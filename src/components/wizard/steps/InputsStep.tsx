import { useState } from 'react';
import { useUpdateProject } from '@/hooks/useProjects';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Globe,
  Image as ImageIcon,
  Loader2,
  Palette,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface InputsStepProps {
  project: Project;
  onNext: () => void;
}

export function InputsStep({ project, onNext }: InputsStepProps) {
  const updateProject = useUpdateProject();
  const [isUploading, setIsUploading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(project.website_url);
  const [description, setDescription] = useState(project.description || '');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${project.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath);

      await updateProject.mutateAsync({
        id: project.id,
        logo_url: publicUrl,
      });

      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProject.mutateAsync({
        id: project.id,
        website_url: websiteUrl,
        description,
      });
      toast.success('Project saved');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleNext = async () => {
    await handleSave();
    onNext();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Project Setup</h2>
        <p className="text-muted-foreground">
          Enter your business details to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website URL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Website URL
            </CardTitle>
            <CardDescription>
              We'll crawl this site to extract facts for your commercial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your business..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              Brand Logo
            </CardTitle>
            <CardDescription>
              Upload your logo for the commercial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.logo_url ? (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={project.logo_url}
                    alt="Logo"
                    className="w-full h-full object-contain p-4"
                  />
                  <Badge className="absolute top-2 right-2 bg-verified">
                    Uploaded
                  </Badge>
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No logo uploaded</p>
                  </div>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button variant="outline" className="w-full" disabled={isUploading}>
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {project.logo_url ? 'Replace Logo' : 'Upload Logo'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              Brand Kit
            </CardTitle>
            <CardDescription>
              We'll automatically extract colors from your logo. You can customize them later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {project.brand_colors.length > 0 ? (
                project.brand_colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg border shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                  <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                  <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                  <span className="text-sm">Colors will be extracted in the next step</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} size="lg">
          Continue to Research
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
