import type { WizardStep, Platform, AspectRatio, ScriptAngle, FactType, ShotType } from '@/types';

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    name: 'Inputs',
    description: 'URL, logo & brand kit',
    icon: 'Globe',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Research',
    description: 'Crawl & extract evidence',
    icon: 'Search',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Strategy',
    description: 'Audience & positioning',
    icon: 'Target',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Script',
    description: 'Claim-checked scripts',
    icon: 'FileText',
    status: 'pending',
  },
  {
    id: 5,
    name: 'Storyboard',
    description: 'Scene-by-scene plan',
    icon: 'LayoutGrid',
    status: 'pending',
  },
  {
    id: 6,
    name: 'Generate',
    description: 'Video generation & QC',
    icon: 'Video',
    status: 'pending',
  },
];

export const PLATFORMS: { value: Platform; label: string; aspectRatio: AspectRatio }[] = [
  { value: 'youtube', label: 'YouTube', aspectRatio: '16:9' },
  { value: 'instagram', label: 'Instagram Reels', aspectRatio: '9:16' },
  { value: 'tiktok', label: 'TikTok', aspectRatio: '9:16' },
  { value: 'facebook', label: 'Facebook', aspectRatio: '1:1' },
  { value: 'linkedin', label: 'LinkedIn', aspectRatio: '16:9' },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; dimensions: string }[] = [
  { value: '16:9', label: 'Landscape', dimensions: '1920×1080' },
  { value: '9:16', label: 'Vertical', dimensions: '1080×1920' },
  { value: '1:1', label: 'Square', dimensions: '1080×1080' },
  { value: '4:5', label: 'Portrait', dimensions: '1080×1350' },
];

export const SCRIPT_ANGLES: { value: ScriptAngle; label: string; description: string }[] = [
  { 
    value: 'authority', 
    label: 'Authority', 
    description: 'Establish expertise and trust through credentials and experience' 
  },
  { 
    value: 'emotional', 
    label: 'Emotional', 
    description: 'Connect through pain points, aspirations, and transformation' 
  },
  { 
    value: 'offer', 
    label: 'Offer-Driven', 
    description: 'Lead with value proposition, pricing, or limited-time deals' 
  },
];

export const FACT_TYPES: { value: FactType; label: string; icon: string }[] = [
  { value: 'company_name', label: 'Company Name', icon: 'Building' },
  { value: 'tagline', label: 'Tagline', icon: 'Quote' },
  { value: 'service', label: 'Service', icon: 'Wrench' },
  { value: 'product', label: 'Product', icon: 'Package' },
  { value: 'guarantee', label: 'Guarantee', icon: 'Shield' },
  { value: 'claim', label: 'Claim', icon: 'MessageSquare' },
  { value: 'testimonial', label: 'Testimonial', icon: 'Star' },
  { value: 'award', label: 'Award', icon: 'Award' },
  { value: 'certification', label: 'Certification', icon: 'BadgeCheck' },
  { value: 'pricing', label: 'Pricing', icon: 'DollarSign' },
  { value: 'location', label: 'Location', icon: 'MapPin' },
  { value: 'contact', label: 'Contact', icon: 'Phone' },
  { value: 'industry', label: 'Industry', icon: 'Factory' },
  { value: 'differentiator', label: 'Differentiator', icon: 'Sparkles' },
  { value: 'statistic', label: 'Statistic', icon: 'BarChart' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
];

export const SHOT_TYPES: { value: ShotType; label: string }[] = [
  { value: 'wide', label: 'Wide Shot' },
  { value: 'medium', label: 'Medium Shot' },
  { value: 'close_up', label: 'Close Up' },
  { value: 'extreme_close_up', label: 'Extreme Close Up' },
  { value: 'overhead', label: 'Overhead' },
  { value: 'pov', label: 'POV' },
  { value: 'tracking', label: 'Tracking Shot' },
  { value: 'static', label: 'Static' },
  { value: 'text_overlay', label: 'Text Overlay' },
  { value: 'logo_reveal', label: 'Logo Reveal' },
];

export const COMMERCIAL_DURATIONS = [
  { value: 15, label: '15s', description: 'Hook-first quick ad' },
  { value: 30, label: '30s', description: 'Trust + Proof standard' },
  { value: 45, label: '45s', description: 'Explainer format' },
  { value: 60, label: '60s', description: 'Full story arc' },
];

export const CONFIDENCE_LABELS = {
  high: { label: 'Verified', color: 'verified' },
  medium: { label: 'Likely', color: 'warning' },
  low: { label: 'Needs Review', color: 'destructive' },
};

export const FORBIDDEN_CLAIMS = [
  '#1',
  'best',
  'number one',
  'top rated',
  'award-winning',
  'leading',
  'guaranteed',
  'proven',
  'fastest',
  'cheapest',
  'most trusted',
  'industry leader',
];

export const VIDEO_PROVIDERS = [
  { value: 'mock', label: 'Mock Provider', description: 'Test without API keys' },
  { value: 'runway', label: 'Runway', description: 'High-quality AI video generation' },
  { value: 'pika', label: 'Pika', description: 'Fast video synthesis' },
  { value: 'kling', label: 'Kling', description: 'Advanced motion synthesis' },
  { value: 'luma', label: 'Luma', description: 'Dream Machine video AI' },
];
