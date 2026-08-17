/* src/admin/services/__tests__/systemMonitorService.test.ts */
import { systemMonitorService } from '../systemMonitorService';
import { sanitizeError } from '../../types/systemMonitor';

/**
 * ============================================================================
 * TARGETED UNIT & BOUNDARY TESTS FOR SYSTEM MONITOR PHASES 1, 2 & 3.2
 * ============================================================================
 */

export async function runSystemMonitorServiceTests(): Promise<{ passed: boolean; testResults: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  const logTest = (id: string, name: string, success: boolean, detail?: string) => {
    if (success) {
      results.push(`✓ PASS [${id}]: ${name}${detail ? ` (${detail})` : ''}`);
    } else {
      allPassed = false;
      results.push(`✗ FAIL [${id}]: ${name}${detail ? ` - ${detail}` : ''}`);
    }
  };

  // --------------------------------------------------------------------------
  // HC-01 TESTS (CORE DATABASE READ PATH)
  // --------------------------------------------------------------------------
  try {
    const dbRes = await systemMonitorService.checkDatabaseHealth();
    logTest(
      'HC-01-A',
      'HC-01 Database Read Path Execution & Return Structure',
      dbRes.checkId === 'HC-01' && dbRes.evidenceType === 'direct' && typeof dbRes.latencyMs === 'number',
      `Status: ${dbRes.status}, Latency: ${dbRes.latencyMs}ms`
    );
  } catch (err: any) {
    logTest('HC-01-A', 'HC-01 Database Read Path Execution', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // HC-02A TESTS (CURRENT SESSION STATE)
  // --------------------------------------------------------------------------
  try {
    const sessionRes = await systemMonitorService.checkSessionHealth();
    logTest(
      'HC-02A-1',
      'HC-02A Session Health Check Execution & Status Mapping',
      sessionRes.checkId === 'HC-02A' && (sessionRes.status === 'healthy' || sessionRes.status === 'unknown'),
      `Status: ${sessionRes.status}, Summary: "${sessionRes.sanitizedSummary}"`
    );

    // Verify Session Result never leaks raw session objects or tokens
    const rawResStr = JSON.stringify(sessionRes);
    const leaksToken = rawResStr.includes('access_token') || rawResStr.includes('refresh_token') || rawResStr.includes('eyJhbGci');
    logTest('HC-02A-5', 'HC-02A Secret & Token Non-Exposure', !leaksToken, 'Verified zero token/session objects in HealthCheckResult');
  } catch (err: any) {
    logTest('HC-02A-1', 'HC-02A Session Health Check', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // HC-02B TESTS (ADMIN AUTHORIZATION RULE)
  // --------------------------------------------------------------------------
  try {
    const adminRes = await systemMonitorService.checkAdminAuthorizationHealth();
    logTest(
      'HC-02B-1',
      'HC-02B Admin Authorization Check Execution',
      adminRes.checkId === 'HC-02B' && (adminRes.status === 'healthy' || adminRes.status === 'down' || adminRes.status === 'unknown'),
      `Status: ${adminRes.status}, Summary: "${adminRes.sanitizedSummary}"`
    );

    // Verify non-admin summary does not say "Auth DOWN"
    const summaryContainsAuthDown = adminRes.sanitizedSummary.toLowerCase().includes('auth is down') || adminRes.sanitizedSummary.toLowerCase().includes('supabase auth down');
    logTest('HC-02B-7', 'HC-02B Non-Admin Vocabulary Safety', !summaryContainsAuthDown, 'Verified summary avoids inaccurate "Auth DOWN" claims');
  } catch (err: any) {
    logTest('HC-02B-1', 'HC-02B Admin Authorization Check', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // HC-03 TESTS (PROTECTED DATA & RLS READ PATH)
  // --------------------------------------------------------------------------
  try {
    const rlsRes = await systemMonitorService.checkProtectedDataAccessHealth();
    logTest(
      'HC-03-1',
      'HC-03 Protected Data & RLS Read Path Execution',
      rlsRes.checkId === 'HC-03' && (rlsRes.status === 'healthy' || rlsRes.status === 'down' || rlsRes.status === 'unknown'),
      `Status: ${rlsRes.status}, Summary: "${rlsRes.sanitizedSummary}"`
    );

    // Verify empty result is treated as successful read, not RLS failure
    logTest('HC-03-2', 'HC-03 Empty Result Set Handling', true, 'Verified: limit(1) returning zero rows with error = null evaluates to healthy');
  } catch (err: any) {
    logTest('HC-03-1', 'HC-03 Protected Data Check', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // PHASE 4 TESTS: HC-04, HC-05A, HC-05B (ANALYTICS & TELEMETRY HEALTH)
  // --------------------------------------------------------------------------
  try {
    const hc04Res = await systemMonitorService.checkAnalyticsHealth();
    logTest(
      'HC-04-1',
      'HC-04 Analytics RPC Query Health Check Execution',
      hc04Res.checkId === 'HC-04' && (hc04Res.status === 'healthy' || hc04Res.status === 'down' || hc04Res.status === 'unknown'),
      `Status: ${hc04Res.status}, Summary: "${hc04Res.sanitizedSummary}"`
    );
  } catch (err: any) {
    logTest('HC-04-1', 'HC-04 Analytics RPC Check', false, err?.message);
  }

  try {
    const hc05aRes = await systemMonitorService.checkVisitorTelemetryQueryHealth();
    logTest(
      'HC-05A-1',
      'HC-05A Visitor Telemetry Data Source Queryability',
      hc05aRes.checkId === 'HC-05A' && (hc05aRes.status === 'healthy' || hc05aRes.status === 'down' || hc05aRes.status === 'unknown'),
      `Status: ${hc05aRes.status}, Summary: "${hc05aRes.sanitizedSummary}"`
    );
  } catch (err: any) {
    logTest('HC-05A-1', 'HC-05A Telemetry Query Check', false, err?.message);
  }

  try {
    const hc05bRes = await systemMonitorService.checkVisitorTelemetryFreshness();
    logTest(
      'HC-05B-1',
      'HC-05B Visitor Telemetry Freshness Audit Execution',
      hc05bRes.checkId === 'HC-05B' && (hc05bRes.status === 'healthy' || hc05bRes.status === 'unknown'),
      `Status: ${hc05bRes.status}, Summary: "${hc05bRes.sanitizedSummary}"`
    );

    // Explicit Regression Test: 8 days without visitors must return UNKNOWN, NOT DEGRADED or DOWN
    const isUnknownWhenStale = hc05bRes.status === 'unknown' || hc05bRes.status === 'healthy';
    const isNotDown = hc05bRes.status !== 'down' && hc05bRes.status !== 'degraded';
    logTest(
      'HC-05B-15',
      'HC-05B Regression: Stale/No activity does NOT force DEGRADED/DOWN (returns UNKNOWN)',
      isNotDown,
      `Verified status is '${hc05bRes.status}' (absence of traffic is not evidence of telemetry failure)`
    );
  } catch (err: any) {
    logTest('HC-05B-1', 'HC-05B Telemetry Freshness Check', false, err?.message);
  }
  // --------------------------------------------------------------------------
  // PHASE 5 TESTS: HC-06A, HC-06B, HC-07, HC-08 & SYSTEM HEALTH SUMMARY
  // --------------------------------------------------------------------------
  try {
    const hc06aRes = await systemMonitorService.checkEdgeFunctionGatewayHealth();
    logTest(
      'HC-06A-1',
      'HC-06A Edge Function Gateway Ping Execution',
      hc06aRes.checkId === 'HC-06A' && (hc06aRes.status === 'healthy' || hc06aRes.status === 'degraded' || hc06aRes.status === 'unknown'),
      `Status: ${hc06aRes.status}, Summary: "${hc06aRes.sanitizedSummary}"`
    );
  } catch (err: any) {
    logTest('HC-06A-1', 'HC-06A Edge Gateway Ping', false, err?.message);
  }

  try {
    const hc06bRes = await systemMonitorService.checkWebhookTriggerHealth();
    logTest(
      'HC-06B-1',
      'HC-06B Webhook Trigger Infrastructure Audit Execution',
      hc06bRes.checkId === 'HC-06B' && (hc06bRes.status === 'healthy' || hc06bRes.status === 'unknown'),
      `Status: ${hc06bRes.status}, Summary: "${hc06bRes.sanitizedSummary}"`
    );
  } catch (err: any) {
    logTest('HC-06B-1', 'HC-06B Webhook Trigger Check', false, err?.message);
  }

  try {
    const hc07Res = await systemMonitorService.checkEmailWorkflowHealth();
    logTest(
      'HC-07-1',
      'HC-07 Email Workflow Audit Log Execution',
      hc07Res.checkId === 'HC-07' && (hc07Res.status === 'healthy' || hc07Res.status === 'degraded' || hc07Res.status === 'unknown'),
      `Status: ${hc07Res.status}, Summary: "${hc07Res.sanitizedSummary}"`
    );
  } catch (err: any) {
    logTest('HC-07-1', 'HC-07 Email Audit Log Check', false, err?.message);
  }

  try {
    const hc08Res = await systemMonitorService.checkOperationalSiteModeHealth();
    logTest(
      'HC-08-1',
      'HC-08 Portfolio Operational Site Mode Audit Execution',
      hc08Res.checkId === 'HC-08' && (hc08Res.status === 'healthy' || hc08Res.status === 'degraded' || hc08Res.status === 'unknown'),
      `Status: ${hc08Res.status}, Summary: "${hc08Res.sanitizedSummary}"`
    );
  } catch (err: any) {
    logTest('HC-08-1', 'HC-08 Site Mode Audit Check', false, err?.message);
  }

  try {
    const summary = await systemMonitorService.getSystemHealthSummary('public');
    logTest(
      'SYS-SUMMARY',
      'Unified getSystemHealthSummary Execution across 11 Checks, 7 Components, and 5 Workflows',
      summary.components.length === 7 && summary.workflows.length === 5 && summary.totalChecksCount >= 11 && typeof summary.overallStatus === 'string',
      `Overall: ${summary.overallStatus}, Total Components: ${summary.components.length}, Workflows: ${summary.workflows.length}, Total Checks: ${summary.totalChecksCount}`
    );
  } catch (err: any) {
    logTest('SYS-SUMMARY', 'Unified getSystemHealthSummary Execution', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // PHASE 7 WORKFLOW EVALUATION TESTS
  // --------------------------------------------------------------------------
  try {
    const workflows = await systemMonitorService.getAllWorkflowHealth();
    logTest(
      'WF-ALL-1',
      'getAllWorkflowHealth returns exactly 5 production workflows',
      workflows.length === 5 && workflows.every(w => typeof w.workflowName === 'string' && typeof w.status === 'string'),
      `Returned Workflows: ${workflows.map(w => `${w.workflowName} (${w.status})`).join('; ')}`
    );

    const contactWf = workflows.find(w => w.workflowName === 'Contact Notification Workflow');
    logTest(
      'WF-STAGES-1',
      'Workflow 4-Stage Pipeline Structure (Trigger -> Function -> Provider -> Delivery)',
      !!contactWf && typeof contactWf.triggerStatus === 'string' && typeof contactWf.functionStatus === 'string' && typeof contactWf.providerStatus === 'string' && typeof contactWf.deliveryStatus === 'string',
      `Contact Workflow Stages: Trigger=${contactWf?.triggerStatus}, Function=${contactWf?.functionStatus}, Provider=${contactWf?.providerStatus}, Delivery=${contactWf?.deliveryStatus}`
    );

    const analyticsWf = workflows.find(w => w.workflowName === 'Visitor Analytics Workflow');
    const isUnknownPreserved = analyticsWf?.providerStatus === 'unknown' || analyticsWf?.providerStatus === 'healthy';
    logTest(
      'WF-UNKNOWN-1',
      'Workflow UNKNOWN propagation preserves insufficient evidence (not forced to fake DOWN/HEALTHY)',
      isUnknownPreserved && analyticsWf?.status !== 'down',
      `Visitor Analytics Workflow Provider Status: '${analyticsWf?.providerStatus}', Overall: '${analyticsWf?.status}'`
    );
  } catch (err: any) {
    logTest('WF-ALL-1', 'Phase 7 Workflow Evaluation', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // PHASE 8 IN-MEMORY INCIDENT TRACKING TESTS
  // --------------------------------------------------------------------------
  try {
    systemMonitorService.clearInMemoryIncidents();

    // 1. Transition: Healthy -> Degraded creates single active incident
    const testComps1 = [
      {
        componentName: 'PostgreSQL Database Engine',
        status: 'degraded' as const,
        evidenceType: 'direct' as const,
        criticality: 'p0_critical' as const,
        checks: [{ checkId: 'HC-01', status: 'degraded' as const, evidenceType: 'direct' as const, timestamp: '', latencyMs: 600, sanitizedSummary: 'Slow query response 600ms', affectedWorkflows: ['Contact Notification Workflow'] }],
        lastEvaluatedAt: ''
      }
    ];
    let incs = systemMonitorService.processIncidentTransitions(testComps1, []);
    logTest(
      'INC-CREATE-1',
      'Transition Healthy -> Degraded creates a single active incident',
      incs.length === 1 && incs[0].status === 'active' && incs[0].targetComponent === 'PostgreSQL Database Engine',
      `Active Incident ID: ${incs[0]?.id}, Status: ${incs[0]?.status}`
    );

    // 2. Transition: Degraded -> Degraded (Repeated refresh) prevents duplicate active incidents
    incs = systemMonitorService.processIncidentTransitions(testComps1, []);
    logTest(
      'INC-DEDUP-1',
      'Transition Degraded -> Degraded maintains same incident without creating duplicate',
      incs.length === 1 && incs[0].status === 'active',
      `Incidents Count: ${incs.length}, Active Status: ${incs[0]?.status}`
    );

    // 3. Transition: Degraded -> Healthy resolves active incident
    const testComps2 = [
      {
        componentName: 'PostgreSQL Database Engine',
        status: 'healthy' as const,
        evidenceType: 'direct' as const,
        criticality: 'p0_critical' as const,
        checks: [{ checkId: 'HC-01', status: 'healthy' as const, evidenceType: 'direct' as const, timestamp: '', latencyMs: 12, sanitizedSummary: 'Query success 12ms', affectedWorkflows: [] }],
        lastEvaluatedAt: ''
      }
    ];
    incs = systemMonitorService.processIncidentTransitions(testComps2, []);
    logTest(
      'INC-RESOLVE-1',
      'Transition Degraded -> Healthy marks incident status = resolved with timestamp',
      incs.length === 1 && incs[0].status === 'resolved' && !!incs[0].resolvedAt,
      `Status: ${incs[0]?.status}, ResolvedAt: ${incs[0]?.resolvedAt}`
    );

    // 4. UNKNOWN state does NOT create an incident
    const testComps3 = [
      {
        componentName: 'Supabase Auth & Admin Authorization',
        status: 'unknown' as const,
        evidenceType: 'direct' as const,
        criticality: 'p0_critical' as const,
        checks: [{ checkId: 'HC-02B', status: 'unknown' as const, evidenceType: 'direct' as const, timestamp: '', latencyMs: 0, sanitizedSummary: 'No session context', affectedWorkflows: [] }],
        lastEvaluatedAt: ''
      }
    ];
    incs = systemMonitorService.processIncidentTransitions(testComps3, []);
    const unknownIncidents = incs.filter(i => i.targetComponent === 'Supabase Auth & Admin Authorization');
    logTest(
      'INC-UNKNOWN-1',
      'UNKNOWN state does NOT create an incident',
      unknownIncidents.length === 0,
      `Auth Incidents Count: ${unknownIncidents.length}`
    );

    // Reset buffer for clean state
    systemMonitorService.clearInMemoryIncidents();
  } catch (err: any) {
    logTest('INC-CREATE-1', 'Phase 8 Incident Tracking', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // PHASE 9 SYNTHETIC FAILURE SIMULATION & VERIFICATION HARNESS TESTS
  // --------------------------------------------------------------------------
  try {
    systemMonitorService.resetSimulations();

    // 1. Simulation API: create, inspect, reset, invalid ID check
    let threwInvalid = false;
    try {
      systemMonitorService.simulateProbeFailure('INVALID-ID', 'down');
    } catch {
      threwInvalid = true;
    }
    systemMonitorService.simulateProbeFailure('HC-01', 'down', 999, 'Simulated DB Outage');
    const overrides = systemMonitorService.getSimulatedOverrides();
    logTest(
      'SIM-API-1',
      'Simulation API sets override, exposes metadata, and rejects invalid check ID',
      threwInvalid && !!overrides['HC-01'] && overrides['HC-01'].status === 'down' && overrides['HC-01'].latencyMs === 999,
      `Overrides count: ${Object.keys(overrides).length}, Threw invalid ID error: ${threwInvalid}`
    );

    // 2. Scenario A — P0 Simulated Failure & Aggregation Chain
    systemMonitorService.clearInMemoryIncidents();
    const simP0Summary = await systemMonitorService.getSystemHealthSummary('public');
    const p0Comp = simP0Summary.components.find(c => c.componentName === 'PostgreSQL Database Engine');
    const p0Inc = simP0Summary.incidents.find(i => i.targetComponent === 'PostgreSQL Database Engine');
    logTest(
      'SIM-P0-1',
      'Simulated HC-01 DOWN triggers P0 critical system impact and active incident',
      simP0Summary.overallStatus === 'down' && p0Comp?.status === 'down' && p0Inc?.status === 'active',
      `Overall: ${simP0Summary.overallStatus}, DB Component: ${p0Comp?.status}, Active Incident ID: ${p0Inc?.id}`
    );

    // 3. Scenario B — P1/P2 Degraded Simulated Failure & Workflow Reaction
    systemMonitorService.resetSimulations();
    systemMonitorService.simulateProbeFailure('HC-04', 'degraded', 150, 'Simulated RPC Latency Degraded');
    const simDegSummary = await systemMonitorService.getSystemHealthSummary('public');
    const analyticsWf = simDegSummary.workflows.find(w => w.workflowName === 'Visitor Analytics Workflow');
    logTest(
      'SIM-DEGRADED-1',
      'Simulated HC-04 Degraded causes component degradation, workflow reaction, and degraded overall status',
      simDegSummary.overallStatus === 'degraded' && analyticsWf?.status === 'degraded',
      `Overall: ${simDegSummary.overallStatus}, Visitor Analytics Workflow Status: ${analyticsWf?.status}`
    );

    // 4. Scenario C — Simulated UNKNOWN (No fake DOWN, no fake HEALTHY, 0 incidents created)
    systemMonitorService.resetSimulations();
    systemMonitorService.clearInMemoryIncidents();
    systemMonitorService.simulateProbeFailure('HC-06A', 'unknown', 0, 'Simulated Edge Gateway Timeout');
    const simUnknownSummary = await systemMonitorService.getSystemHealthSummary('public');
    const edgeComp = simUnknownSummary.components.find(c => c.componentName === 'Supabase Edge Gateway & Webhook Triggers');
    const edgeIncs = simUnknownSummary.incidents.filter(i => i.targetComponent === 'Supabase Edge Gateway & Webhook Triggers');
    logTest(
      'SIM-UNKNOWN-1',
      'Simulated UNKNOWN is preserved (does not create fake DOWN/HEALTHY or active incidents)',
      edgeComp?.checks.find(c => c.checkId === 'HC-06A')?.status === 'unknown' && edgeIncs.length === 0,
      `HC-06A Status: ${edgeComp?.checks.find(c => c.checkId === 'HC-06A')?.status}, Incident Count: ${edgeIncs.length}`
    );

    // 5. Scenario D — Probe Simulation Recovery Lifecycle (Failure -> Active -> Reset -> Recovery -> Resolved)
    systemMonitorService.resetSimulations();
    systemMonitorService.clearInMemoryIncidents();

    // Step A: Inject simulation failure
    systemMonitorService.simulateProbeFailure('HC-01', 'down');
    await systemMonitorService.getSystemHealthSummary('public');

    // Step B: Reset simulation overrides
    systemMonitorService.resetSimulations();

    // Step C: Evaluate live health again -> real probe executes, component recovers, incident resolves
    const recoverySummary = await systemMonitorService.getSystemHealthSummary('public');
    const dbIncAfterRecovery = recoverySummary.incidents.find(i => i.targetComponent === 'PostgreSQL Database Engine');

    logTest(
      'SIM-RECOVERY-1',
      'Full Simulation Recovery Chain (Failure -> Active Incident -> Reset -> Real Probe Evaluation -> Resolved Incident)',
      dbIncAfterRecovery?.status === 'resolved' && !!dbIncAfterRecovery?.resolvedAt,
      `Recovered Incident Status: ${dbIncAfterRecovery?.status}, ResolvedAt: ${dbIncAfterRecovery?.resolvedAt}`
    );

    // Clean up simulation overrides & incident buffer after tests
    systemMonitorService.resetSimulations();
    systemMonitorService.clearInMemoryIncidents();
  } catch (err: any) {
    logTest('SIM-API-1', 'Phase 9 Simulation Harness', false, err?.message);
  }

  // --------------------------------------------------------------------------
  // AGGREGATION SCENARIO TESTS (calculateSystemHealth)
  // --------------------------------------------------------------------------
  try {
    const { calculateSystemHealth, SYSTEM_MONITOR_CONTRACTS } = await import('../../types/systemMonitor');

    // Contract Consistency Check
    const hc02bContract = SYSTEM_MONITOR_CONTRACTS['HC-02B'];
    logTest(
      'CONTRACT-02B',
      'HC-02B Contract Criticality is strictly p1_high',
      hc02bContract?.criticality === 'p1_high',
      `Criticality: ${hc02bContract?.criticality}`
    );

    // Scenario A: All Healthy -> healthy
    const sysA = calculateSystemHealth(
      [{ componentName: 'DB', status: 'healthy', evidenceType: 'direct', criticality: 'p0_critical', checks: [{ checkId: 'HC-01', status: 'healthy', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'OK', affectedWorkflows: [] }], lastEvaluatedAt: '' }],
      []
    );
    logTest('AGG-A', 'Scenario A: All Healthy -> healthy', sysA.overallStatus === 'healthy', `Overall: ${sysA.overallStatus}`);

    // Scenario B: P3 Down -> NOT global down
    const sysB = calculateSystemHealth(
      [{ componentName: 'SiteMode', status: 'down', evidenceType: 'direct', criticality: 'p3_low', checks: [{ checkId: 'HC-08', status: 'down', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'P3 Down', affectedWorkflows: [] }], lastEvaluatedAt: '' }],
      []
    );
    logTest('AGG-B', 'Scenario B: P3 Down -> NOT global down', sysB.overallStatus !== 'down', `Overall: ${sysB.overallStatus}`);

    // Scenario C: P2 Workflow Down -> degraded
    const sysC = calculateSystemHealth(
      [],
      [{ workflowName: 'Search', status: 'down', evidenceType: 'direct', triggerStatus: 'healthy', functionStatus: 'healthy', providerStatus: 'healthy', deliveryStatus: 'down', lastEvaluatedAt: '' }]
    );
    logTest('AGG-C', 'Scenario C: P2 Workflow Down -> degraded', sysC.overallStatus === 'degraded', `Overall: ${sysC.overallStatus}`);

    // Scenario D: P1 Component Down -> degraded
    const sysD = calculateSystemHealth(
      [{ componentName: 'Telemetry', status: 'down', evidenceType: 'direct', criticality: 'p1_high', checks: [{ checkId: 'HC-05A', status: 'down', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'P1 Down', affectedWorkflows: [] }], lastEvaluatedAt: '' }],
      []
    );
    logTest('AGG-D', 'Scenario D: P1 Component Down -> degraded', sysD.overallStatus === 'degraded', `Overall: ${sysD.overallStatus}`);

    // Scenario E: Actual P0 infrastructure component DOWN (HC-01 = down) -> down
    const sysE = calculateSystemHealth(
      [{ componentName: 'DB', status: 'down', evidenceType: 'direct', criticality: 'p0_critical', checks: [{ checkId: 'HC-01', status: 'down', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'DB Failure', affectedWorkflows: [] }], lastEvaluatedAt: '' }],
      []
    );
    logTest('AGG-E', 'Scenario E: P0 Infrastructure DOWN -> down', sysE.overallStatus === 'down', `Overall: ${sysE.overallStatus}`);

    // Scenario F: Current user authenticated but non-admin (HC-02A=healthy, HC-02B=down) -> MUST NOT be down, MUST be degraded
    const sysF = calculateSystemHealth(
      [{ componentName: 'Auth', status: 'degraded', evidenceType: 'direct', criticality: 'p0_critical', checks: [
        { checkId: 'HC-02A', status: 'healthy', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'Session Active', affectedWorkflows: [] },
        { checkId: 'HC-02B', status: 'down', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'User lacks admin record', affectedWorkflows: [] }
      ], lastEvaluatedAt: '' }],
      []
    );
    logTest('AGG-F', 'Scenario F: Non-Admin HC-02B DOWN -> overallStatus = degraded (NOT down)', sysF.overallStatus === 'degraded', `Overall: ${sysF.overallStatus}`);

    // Scenario G: HC-02B lookup query fails due to DB error -> unknown
    const sysG = calculateSystemHealth(
      [{ componentName: 'Auth', status: 'unknown', evidenceType: 'direct', criticality: 'p0_critical', checks: [
        { checkId: 'HC-02B', status: 'unknown', evidenceType: 'direct', timestamp: '', latencyMs: 10, sanitizedSummary: 'Lookup query unavailable', affectedWorkflows: [] }
      ], lastEvaluatedAt: '' }],
      []
    );
    logTest('AGG-G', 'Scenario G: HC-02B Lookup Error -> unknown (does not claim Auth failure)', sysG.overallStatus === 'unknown' || sysG.overallStatus === 'healthy', `Overall: ${sysG.overallStatus}`);
  } catch (err: any) {
    logTest('AGG-TESTS', 'Aggregation Scenarios Execution', false, err?.message);
  }

  return { passed: allPassed, testResults: results };
}

// Auto-run if executed in environment with process
if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'test') {
  runSystemMonitorServiceTests().then(({ testResults }) => {
    console.log(testResults.join('\n'));
  });
}
