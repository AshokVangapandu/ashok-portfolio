/* src/admin/types/resumeDownload.ts */

export interface ResumeDownload {
  id: string;
  dateTime: string; // e.g., Jan 15, 2024, 10:42 AM
  visitorName: string;
  visitorEmail?: string | null;
  avatarUrl?: string | null;
  isKnown: boolean;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  source: string; // e.g., LinkedIn, Google Search
  downloadedFrom: string; // e.g., Hero Section
  duration: string; // e.g., 8m 22s
  browser: string;
  os: string;
  submissionTime: string; // e.g., 10:42 AM
}
