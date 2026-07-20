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

  /**
   * PortfolioSettingsService
   * Exposes global site visibility settings and availability toggles.
   */
  const PortfolioSettingsService = {
    async getSiteMode() {
      if (!supabase) return 'public';
      try {
        const { data, error } = await supabase
          .from('portfolio_settings')
          .select('visibility')
          .limit(1)
          .maybeSingle();
        if (error) {
          console.error("Error fetching site_mode from Supabase:", error);
          return 'public';
        }
        return data?.visibility || 'public';
      } catch (err) {
        console.error("Failed to load site mode:", err);
        return 'public';
      }
    },
    async getSettings() {
      if (!supabase) throw new Error("Supabase Client is not initialized.");
      return await supabase
        .from('portfolio_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
    }
  };

  /**
   * MaintenanceService
   * Handles subscriber registration during Maintenance mode.
   */
  const MaintenanceService = {
    async subscribeToNotify(rawEmail) {
      const email = (rawEmail || '').trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
          success: false,
          isDuplicate: false,
          message: 'Please enter a valid email address.'
        };
      }
      if (!supabase) {
        return {
          success: false,
          isDuplicate: false,
          message: 'Database service unavailable. Please try again later.'
        };
      }
      try {
        const { data: existing } = await supabase
          .from('maintenance_subscribers')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (existing) {
          return {
            success: true,
            isDuplicate: true,
            message: "You're already subscribed. We'll notify you when the portfolio is live again."
          };
        }

        const { error: insertError } = await supabase
          .from('maintenance_subscribers')
          .insert({
            email: email,
            status: 'pending',
            source: 'maintenance_page'
          });

        if (insertError) {
          if (insertError.code === '23505') {
            return {
              success: true,
              isDuplicate: true,
              message: "You're already subscribed. We'll notify you when the portfolio is live again."
            };
          }
          throw insertError;
        }

        return {
          success: true,
          isDuplicate: false,
          message: "Thank you! We'll notify you as soon as the portfolio is live."
        };
      } catch (err) {
        console.error("MaintenanceService error:", err);
        return {
          success: false,
          isDuplicate: false,
          message: 'Failed to save subscription. Please try again.'
        };
      }
    }
  };

  const PRIVATE_SESSION_KEY = 'portfolio_private_session';

  const PrivateAccessService = {
    hasValidSession() {
      if (typeof window === 'undefined' || !window.sessionStorage) return false;
      try {
        const raw = window.sessionStorage.getItem(PRIVATE_SESSION_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return Boolean(parsed && parsed.email && parsed.token);
      } catch (err) {
        return false;
      }
    },

    async verifyAccess(email) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
      if (!supabase) {
        return { success: false, message: 'Database service unavailable. Please try again later.' };
      }
      try {
        const { data, error } = await supabase
          .from('authorized_users')
          .select('id, email, access_status')
          .ilike('email', cleanEmail)
          .eq('access_status', 'enabled')
          .maybeSingle();

        if (error) throw error;

        if (data && data.access_status === 'enabled') {
          supabase
            .from('authorized_users')
            .update({ last_access: new Date().toISOString() })
            .eq('id', data.id)
            .then(() => {});

          const session = {
            email: cleanEmail,
            token: btoa(cleanEmail + ':' + Date.now()),
            verifiedAt: new Date().toISOString()
          };
          window.sessionStorage.setItem(PRIVATE_SESSION_KEY, JSON.stringify(session));
          return { success: true };
        }

        return {
          success: false,
          message: "This email isn't authorized to access this portfolio. If you believe this is a mistake, please request access."
        };
      } catch (err) {
        console.error("PrivateAccessService error:", err);
        return {
          success: false,
          message: 'An unexpected error occurred while verifying access. Please try again.'
        };
      }
    },

    clearSession() {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(PRIVATE_SESSION_KEY);
      }
    }
  };

  const AccessRequestService = {
    async submitAccessRequest(payload) {
      const cleanEmail = (payload.email || '').trim().toLowerCase();
      const cleanName = (payload.fullName || '').trim();
      const cleanReason = (payload.reason || '').trim();

      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
      if (!cleanName) {
        return { success: false, message: 'Please enter your full name.' };
      }
      if (!cleanReason) {
        return { success: false, message: 'Please provide a reason for your access request.' };
      }
      if (!supabase) {
        return { success: false, message: 'Database service unavailable. Please try again later.' };
      }

      try {
        const { data: pendingReq } = await supabase
          .from('access_requests')
          .select('id')
          .ilike('email', cleanEmail)
          .eq('request_status', 'pending')
          .maybeSingle();

        if (pendingReq) {
          return {
            success: false,
            message: "An access request for this email address is already pending review. You'll be notified once it's reviewed."
          };
        }

        const { error: insertError } = await supabase
          .from('access_requests')
          .insert({
            email: cleanEmail,
            full_name: cleanName,
            company: payload.company ? payload.company.trim() : null,
            job_title: payload.jobTitle ? payload.jobTitle.trim() : null,
            reason: cleanReason,
            linkedin_url: payload.linkedinUrl ? payload.linkedinUrl.trim() : null,
            request_status: 'pending'
          });

        if (insertError) throw insertError;

        return {
          success: true,
          message: "Your request has been submitted successfully. You'll be notified once it's reviewed."
        };
      } catch (err) {
        console.error("AccessRequestService submit error:", err);
        return {
          success: false,
          message: 'Failed to submit request. Please try again.'
        };
      }
    }
  };

  // Expose services to window scope
  window.AuthService = AuthService;
  window.TestimonialService = TestimonialService;
  window.AdminService = AdminService;
  window.CertificationService = CertificationService;
  window.ResumeService = ResumeService;
  window.PortfolioSettingsService = PortfolioSettingsService;
  window.MaintenanceService = MaintenanceService;
  window.PrivateAccessService = PrivateAccessService;
  window.AccessRequestService = AccessRequestService;
  window.supabaseInstance = supabase;
})();
