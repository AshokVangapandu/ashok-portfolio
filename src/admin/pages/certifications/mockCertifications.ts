/* src/admin/pages/certifications/mockCertifications.ts */

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  status: 'Published' | 'Draft' | 'Featured' | 'Expired' | 'Archived' | 'published' | 'draft';
  thumbnailUrl: string;
  isFeatured?: boolean;
  certificateImageUrl?: string | null;
  certificateFileUrl?: string | null;
  category?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
  expiryDate?: string | null;
  skills?: string[] | null;
}

export const MOCK_CERTIFICATIONS: Certification[] = [];

export const MOCK_SUMMARY = {
  total: 0,
  published: 0,
  draft: 0,
  featured: 0
};

