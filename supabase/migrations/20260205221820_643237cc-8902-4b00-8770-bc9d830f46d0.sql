-- CommercialForge AI Database Schema
-- Focus: Evidence grounding, claim verification, and production-grade video generation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Projects table (main entity)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'researching', 'scripting', 'storyboarding', 'generating', 'complete', 'failed')),
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 6),
  
  -- Brand kit
  logo_url TEXT,
  brand_colors JSONB DEFAULT '[]'::jsonb,
  brand_fonts JSONB DEFAULT '{"primary": "Inter", "secondary": "Inter"}'::jsonb,
  
  -- Settings
  settings JSONB DEFAULT '{
    "max_crawl_pages": 30,
    "target_platforms": ["youtube", "instagram", "tiktok"],
    "commercial_types": ["15s", "30s", "45s"],
    "aspect_ratios": ["16:9", "9:16", "1:1"]
  }'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Crawled pages table
CREATE TABLE public.crawled_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  text_content TEXT,
  html_hash TEXT,
  word_count INTEGER DEFAULT 0,
  crawl_status TEXT NOT NULL DEFAULT 'pending' CHECK (crawl_status IN ('pending', 'crawling', 'complete', 'failed')),
  error_message TEXT,
  crawled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(project_id, url)
);

-- Enable RLS
ALTER TABLE public.crawled_pages ENABLE ROW LEVEL SECURITY;

-- Crawled pages policies
CREATE POLICY "Users can view crawled pages of their projects"
  ON public.crawled_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = crawled_pages.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert crawled pages for their projects"
  ON public.crawled_pages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = crawled_pages.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update crawled pages of their projects"
  ON public.crawled_pages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = crawled_pages.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete crawled pages of their projects"
  ON public.crawled_pages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = crawled_pages.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Fact pack table (extracted facts with evidence)
CREATE TABLE public.fact_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'extracting', 'review', 'confirmed', 'failed')),
  
  -- Company info
  company_name TEXT,
  tagline TEXT,
  location TEXT,
  service_area TEXT,
  phone TEXT,
  email TEXT,
  
  -- Extracted facts array (each with evidence)
  facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- What's missing and needs user input
  missing_info JSONB DEFAULT '[]'::jsonb,
  
  -- Statistics
  total_facts INTEGER DEFAULT 0,
  confirmed_facts INTEGER DEFAULT 0,
  unconfirmed_facts INTEGER DEFAULT 0,
  
  extraction_log JSONB DEFAULT '[]'::jsonb,
  extracted_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fact_packs ENABLE ROW LEVEL SECURITY;

-- Fact packs policies
CREATE POLICY "Users can view fact packs of their projects"
  ON public.fact_packs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = fact_packs.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert fact packs for their projects"
  ON public.fact_packs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = fact_packs.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update fact packs of their projects"
  ON public.fact_packs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = fact_packs.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete fact packs of their projects"
  ON public.fact_packs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = fact_packs.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Scripts table
CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 30,
  angle TEXT NOT NULL DEFAULT 'authority' CHECK (angle IN ('authority', 'emotional', 'offer')),
  
  -- Script content
  hook_text TEXT,
  problem_text TEXT,
  solution_text TEXT,
  proof_text TEXT,
  cta_text TEXT,
  
  -- Full script JSON with timing
  script_json JSONB DEFAULT '{}'::jsonb,
  
  -- Claim check results
  claim_check_status TEXT NOT NULL DEFAULT 'pending' CHECK (claim_check_status IN ('pending', 'checking', 'passed', 'warnings', 'failed')),
  claim_warnings JSONB DEFAULT '[]'::jsonb,
  
  -- Voice over and captions
  vo_text TEXT,
  captions_json JSONB DEFAULT '[]'::jsonb,
  
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Scripts policies
CREATE POLICY "Users can view scripts of their projects"
  ON public.scripts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = scripts.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert scripts for their projects"
  ON public.scripts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = scripts.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update scripts of their projects"
  ON public.scripts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = scripts.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete scripts of their projects"
  ON public.scripts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = scripts.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Storyboards table
