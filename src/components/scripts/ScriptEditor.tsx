import { cn } from '@/lib/utils';
import type { Script, ClaimWarning } from '@/types';
import { SCRIPT_ANGLES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  FileText,
  Play,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface ScriptEditorProps {
  script: Script;
  onEdit?: (script: Script) => void;
  onGenerate?: () => void;
  className?: string;
}

export function ScriptEditor({
  script,
  onEdit,
  onGenerate,
  className,
}: ScriptEditorProps) {
  const angleConfig = SCRIPT_ANGLES.find((a) => a.value === script.angle);

  const getClaimCheckIcon = () => {
    switch (script.claim_check_status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-verified" />;
      case 'warnings':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'checking':
        return <Clock className="h-4 w-4 text-muted-foreground animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatFullScript = () => {
    const parts = [
      script.hook_text && `[HOOK]\n${script.hook_text}`,
      script.problem_text && `[PROBLEM]\n${script.problem_text}`,
      script.solution_text && `[SOLUTION]\n${script.solution_text}`,
      script.proof_text && `[PROOF]\n${script.proof_text}`,
      script.cta_text && `[CTA]\n${script.cta_text}`,
    ].filter(Boolean);
    return parts.join('\n\n');
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {script.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {script.duration_seconds}s
              </span>
              <Badge variant="secondary">{angleConfig?.label || script.angle}</Badge>
              <span className="flex items-center gap-1">
                {getClaimCheckIcon()}
                Claim Check
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(formatFullScript())}
            >
              <Copy className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(script)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onGenerate && (
              <Button size="sm" onClick={onGenerate}>
                <Play className="h-4 w-4 mr-1" />
                Generate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Claim warnings */}
        {script.claim_warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              Claim Warnings ({script.claim_warnings.length})
            </h4>
            <div className="space-y-2">
              {script.claim_warnings.map((warning: ClaimWarning) => (
                <div key={warning.id} className="claim-warning text-sm">
                  <p className="font-medium">"{warning.phrase}"</p>
                  <p className="text-muted-foreground">{warning.text}</p>
                  {warning.suggestion && (
                    <p className="text-xs text-accent mt-1">
                      Suggestion: {warning.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Script sections */}
        <Tabs defaultValue="full" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="full">Full</TabsTrigger>
            <TabsTrigger value="hook">Hook</TabsTrigger>
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
            <TabsTrigger value="proof">Proof</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          <TabsContent value="full" className="mt-4">
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
              {formatFullScript() || 'No script content yet'}
            </div>
          </TabsContent>

          <TabsContent value="hook" className="mt-4">
            <ScriptSection
              title="Hook (0-3s)"
              description="Grab attention immediately"
              content={script.hook_text}
            />
          </TabsContent>

          <TabsContent value="problem" className="mt-4">
            <ScriptSection
              title="Problem (3-7s)"
              description="Identify the pain point"
              content={script.problem_text}
            />
          </TabsContent>

          <TabsContent value="solution" className="mt-4">
            <ScriptSection
              title="Solution (7-15s)"
              description="Present your offering"
              content={script.solution_text}
            />
          </TabsContent>

          <TabsContent value="proof" className="mt-4">
            <ScriptSection
              title="Proof (optional)"
              description="Social proof and credibility"
              content={script.proof_text}
            />
          </TabsContent>

          <TabsContent value="cta" className="mt-4">
            <ScriptSection
              title="Call to Action (last 2-4s)"
              description="Clear next step"
              content={script.cta_text}
            />
          </TabsContent>
        </Tabs>

        {/* Voice over text */}
        {script.vo_text && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Voice Over Script</h4>
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              {script.vo_text}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ScriptSectionProps {
  title: string;
  description: string;
  content?: string;
}

function ScriptSection({ title, description, content }: ScriptSectionProps) {
  return (
    <div className="space-y-2">
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 min-h-[100px]">
        {content ? (
          <p className="text-sm">{content}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Not yet written</p>
        )}
      </div>
    </div>
  );
}
