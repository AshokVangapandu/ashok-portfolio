/* src/admin/types/edithInsight.ts */

export type InsightPriority = 'high' | 'medium' | 'low' | 'informational';

export type InsightType =
  | 'resume_stale'
  | 'contacts_attention'
  | 'certifications_ready'
  | 'traffic_increase'
  | 'traffic_decrease'
  | 'top_project'
  | 'traffic_and_inquiries_up'
  | 'traffic_up_inquiries_down'
  | 'traffic_and_inquiries_down'
  | 'traffic_driven_by_project'
  | 'project_and_inquiry_signal';

export interface EdithInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  category: string; // e.g. 'Resume', 'Contacts', 'Certifications', 'Analytics', 'Projects'
  title: string;
  description: string;
  actionText?: string;
  actionDestination?: string;
  actionType?: 'internal-route' | 'external-link';
  source: 'resume' | 'contact' | 'certification' | 'analytics' | 'project';
  isCompound?: boolean;
  generatedAt: string;
  metadata?: Record<string, any>;
}

export interface EdithDataSnapshot {
  analyticsSummary: {
    totalVisitors: number;
    uniqueVisitors: number;
    totalVisitorTrend: number;
    formSubmissionsTrend: number;
  } | null;
  activeResume: {
    id: string;
    updatedAt: string | null;
    uploadedAt: string | null;
  } | null;
  openContactsCount: number;
  certificationsSummary: {
    draftCount: number;
    pendingCount: number;
    publishedCount: number;
  } | null;
  topProject: {
    id: string;
    title: string;
    viewCount: number;
  } | null;
}

export interface EdithEngineDiagnostics {
  evaluatedRules: string[];
  skippedRules: string[];
  failedSources: string[];
  executionTimeMs: number;
}

export interface EdithEngineResult {
  insights: EdithInsight[];
  snapshot: EdithDataSnapshot;
  diagnostics: EdithEngineDiagnostics;
}
