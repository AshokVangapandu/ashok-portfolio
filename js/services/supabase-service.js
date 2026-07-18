// js/services/supabase-service.js
/**
 * Supabase Services Wrapper for Ashok's Portfolio.
 * Decouples database operations, authentication tracking, and administrative utilities.
 * Exposes global services:
 * - window.AuthService
 * - window.TestimonialService
 * - window.AdminService
 */

(function() {
  const supabaseUrl = "https://txoszrnjkrlbjzpjisvp.supabase.co";
  const supabaseKey = "sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB";
  const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

  /**
   * AuthService
   * Handles social authentication flow state operations.
   */
  const AuthService = {
    supabase: supabase,
    async signInWithGoogle() {
      console.log("AuthService: signInWithGoogle invoked");
      if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase Client is not initialized.");
      }
      const redirectTo = window.location.origin + window.location.pathname;
      console.log("AuthService: calling signInWithOAuth with redirectTo:", redirectTo);
      const res = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: redirectTo
        }
      });
      console.log("AuthService: signInWithOAuth result:", res);
      return res;
    },

    async setSession(hash) {
      console.log("AuthService: setSession invoked");
      if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase Client is not initialized.");
      }
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (!access_token || !refresh_token) {
        console.error("AuthService: Missing tokens in hash");
        throw new Error("Missing tokens in hash.");
      }
      console.log("AuthService: setting session on supabase auth client...");
      return await supabase.auth.setSession({
        access_token,
        refresh_token
      });
    },

    async signOut() {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase.auth.signOut();
    },

    async getCurrentUser() {
      if (!supabase) return null;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user || null;
      } catch (err) {
        console.error("Error fetching current user session:", err);
        return null;
      }
    },

    onAuthStateChange(callback) {
      if (!supabase) return () => {};
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return subscription;
    }
  };

  /**
   * TestimonialService
   * Handles public testimonial CRUD operations.
   */
  const TestimonialService = {
    async submitTestimonial(testimonial) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      const dbTestimonial = {
        user_id: testimonial.user_id || null,
        full_name: testimonial.google_name || testimonial.full_name,
        email: testimonial.google_email || testimonial.email,
        avatar_url: testimonial.google_avatar || testimonial.avatar_url || null,
        linkedin_url: testimonial.linkedin_url || null,
        testimonial: testimonial.testimonial,
        status: 'pending',
        featured: false,
        is_visible: false,
        display_order: null,
        rating: testimonial.rating,
        designation: testimonial.designation || null,
        company: testimonial.company || null
      };
      return await supabase
        .from('testimonials')
        .insert([dbTestimonial]);
    },

    async createTestimonial(testimonial) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      const dbTestimonial = {
        user_id: testimonial.user_id || null,
        full_name: testimonial.google_name || testimonial.full_name,
        email: testimonial.google_email || testimonial.email,
        avatar_url: testimonial.google_avatar || testimonial.avatar_url || null,
        linkedin_url: testimonial.linkedin_url || null,
        testimonial: testimonial.testimonial,
        status: 'pending',
        featured: false,
        is_visible: false,
        display_order: null,
        rating: testimonial.rating,
        designation: testimonial.designation || null,
        company: testimonial.company || null
      };
      return await supabase
        .from('testimonials')
        .insert([dbTestimonial]);
    },

    async hasSubmittedTestimonial(userId) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      const { data, error } = await supabase
        .from('testimonials')
        .select('id')
        .eq('user_id', userId);
      if (error) throw error;
      return data && data.length > 0;
    },

    async getApprovedTestimonials() {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .eq('is_visible', true)
        .is('deleted_at', null)
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
    }
  };

  /**
   * AdminService
   * Administrative controls (accessible only by ashokvangapandu45@gmail.com).
   */
  const AdminService = {
    async getAllTestimonials() {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
    },

    async approveTestimonial(id) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('testimonials')
        .update({ status: 'approved', is_visible: true })
        .eq('id', id);
    },

    async rejectTestimonial(id) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('testimonials')
        .update({ status: 'rejected', is_visible: false })
        .eq('id', id);
    },

    async deleteTestimonial(id) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
    },

    async updateTestimonial(id, data) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('testimonials')
        .update({
          testimonial: data.testimonial,
          linkedin_url: data.linkedin_url || null
        })
        .eq('id', id);
    }
  };

  /**
   * CertificationService
   * Handles public certifications queries.
   */
  const CertificationService = {
    async getPublishedCertifications() {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('certifications')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
    }
  };

  const ResumeService = {
    async getActiveResume() {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('resume_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
    },
    async logResumeDownload(downloadData) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('resume_downloads')
        .insert([downloadData])
        .select()
        .single();
    },
    async updateDownloadStatus(id, status) {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('resume_downloads')
        .update({ download_status: status })
        .eq('id', id);
    }
  };

  // Expose services to window scope
  window.AuthService = AuthService;
  window.TestimonialService = TestimonialService;
  window.AdminService = AdminService;
  window.CertificationService = CertificationService;
  window.ResumeService = ResumeService;
  window.supabaseInstance = supabase;
})();
