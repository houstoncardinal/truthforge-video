import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project, ProjectSettings, BrandFonts } from '@/types';
import { toast } from 'sonner';

// Transform database row to Project type
function transformProject(row: any): Project {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    description: row.description,
    website_url: row.website_url,
    status: row.status,
    current_step: row.current_step,
    logo_url: row.logo_url,
    brand_colors: (row.brand_colors as string[]) || [],
    brand_fonts: (row.brand_fonts as BrandFonts) || { primary: 'Inter', secondary: 'Inter' },
    settings: (row.settings as ProjectSettings) || {
      max_crawl_pages: 30,
      target_platforms: ['youtube'],
      commercial_types: ['30s'],
      aspect_ratios: ['16:9'],
    },
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformProject);
    },
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return transformProject(data);
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      website_url: string;
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: input.name,
          website_url: input.website_url,
          description: input.description,
        })
        .select()
        .single();

      if (error) throw error;
      return transformProject(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Project> & { id: string }) => {
      // Transform to database-compatible types
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.website_url !== undefined) dbUpdates.website_url = updates.website_url;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.current_step !== undefined) dbUpdates.current_step = updates.current_step;
      if (updates.logo_url !== undefined) dbUpdates.logo_url = updates.logo_url;
      if (updates.brand_colors !== undefined) dbUpdates.brand_colors = updates.brand_colors;
      if (updates.brand_fonts !== undefined) dbUpdates.brand_fonts = updates.brand_fonts;
      if (updates.settings !== undefined) dbUpdates.settings = updates.settings;

      const { data, error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return transformProject(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });
}
