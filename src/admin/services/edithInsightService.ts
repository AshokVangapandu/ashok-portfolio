/* src/admin/services/edithInsightService.ts */
import { analyticsService } from './analyticsService';
import { resumeService } from './resumeService';
import { contactService } from './contactService';
import { certificationService } from './certificationService';
import {
  EdithInsight,
  EdithDataSnapshot,
  EdithEngineResult,
  EdithEngineDiagnostics,
  InsightPriority
} from '../types/edithInsight';

/**
 * NAMED DOMAIN CONSTANTS
 */
export const RESUME_STALE_DAYS = 30; // Threshold in days after which resume is flagged as stale
export const TRAFFIC_INSIGHT_THRESHOLD_PERCENT = 5; // Minimum % change required to generate a traffic insight
export const FORM_SUBMISSION_INSIGHT_THRESHOLD_PERCENT = 5; // Minimum % change required for form submission trend insight
export const MAX_EDITH_INSIGHTS = 5; // Maximum insights generated for dashboard presentation

/**
 * VERIFIED ADMIN APPLICATION ROUTES
 * Derived directly from src/admin/router.tsx
 */
export const VERIFIED_ROUTES = {
  RESUME: '/admin/resume',
  CONTACTS: '/admin/contacts',
  CERTIFICATIONS: '/admin/certifications',
  ANALYTICS: '/admin/analytics',
  PROJECTS: '/admin/projects',
  TESTIMONIALS: '/admin/testimonials'
} as const;

/**
 * PRIORITY WEIGHT MAP
 */
const PRIORITY_ORDER: Record<InsightPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
  informational: 4
};

// ==========================================
// PURE INDIVIDUAL RULE EVALUATION FUNCTIONS
// ==========================================

/**
 * Rule 1: Stale Resume Evaluation
 */
export function evaluateResumeRule(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.activeResume) return null;

  const dateStr = snapshot.activeResume.updatedAt || snapshot.activeResume.uploadedAt;
  if (!dateStr) return null;

  const updatedDate = new Date(dateStr);
  if (isNaN(updatedDate.getTime())) return null;

  const diffMs = now.getTime() - updatedDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < RESUME_STALE_DAYS) return null;

  return {
    id: `insight-resume-stale-${snapshot.activeResume.id}`,
    type: 'resume_stale',
    priority: 'medium',
    category: 'Resume',
    title: 'Resume',
    description: `Your resume hasn't been updated for ${days} days.`,
    actionText: 'Review Resume →',
    actionDestination: VERIFIED_ROUTES.RESUME,
    actionType: 'internal-route',
    source: 'resume',
    isCompound: false,
    generatedAt: now.toISOString(),
    metadata: { daysStale: days, thresholdDays: RESUME_STALE_DAYS }
  };
}

/**
 * Rule 2: Contacts Attention Evaluation
 */
export function evaluateContactRule(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  const count = snapshot.openContactsCount;
  const trend = snapshot.analyticsSummary?.formSubmissionsTrend || 0;

  // If there are open contacts, evaluate if form submission trend adds extra analytical value
  if (count > 0 && Math.abs(trend) >= FORM_SUBMISSION_INSIGHT_THRESHOLD_PERCENT) {
    const trendText = trend > 0 ? `increased by ${Math.round(trend)}%` : `decreased by ${Math.abs(Math.round(trend))}%`;
    return {
      id: `insight-contacts-trend-${count}`,
      type: 'contacts_attention',
      priority: trend > 0 ? 'high' : 'medium',
      category: 'Contacts',
      title: 'Contacts',
      description: `Inquiries ${trendText} this period (${count} open).`,
      actionText: 'View Messages →',
      actionDestination: VERIFIED_ROUTES.CONTACTS,
      actionType: 'internal-route',
      source: 'contact',
      isCompound: false,
      generatedAt: now.toISOString(),
      metadata: { openContactsCount: count, formSubmissionsTrend: trend }
    };
  }

  // If no trend context, suppress duplicate count statement to avoid repeating Requests & Approvals card!
  return null;
}

/**
 * Rule 3: Certifications Ready Evaluation
 */
export function evaluateCertificationRule(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.certificationsSummary) return null;

  const { draftCount, pendingCount } = snapshot.certificationsSummary;
  const count = draftCount + pendingCount;
  if (count <= 0) return null;

  return {
    id: `insight-certifications-ready-${count}`,
    type: 'certifications_ready',
    priority: 'medium',
    category: 'Certifications',
    title: 'Certifications',
    description: `${count} ${count === 1 ? 'certification is' : 'certifications are'} ready for review.`,
    actionText: 'Review Certifications →',
    actionDestination: VERIFIED_ROUTES.CERTIFICATIONS,
    actionType: 'internal-route',
    source: 'certification',
    isCompound: false,
    generatedAt: now.toISOString(),
    metadata: { draftCount, pendingCount, totalReady: count }
  };
}

