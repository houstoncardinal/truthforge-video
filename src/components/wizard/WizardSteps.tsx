import { cn } from '@/lib/utils';
import { WIZARD_STEPS } from '@/lib/constants';
import { 
  CheckCircle2, 
  Circle, 
  Globe, 
  Search, 
  Target, 
  FileText, 
  LayoutGrid, 
  Video,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Search,
  Target,
  FileText,
  LayoutGrid,
  Video,
  Circle,
};

interface WizardStepsProps {
  currentStep: number;
  completedSteps?: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function WizardSteps({
  currentStep,
  completedSteps = [],
  onStepClick,
  className,
}: WizardStepsProps) {
  return (
    <nav className={cn('flex items-center justify-between', className)}>
      {WIZARD_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isComplete = completedSteps.includes(step.id);
        const isPending = !isActive && !isComplete;
        const IconComponent = iconMap[step.icon] || Circle;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepClick?.(step.id)}
              disabled={!onStepClick}
              className={cn(
                'flex flex-col items-center gap-2 transition-all',
                onStepClick && 'cursor-pointer hover:opacity-80',
                !onStepClick && 'cursor-default'
              )}
            >
              <div
                className={cn(
                  'wizard-step',
                  isActive && 'wizard-step-active',
                  isComplete && 'wizard-step-complete',
                  isPending && 'wizard-step-pending'
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isActive ? (
                  <IconComponent className="h-4 w-4" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isActive && 'text-foreground',
                    isComplete && 'text-verified',
                    isPending && 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </button>

            {index < WIZARD_STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-16 mx-2 sm:mx-4',
                  index < currentStep - 1 ? 'bg-verified' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
