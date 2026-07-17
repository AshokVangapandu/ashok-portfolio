/* src/admin/services/testimonialService.ts */
import { supabase } from '../../services/supabase/client';
import { Testimonial, SupabaseTestimonial, mapSupabaseToTestimonial } from '../types/testimonial';

export interface TestimonialsQueryOptions {
  search?: string;
  status?: string;
  rating?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export const testimonialService = {
  /**
   * Retrieves testimonials based on search queries, filters, and pagination from Supabase.
   */
  async getTestimonials(options: TestimonialsQueryOptions = {}): Promise<{
    data: Testimonial[];
    totalCount: number;
  }> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const search = options.search || '';
    const status = options.status || 'all';
    const rating = options.rating || 'all';
    const sortBy = options.sortBy || 'newest';

    let query = supabase
      .from('testimonials')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    // 1. Search Filter
    if (search.trim()) {
      const q = `%${search.trim()}%`;
      query = query.or(`full_name.ilike.${q},email.ilike.${q},company.ilike.${q},testimonial.ilike.${q}`);
    }

    // 2. Status Filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // 3. Rating Filter
    if (rating !== 'all') {
      const r = parseInt(rating, 10);
      if (!isNaN(r)) {
        query = query.eq('rating', r);
      }
    }

    // 4. Sort By
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sortBy === 'rating_high' || sortBy === 'highest_rating') {
      query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
    } else if (sortBy === 'rating_low' || sortBy === 'lowest_rating') {
      query = query.order('rating', { ascending: true }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 5. Pagination range
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error('[testimonialService.getTestimonials] Query error:', error);
      throw error;
    }

    const mappedData = (data as SupabaseTestimonial[] || []).map(mapSupabaseToTestimonial);

    return {
      data: mappedData,
      totalCount: count || 0,
    };
  },

  /**
   * Retrieves a single testimonial by ID.
   */
  async getTestimonialById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('[testimonialService.getTestimonialById] Error:', error);
      throw error;
    }

    return data ? mapSupabaseToTestimonial(data as SupabaseTestimonial) : null;
  },

  /**
   * Updates an existing testimonial row in Supabase.
   */
  async updateTestimonial(id: string, updates: Partial<SupabaseTestimonial>): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[testimonialService.updateTestimonial] Error:', error);
      throw error;
    }

    return data ? mapSupabaseToTestimonial(data as SupabaseTestimonial) : null;
  },

  /**
   * Deletes a testimonial by ID (Soft delete).
   */
  async deleteTestimonial(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('testimonials')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[testimonialService.deleteTestimonial] Error:', error);
      throw error;
    }

    return true;
  },

  /**
   * Approves a testimonial with audit fields.
   */
  async approveTestimonial(id: string): Promise<Testimonial | null> {
    const { data: userData } = await supabase.auth.getUser();
    const adminEmail = userData?.user?.email || 'Admin';
    return this.updateTestimonial(id, {
      status: 'approved',
      is_visible: true,
      approved_at: new Date().toISOString(),
      approved_by: adminEmail
    });
  },

  /**
   * Rejects a testimonial with audit fields.
   */
  async rejectTestimonial(id: string): Promise<Testimonial | null> {
    const { data: userData } = await supabase.auth.getUser();
    const adminEmail = userData?.user?.email || 'Admin';
    return this.updateTestimonial(id, {
      status: 'rejected',
      is_visible: false,
      rejected_at: new Date().toISOString(),
      rejected_by: adminEmail
    });
  },

  /**
   * Retrieves summary count metrics for the top admin dashboard cards.
   */
  async getSummary() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [totalRes, pendingRes, approvedRes, rejectedRes, newThisWeekRes] = await Promise.all([
      supabase.from('testimonials').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'pending'),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'approved'),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'rejected'),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }).is('deleted_at', null).gte('created_at', sevenDaysAgo),
    ]);

    const total = totalRes.count || 0;
    const pending = pendingRes.count || 0;
    const approved = approvedRes.count || 0;
    const rejected = rejectedRes.count || 0;
    const newThisWeek = newThisWeekRes.count || 0;

    // Fetch approved testimonials to calculate average rating and distribution
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('testimonials')
      .select('rating')
      .is('deleted_at', null)
      .eq('status', 'approved');

    let avgRating = 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!ratingsError && ratingsData && ratingsData.length > 0) {
      const sum = ratingsData.reduce((acc, t) => acc + t.rating, 0);
      avgRating = parseFloat((sum / ratingsData.length).toFixed(1));
      ratingsData.forEach((t) => {
        const ratingKey = t.rating as 1 | 2 | 3 | 4 | 5;
        if (distribution[ratingKey] !== undefined) {
          distribution[ratingKey] += 1;
        }
      });
    }

    return {
      total,
      pending,
      approved,
      rejected,
      avgRating,
      distribution,
      trends: {
        total: `+${newThisWeek}`,
        pending: `+${pending}`,
        approved: `+${approved}`,
        rejected: `+${rejected}`,
      }
    };
  }
};

export default testimonialService;