/**
 * Rule 4: Traffic Trend Evaluation
 */
export function evaluateTrafficRule(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.analyticsSummary) return null;

  const trend = snapshot.analyticsSummary.totalVisitorTrend;

  if (trend >= TRAFFIC_INSIGHT_THRESHOLD_PERCENT) {
    const percent = Math.round(trend);
    return {
      id: `insight-traffic-increase-${percent}`,
      type: 'traffic_increase',
      priority: 'informational',
      category: 'Analytics',
      title: 'Analytics',
      description: `Portfolio traffic increased by ${percent}% this period.`,
      actionText: 'View Analytics →',
      actionDestination: VERIFIED_ROUTES.ANALYTICS,
      actionType: 'internal-route',
      source: 'analytics',
      isCompound: false,
      generatedAt: now.toISOString(),
      metadata: { trendPercent: percent, rawTrend: trend }
    };
  }

  if (trend <= -TRAFFIC_INSIGHT_THRESHOLD_PERCENT) {
    const percent = Math.abs(Math.round(trend));
    return {
      id: `insight-traffic-decrease-${percent}`,
      type: 'traffic_decrease',
      priority: 'medium',
      category: 'Analytics',
      title: 'Analytics',
      description: `Portfolio traffic decreased by ${percent}% this period.`,
      actionText: 'View Analytics →',
      actionDestination: VERIFIED_ROUTES.ANALYTICS,
      actionType: 'internal-route',
      source: 'analytics',
      isCompound: false,
      generatedAt: now.toISOString(),
      metadata: { trendPercent: -percent, rawTrend: trend }
    };
  }

  return null;
}

/**
 * Rule 5: Top Project Evaluation
 */
export function evaluateTopProjectRule(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.topProject || !snapshot.topProject.title) return null;

  return {
    id: `insight-top-project-${snapshot.topProject.id}`,
    type: 'top_project',
    priority: 'informational',
    category: 'Projects',
    title: 'Projects',
    description: `Your ${snapshot.topProject.title} project is receiving the most visits.`,
    actionText: 'View Projects →',
    actionDestination: VERIFIED_ROUTES.PROJECTS,
    actionType: 'internal-route',
    source: 'project',
    isCompound: false,
    generatedAt: now.toISOString(),
    metadata: { projectId: snapshot.topProject.id, viewCount: snapshot.topProject.viewCount }
  };
}

// ==========================================
// PURE COMPOUND RULE EVALUATION FUNCTIONS
// ==========================================

/**
 * Compound Rule #1: Traffic & Inquiries Both Growing
 */
export function evaluateCompoundTrafficInquiriesUp(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.analyticsSummary) return null;

  const traffic = snapshot.analyticsSummary.totalVisitorTrend;
  const inquiries = snapshot.analyticsSummary.formSubmissionsTrend;

  if (traffic >= TRAFFIC_INSIGHT_THRESHOLD_PERCENT && inquiries >= FORM_SUBMISSION_INSIGHT_THRESHOLD_PERCENT) {
    const tPercent = Math.round(traffic);
    const iPercent = Math.round(inquiries);
    return {
      id: `insight-compound-up-${tPercent}-${iPercent}`,
      type: 'traffic_and_inquiries_up',
      priority: 'informational',
      category: 'Analytics',
      title: 'Analytics',
      description: `Traffic increased by ${tPercent}% and contact inquiries grew by ${iPercent}%.`,
      actionText: 'View Analytics →',
      actionDestination: VERIFIED_ROUTES.ANALYTICS,
      actionType: 'internal-route',
      source: 'analytics',
      isCompound: true,
      generatedAt: now.toISOString(),
      metadata: { trafficTrend: tPercent, inquiriesTrend: iPercent }
    };
  }

  return null;
}

/**
 * Compound Rule #2: Traffic Up, Inquiries Down
 */
