import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { useFactPack } from '@/hooks/useFactPack';
import { WizardSteps } from '@/components/wizard/WizardSteps';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Loader2,
  LogOut,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';

// Step components
import { InputsStep } from '@/components/wizard/steps/InputsStep';
import { ResearchStep } from '@/components/wizard/steps/ResearchStep';
import { StrategyStep } from '@/components/wizard/steps/StrategyStep';
import { ScriptStep } from '@/components/wizard/steps/ScriptStep';
import { StoryboardStep } from '@/components/wizard/steps/StoryboardStep';
import { GenerateStep } from '@/components/wizard/steps/GenerateStep';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: factPack } = useFactPack(id);
  const updateProject = useUpdateProject();

  const [activeTab, setActiveTab] = useState('wizard');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleStepChange = async (newStep: number) => {
    if (!project || newStep < 1 || newStep > 6) return;

    try {
      await updateProject.mutateAsync({
        id: project.id,
        current_step: newStep,
      });
    } catch (error) {
      toast.error('Failed to update step');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const completedSteps = Array.from(
    { length: project.current_step - 1 },
    (_, i) => i + 1
  );

  const renderCurrentStep = () => {
    switch (project.current_step) {
      case 1:
        return (
          <InputsStep
            project={project}
            onNext={() => handleStepChange(2)}
          />
        );
      case 2:
        return (
          <ResearchStep
            project={project}
            factPack={factPack}
            onNext={() => handleStepChange(3)}
            onBack={() => handleStepChange(1)}
          />
        );
      case 3:
        return (
          <StrategyStep
            project={project}
            factPack={factPack}
            onNext={() => handleStepChange(4)}
            onBack={() => handleStepChange(2)}
          />
        );
      case 4:
        return (
          <ScriptStep
            project={project}
            factPack={factPack}
            onNext={() => handleStepChange(5)}
            onBack={() => handleStepChange(3)}
          />
        );
      case 5:
        return (
          <StoryboardStep
            project={project}
            onNext={() => handleStepChange(6)}
            onBack={() => handleStepChange(4)}
          />
        );
      case 6:
        return (
          <GenerateStep
            project={project}
            onBack={() => handleStepChange(5)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-accent" />
              <span className="font-semibold truncate max-w-[200px]">
                {project.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Wizard steps */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <WizardSteps
            currentStep={project.current_step}
            completedSteps={completedSteps}
            onStepClick={(step) => {
              if (step <= project.current_step) {
                handleStepChange(step);
              }
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="mb-6">
            <TabsTrigger value="wizard">Wizard</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="facts">Facts</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="storyboards">Storyboards</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="mt-0">
            {renderCurrentStep()}
          </TabsContent>

          <TabsContent value="evidence">
            <ResearchStep
              project={project}
              factPack={factPack}
              onNext={() => {}}
              onBack={() => {}}
              showNavigationButtons={false}
            />
          </TabsContent>

          <TabsContent value="facts">
            <div className="text-center py-16 text-muted-foreground">
              Facts view - Use the wizard to extract and confirm facts
            </div>
          </TabsContent>

          <TabsContent value="scripts">
            <ScriptStep
              project={project}
              factPack={factPack}
              onNext={() => {}}
              onBack={() => {}}
              showNavigationButtons={false}
            />
          </TabsContent>

          <TabsContent value="storyboards">
            <StoryboardStep
              project={project}
              onNext={() => {}}
              onBack={() => {}}
              showNavigationButtons={false}
            />
          </TabsContent>

          <TabsContent value="exports">
            <GenerateStep
              project={project}
              onBack={() => {}}
              showNavigationButtons={false}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer navigation */}
      <footer className="border-t bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => handleStepChange(project.current_step - 1)}
            disabled={project.current_step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {project.current_step} of 6
          </span>
          <Button
            onClick={() => handleStepChange(project.current_step + 1)}
            disabled={project.current_step === 6}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
