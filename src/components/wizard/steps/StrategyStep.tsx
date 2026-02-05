import { useState } from 'react';
import type { Project, FactPack, Fact } from '@/types';
import { useCreateFactPack, useUpdateFactPack, useConfirmFact } from '@/hooks/useFactPack';
import { FactCard } from '@/components/facts/FactCard';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface StrategyStepProps {
  project: Project;
  factPack: FactPack | null | undefined;
  onNext: () => void;
  onBack: () => void;
  showNavigationButtons?: boolean;
}

export function StrategyStep({
  project,
  factPack,
  onNext,
  onBack,
  showNavigationButtons = true,
}: StrategyStepProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);

  const createFactPack = useCreateFactPack();
  const updateFactPack = useUpdateFactPack();
  const confirmFact = useConfirmFact();

  const handleExtractFacts = async () => {
    setIsExtracting(true);
    setExtractProgress(0);

    try {
      // Create fact pack if doesn't exist
      let currentFactPack = factPack;
      if (!currentFactPack) {
        currentFactPack = await createFactPack.mutateAsync(project.id);
      }

      // Simulate extraction for demo
      // In production, this would call an AI edge function
      const sampleFacts: Fact[] = [
        {
          id: crypto.randomUUID(),
          type: 'company_name',
          value: new URL(project.website_url).hostname.replace('www.', '').split('.')[0],
          category: 'identity',
          evidence: [{
            url: project.website_url,
            quote: 'Welcome to our company',
            page_title: 'Home',
            extracted_at: new Date().toISOString(),
          }],
          confidence: 'high',
          status: 'unconfirmed',
        },
        {
          id: crypto.randomUUID(),
          type: 'service',
          value: 'Professional consulting services',
          category: 'services',
          evidence: [{
            url: `${project.website_url}/services`,
            quote: 'We offer professional consulting services to help your business grow',
            page_title: 'Services',
            extracted_at: new Date().toISOString(),
          }],
          confidence: 'high',
          status: 'unconfirmed',
        },
        {
          id: crypto.randomUUID(),
          type: 'differentiator',
          value: '24/7 customer support',
          category: 'features',
          evidence: [{
            url: `${project.website_url}/contact`,
            quote: 'Our team is available 24/7 to assist you',
            page_title: 'Contact',
            extracted_at: new Date().toISOString(),
          }],
          confidence: 'medium',
          status: 'needs_review',
        },
        {
          id: crypto.randomUUID(),
          type: 'location',
          value: 'Serving customers nationwide',
          category: 'location',
          evidence: [{
            url: `${project.website_url}/about`,
            quote: 'Proudly serving customers across the nation',
            page_title: 'About',
            extracted_at: new Date().toISOString(),
          }],
          confidence: 'high',
          status: 'unconfirmed',
        },
      ];

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setExtractProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      await updateFactPack.mutateAsync({
        id: currentFactPack.id,
        projectId: project.id,
        status: 'review',
        facts: sampleFacts,
        total_facts: sampleFacts.length,
        confirmed_facts: 0,
        unconfirmed_facts: sampleFacts.length,
        extracted_at: new Date().toISOString(),
      });

      toast.success('Facts extracted successfully');
    } catch (error) {
      console.error('Extraction error:', error);
      toast.error('Failed to extract facts');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmFact = async (factId: string) => {
    if (!factPack) return;
    await confirmFact.mutateAsync({
      factPackId: factPack.id,
      projectId: project.id,
      factId,
      status: 'confirmed',
    });
  };

  const handleRejectFact = async (factId: string) => {
    if (!factPack) return;
    await confirmFact.mutateAsync({
      factPackId: factPack.id,
      projectId: project.id,
      factId,
      status: 'rejected',
    });
  };

  const confirmedFacts = factPack?.facts.filter((f) => f.status === 'confirmed') || [];
  const unconfirmedFacts = factPack?.facts.filter((f) => f.status !== 'confirmed' && f.status !== 'rejected') || [];
  const rejectedFacts = factPack?.facts.filter((f) => f.status === 'rejected') || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Strategy & Facts</h2>
        <p className="text-muted-foreground">
          Review and confirm extracted facts. Only confirmed facts will be used in scripts.
        </p>
      </div>

      {/* Extraction status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Fact Extraction
              </CardTitle>
              <CardDescription>
                AI-powered extraction with evidence tracking
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {factPack && (
                <>
                  <Badge variant="default" className="bg-verified">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {confirmedFacts.length} confirmed
                  </Badge>
                  <Badge variant="secondary">
                    {unconfirmedFacts.length} pending
                  </Badge>
                </>
              )}
              <Button
                onClick={handleExtractFacts}
                disabled={isExtracting}
                size="sm"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {factPack ? 'Re-extract' : 'Extract Facts'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {isExtracting && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Analyzing content...</span>
                <span className="font-medium">{Math.round(extractProgress)}%</span>
              </div>
              <Progress value={extractProgress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Facts list */}
      {factPack && factPack.facts.length > 0 ? (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Review ({unconfirmedFacts.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed ({confirmedFacts.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedFacts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unconfirmedFacts.map((fact) => (
                <FactCard
                  key={fact.id}
                  fact={fact}
                  onConfirm={handleConfirmFact}
                  onReject={handleRejectFact}
                />
              ))}
              {unconfirmedFacts.length === 0 && (
                <Card className="col-span-2 py-8">
                  <CardContent className="text-center text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-verified" />
                    All facts have been reviewed
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {confirmedFacts.map((fact) => (
                <FactCard key={fact.id} fact={fact} />
              ))}
              {confirmedFacts.length === 0 && (
                <Card className="col-span-2 py-8">
                  <CardContent className="text-center text-muted-foreground">
                    No confirmed facts yet
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejectedFacts.map((fact) => (
                <FactCard key={fact.id} fact={fact} />
              ))}
              {rejectedFacts.length === 0 && (
                <Card className="col-span-2 py-8">
                  <CardContent className="text-center text-muted-foreground">
                    <XCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No rejected facts
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : !isExtracting ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No facts extracted yet</h3>
            <p className="text-muted-foreground mb-4">
              Extract facts from your crawled pages to build claim-checked scripts
            </p>
            <Button onClick={handleExtractFacts}>
              <Sparkles className="h-4 w-4 mr-2" />
              Extract Facts
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
            disabled={confirmedFacts.length === 0}
          >
            Continue to Script
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
