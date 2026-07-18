/* src/admin/types/certification.ts */

// Represents the raw certification structure in the Supabase database
export interface SupabaseCertification {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  issuer: string;
  category: string;
  description: string | null;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  certificate_image_url: string | null;
  certificate_file_url: string | null;
  skills: string[] | null;
  status: 'draft' | 'published';
  is_featured: boolean;
  display_order: number;
}

// Represents the UI model structure consumed by the Admin dashboard and showcase components
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: string;
  description?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificateImageUrl?: string | null;
  certificateFileUrl?: string | null;
  skills?: string[] | null;
  status: 'draft' | 'published';
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Maps a Supabase database certification row to the frontend UI model
 */
export const mapSupabaseToCertification = (db: SupabaseCertification): Certification => {
  return {
    id: db.id,
    title: db.title,
    issuer: db.issuer,
    category: db.category,
    description: db.description,
    issueDate: db.issue_date,
    expiryDate: db.expiry_date,
    credentialId: db.credential_id,
    credentialUrl: db.credential_url,
    certificateImageUrl: db.certificate_image_url,
    certificateFileUrl: db.certificate_file_url,
    skills: db.skills,
    status: db.status as 'draft' | 'published',
    isFeatured: db.is_featured,
    displayOrder: db.display_order,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
};