export function evaluateCompoundTrafficUpInquiriesDown(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.analyticsSummary) return null;

  const traffic = snapshot.analyticsSummary.totalVisitorTrend;
  const inquiries = snapshot.analyticsSummary.formSubmissionsTrend;

  if (traffic >= TRAFFIC_INSIGHT_THRESHOLD_PERCENT && inquiries <= -FORM_SUBMISSION_INSIGHT_THRESHOLD_PERCENT) {
    const tPercent = Math.round(traffic);
    const iPercent = Math.abs(Math.round(inquiries));
    return {
      id: `insight-compound-up-down-${tPercent}-${iPercent}`,
      type: 'traffic_up_inquiries_down',
      priority: 'medium',
      category: 'Analytics',
      title: 'Analytics',
      description: `Traffic grew by ${tPercent}%, but contact inquiries declined by ${iPercent}%.`,
      actionText: 'View Analytics →',
      actionDestination: VERIFIED_ROUTES.ANALYTICS,
      actionType: 'internal-route',
      source: 'analytics',
      isCompound: true,
      generatedAt: now.toISOString(),
      metadata: { trafficTrend: tPercent, inquiriesTrend: -iPercent }
    };
  }

  return null;
}

/**
 * Compound Rule #3: Traffic & Inquiries Both Declining
 */
export function evaluateCompoundTrafficInquiriesDown(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.analyticsSummary) return null;

  const traffic = snapshot.analyticsSummary.totalVisitorTrend;
  const inquiries = snapshot.analyticsSummary.formSubmissionsTrend;

  if (traffic <= -TRAFFIC_INSIGHT_THRESHOLD_PERCENT && inquiries <= -FORM_SUBMISSION_INSIGHT_THRESHOLD_PERCENT) {
    const tPercent = Math.abs(Math.round(traffic));
    const iPercent = Math.abs(Math.round(inquiries));
    return {
      id: `insight-compound-down-${tPercent}-${iPercent}`,
      type: 'traffic_and_inquiries_down',
      priority: 'medium',
      category: 'Analytics',
      title: 'Analytics',
      description: `Both portfolio traffic (-${tPercent}%) and contact inquiries (-${iPercent}%) decreased this period.`,
      actionText: 'View Analytics →',
      actionDestination: VERIFIED_ROUTES.ANALYTICS,
      actionType: 'internal-route',
      source: 'analytics',
      isCompound: true,
      generatedAt: now.toISOString(),
      metadata: { trafficTrend: -tPercent, inquiriesTrend: -iPercent }
    };
  }

  return null;
}

/**
 * Compound Rule #4: Traffic Growth Driven by Top Project
 */
export function evaluateCompoundTrafficDrivenByProject(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.analyticsSummary || !snapshot.topProject || !snapshot.topProject.title) return null;

  const traffic = snapshot.analyticsSummary.totalVisitorTrend;
  if (traffic >= TRAFFIC_INSIGHT_THRESHOLD_PERCENT) {
    const tPercent = Math.round(traffic);
    return {
      id: `insight-compound-proj-traffic-${snapshot.topProject.id}`,
      type: 'traffic_driven_by_project',
      priority: 'informational',
      category: 'Projects',
      title: 'Projects',
      description: `Your ${snapshot.topProject.title} project is receiving the most attention while traffic is up ${tPercent}%.`,
      actionText: 'View Projects →',
      actionDestination: VERIFIED_ROUTES.PROJECTS,
      actionType: 'internal-route',
      source: 'project',
      isCompound: true,
      generatedAt: now.toISOString(),
      metadata: { projectId: snapshot.topProject.id, trafficTrend: tPercent }
    };
  }

  return null;
}

/**
 * Compound Rule #5: Project Popularity & Contact Inquiries Signal
 */
export function evaluateCompoundProjectInquirySignal(snapshot: EdithDataSnapshot, now: Date = new Date()): EdithInsight | null {
  if (!snapshot.analyticsSummary || !snapshot.topProject || !snapshot.topProject.title) return null;

  const inquiries = snapshot.analyticsSummary.formSubmissionsTrend;
  if (inquiries >= FORM_SUBMISSION_INSIGHT_THRESHOLD_PERCENT) {
    const iPercent = Math.round(inquiries);
    return {
      id: `insight-compound-proj-inquiries-${snapshot.topProject.id}`,
      type: 'project_and_inquiry_signal',
      priority: 'informational',
      category: 'Projects',
      title: 'Projects',
      description: `High interest in ${snapshot.topProject.title} is happening alongside a ${iPercent}% increase in inquiries.`,
      actionText: 'View Projects →',
      actionDestination: VERIFIED_ROUTES.PROJECTS,
      actionType: 'internal-route',
      source: 'project',
      isCompound: true,
      generatedAt: now.toISOString(),
      metadata: { projectId: snapshot.topProject.id, inquiriesTrend: iPercent }
    };
  }

  return null;
}

// ==========================================
// REDUNDANCY & DEDUPLICATION PIPELINE
// ==========================================