CREATE TABLE public.storyboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  script_id UUID REFERENCES public.scripts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1', '4:5')),
  
  -- Scene cards
  scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Platform target
  platform TEXT DEFAULT 'youtube',
  
  -- Total duration
  total_duration_seconds INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.storyboards ENABLE ROW LEVEL SECURITY;

-- Storyboards policies
CREATE POLICY "Users can view storyboards of their projects"
  ON public.storyboards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = storyboards.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert storyboards for their projects"
  ON public.storyboards FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = storyboards.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update storyboards of their projects"
  ON public.storyboards FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = storyboards.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete storyboards of their projects"
  ON public.storyboards FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = storyboards.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Renders table (video generation jobs)
CREATE TABLE public.renders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  storyboard_id UUID REFERENCES public.storyboards(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'mock' CHECK (provider IN ('mock', 'runway', 'pika', 'kling', 'luma')),
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'processing', 'rendering', 'post_processing', 'complete', 'failed')),
  progress INTEGER DEFAULT 0,
  
  -- Output URLs
  output_url TEXT,
  thumbnail_url TEXT,
  captions_url TEXT,
  
  -- Quality control
  qc_status TEXT DEFAULT 'pending' CHECK (qc_status IN ('pending', 'checking', 'passed', 'failed')),
  qc_report JSONB DEFAULT '{}'::jsonb,
  
  -- Job details
  job_id TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Logs
  job_log JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.renders ENABLE ROW LEVEL SECURITY;

-- Renders policies
CREATE POLICY "Users can view renders of their projects"
  ON public.renders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = renders.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert renders for their projects"
  ON public.renders FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = renders.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update renders of their projects"
  ON public.renders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = renders.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete renders of their projects"
  ON public.renders FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = renders.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Assets table (logos, uploads)
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'image', 'video', 'audio', 'document')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Extracted data (e.g., colors from logo)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Assets policies
CREATE POLICY "Users can view their own assets"
  ON public.assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets"
  ON public.assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON public.assets FOR DELETE
  USING (auth.uid() = user_id);

-- Background jobs table (for tracking async operations)
CREATE TABLE public.background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  job_type TEXT NOT NULL CHECK (job_type IN ('crawl', 'extract', 'script', 'storyboard', 'render', 'qc')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'complete', 'failed', 'cancelled')),
  
  progress INTEGER DEFAULT 0,
  progress_message TEXT,
  
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;

-- Background jobs policies
CREATE POLICY "Users can view jobs of their projects"
  ON public.background_jobs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = background_jobs.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert jobs for their projects"
  ON public.background_jobs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = background_jobs.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update jobs of their projects"
  ON public.background_jobs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = background_jobs.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fact_packs_updated_at
  BEFORE UPDATE ON public.fact_packs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_storyboards_updated_at
  BEFORE UPDATE ON public.storyboards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_renders_updated_at
  BEFORE UPDATE ON public.renders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_background_jobs_updated_at
  BEFORE UPDATE ON public.background_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_crawled_pages_project_id ON public.crawled_pages(project_id);
CREATE INDEX idx_fact_packs_project_id ON public.fact_packs(project_id);
CREATE INDEX idx_scripts_project_id ON public.scripts(project_id);
CREATE INDEX idx_storyboards_project_id ON public.storyboards(project_id);
CREATE INDEX idx_renders_project_id ON public.renders(project_id);
CREATE INDEX idx_renders_status ON public.renders(status);
CREATE INDEX idx_assets_project_id ON public.assets(project_id);
CREATE INDEX idx_background_jobs_project_id ON public.background_jobs(project_id);
CREATE INDEX idx_background_jobs_status ON public.background_jobs(status);

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project assets
CREATE POLICY "Users can upload their own assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view project assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-assets');