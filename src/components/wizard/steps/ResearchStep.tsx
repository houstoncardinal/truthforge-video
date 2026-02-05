import { useState } from 'react';
import type { Project, FactPack, CrawledPage } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EvidenceInspector } from '@/components/facts/EvidenceInspector';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Loader2,
  Play,
  RefreshCw,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

interface ResearchStepProps {
  project: Project;
  factPack: FactPack | null | undefined;
  onNext: () => void;
  onBack: () => void;
  showNavigationButtons?: boolean;
}

export function ResearchStep({
  project,
  factPack,
  onNext,
  onBack,
  showNavigationButtons = true,
}: ResearchStepProps) {
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [selectedPageId, setSelectedPageId] = useState<string>();

  const { data: crawledPages = [], refetch: refetchPages } = useQuery({
    queryKey: ['crawledPages', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crawled_pages')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as CrawledPage[];
    },
  });

  const handleStartCrawl = async () => {
    setIsCrawling(true);
    setCrawlProgress(0);

    try {
      // Simulate crawling for demo purposes
      // In production, this would call an edge function
      const baseUrl = new URL(project.website_url);
      const pagesToCrawl = [
        baseUrl.href,
        `${baseUrl.origin}/about`,
        `${baseUrl.origin}/services`,
        `${baseUrl.origin}/contact`,
      ];

      for (let i = 0; i < pagesToCrawl.length; i++) {
        const url = pagesToCrawl[i];
        
        // Insert pending page
        await supabase.from('crawled_pages').upsert({
          project_id: project.id,
          url,
          title: `Page ${i + 1}`,
          text_content: `Sample content from ${url}. This is placeholder text that would be extracted from the actual website. It contains information about the business, services, and contact details.`,
          word_count: 50,
          crawl_status: 'complete',
          crawled_at: new Date().toISOString(),
        }, { onConflict: 'project_id,url' });

        setCrawlProgress(((i + 1) / pagesToCrawl.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      await refetchPages();
      toast.success('Website crawled successfully');
    } catch (error) {
      console.error('Crawl error:', error);
      toast.error('Failed to crawl website');
    } finally {
      setIsCrawling(false);
    }
  };

  const completedPages = crawledPages.filter((p) => p.crawl_status === 'complete');
  const totalWords = completedPages.reduce((sum, p) => sum + p.word_count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Research & Evidence</h2>
        <p className="text-muted-foreground">
          We crawl your website to extract facts for claim-checked commercials
        </p>
      </div>

      {/* Crawl status card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                Website Crawl
              </CardTitle>
              <CardDescription>
                {project.website_url}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {crawledPages.length > 0 && (
                <Badge variant="secondary">
                  {completedPages.length} pages • {totalWords.toLocaleString()} words
                </Badge>
              )}
              <Button
                onClick={handleStartCrawl}
                disabled={isCrawling}
                size="sm"
              >
                {isCrawling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Crawling...
                  </>
                ) : crawledPages.length > 0 ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-crawl
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Crawl
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {isCrawling && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Crawling pages...</span>
                <span className="font-medium">{Math.round(crawlProgress)}%</span>
              </div>
              <Progress value={crawlProgress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Evidence inspector */}
      {crawledPages.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-5 w-5" />
            Evidence Inspector
          </h3>
          <EvidenceInspector
            pages={crawledPages}
            selectedPageId={selectedPageId}
            onSelectPage={setSelectedPageId}
          />
        </div>
      ) : !isCrawling ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pages crawled yet</h3>
            <p className="text-muted-foreground mb-4">
              Start the crawl to extract content from your website
            </p>
            <Button onClick={handleStartCrawl}>
              <Play className="h-4 w-4 mr-2" />
              Start Crawl
            </Button>
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
            disabled={completedPages.length === 0}
          >
            Continue to Strategy
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
