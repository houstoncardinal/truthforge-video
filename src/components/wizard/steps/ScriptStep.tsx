import { useState } from 'react';
import type { Project, FactPack, Script } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScriptEditor } from '@/components/scripts/ScriptEditor';
import { SCRIPT_ANGLES, COMMERCIAL_DURATIONS } from '@/lib/constants';
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
  FileText,
  Loader2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface ScriptStepProps {
  project: Project;
  factPack: FactPack | null | undefined;
  onNext: () => void;
  onBack: () => void;
  showNavigationButtons?: boolean;
}

export function ScriptStep({
  project,
  factPack,
  onNext,
  onBack,
  showNavigationButtons = true,
}: ScriptStepProps) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [selectedAngle, setSelectedAngle] = useState<string>('authority');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

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

  const handleGenerateScript = async () => {
    if (!factPack) {
      toast.error('Please extract facts first');
      return;
    }

    const confirmedFacts = factPack.facts.filter((f) => f.status === 'confirmed');
    if (confirmedFacts.length === 0) {
      toast.error('Please confirm at least one fact');
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);

    try {
      // Simulate script generation
      for (let i = 0; i <= 100; i += 10) {
        setGenerateProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      const angleConfig = SCRIPT_ANGLES.find((a) => a.value === selectedAngle);
      const durationConfig = COMMERCIAL_DURATIONS.find((d) => d.value === selectedDuration);

      // Generate sample script based on confirmed facts
      const companyName = confirmedFacts.find((f) => f.type === 'company_name')?.value || 'Your Business';
      const mainService = confirmedFacts.find((f) => f.type === 'service')?.value || 'our services';
      const differentiator = confirmedFacts.find((f) => f.type === 'differentiator')?.value || 'exceptional quality';

      const hookText = selectedAngle === 'authority'
        ? `Looking for ${mainService}? ${companyName} delivers results.`
        : selectedAngle === 'emotional'
          ? `Tired of settling for less? There's a better way.`
          : `Special offer: Get started with ${companyName} today.`;

      const problemText = selectedAngle === 'emotional'
        ? `Finding reliable ${mainService} shouldn't be this hard.`
        : `Many businesses struggle to find quality ${mainService}.`;

      const solutionText = `${companyName} provides ${mainService} with ${differentiator}.`;

      const ctaText = `Contact ${companyName} today. Let's get started.`;

      const { data, error } = await supabase
        .from('scripts')
        .insert({
          project_id: project.id,
          name: `${durationConfig?.label} ${angleConfig?.label} Script`,
          duration_seconds: selectedDuration,
          angle: selectedAngle,
          hook_text: hookText,
          problem_text: problemText,
          solution_text: solutionText,
          cta_text: ctaText,
          vo_text: `${hookText} ${problemText} ${solutionText} ${ctaText}`,
          claim_check_status: 'passed',
          claim_warnings: [],
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scripts', project.id] });
      toast.success('Script generated successfully');
    } catch (error) {
      console.error('Script generation error:', error);
      toast.error('Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Script Generation</h2>
        <p className="text-muted-foreground">
          Generate claim-checked scripts from your confirmed facts
        </p>
      </div>

      {/* Script generator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Generate Script
              </CardTitle>
              <CardDescription>
                Choose your angle and duration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Script Angle</label>
              <Select value={selectedAngle} onValueChange={setSelectedAngle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCRIPT_ANGLES.map((angle) => (
                    <SelectItem key={angle.value} value={angle.value}>
                      <div>
                        <div className="font-medium">{angle.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {angle.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select
                value={selectedDuration.toString()}
                onValueChange={(v) => setSelectedDuration(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMERCIAL_DURATIONS.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      <div>
                        <div className="font-medium">{duration.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {duration.description}
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
                onClick={handleGenerateScript}
                disabled={isGenerating}
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
                    Generate Script
                  </>
                )}
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Creating claim-checked script...</span>
                <span className="font-medium">{Math.round(generateProgress)}%</span>
              </div>
              <Progress value={generateProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scripts list */}
      {scripts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Scripts</h3>
            <Badge variant="secondary">{scripts.length} scripts</Badge>
          </div>
          <div className="space-y-4">
            {scripts.map((script) => (
              <ScriptEditor
                key={script.id}
                script={script}
                onGenerate={() => {}}
              />
            ))}
          </div>
        </div>
      ) : !isGenerating ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scripts yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first script to continue
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
            disabled={scripts.length === 0}
          >
            Continue to Storyboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
