// CommercialForge AI Type Definitions

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  website_url: string;
  status: ProjectStatus;
  current_step: number;
  logo_url?: string;
  brand_colors: string[];
  brand_fonts: BrandFonts;
  settings: ProjectSettings;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 
  | 'draft' 
  | 'researching' 
  | 'scripting' 
  | 'storyboarding' 
  | 'generating' 
  | 'complete' 
  | 'failed';

export interface BrandFonts {
  primary: string;
  secondary: string;
}

export interface ProjectSettings {
  max_crawl_pages: number;
  target_platforms: Platform[];
  commercial_types: CommercialType[];
  aspect_ratios: AspectRatio[];
}

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin';
export type CommercialType = '15s' | '30s' | '45s' | '60s';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

// Fact Pack Types
export interface FactPack {
  id: string;
  project_id: string;
  status: FactPackStatus;
  company_name?: string;
  tagline?: string;
  location?: string;
  service_area?: string;
  phone?: string;
  email?: string;
  facts: Fact[];
  missing_info: MissingInfo[];
  total_facts: number;
  confirmed_facts: number;
  unconfirmed_facts: number;
  extraction_log: LogEntry[];
  extracted_at?: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export type FactPackStatus = 'pending' | 'extracting' | 'review' | 'confirmed' | 'failed';

export interface Fact {
  id: string;
  type: FactType;
  value: string;
  category?: string;
  evidence: Evidence[];
  confidence: ConfidenceLevel;
  status: FactStatus;
  user_provided?: boolean;
  user_notes?: string;
}

export type FactType = 
  | 'company_name'
  | 'tagline'
  | 'service'
  | 'product'
  | 'guarantee'
  | 'claim'
  | 'testimonial'
  | 'award'
  | 'certification'
  | 'pricing'
  | 'location'
  | 'contact'
  | 'industry'
  | 'differentiator'
  | 'statistic'
  | 'other';

export interface Evidence {
  url: string;
  quote: string;
  page_title?: string;
  extracted_at: string;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type FactStatus = 'confirmed' | 'unconfirmed' | 'rejected' | 'needs_review';

export interface MissingInfo {
  type: string;
  description: string;
  required: boolean;
  user_value?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, unknown>;
}

// Script Types
export interface Script {
  id: string;
  project_id: string;
  name: string;
  duration_seconds: number;
  angle: ScriptAngle;
  hook_text?: string;
  problem_text?: string;
  solution_text?: string;
  proof_text?: string;
  cta_text?: string;
  script_json: ScriptJSON;
  claim_check_status: ClaimCheckStatus;
  claim_warnings: ClaimWarning[];
  vo_text?: string;
  captions_json: Caption[];
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export type ScriptAngle = 'authority' | 'emotional' | 'offer';
export type ClaimCheckStatus = 'pending' | 'checking' | 'passed' | 'warnings' | 'failed';

export interface ScriptJSON {
  sections: ScriptSection[];
  total_duration: number;
  word_count: number;
}

export interface ScriptSection {
  type: 'hook' | 'problem' | 'solution' | 'proof' | 'cta';
  text: string;
  start_time: number;
  end_time: number;
  on_screen_text?: string;
  fact_references: string[]; // Fact IDs
}

export interface ClaimWarning {
  id: string;
  severity: 'error' | 'warning' | 'info';
  text: string;
  phrase: string;
  section: string;
  suggestion?: string;
  fact_id?: string;
}

export interface Caption {
  start: number;
  end: number;
  text: string;
}

// Storyboard Types
export interface Storyboard {
  id: string;
  project_id: string;
  script_id?: string;
  name: string;
  aspect_ratio: AspectRatio;
  scenes: Scene[];
  platform: Platform;
  total_duration_seconds: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  order: number;
  duration: number;
  start_time: number;
  end_time: number;
  shot_type: ShotType;
  shot_description: string;
  on_screen_text: string;
  b_roll_suggestions: string[];
  brand_instructions: BrandInstructions;
  audio_notes: AudioNotes;
  model_prompt: string;
  fact_references: string[];
}

export type ShotType = 
  | 'wide'
  | 'medium'
  | 'close_up'
  | 'extreme_close_up'
  | 'overhead'
  | 'pov'
  | 'tracking'
  | 'static'
  | 'text_overlay'
  | 'logo_reveal';

export interface BrandInstructions {
  logo_position?: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center' | 'none';
  color_overlay?: string;
  typography_style?: string;
  safe_zone: boolean;
}

export interface AudioNotes {
  music_mood?: string;
  sfx?: string[];
  vo_timing?: string;
}

// Render Types
export interface Render {
  id: string;
  project_id: string;
  storyboard_id?: string;
  name: string;
  provider: VideoProvider;
  status: RenderStatus;
  progress: number;
  output_url?: string;
  thumbnail_url?: string;
  captions_url?: string;
  qc_status: QCStatus;
  qc_report: QCReport;
  job_id?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;
  job_log: LogEntry[];
  created_at: string;
  updated_at: string;
}

export type VideoProvider = 'mock' | 'runway' | 'pika' | 'kling' | 'luma';
export type RenderStatus = 'pending' | 'queued' | 'processing' | 'rendering' | 'post_processing' | 'complete' | 'failed';
export type QCStatus = 'pending' | 'checking' | 'passed' | 'failed';

export interface QCReport {
  passed: boolean;
  checks: QCCheck[];
  timestamp?: string;
}

export interface QCCheck {
  name: string;
  passed: boolean;
  message?: string;
}

// Crawled Page Types
export interface CrawledPage {
  id: string;
  project_id: string;
  url: string;
  title?: string;
  text_content?: string;
  html_hash?: string;
  word_count: number;
  crawl_status: CrawlStatus;
  error_message?: string;
  crawled_at?: string;
  created_at: string;
}

export type CrawlStatus = 'pending' | 'crawling' | 'complete' | 'failed';

// Background Job Types
export interface BackgroundJob {
  id: string;
  project_id: string;
  job_type: JobType;
  status: JobStatus;
  progress: number;
  progress_message?: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export type JobType = 'crawl' | 'extract' | 'script' | 'storyboard' | 'render' | 'qc';
export type JobStatus = 'pending' | 'running' | 'complete' | 'failed' | 'cancelled';

// Asset Types
export interface Asset {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  type: AssetType;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  metadata: AssetMetadata;
  created_at: string;
}

export type AssetType = 'logo' | 'image' | 'video' | 'audio' | 'document';

export interface AssetMetadata {
  colors?: string[];
  dimensions?: { width: number; height: number };
  duration?: number;
}

// Wizard Step Types
export interface WizardStep {
  id: number;
  name: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

// Export Pack Types
export interface ExportPack {
  project_id: string;
  render_id: string;
  files: ExportFile[];
  created_at: string;
}

export interface ExportFile {
  type: 'mp4' | 'srt' | 'json' | 'pdf' | 'thumbnail';
  name: string;
  url: string;
  size?: number;
}
