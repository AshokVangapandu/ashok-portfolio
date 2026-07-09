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
          featured: boolean
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
          featured?: boolean
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
          featured?: boolean
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
      admins: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          full_name: string
          email: string
          company: string | null
          phone_number: string | null
          subject: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          company?: string | null
          phone_number?: string | null
          subject: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          company?: string | null
          phone_number?: string | null
          subject?: string
          message?: string
          status?: string
          created_at?: string
        }
        Relationships: []
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