/**
 * Filters out lower-value standalone individual insights that are already
 * synthesized inside higher-value compound insights.
 */
export function filterRedundantInsights(rawInsights: EdithInsight[]): EdithInsight[] {
  const hasCompoundTraffic = rawInsights.some(i =>
    i.type === 'traffic_and_inquiries_up' ||
    i.type === 'traffic_up_inquiries_down' ||
    i.type === 'traffic_and_inquiries_down'
  );

  const hasCompoundProject = rawInsights.some(i => i.type === 'traffic_driven_by_project');

  return rawInsights.filter(insight => {
    // If a compound traffic/inquiry insight exists, suppress standalone traffic_increase & traffic_decrease
    if (hasCompoundTraffic && (insight.type === 'traffic_increase' || insight.type === 'traffic_decrease')) {
      return false;
    }
    // If a compound project traffic insight exists, suppress standalone top_project
    if (hasCompoundProject && insight.type === 'top_project') {
      return false;
    }
    return true;
  });
}

/**
 * Deduplicate, Sort by Priority (with deterministic secondary sort), and Limit Insights
 */
export function sortAndLimitInsights(insights: EdithInsight[]): EdithInsight[] {
  // First run redundancy filter
  const nonRedundant = filterRedundantInsights(insights);

  // Deduplicate by insight type (only 1 aggregated insight per type allowed)
  const uniqueMap = new Map<string, EdithInsight>();
  for (const item of nonRedundant) {
    if (!uniqueMap.has(item.type)) {
      uniqueMap.set(item.type, item);
    }
  }

  const list = Array.from(uniqueMap.values());

  // Stable Deterministic Sort:
  // Primary: Priority Weight (High -> Medium -> Low -> Informational)
  // Secondary: Category Alphabetical (A -> Z)
  // Tertiary: Rule ID string comparison
  list.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;

    const cDiff = a.category.localeCompare(b.category);
    if (cDiff !== 0) return cDiff;

    return a.id.localeCompare(b.id);
  });

  // Cap list to MAX_EDITH_INSIGHTS
  return list.slice(0, MAX_EDITH_INSIGHTS);
}

// ==========================================
// EDITH INSIGHT ENGINE SERVICE MODULE
// ==========================================

