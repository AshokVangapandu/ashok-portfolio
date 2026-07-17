/* src/admin/types/testimonial.ts */

// Represents the raw testimonial structure in the Supabase database
export interface SupabaseTestimonial {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  company: string | null;
  designation: string | null;
  country: string | null;
  avatar_url: string | null;
  rating: number;
  testimonial: string;
  status: string; // 'pending' | 'approved' | 'rejected'
  featured: boolean;
  display_order: number | null;
  is_visible: boolean;
  linkedin_url: string | null;
  admin_notes: string | null;
  user_id: string | null;
  deleted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
}

// Represents the UI model structure consumed by the Admin dashboard components
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number; // 1 to 5 stars
  preview: string;
  country: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected' | 'remind_later';
  avatarUrl?: string | null;
  
  // Details Modal Metadata
  email: string;
  city: string;
  submittedFrom: string;
  device: string;
  browser: string;
  os: string;
  trafficSource: string;
  submissionTime: string;
  featured?: boolean;
  displayOrder?: number | null;
  isVisible?: boolean;
  linkedinUrl?: string | null;
  adminNotes?: string | null;
  deletedAt?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
}

/**
 * Maps a Supabase database testimonial row to the frontend UI model
 */
export const mapSupabaseToTestimonial = (db: SupabaseTestimonial): Testimonial => {
  const dateObj = new Date(db.created_at);
  return {
    id: db.id,
    name: db.full_name,
    company: db.company || 'N/A',
    role: db.designation || 'N/A',
    rating: db.rating,
    preview: db.testimonial,
    country: db.country || 'N/A',
    date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: db.status as 'approved' | 'pending' | 'rejected' | 'remind_later',
    avatarUrl: db.avatar_url,
    email: db.email,
    city: db.country || 'N/A', // Map country as a fallback for city
    submittedFrom: 'Portfolio Website',
    device: 'Desktop',
    browser: 'Chrome',
    os: 'Unknown OS',
    trafficSource: db.linkedin_url ? 'LinkedIn' : 'Direct',
    submissionTime: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    featured: db.featured,
    displayOrder: db.display_order,
    isVisible: db.is_visible,
    linkedinUrl: db.linkedin_url,
    adminNotes: db.admin_notes,
    deletedAt: db.deleted_at,
    approvedAt: db.approved_at,
    approvedBy: db.approved_by,
    rejectedAt: db.rejected_at,
    rejectedBy: db.rejected_by,
  };
};
