export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string
          file_size: number | null
          file_url: string
          id: string
          metadata: Json | null
          mime_type: string | null
          name: string
          project_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_url: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name: string
          project_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_url?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          project_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      background_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          input_data: Json | null
          job_type: string
          max_retries: number | null
          output_data: Json | null
          progress: number | null
          progress_message: string | null
          project_id: string
          retry_count: number | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json | null
          job_type: string
          max_retries?: number | null
          output_data?: Json | null
          progress?: number | null
          progress_message?: string | null
          project_id: string
          retry_count?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json | null
          job_type?: string
          max_retries?: number | null
          output_data?: Json | null
          progress?: number | null
          progress_message?: string | null
          project_id?: string
          retry_count?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "background_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_pages: {
        Row: {
          crawl_status: string
          crawled_at: string | null
          created_at: string
          error_message: string | null
          html_hash: string | null
          id: string
          project_id: string
          text_content: string | null
          title: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          crawl_status?: string
          crawled_at?: string | null
          created_at?: string
          error_message?: string | null
          html_hash?: string | null
          id?: string
          project_id: string
          text_content?: string | null
          title?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          crawl_status?: string
          crawled_at?: string | null
          created_at?: string
          error_message?: string | null
          html_hash?: string | null
          id?: string
          project_id?: string
          text_content?: string | null
          title?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_pages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_packs: {
        Row: {
          company_name: string | null
          confirmed_at: string | null
          confirmed_facts: number | null
          created_at: string
          email: string | null
          extracted_at: string | null
          extraction_log: Json | null
          facts: Json
          id: string
          location: string | null
          missing_info: Json | null
          phone: string | null
          project_id: string
          service_area: string | null
          status: string
          tagline: string | null
          total_facts: number | null
          unconfirmed_facts: number | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          confirmed_at?: string | null
          confirmed_facts?: number | null
          created_at?: string
          email?: string | null
          extracted_at?: string | null
          extraction_log?: Json | null
          facts?: Json
          id?: string
          location?: string | null
          missing_info?: Json | null
          phone?: string | null
          project_id: string
          service_area?: string | null
          status?: string
          tagline?: string | null
          total_facts?: number | null
          unconfirmed_facts?: number | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          confirmed_at?: string | null
          confirmed_facts?: number | null
          created_at?: string
          email?: string | null
          extracted_at?: string | null
          extraction_log?: Json | null
          facts?: Json
          id?: string
          location?: string | null
          missing_info?: Json | null
          phone?: string | null
          project_id?: string
          service_area?: string | null
          status?: string
          tagline?: string | null
          total_facts?: number | null
          unconfirmed_facts?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fact_packs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          brand_colors: Json | null
          brand_fonts: Json | null
          created_at: string
          current_step: number
          description: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          status: string
          updated_at: string
          user_id: string
          website_url: string
        }
        Insert: {
          brand_colors?: Json | null
          brand_fonts?: Json | null
          created_at?: string
          current_step?: number
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id: string
          website_url: string
        }
        Update: {
          brand_colors?: Json | null
          brand_fonts?: Json | null
          created_at?: string
          current_step?: number
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
          website_url?: string
        }
        Relationships: []
      }
      renders: {
        Row: {
          captions_url: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_id: string | null
          job_log: Json | null
          name: string
          output_url: string | null
          progress: number | null
          project_id: string
          provider: string
          qc_report: Json | null
          qc_status: string | null
          retry_count: number | null
          started_at: string | null
          status: string
          storyboard_id: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          captions_url?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_id?: string | null
          job_log?: Json | null
          name: string
          output_url?: string | null
          progress?: number | null
          project_id: string
          provider?: string
          qc_report?: Json | null
          qc_status?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          storyboard_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          captions_url?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_id?: string | null
          job_log?: Json | null
          name?: string
          output_url?: string | null
          progress?: number | null
          project_id?: string
          provider?: string
          qc_report?: Json | null
          qc_status?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          storyboard_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renders_storyboard_id_fkey"
            columns: ["storyboard_id"]
            isOneToOne: false
            referencedRelation: "storyboards"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts: {
        Row: {
          angle: string
          captions_json: Json | null
          claim_check_status: string
          claim_warnings: Json | null
          created_at: string
          cta_text: string | null
          duration_seconds: number
          hook_text: string | null
          id: string
          is_active: boolean | null
          name: string
          problem_text: string | null
          project_id: string
          proof_text: string | null
          script_json: Json | null
          solution_text: string | null
          updated_at: string
          version: number | null
          vo_text: string | null
        }
        Insert: {
          angle?: string
          captions_json?: Json | null
          claim_check_status?: string
          claim_warnings?: Json | null
          created_at?: string
          cta_text?: string | null
          duration_seconds?: number
          hook_text?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          problem_text?: string | null
          project_id: string
          proof_text?: string | null
          script_json?: Json | null
          solution_text?: string | null
          updated_at?: string
          version?: number | null
          vo_text?: string | null
        }
        Update: {
          angle?: string
          captions_json?: Json | null
          claim_check_status?: string
          claim_warnings?: Json | null
          created_at?: string
          cta_text?: string | null
          duration_seconds?: number
          hook_text?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          problem_text?: string | null
          project_id?: string
          proof_text?: string | null
          script_json?: Json | null
          solution_text?: string | null
          updated_at?: string
          version?: number | null
          vo_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scripts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      storyboards: {
        Row: {
          aspect_ratio: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          platform: string | null
          project_id: string
          scenes: Json
          script_id: string | null
          total_duration_seconds: number | null
          updated_at: string
        }
        Insert: {
          aspect_ratio?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          platform?: string | null
          project_id: string
          scenes?: Json
          script_id?: string | null
          total_duration_seconds?: number | null
          updated_at?: string
        }
        Update: {
          aspect_ratio?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          platform?: string | null
          project_id?: string
          scenes?: Json
          script_id?: string | null
          total_duration_seconds?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storyboards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storyboards_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