export const edithInsightService = {
  /**
   * Fetches data from existing domain services to construct the data snapshot.
   */
  async buildSnapshot(): Promise<{ snapshot: EdithDataSnapshot; failedSources: string[] }> {
    const failedSources: string[] = [];

    // 1. Analytics Summary
    let analyticsSummarySnapshot: EdithDataSnapshot['analyticsSummary'] = null;
    try {
      const summary = await analyticsService.getSummary('30days');
      if (summary) {
        let visitorTrend = 0;
        let formTrend = 0;
        if (summary.trends) {
          if (typeof summary.trends.totalVisitors === 'number') {
            visitorTrend = summary.trends.totalVisitors;
          } else if (typeof summary.trends.totalVisitors === 'string') {
            visitorTrend = parseFloat(summary.trends.totalVisitors.replace('%', '').replace('+', '')) || 0;
          }

          if (typeof summary.trends.formSubmissions === 'number') {
            formTrend = summary.trends.formSubmissions;
          } else if (typeof summary.trends.formSubmissions === 'string') {
            formTrend = parseFloat(summary.trends.formSubmissions.replace('%', '').replace('+', '')) || 0;
          }
        }

        analyticsSummarySnapshot = {
          totalVisitors: summary.totalVisitors || 0,
          uniqueVisitors: summary.uniqueVisitors || 0,
          totalVisitorTrend: visitorTrend,
          formSubmissionsTrend: formTrend
        };
      }
    } catch (err) {
      console.warn('[edithInsightService] Failed to load analytics snapshot source:', err);
      failedSources.push('analytics');
    }

    // 2. Active Resume
    let activeResumeSnapshot: EdithDataSnapshot['activeResume'] = null;
    try {
      const activeResume = await resumeService.getActiveResume();
      if (activeResume) {
        activeResumeSnapshot = {
          id: activeResume.id,
          updatedAt: activeResume.updatedAt || null,
          uploadedAt: activeResume.uploadedAt || null
        };
      }
    } catch (err) {
      console.warn('[edithInsightService] Failed to load resume snapshot source:', err);
      failedSources.push('resume');
    }

    // 3. Open Contacts Count
    let openContactsCount = 0;
    try {
      const contactsRes = await contactService.getSubmissions({ status: 'open' });
      if (contactsRes && Array.isArray(contactsRes.data)) {
        openContactsCount = contactsRes.data.filter(
          m => m.status === 'open' || m.status === 'New' || !m.status
        ).length;
      }
    } catch (err) {
      console.warn('[edithInsightService] Failed to load contacts snapshot source:', err);
      failedSources.push('contact');
    }

    // 4. Certifications Summary
    let certsSnapshot: EdithDataSnapshot['certificationsSummary'] = null;
    try {
      const certs = await certificationService.getCertifications();
      if (certs && Array.isArray(certs)) {
        const draftCount = certs.filter(c => c.status === 'draft').length;
        const pendingCount = certs.filter(c => (c.status as string) === 'pending').length;
        const publishedCount = certs.filter(c => c.status === 'published').length;
        certsSnapshot = { draftCount, pendingCount, publishedCount };
      }
    } catch (err) {
      console.warn('[edithInsightService] Failed to load certifications snapshot source:', err);
      failedSources.push('certification');
    }

    // 5. Top Project (Deferred - null because backend RPC does not expose project view aggregate)
    const topProjectSnapshot: EdithDataSnapshot['topProject'] = null;

    return {
      snapshot: {
        analyticsSummary: analyticsSummarySnapshot,
        activeResume: activeResumeSnapshot,
        openContactsCount,
        certificationsSummary: certsSnapshot,
        topProject: topProjectSnapshot
      },
      failedSources
    };
  },

  /**
   * Generates structured insights by evaluating individual and compound rules against the snapshot.
   */
  async generateInsights(now: Date = new Date()): Promise<EdithEngineResult> {
    const startTime = Date.now();
    const { snapshot, failedSources } = await this.buildSnapshot();

    const evaluatedRules: string[] = [];
    const skippedRules: string[] = [];
    const rawInsights: EdithInsight[] = [];

    // --- Individual Rules ---
    evaluatedRules.push('rule_resume_stale');
    const resumeInsight = evaluateResumeRule(snapshot, now);
    if (resumeInsight) rawInsights.push(resumeInsight);

    evaluatedRules.push('rule_contacts_attention');
    const contactInsight = evaluateContactRule(snapshot, now);
    if (contactInsight) rawInsights.push(contactInsight);

    evaluatedRules.push('rule_certifications_ready');
    const certInsight = evaluateCertificationRule(snapshot, now);
    if (certInsight) rawInsights.push(certInsight);

    evaluatedRules.push('rule_traffic_trend');
    const trafficInsight = evaluateTrafficRule(snapshot, now);
    if (trafficInsight) rawInsights.push(trafficInsight);

    evaluatedRules.push('rule_top_project');
    const topProjInsight = evaluateTopProjectRule(snapshot, now);
    if (topProjInsight) {
      rawInsights.push(topProjInsight);
    } else {
      skippedRules.push('rule_top_project (deferred: insufficient backend project view aggregate)');
    }

    // --- Compound Rules ---
    evaluatedRules.push('rule_compound_traffic_inquiries_up');
    const cUp = evaluateCompoundTrafficInquiriesUp(snapshot, now);
    if (cUp) rawInsights.push(cUp);

    evaluatedRules.push('rule_compound_traffic_up_inquiries_down');
    const cUpDown = evaluateCompoundTrafficUpInquiriesDown(snapshot, now);
    if (cUpDown) rawInsights.push(cUpDown);

    evaluatedRules.push('rule_compound_traffic_inquiries_down');
    const cDown = evaluateCompoundTrafficInquiriesDown(snapshot, now);
    if (cDown) rawInsights.push(cDown);

    evaluatedRules.push('rule_compound_traffic_driven_by_project');
    const cProjT = evaluateCompoundTrafficDrivenByProject(snapshot, now);
    if (cProjT) {
      rawInsights.push(cProjT);
    } else {
      skippedRules.push('rule_compound_traffic_driven_by_project (deferred: topProject null)');
    }

    evaluatedRules.push('rule_compound_project_inquiry_signal');
    const cProjI = evaluateCompoundProjectInquirySignal(snapshot, now);
    if (cProjI) {
      rawInsights.push(cProjI);
    } else {
      skippedRules.push('rule_compound_project_inquiry_signal (deferred: topProject null)');
    }

    const finalInsights = sortAndLimitInsights(rawInsights);
    const executionTimeMs = Date.now() - startTime;

    const diagnostics: EdithEngineDiagnostics = {
      evaluatedRules,
      skippedRules,
      failedSources,
      executionTimeMs
    };

    return {
      insights: finalInsights,
      snapshot,
      diagnostics
    };
  }
};

export default edithInsightService;
