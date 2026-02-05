import { useState } from 'react';
import type { Project, Storyboard, Scene, Script } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SceneCard } from '@/components/storyboard/SceneCard';
import { ASPECT_RATIOS, PLATFORMS } from '@/lib/constants';
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
  ArrowRight,
  LayoutGrid,
  Loader2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface StoryboardStepProps {
  project: Project;
  onNext: () => void;
  onBack: () => void;
  showNavigationButtons?: boolean;
}

export function StoryboardStep({
  project,
  onNext,
  onBack,
  showNavigationButtons = true,
}: StoryboardStepProps) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [selectedScriptId, setSelectedScriptId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube');
  const [selectedSceneId, setSelectedSceneId] = useState<string>();

  const { data: scripts = [] } = useQuery({
    queryKey: ['scripts', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Script[];
    },
  });

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

  const handleGenerateStoryboard = async () => {
    if (!selectedScriptId) {
      toast.error('Please select a script');
      return;
    }

    const script = scripts.find((s) => s.id === selectedScriptId);
    if (!script) {
      toast.error('Script not found');
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);

    try {
      // Simulate storyboard generation
      for (let i = 0; i <= 100; i += 10) {
        setGenerateProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const platform = PLATFORMS.find((p) => p.value === selectedPlatform);
      const aspectRatio = platform?.aspectRatio || '16:9';

      // Generate sample scenes based on script
      const scenes: Scene[] = [
        {
          id: crypto.randomUUID(),
          order: 0,
          duration: 3,
          start_time: 0,
          end_time: 3,
          shot_type: 'wide',
          shot_description: 'Opening establishing shot with brand presence',
          on_screen_text: script.hook_text?.split('.')[0] || '',
          b_roll_suggestions: ['City skyline', 'Office exterior', 'Brand logo animation'],
          brand_instructions: {
            logo_position: 'bottom_right',
            safe_zone: true,
          },
          audio_notes: {
            music_mood: 'Upbeat, inspiring',
            vo_timing: 'Start at 0.5s',
          },
          model_prompt: 'Professional wide shot of modern office building, cinematic lighting',
          fact_references: [],
        },
        {
          id: crypto.randomUUID(),
          order: 1,
          duration: 4,
          start_time: 3,
          end_time: 7,
          shot_type: 'medium',
          shot_description: 'Problem visualization - relatable scenario',
          on_screen_text: '',
          b_roll_suggestions: ['Person looking frustrated', 'Searching on phone'],
          brand_instructions: {
            logo_position: 'none',
            safe_zone: true,
          },
          audio_notes: {
            music_mood: 'Slightly tense',
          },
          model_prompt: 'Medium shot of person looking at phone with concerned expression',
          fact_references: [],
        },
        {
          id: crypto.randomUUID(),
          order: 2,
          duration: 8,
          start_time: 7,
          end_time: 15,
          shot_type: 'close_up',
          shot_description: 'Solution presentation with product/service focus',
          on_screen_text: 'Your Solution',
          b_roll_suggestions: ['Product close-up', 'Service in action', 'Happy customer'],
          brand_instructions: {
            logo_position: 'bottom_right',
            safe_zone: true,
          },
          audio_notes: {
            music_mood: 'Triumphant, positive',
          },
          model_prompt: 'Close-up shot showcasing professional service delivery, warm lighting',
          fact_references: [],
        },
        {
          id: crypto.randomUUID(),
          order: 3,
          duration: script.duration_seconds - 15,
          start_time: 15,
          end_time: script.duration_seconds,
          shot_type: 'logo_reveal',
          shot_description: 'Call to action with contact information',
          on_screen_text: script.cta_text || 'Contact Us Today',
          b_roll_suggestions: ['Logo animation', 'Contact info overlay'],
          brand_instructions: {
            logo_position: 'center',
            safe_zone: true,
          },
          audio_notes: {
            music_mood: 'Resolving, memorable',
            sfx: ['Whoosh', 'Ding'],
          },
          model_prompt: 'Brand logo reveal with professional end card, branded colors',
          fact_references: [],
        },
      ];

      const { data, error } = await supabase
        .from('storyboards')
        .insert([{
          project_id: project.id,
          script_id: selectedScriptId,
          name: `${script.name} - ${platform?.label || 'YouTube'}`,
          aspect_ratio: aspectRatio,
          scenes: JSON.parse(JSON.stringify(scenes)),
          platform: selectedPlatform,
          total_duration_seconds: script.duration_seconds,
        }])
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['storyboards', project.id] });
      toast.success('Storyboard generated successfully');
    } catch (error) {
      console.error('Storyboard generation error:', error);
      toast.error('Failed to generate storyboard');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Storyboard</h2>
        <p className="text-muted-foreground">
          Create scene-by-scene plans for your commercial
        </p>
      </div>

      {/* Storyboard generator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-accent" />
                Generate Storyboard
              </CardTitle>
              <CardDescription>
                Convert script to visual scenes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Script</label>
              <Select value={selectedScriptId} onValueChange={setSelectedScriptId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a script" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.map((script) => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label} ({platform.aspectRatio})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button
                onClick={handleGenerateStoryboard}
                disabled={isGenerating || !selectedScriptId}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Storyboard
                  </>
                )}
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Creating scene cards...</span>
                <span className="font-medium">{Math.round(generateProgress)}%</span>
              </div>
              <Progress value={generateProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storyboards list */}
      {storyboards.length > 0 ? (
        <div className="space-y-6">
          {storyboards.map((storyboard) => (
            <Card key={storyboard.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{storyboard.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary">{storyboard.platform}</Badge>
                      <Badge variant="outline">{storyboard.aspect_ratio}</Badge>
                      <span>{storyboard.total_duration_seconds}s</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {storyboard.scenes.map((scene, index) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      index={index}
                      isSelected={selectedSceneId === scene.id}
                      onSelect={() => setSelectedSceneId(scene.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isGenerating ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No storyboards yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate a storyboard from your scripts
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Navigation */}
      {showNavigationButtons && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={storyboards.length === 0}
          >
            Continue to Generate
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
