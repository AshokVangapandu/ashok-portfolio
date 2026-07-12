/* src/admin/types/testimonial.ts */

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
}
