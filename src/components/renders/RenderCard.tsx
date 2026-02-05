import { cn } from '@/lib/utils';
import type { Render, VideoProvider } from '@/types';
import { VIDEO_PROVIDERS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
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
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  Video,
  XCircle,
} from 'lucide-react';

interface RenderCardProps {
  render: Render;
  onRetry?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function RenderCard({
  render,
  onRetry,
  onDownload,
  className,
}: RenderCardProps) {
  const provider = VIDEO_PROVIDERS.find((p) => p.value === render.provider);

  const getStatusBadge = () => {
    switch (render.status) {
      case 'complete':
        return <Badge className="bg-verified">Complete</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'queued':
        return <Badge variant="secondary">Queued</Badge>;
      case 'processing':
      case 'rendering':
      case 'post_processing':
        return <Badge className="bg-accent text-accent-foreground">Rendering</Badge>;
      default:
        return <Badge variant="outline">{render.status}</Badge>;
    }
  };

  const getQCBadge = () => {
    switch (render.qc_status) {
      case 'passed':
        return (
          <Badge variant="outline" className="border-verified text-verified">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            QC Passed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="border-destructive text-destructive">
            <XCircle className="h-3 w-3 mr-1" />
            QC Failed
          </Badge>
        );
      case 'checking':
        return (
          <Badge variant="outline">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Checking
          </Badge>
        );
      default:
        return null;
    }
  };

  const isInProgress = ['queued', 'processing', 'rendering', 'post_processing'].includes(
    render.status
  );

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Video className="h-4 w-4" />
              {render.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{provider?.label || render.provider}</span>
              {getStatusBadge()}
              {getQCBadge()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        {isInProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground capitalize">
                {render.status.replace('_', ' ')}...
              </span>
              <span className="font-medium">{render.progress}%</span>
            </div>
            <Progress value={render.progress} className="h-2" />
          </div>
        )}

        {/* Video preview */}
        {render.status === 'complete' && render.output_url && (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
            {render.thumbnail_url ? (
              <img
                src={render.thumbnail_url}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" size="sm" asChild>
                <a href={render.output_url} target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4 mr-1" />
                  Preview
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Error message */}
        {render.status === 'failed' && render.error_message && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {render.error_message}
            </p>
          </div>
        )}

        {/* QC Report */}
        {render.qc_status === 'failed' && render.qc_report.checks?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">QC Report</h4>
            <div className="space-y-1">
              {render.qc_report.checks.map((check, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2 text-sm p-2 rounded',
                    check.passed ? 'bg-verified/10' : 'bg-destructive/10'
                  )}
                >
                  {check.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-verified" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span>{check.name}</span>
                  {check.message && (
                    <span className="text-muted-foreground ml-auto">{check.message}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {render.status === 'complete' && (
            <>
              {onDownload && (
                <Button size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download Pack
                </Button>
              )}
              {render.output_url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={render.output_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </a>
                </Button>
              )}
            </>
          )}
          {render.status === 'failed' && onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          {render.started_at && (
            <span>Started: {new Date(render.started_at).toLocaleString()}</span>
          )}
          {render.completed_at && (
            <span>Completed: {new Date(render.completed_at).toLocaleString()}</span>
          )}
          {render.retry_count > 0 && <span>Retries: {render.retry_count}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
