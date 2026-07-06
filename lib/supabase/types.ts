// lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          google_name: string | null
          google_email: string
          google_avatar: string | null
          linkedin_url: string | null
          testimonial: string
          consent_public: boolean
          status: 'pending' | 'approved' | 'rejected'
          approved: boolean
          source: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          google_name?: string | null
          google_email: string
          google_avatar?: string | null
          linkedin_url?: string | null
          testimonial: string
          consent_public?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          approved?: boolean
          source?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          google_name?: string | null
          google_email?: string
          google_avatar?: string | null
          linkedin_url?: string | null
          testimonial?: string
          consent_public?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          approved?: boolean
          source?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
