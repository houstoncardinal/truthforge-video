import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight, CheckCircle2, Shield, Zap, Video } from 'lucide-react';
import { useEffect } from 'react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary">
              <Flame className="h-5 w-5 text-accent" />
            </div>
            <span className="font-bold text-lg">CommercialForge AI</span>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-4 bg-grid">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Create <span className="gradient-text">High-Converting</span> Video Commercials
            <br />with Zero Hallucinations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered video commercial generator that extracts real facts from your website.
            Every claim is grounded in evidence. No made-up statistics. No false promises.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="forge-glow">
              Start Creating
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Accuracy, Designed for Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-lg bg-verified/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-verified" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Zero Hallucinations</h3>
              <p className="text-muted-foreground">
                Every claim in your commercial is backed by evidence from your actual website. 
                No AI-invented facts.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Evidence Inspector</h3>
              <p className="text-muted-foreground">
                Review extracted facts with source quotes and page URLs. 
                Confirm or edit before script generation.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-info" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Platform Export</h3>
              <p className="text-muted-foreground">
                Generate 15s, 30s, and 45s commercials optimized for YouTube, Instagram, TikTok, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Commercial?</h2>
          <p className="text-lg opacity-80 mb-8">
            Start with your website URL. We'll handle the rest.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" />
            <span>CommercialForge AI</span>
          </div>
          <p>© 2024 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
