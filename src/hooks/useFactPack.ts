import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FactPack, Fact, MissingInfo, LogEntry } from '@/types';
import { toast } from 'sonner';

// Transform database row to FactPack type
function transformFactPack(row: any): FactPack {
  return {
    id: row.id,
    project_id: row.project_id,
    status: row.status,
    company_name: row.company_name,
    tagline: row.tagline,
    location: row.location,
    service_area: row.service_area,
    phone: row.phone,
    email: row.email,
    facts: (row.facts as Fact[]) || [],
    missing_info: (row.missing_info as MissingInfo[]) || [],
    total_facts: row.total_facts || 0,
    confirmed_facts: row.confirmed_facts || 0,
    unconfirmed_facts: row.unconfirmed_facts || 0,
    extraction_log: (row.extraction_log as LogEntry[]) || [],
    extracted_at: row.extracted_at,
    confirmed_at: row.confirmed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useFactPack(projectId: string | undefined) {
  return useQuery({
    queryKey: ['factPack', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from('fact_packs')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? transformFactPack(data) : null;
    },
    enabled: !!projectId,
  });
}

export function useCreateFactPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data, error } = await supabase
        .from('fact_packs')
        .insert({
          project_id: projectId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return transformFactPack(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['factPack', data.project_id] });
    },
  });
}

export function useUpdateFactPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      ...updates
    }: Partial<FactPack> & { id: string; projectId: string }) => {
      const updateData: Record<string, any> = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.company_name !== undefined) updateData.company_name = updates.company_name;
      if (updates.tagline !== undefined) updateData.tagline = updates.tagline;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.service_area !== undefined) updateData.service_area = updates.service_area;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.facts) updateData.facts = updates.facts;
      if (updates.missing_info) updateData.missing_info = updates.missing_info;
      if (updates.total_facts !== undefined) updateData.total_facts = updates.total_facts;
      if (updates.confirmed_facts !== undefined) updateData.confirmed_facts = updates.confirmed_facts;
      if (updates.unconfirmed_facts !== undefined) updateData.unconfirmed_facts = updates.unconfirmed_facts;
      if (updates.extraction_log) updateData.extraction_log = updates.extraction_log;
      if (updates.extracted_at) updateData.extracted_at = updates.extracted_at;
      if (updates.confirmed_at) updateData.confirmed_at = updates.confirmed_at;

      const { data, error } = await supabase
        .from('fact_packs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return transformFactPack(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['factPack', data.project_id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update fact pack: ${error.message}`);
    },
  });
}

export function useConfirmFact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      factPackId,
      projectId,
      factId,
      status,
    }: {
      factPackId: string;
      projectId: string;
      factId: string;
      status: 'confirmed' | 'rejected';
    }) => {
      // Get current facts
      const { data: factPack, error: fetchError } = await supabase
        .from('fact_packs')
        .select('facts, confirmed_facts, unconfirmed_facts')
        .eq('id', factPackId)
        .single();

      if (fetchError) throw fetchError;

      const facts = (factPack.facts as unknown as Fact[]) || [];
      const updatedFacts = facts.map((fact) =>
        fact.id === factId ? { ...fact, status } : fact
      );

      const confirmedCount = updatedFacts.filter((f) => f.status === 'confirmed').length;
      const unconfirmedCount = updatedFacts.filter((f) => f.status !== 'confirmed').length;

      const { data, error } = await supabase
        .from('fact_packs')
        .update({
          facts: JSON.parse(JSON.stringify(updatedFacts)),
          confirmed_facts: confirmedCount,
          unconfirmed_facts: unconfirmedCount,
        })
        .eq('id', factPackId)
        .select()
        .single();

      if (error) throw error;
      return transformFactPack(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['factPack', data.project_id] });
      toast.success('Fact updated');
    },
  });
}
