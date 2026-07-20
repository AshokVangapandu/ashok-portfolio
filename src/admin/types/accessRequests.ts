/* src/admin/types/accessRequests.ts */

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  linkedinUrl: string | null;
  reason: string;
  requestStatus: RequestStatus;
  requestedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccessRequestsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface SubmitAccessRequestPayload {
  fullName: string;
  email: string;
  company?: string;
  jobTitle?: string;
  reason: string;
  linkedinUrl?: string;
}
