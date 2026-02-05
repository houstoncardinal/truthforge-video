import { useState } from 'react';
import type { Project, Render, Storyboard } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RenderCard } from '@/components/renders/RenderCard';
import { VIDEO_PROVIDERS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Play,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';

interface GenerateStepProps {
  project: Project;
  onBack: () => void;
  showNavigationButtons?: boolean;
}

export function GenerateStep({
  project,
  onBack,
  showNavigationButtons = true,
}: GenerateStepProps) {
  const queryClient = useQueryClient();
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [selectedStoryboardId, setSelectedStoryboardId] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('mock');

  const { data: storyboards = [] } = useQuery({
    queryKey: ['storyboards', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('storyboards')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Storyboard[];
    },
  });

  const { data: renders = [] } = useQuery({
    queryKey: ['renders', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('renders')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((r: any) => ({
        ...r,
        qc_report: r.qc_report || { passed: false, checks: [] },
        job_log: r.job_log || [],
      })) as Render[];
    },
  });

  const handleStartRender = async () => {
    if (!selectedStoryboardId) {
      toast.error('Please select a storyboard');
      return;
    }

    const storyboard = storyboards.find((s) => s.id === selectedStoryboardId);
    if (!storyboard) {
      toast.error('Storyboard not found');
      return;
    }

    setIsRendering(true);
    setRenderProgress(0);

    try {
      // Insert render job
      const { data: render, error: insertError } = await supabase
        .from('renders')
        .insert({
          project_id: project.id,
          storyboard_id: selectedStoryboardId,
          name: `${storyboard.name} - Render`,
          provider: selectedProvider,
          status: 'processing',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Simulate rendering progress
      for (let i = 0; i <= 100; i += 5) {
        setRenderProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Update status in database
        if (i === 50) {
          await supabase
            .from('renders')
            .update({ status: 'rendering', progress: i })
            .eq('id', render.id);
        } else if (i === 80) {
          await supabase
            .from('renders')
            .update({ status: 'post_processing', progress: i })
            .eq('id', render.id);
        }
      }

      // Complete the render
      await supabase
        .from('renders')
        .update({
          status: 'complete',
          progress: 100,
          completed_at: new Date().toISOString(),
          output_url: 'https://example.com/placeholder-video.mp4',
          thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
          qc_status: 'passed',
          qc_report: {
            passed: true,
            checks: [
              { name: 'Audio sync', passed: true },
              { name: 'Caption alignment', passed: true },
              { name: 'Brand compliance', passed: true },
              { name: 'Safe zones', passed: true },
            ],
            timestamp: new Date().toISOString(),
          },
        })
        .eq('id', render.id);

      queryClient.invalidateQueries({ queryKey: ['renders', project.id] });
      toast.success('Video rendered successfully!');
    } catch (error) {
      console.error('Render error:', error);
      toast.error('Failed to render video');
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadPack = (renderId: string) => {
    toast.success('Export pack download started');
    // In production, this would trigger actual file downloads
  };

  const completedRenders = renders.filter((r) => r.status === 'complete');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Generate & Export</h2>
        <p className="text-muted-foreground">
          Render your video commercial and download the export pack
        </p>
      </div>

      {/* Render controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5 text-accent" />
                Video Generation
              </CardTitle>
              <CardDescription>
                Choose your storyboard and provider
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Storyboard</label>
              <Select value={selectedStoryboardId} onValueChange={setSelectedStoryboardId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a storyboard" />
                </SelectTrigger>
                <SelectContent>
                  {storyboards.map((storyboard) => (
                    <SelectItem key={storyboard.id} value={storyboard.id}>
                      {storyboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Video Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <div>
                        <div className="font-medium">{provider.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button
                onClick={handleStartRender}
                disabled={isRendering || !selectedStoryboardId}
                className="w-full"
              >
                {isRendering ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Render
                  </>
                )}
              </Button>
            </div>
          </div>

          {isRendering && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Generating video...</span>
                <span className="font-medium">{Math.round(renderProgress)}%</span>
              </div>
              <Progress value={renderProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Renders list */}
      {renders.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Rendered Videos</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{renders.length} renders</Badge>
              {completedRenders.length > 0 && (
                <Badge className="bg-verified">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {completedRenders.length} complete
                </Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renders.map((render) => (
              <RenderCard
                key={render.id}
                render={render}
                onDownload={() => handleDownloadPack(render.id)}
                onRetry={() => {}}
              />
            ))}
          </div>
        </div>
      ) : !isRendering ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No renders yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a render to generate your video commercial
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Export pack summary */}
      {completedRenders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-accent" />
              Export Pack
            </CardTitle>
            <CardDescription>
              Download all assets for your completed renders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{completedRenders.length}</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{completedRenders.length}</p>
                <p className="text-sm text-muted-foreground">Captions (SRT)</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{completedRenders.length}</p>
                <p className="text-sm text-muted-foreground">Thumbnails</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Storyboard JSON</p>
              </div>
            </div>
            <Button className="w-full mt-4" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Full Export Pack
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {showNavigationButtons && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-verified" />
            Final step - Download your exports when ready
          </div>
        </div>
      )}
    </div>
  );
}
