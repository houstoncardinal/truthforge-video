import { cn } from '@/lib/utils';
import type { Fact, FactStatus, ConfidenceLevel } from '@/types';
import { FACT_TYPES, CONFIDENCE_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Building,
  Quote,
  Wrench,
  Package,
  Shield,
  MessageSquare,
  Star,
  Award,
  BadgeCheck,
  DollarSign,
  MapPin,
  Phone,
  Factory,
  Sparkles,
  BarChart,
  MoreHorizontal,
  FileQuestion,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, LucideIcon> = {
  Building,
  Quote,
  Wrench,
  Package,
  Shield,
  MessageSquare,
  Star,
  Award,
  BadgeCheck,
  DollarSign,
  MapPin,
  Phone,
  Factory,
  Sparkles,
  BarChart,
  MoreHorizontal,
  FileQuestion,
};

interface FactCardProps {
  fact: Fact;
  onConfirm?: (factId: string) => void;
  onReject?: (factId: string) => void;
  onEdit?: (fact: Fact) => void;
  className?: string;
}

export function FactCard({
  fact,
  onConfirm,
  onReject,
  onEdit,
  className,
}: FactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const factTypeConfig = FACT_TYPES.find((t) => t.value === fact.type);
  const confidenceConfig = CONFIDENCE_LABELS[fact.confidence];
  const IconComponent = factTypeConfig 
    ? iconMap[factTypeConfig.icon] || FileQuestion
    : FileQuestion;

  const getStatusIcon = (status: FactStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-verified" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'needs_review':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getConfidenceBadgeVariant = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'destructive';
    }
  };

  return (
    <Card
      className={cn(
        'transition-all',
        fact.status === 'confirmed' && 'border-verified/50',
        fact.status === 'rejected' && 'border-destructive/50 opacity-60',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {fact.value}
                {getStatusIcon(fact.status)}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="capitalize">{factTypeConfig?.label || fact.type}</span>
                {fact.user_provided && (
                  <Badge variant="outline" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    User-provided
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getConfidenceBadgeVariant(fact.confidence)}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Evidence preview */}
        {fact.evidence.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span>{fact.evidence.length} source{fact.evidence.length !== 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Expanded evidence */}
        {isExpanded && fact.evidence.length > 0 && (
          <div className="space-y-2 pl-6">
            {fact.evidence.map((evidence, index) => (
              <div
                key={index}
                className="evidence-block text-xs"
              >
                <p className="text-muted-foreground mb-1">
                  "{evidence.quote}"
                </p>
                <a
                  href={evidence.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {evidence.page_title || evidence.url}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {fact.status !== 'confirmed' && fact.status !== 'rejected' && (
          <div className="flex items-center gap-2 pt-2">
            {onConfirm && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onConfirm(fact.id)}
                className="bg-verified hover:bg-verified/90"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Confirm
              </Button>
            )}
            {onReject && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(fact.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(fact)}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
