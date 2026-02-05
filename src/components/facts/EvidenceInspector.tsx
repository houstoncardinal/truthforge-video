import { cn } from '@/lib/utils';
import type { CrawledPage } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';

interface EvidenceInspectorProps {
  pages: CrawledPage[];
  selectedPageId?: string;
  onSelectPage?: (pageId: string) => void;
  highlightedQuote?: string;
  className?: string;
}

export function EvidenceInspector({
  pages,
  selectedPageId,
  onSelectPage,
  highlightedQuote,
  className,
}: EvidenceInspectorProps) {
  const selectedPage = pages.find((p) => p.id === selectedPageId);

  const getStatusIcon = (status: CrawledPage['crawl_status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-verified" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'crawling':
        return <Loader2 className="h-4 w-4 text-accent animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const highlightText = (text: string, quote?: string) => {
    if (!quote || !text) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuote = quote.toLowerCase();
    const index = lowerText.indexOf(lowerQuote);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-accent/30 px-0.5 rounded">{text.slice(index, index + quote.length)}</mark>
        {text.slice(index + quote.length)}
      </>
    );
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      {/* Page list */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Crawled Pages ({pages.length})
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onSelectPage?.(page.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    'hover:bg-muted/50',
                    selectedPageId === page.id && 'bg-muted'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {page.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {new URL(page.url).pathname}
                      </p>
                    </div>
                    {getStatusIcon(page.crawl_status)}
                  </div>
                  {page.crawl_status === 'complete' && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {page.word_count} words
                    </Badge>
                  )}
                </button>
              ))}
              {pages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No pages crawled yet
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Page content */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          {selectedPage ? (
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">{selectedPage.title || 'Untitled'}</h3>
              <a
                href={selectedPage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
              >
                <ExternalLink className="h-3 w-3" />
                {selectedPage.url}
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a page to view content</p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {selectedPage?.text_content ? (
              <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {highlightText(selectedPage.text_content, highlightedQuote)}
              </div>
            ) : selectedPage?.crawl_status === 'crawling' ? (
              <div className="flex items-center justify-center h-full py-16">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : selectedPage?.crawl_status === 'failed' ? (
              <div className="text-center py-16">
                <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {selectedPage.error_message || 'Failed to crawl page'}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No content available</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
