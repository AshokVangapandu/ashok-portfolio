/* src/admin/services/__tests__/edithInsightEngine.test.ts */
import {
  evaluateResumeRule,
  evaluateContactRule,
  evaluateCertificationRule,
  evaluateTrafficRule,
  evaluateTopProjectRule,
  evaluateCompoundTrafficInquiriesUp,
  evaluateCompoundTrafficUpInquiriesDown,
  evaluateCompoundTrafficInquiriesDown,
  evaluateCompoundTrafficDrivenByProject,
  evaluateCompoundProjectInquirySignal,
  filterRedundantInsights,
  sortAndLimitInsights,
  VERIFIED_ROUTES
} from '../edithInsightService';
import { EdithDataSnapshot, EdithInsight } from '../../types/edithInsight';

// Simple test runner assertion helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
  console.log(`✓ ${message}`);
}

export function runEdithEngineUnitTests() {
  console.log('===========================================================');
  console.log('=== Running Edith Engine Phase 5.1 Compound Tests ===');
  console.log('===========================================================\n');
  const now = new Date('2026-08-17T12:00:00Z');

  const baseSnapshot: EdithDataSnapshot = {
    analyticsSummary: { totalVisitors: 1000, uniqueVisitors: 800, totalVisitorTrend: 0, formSubmissionsTrend: 0 },
    activeResume: null,
    openContactsCount: 0,
    certificationsSummary: null,
    topProject: null
  };

  // ----------------------------------------------------
  // Test 1: Traffic +30%, Contacts +20% -> traffic_and_inquiries_up
  // ----------------------------------------------------
  console.log('--- Test 1: Traffic +30%, Contacts +20% ---');
  const snapUp: EdithDataSnapshot = {
    ...baseSnapshot,
    analyticsSummary: { totalVisitors: 1300, uniqueVisitors: 1000, totalVisitorTrend: 30, formSubmissionsTrend: 20 }
  };
  const cUpInsight = evaluateCompoundTrafficInquiriesUp(snapUp, now);
  assert(cUpInsight !== null && cUpInsight.type === 'traffic_and_inquiries_up', 'Generates "traffic_and_inquiries_up"');
  assert(cUpInsight?.actionDestination === VERIFIED_ROUTES.ANALYTICS, `Action destination is verified route "${VERIFIED_ROUTES.ANALYTICS}"`);
  assert(Boolean(cUpInsight?.isCompound), 'isCompound property is true');

  // ----------------------------------------------------
  // Test 2: Traffic +40%, Contacts -15% -> traffic_up_inquiries_down
  // ----------------------------------------------------
  console.log('\n--- Test 2: Traffic +40%, Contacts -15% ---');
  const snapUpDown: EdithDataSnapshot = {
    ...baseSnapshot,
    analyticsSummary: { totalVisitors: 1400, uniqueVisitors: 1100, totalVisitorTrend: 40, formSubmissionsTrend: -15 }
  };
  const cUpDownInsight = evaluateCompoundTrafficUpInquiriesDown(snapUpDown, now);
  assert(cUpDownInsight !== null && cUpDownInsight.type === 'traffic_up_inquiries_down', 'Generates "traffic_up_inquiries_down"');
  assert(cUpDownInsight?.priority === 'medium', 'Priority is "medium"');

  // ----------------------------------------------------
  // Test 3: Traffic -20%, Contacts -10% -> traffic_and_inquiries_down
  // ----------------------------------------------------
  console.log('\n--- Test 3: Traffic -20%, Contacts -10% ---');
  const snapDown: EdithDataSnapshot = {
    ...baseSnapshot,
    analyticsSummary: { totalVisitors: 800, uniqueVisitors: 600, totalVisitorTrend: -20, formSubmissionsTrend: -10 }
  };
  const cDownInsight = evaluateCompoundTrafficInquiriesDown(snapDown, now);
  assert(cDownInsight !== null && cDownInsight.type === 'traffic_and_inquiries_down', 'Generates "traffic_and_inquiries_down"');

  // ----------------------------------------------------
  // Test 4: Traffic +30%, Valid Top Project -> traffic_driven_by_project
  // ----------------------------------------------------
  console.log('\n--- Test 4: Traffic +30%, Valid Top Project ---');
  const snapProjTraffic: EdithDataSnapshot = {
    ...baseSnapshot,
    analyticsSummary: { totalVisitors: 1300, uniqueVisitors: 1000, totalVisitorTrend: 30, formSubmissionsTrend: 0 },
    topProject: { id: 'p1', title: 'AI Portfolio Builder', viewCount: 200 }
  };
  const cProjTInsight = evaluateCompoundTrafficDrivenByProject(snapProjTraffic, now);
  assert(cProjTInsight !== null && cProjTInsight.type === 'traffic_driven_by_project', 'Generates "traffic_driven_by_project"');
  assert(Boolean(cProjTInsight?.description.includes('AI Portfolio Builder')), 'Description contains project title');
  assert(cProjTInsight?.actionDestination === VERIFIED_ROUTES.PROJECTS, `Action destination is verified route "${VERIFIED_ROUTES.PROJECTS}"`);

  // ----------------------------------------------------
  // Test 5: Project Views Strong, Contacts Positive -> project_and_inquiry_signal
  // ----------------------------------------------------
  console.log('\n--- Test 5: Project Views Strong, Contacts Positive ---');
  const snapProjInq: EdithDataSnapshot = {
    ...baseSnapshot,
    analyticsSummary: { totalVisitors: 1000, uniqueVisitors: 800, totalVisitorTrend: 0, formSubmissionsTrend: 15 },
    topProject: { id: 'p1', title: 'AI Portfolio Builder', viewCount: 200 }
  };
  const cProjIInsight = evaluateCompoundProjectInquirySignal(snapProjInq, now);
  assert(cProjIInsight !== null && cProjIInsight.type === 'project_and_inquiry_signal', 'Generates "project_and_inquiry_signal"');
  assert(evaluateCompoundProjectInquirySignal(baseSnapshot, now) === null, 'Deferred cleanly when topProject is null');

  // ----------------------------------------------------
  // Test 6: Compound Suppression Filter (No Duplicate Standalone Insights)
  // ----------------------------------------------------
  console.log('\n--- Test 6: Compound Suppression Filter ---');
  const FortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const snapMixed: EdithDataSnapshot = {
    analyticsSummary: { totalVisitors: 1300, uniqueVisitors: 1000, totalVisitorTrend: 30, formSubmissionsTrend: 20 },
    activeResume: { id: 'r1', updatedAt: FortyFiveDaysAgo, uploadedAt: FortyFiveDaysAgo },
    openContactsCount: 0,
    certificationsSummary: null,
    topProject: null
  };

  const rawInsights: EdithInsight[] = [
    evaluateResumeRule(snapMixed, now)!,
    evaluateTrafficRule(snapMixed, now)!,
    evaluateCompoundTrafficInquiriesUp(snapMixed, now)!
  ];

  const processed = sortAndLimitInsights(rawInsights);
  assert(processed.length === 2, 'Redundancy filter suppresses standalone traffic insight in favor of compound insight');
  assert(processed.some(i => i.type === 'traffic_and_inquiries_up'), 'Compound traffic/inquiry insight retained');
  assert(processed.some(i => i.type === 'resume_stale'), 'Unrelated stale resume insight retained');
  assert(!processed.some(i => i.type === 'traffic_increase'), 'Standalone traffic_increase suppressed');

  // ----------------------------------------------------
  // Test 7: No Meaningful Trends -> No Compound Insights
  // ----------------------------------------------------
  console.log('\n--- Test 7: No Meaningful Trends ---');
  const snapFlat: EdithDataSnapshot = {
    ...baseSnapshot,
    analyticsSummary: { totalVisitors: 1000, uniqueVisitors: 800, totalVisitorTrend: 2, formSubmissionsTrend: 1 }
  };
  assert(evaluateCompoundTrafficInquiriesUp(snapFlat, now) === null, 'Flat trends generate no compound insights');
  assert(evaluateCompoundTrafficUpInquiriesDown(snapFlat, now) === null, 'Flat trends generate no compound insights');

  // ----------------------------------------------------
  // Test 8: Data Source Failure -> Clean Execution
  // ----------------------------------------------------
  console.log('\n--- Test 8: Data Source Failure Resilience ---');
  const snapNullAnalytics: EdithDataSnapshot = { ...baseSnapshot, analyticsSummary: null };
  assert(evaluateCompoundTrafficInquiriesUp(snapNullAnalytics, now) === null, 'Null analytics executes cleanly to null without crash');
  assert(evaluateCompoundTrafficUpInquiriesDown(snapNullAnalytics, now) === null, 'Null analytics executes cleanly to null without crash');

  console.log('\n===========================================================');
  console.log('=== All 8 Phase 5.1 Compound Tests Passed Cleanly! ===');
  console.log('===========================================================\n');
}

// Run test suite
runEdithEngineUnitTests();
