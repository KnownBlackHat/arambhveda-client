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
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          module: string
          record_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          module: string
          record_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          module?: string
          record_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          module: string | null
          record_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          module?: string | null
          record_id?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          module?: string | null
          record_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          position: string | null
          sort_order: number | null
          start_date: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          start_date?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          start_date?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      college_versions: {
        Row: {
          change_summary: string | null
          college_id: number
          created_at: string
          edited_by: string | null
          id: string
          previous_content: Json
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          college_id: number
          created_at?: string
          edited_by?: string | null
          id?: string
          previous_content: Json
          version_number?: number
        }
        Update: {
          change_summary?: string | null
          college_id?: number
          created_at?: string
          edited_by?: string | null
          id?: string
          previous_content?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "college_versions_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          accreditation: string | null
          address: string | null
          admission_exams: string[] | null
          admission_process: string | null
          affiliation: string | null
          approvals: string[] | null
          avg_fees: number | null
          avg_package: number | null
          breadcrumb_schema: Json | null
          campus_area: number | null
          canonical_url: string | null
          category: string | null
          city: string | null
          code: string | null
          college_conversion_rate: number | null
          courses: string[] | null
          created_at: string
          cutoff_details: Json | null
          deleted_at: string | null
          description: string | null
          established: number | null
          faq_schema: Json | null
          faqs: Json | null
          featured_priority: number | null
          gallery: string[] | null
          highest_package: number | null
          homepage_visible: boolean | null
          id: number
          image_url: string | null
          infrastructure: string[] | null
          is_featured: boolean | null
          leads_generated: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_views: number | null
          pincode: string | null
          prospectus_url: string | null
          publish_status: string | null
          rating: number | null
          scheduled_publish_at: string | null
          sitemap_priority: number | null
          slug: string | null
          state: string | null
          top_recruiters: string[] | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          accreditation?: string | null
          address?: string | null
          admission_exams?: string[] | null
          admission_process?: string | null
          affiliation?: string | null
          approvals?: string[] | null
          avg_fees?: number | null
          avg_package?: number | null
          breadcrumb_schema?: Json | null
          campus_area?: number | null
          canonical_url?: string | null
          category?: string | null
          city?: string | null
          code?: string | null
          college_conversion_rate?: number | null
          courses?: string[] | null
          created_at?: string
          cutoff_details?: Json | null
          deleted_at?: string | null
          description?: string | null
          established?: number | null
          faq_schema?: Json | null
          faqs?: Json | null
          featured_priority?: number | null
          gallery?: string[] | null
          highest_package?: number | null
          homepage_visible?: boolean | null
          id?: number
          image_url?: string | null
          infrastructure?: string[] | null
          is_featured?: boolean | null
          leads_generated?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_views?: number | null
          pincode?: string | null
          prospectus_url?: string | null
          publish_status?: string | null
          rating?: number | null
          scheduled_publish_at?: string | null
          sitemap_priority?: number | null
          slug?: string | null
          state?: string | null
          top_recruiters?: string[] | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          accreditation?: string | null
          address?: string | null
          admission_exams?: string[] | null
          admission_process?: string | null
          affiliation?: string | null
          approvals?: string[] | null
          avg_fees?: number | null
          avg_package?: number | null
          breadcrumb_schema?: Json | null
          campus_area?: number | null
          canonical_url?: string | null
          category?: string | null
          city?: string | null
          code?: string | null
          college_conversion_rate?: number | null
          courses?: string[] | null
          created_at?: string
          cutoff_details?: Json | null
          deleted_at?: string | null
          description?: string | null
          established?: number | null
          faq_schema?: Json | null
          faqs?: Json | null
          featured_priority?: number | null
          gallery?: string[] | null
          highest_package?: number | null
          homepage_visible?: boolean | null
          id?: number
          image_url?: string | null
          infrastructure?: string[] | null
          is_featured?: boolean | null
          leads_generated?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_views?: number | null
          pincode?: string | null
          prospectus_url?: string | null
          publish_status?: string | null
          rating?: number | null
          scheduled_publish_at?: string | null
          sitemap_priority?: number | null
          slug?: string | null
          state?: string | null
          top_recruiters?: string[] | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          avg_fees: number | null
          career_options: string[] | null
          created_at: string
          degree_type: string | null
          description: string | null
          duration: string | null
          eligibility: string | null
          id: string
          is_popular: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string | null
          status: string | null
          stream: string | null
          top_colleges: string[] | null
          updated_at: string
        }
        Insert: {
          avg_fees?: number | null
          career_options?: string[] | null
          created_at?: string
          degree_type?: string | null
          description?: string | null
          duration?: string | null
          eligibility?: string | null
          id?: string
          is_popular?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug?: string | null
          status?: string | null
          stream?: string | null
          top_colleges?: string[] | null
          updated_at?: string
        }
        Update: {
          avg_fees?: number | null
          career_options?: string[] | null
          created_at?: string
          degree_type?: string | null
          description?: string | null
          duration?: string | null
          eligibility?: string | null
          id?: string
          is_popular?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string | null
          status?: string | null
          stream?: string | null
          top_colleges?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      erp_attendance: {
        Row: {
          check_in: string
          check_out: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          check_in?: string
          check_out?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          check_in?: string
          check_out?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      erp_call_logs: {
        Row: {
          created_at: string
          duration_minutes: number | null
          duration_seconds: number | null
          id: string
          lead_id: string | null
          notes: string | null
          outcome: Database["public"]["Enums"]["call_outcome"]
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          duration_seconds?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome: Database["public"]["Enums"]["call_outcome"]
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          duration_seconds?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: Database["public"]["Enums"]["call_outcome"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_call_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "erp_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_leads: {
        Row: {
          assigned_to: string | null
          call_count: number | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          follow_up_date: string | null
          id: string
          inactivity_days: number | null
          is_complete: boolean | null
          last_activity_at: string | null
          last_call_at: string | null
          last_note_at: string | null
          name: string
          next_follow_up_at: string | null
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          call_count?: number | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          follow_up_date?: string | null
          id?: string
          inactivity_days?: number | null
          is_complete?: boolean | null
          last_activity_at?: string | null
          last_call_at?: string | null
          last_note_at?: string | null
          name: string
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          call_count?: number | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          follow_up_date?: string | null
          id?: string
          inactivity_days?: number | null
          is_complete?: boolean | null
          last_activity_at?: string | null
          last_call_at?: string | null
          last_note_at?: string | null
          name?: string
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          conducting_body: string | null
          created_at: string
          description: string | null
          eligibility: string | null
          exam_date: string | null
          exam_pattern: string | null
          frequency: string | null
          full_name: string | null
          id: string
          is_popular: boolean | null
          meta_description: string | null
          meta_title: string | null
          mode: string | null
          name: string
          official_website: string | null
          preparation_tips: string | null
          registration_end: string | null
          registration_start: string | null
          slug: string | null
          status: string | null
          syllabus: string | null
          updated_at: string
        }
        Insert: {
          conducting_body?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          exam_date?: string | null
          exam_pattern?: string | null
          frequency?: string | null
          full_name?: string | null
          id?: string
          is_popular?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          mode?: string | null
          name: string
          official_website?: string | null
          preparation_tips?: string | null
          registration_end?: string | null
          registration_start?: string | null
          slug?: string | null
          status?: string | null
          syllabus?: string | null
          updated_at?: string
        }
        Update: {
          conducting_body?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          exam_date?: string | null
          exam_pattern?: string | null
          frequency?: string | null
          full_name?: string | null
          id?: string
          is_popular?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          mode?: string | null
          name?: string
          official_website?: string | null
          preparation_tips?: string | null
          registration_end?: string | null
          registration_start?: string | null
          slug?: string | null
          status?: string | null
          syllabus?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
        }
        Relationships: []
      }
      lead_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          lead_id: string
          new_status: string
          notes: string | null
          old_status: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          lead_id: string
          new_status: string
          notes?: string | null
          old_status?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_timeline: {
        Row: {
          action_type: string
          created_at: string
          id: string
          lead_id: string
          metadata: Json | null
          new_value: string | null
          notes: string | null
          old_value: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          lead_id: string
          metadata?: Json | null
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_timeline_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "erp_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          city: string | null
          course_interest: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          follow_up_date: string | null
          id: string
          is_duplicate: boolean | null
          lead_stage: string | null
          merged_into: string | null
          name: string
          notes: string | null
          phone: string | null
          reminder_flag: boolean | null
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          city?: string | null
          course_interest?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          follow_up_date?: string | null
          id?: string
          is_duplicate?: boolean | null
          lead_stage?: string | null
          merged_into?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          reminder_flag?: boolean | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          city?: string | null
          course_interest?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          follow_up_date?: string | null
          id?: string
          is_duplicate?: boolean | null
          lead_stage?: string | null
          merged_into?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          reminder_flag?: boolean | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          file_url: string
          folder: string | null
          id: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          folder?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          folder?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prospect_calls: {
        Row: {
          ai_analysis: string | null
          ai_promote_recommendation: boolean | null
          call_time: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          notes: string | null
          outcome: Database["public"]["Enums"]["prospect_call_outcome"]
          prospect_id: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          ai_promote_recommendation?: boolean | null
          call_time?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          outcome: Database["public"]["Enums"]["prospect_call_outcome"]
          prospect_id: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          ai_promote_recommendation?: boolean | null
          call_time?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          outcome?: Database["public"]["Enums"]["prospect_call_outcome"]
          prospect_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospect_calls_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          ai_recommendation: string | null
          ai_score: number | null
          assigned_to: string | null
          call_count: number | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_promoted: boolean | null
          last_called_at: string | null
          name: string
          notes: string | null
          phone: string | null
          promoted_at: string | null
          promoted_to_lead_id: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          ai_recommendation?: string | null
          ai_score?: number | null
          assigned_to?: string | null
          call_count?: number | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_promoted?: boolean | null
          last_called_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          promoted_at?: string | null
          promoted_to_lead_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          ai_recommendation?: string | null
          ai_score?: number | null
          assigned_to?: string | null
          call_count?: number | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_promoted?: boolean | null
          last_called_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          promoted_at?: string | null
          promoted_to_lead_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospects_promoted_to_lead_id_fkey"
            columns: ["promoted_to_lead_id"]
            isOneToOne: false
            referencedRelation: "erp_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          schema_markup: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          schema_markup?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          schema_markup?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      slug_redirects: {
        Row: {
          created_at: string
          entity_type: string
          id: string
          new_slug: string
          old_slug: string
        }
        Insert: {
          created_at?: string
          entity_type?: string
          id?: string
          new_slug: string
          old_slug: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          id?: string
          new_slug?: string
          old_slug?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          is_visible: boolean | null
          name: string
          rating: number | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          name: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          name?: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "content_manager"
        | "seo_manager"
        | "lead_manager"
        | "editor"
        | "admin"
        | "user"
      call_outcome:
        | "answered"
        | "no_answer"
        | "busy"
        | "voicemail"
        | "wrong_number"
        | "callback_requested"
      invitation_status: "pending" | "accepted" | "expired" | "revoked"
      lead_status:
        | "new"
        | "contacted"
        | "interested"
        | "follow_up"
        | "converted"
        | "not_interested"
      prospect_call_outcome:
        | "connected"
        | "not_connected"
        | "busy"
        | "no_answer"
        | "wrong_number"
        | "callback"
        | "interested"
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
    Enums: {
      app_role: [
        "super_admin",
        "content_manager",
        "seo_manager",
        "lead_manager",
        "editor",
        "admin",
        "user",
      ],
      call_outcome: [
        "answered",
        "no_answer",
        "busy",
        "voicemail",
        "wrong_number",
        "callback_requested",
      ],
      invitation_status: ["pending", "accepted", "expired", "revoked"],
      lead_status: [
        "new",
        "contacted",
        "interested",
        "follow_up",
        "converted",
        "not_interested",
      ],
      prospect_call_outcome: [
        "connected",
        "not_connected",
        "busy",
        "no_answer",
        "wrong_number",
        "callback",
        "interested",
      ],
    },
  },
} as const
