// lib/supabase/testimonials.ts
import { supabase } from './client';
import { Database } from './types';

export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type InsertTestimonial = Database['public']['Tables']['testimonials']['Insert'];

/**
 * createTestimonial
 * Inserts a new testimonial into the database.
 * Restricted by RLS: insert is only allowed if auth.uid() matches user_id.
 */
export async function createTestimonial(testimonial: InsertTestimonial) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();

    if (error) {
      console.error("[Database] createTestimonial query error:", error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("[Database] createTestimonial caught error:", err);
    return { data: null, error: err };
  }
}

/**
 * getUserTestimonials
 * Fetches all testimonials submitted by a specific user.
 * Restricted by RLS: selects are only allowed if auth.uid() matches user_id.
 */
export async function getUserTestimonials(userId: string) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[Database] getUserTestimonials query error:", error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("[Database] getUserTestimonials caught error:", err);
    return { data: null, error: err };
  }
}
