/* src/admin/types/systemMonitor.ts */

/**
 * ============================================================================
 * ADMIN DASHBOARD — SYSTEM MONITOR DOMAIN CONTRACTS
 * Source of Truth: Phase 1 Core Health & Truthful Verification Model
 * ============================================================================
 */

/**
 * Standardized health status representation for components, workflows, and system evaluation.
 */
export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

/**
 * Verification coverage classification separating health from evidence completeness.
 * - 'verified': All defined checks/stages have active, evaluated evidence.
 * - 'partially_verified': Some checks/stages are evaluated, but others are unknown/unprobed.
 * - 'not_verified': Zero checks or all checks are unknown (insufficient evidence).
 */
export type VerificationStatus = 'verified' | 'partially_verified' | 'not_verified';

/**
 * Formal evidence confidence levels based on the evidence hierarchy.
 */
export type EvidenceLevel = 'direct' | 'synthetic' | 'external' | 'indirect' | 'unknown';

/**
 * Criticality classification hierarchy governing system status aggregation.
 */
export type CriticalityLevel = 'p0_critical' | 'p1_high' | 'p2_medium' | 'p3_low';

/**
 * Categorization of health checks across portfolio architecture layers.
 */
export type HealthCheckCategory =
  | 'database'
  | 'auth'
  | 'analytics'
  | 'edge_function'
  | 'email'
  | 'telemetry'
  | 'portfolio_state'
  | 'external_availability';

/**
 * Valid operational states for the portfolio site mode machine.
 */
export type OperationalSiteMode = 'public' | 'maintenance' | 'private';

/**
 * Sanitized error representation preventing secrets or API keys from exposing in diagnostic evidence.
 */
export interface SanitizedErrorDetails {
  code: string;
  message: string;
  timestamp: string;
}

/**
 * Static metadata contract defining a health check's scope, proof boundaries, and criticality.
 */
export interface HealthCheckContract {
  id: string;
  name: string;
  component: string;
  category: HealthCheckCategory;
  criticality: CriticalityLevel;
  evidenceType: EvidenceLevel;
  description: string;
  testOperation: string;
  successCondition: string;
  failureCondition: string;
  proves: string[];
  doesNotProve: string[];
  affectedWorkflows: string[];
}

/**
 * Diagnostic model for inspecting a specific technical component.
 */
export interface ComponentDiagnostic {
  componentId: string;
  name: string;
  description: string;
  healthStatus: HealthStatus;
  verificationStatus: VerificationStatus;
  criticality: CriticalityLevel;
  evidenceType: EvidenceLevel;
  responseTimeMs: number;
  lastEvaluatedAt: string;
  checks: HealthCheckResult[];
  affectedWorkflows: string[];
  currentProblem?: {
    checkId: string;
    operation: string;
    detectedAt: string;
    sanitizedError: string;
    status: HealthStatus;
  };
  metrics: {
    totalProbes: number;
    healthyProbes: number;
    degradedProbes: number;
    downProbes: number;
    unknownProbes: number;
  };
}

/**
 * Execution result of a specific health check probe.
 */
export interface HealthCheckResult {
  checkId: string;
  status: HealthStatus;
  evidenceType: EvidenceLevel;
  timestamp: string;
  latencyMs: number;
  sanitizedSummary: string;
  errorDetails?: SanitizedErrorDetails;
  affectedWorkflows: string[];
}

/**
 * Aggregated health status of a specific technical component.
 */
export interface ComponentHealth {
  componentName: string;
  status: HealthStatus;
  verificationStatus: VerificationStatus;
  evidenceType: EvidenceLevel;
  criticality: CriticalityLevel;
  checks: HealthCheckResult[];
  lastEvaluatedAt: string;
}

/**
 * Individual pipeline stage in an end-to-end production workflow.
 */
export interface WorkflowStage {
  stageId: string;
  stageName: string;
  status: HealthStatus;
  verificationStatus: VerificationStatus;
  evidenceType: EvidenceLevel;
  timestamp: string;
  latencyMs?: number;
  operation: string;
  successCondition: string;
  failureCondition: string;
  summary: string;
  proves: string[];
  doesNotProve: string[];
  error?: string;
}

/**
 * Diagnostic representation of an end-to-end production workflow.
 */
export interface WorkflowDiagnostic {
  workflowId: string;
  workflowName: string;
  description: string;
  status: HealthStatus;
  verificationStatus: VerificationStatus;
  evidenceType: EvidenceLevel;
  stages: WorkflowStage[];
  affectedComponents: string[];
  lastEvaluatedAt: string;
  latencyMs?: number;
  summary: string;
  limitations: string[];
}

/**
 * Result of an individual stage within a synthetic test execution.
 */
export interface SyntheticStageResult {
  stageId: string;
  stageName: string;
  status: 'passed' | 'failed' | 'timeout' | 'not_evaluated';
  durationMs: number;
  evidence: string;
  proves: string[];
  doesNotProve: string[];
  error?: string;
}

/**
 * Result of an end-to-end safe synthetic workflow test.
 */
export interface SyntheticTestResult {
  testId: string;
  workflowId: string;
  workflowName: string;
  correlationId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: 'passed' | 'failed' | 'timeout' | 'not_supported';
  stages: SyntheticStageResult[];
  cleanupStatus: 'cleaned' | 'failed' | 'not_applicable';
  summary: string;
  error?: string;
}

/**
 * Safety classification for a workflow's synthetic testability.
 */
export type WorkflowSafetyClassification =
  | 'SAFE_WITH_ISOLATION'
  | 'SAFE_TO_SYNTHETIC_TEST'
  | 'NOT_SAFE_TO_TEST'
  | 'NOT_SUPPORTED';

/**
 * Aggregated health status of an end-to-end user process.
 */
export interface WorkflowHealth {
  workflowId?: string;
  workflowName: string;
  description?: string;
  status: HealthStatus;
  verificationStatus: VerificationStatus;
  evidenceType: EvidenceLevel;
  triggerStatus: HealthStatus;
  functionStatus: HealthStatus;
  providerStatus: HealthStatus;
  deliveryStatus: HealthStatus;
  stages?: WorkflowStage[];
  affectedComponents?: string[];
  lastEvaluatedAt: string;
  notes?: string;
  latencyMs?: number;
  summary?: string;
  limitations?: string[];
  safetyClassification?: WorkflowSafetyClassification;
  safetyReason?: string;
  lastSyntheticResult?: SyntheticTestResult;
}

/**
 * ============================================================================
 * PHASE 7: PERSISTENT INCIDENT MANAGEMENT TYPE DEFINITIONS
 * ============================================================================
 */

export type IncidentStatus = 'open' | 'acknowledged' | 'resolved';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentSourceType =
  | 'TECHNICAL_COMPONENT'
  | 'PRODUCTION_WORKFLOW'
  | 'DATA_INTEGRITY'
  | 'SECURITY';

export type IncidentTimelineEventType =
  | 'detected'
  | 'repeated_detection'
  | 'acknowledged'
  | 'recovery_detected'
  | 'resolved'
  | 'reopened';

export interface IncidentTimelineEvent {
  id: string;
  type: IncidentTimelineEventType;
  timestamp: string;
  summary: string;
  actor?: string;
  metadata?: Record<string, any>;
}

/**
 * Persistent incident record representing an operational issue lifecycle.
 */
export interface SystemIncident {
  id: string;
  incidentKey: string;
  title: string;
  description?: string;
  status: IncidentStatus | 'active'; // 'open' | 'acknowledged' | 'resolved' (with 'active' alias for backward compat)
  severity: IncidentSeverity | CriticalityLevel;
  sourceType: IncidentSourceType;
  sourceId?: string;
  componentName?: string;
  workflowName?: string;
  checkId?: string;
  evidenceType?: string;
  firstDetectedAt: string;
  lastDetectedAt: string;
  occurrenceCount: number;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  recoveryDetectedAt?: string;
  sanitizedError?: string;
  latestEvidence?: string;
  timeline: IncidentTimelineEvent[];
  isSimulated: boolean;
  persistenceStatus?: 'persisted' | 'failed' | 'fallback_local';
  
  // Backward compatibility aliases
  targetComponent?: string;
  startedAt?: string;
  sanitizedSummary?: string;
  affectedWorkflows?: string[];
}

/**
 * ============================================================================
 * PHASE 8: MONITORING HISTORY & TRENDS TYPE DEFINITIONS
 * ============================================================================
 */

export type TrendDirection = 'improving' | 'stable' | 'degrading' | 'insufficient_data';

export interface MonitorHistoryRecord {
  id: string;
  sourceType: IncidentSourceType;
  sourceId: string;
  checkId?: string;
  status: HealthStatus | IntegrityCheckStatus | SecurityCheckStatus;
  verificationStatus?: VerificationStatus;
  responseTimeMs?: number;
  evidenceType?: string;
  severity?: IncidentSeverity | CriticalityLevel;
  sanitizedSummary?: string;
  incidentId?: string;
  isSimulated?: boolean;
  evaluatedAt?: string;
  createdAt?: string;
}

export interface ComponentHistoryMetrics {
  sourceId: string;
  componentName?: string;
  totalObservations: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  unknownCount: number;
  healthyPercentage: number;
  healthPercentage: number;
  degradedPercentage: number;
  downPercentage: number;
  minResponseTimeMs?: number;
  maxResponseTimeMs?: number;
  avgResponseTimeMs?: number;
  recentResponseTimeMs?: number;
  trend: TrendDirection;
  trendReason?: string;
  hasLatencyOutlier?: boolean;
  latencyOutlierNote?: string;
  recentObservations: MonitorHistoryRecord[];
  correlatedIncidentCount: number;
  correlatedIncidents: SystemIncident[];
  timeRangeHours: number;
  timeWindowHours: number;
}

export interface WorkflowHistoryMetrics {
  workflowId?: string;
  workflowName: string;
  totalObservations: number;
  totalEvaluations?: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  unknownCount?: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  notVerifiedCount: number;
  healthPercentage?: number;
  degradedPercentage?: number;
  downPercentage?: number;
  avgDurationMs?: number;
  minResponseTimeMs?: number;
  avgResponseTimeMs?: number;
  maxResponseTimeMs?: number;
  recentResponseTimeMs?: number;
  trend?: TrendDirection;
  trendReason?: string;
  recentObservations: MonitorHistoryRecord[];
  correlatedIncidents?: SystemIncident[];
  timeWindowHours?: number;
}

/**
 * ============================================================================
 * PHASE 9: FAILURE SIMULATION & DIAGNOSTIC VALIDATION TYPE DEFINITIONS
 * ============================================================================
 */

export type SimulationTargetType =
  | 'TECHNICAL_COMPONENT'
  | 'PRODUCTION_WORKFLOW'
  | 'DATA_INTEGRITY'
  | 'SECURITY';

export type SimulationFailureType =
  | 'down'
  | 'degraded'
  | 'failed'
  | 'warning'
  | 'unknown';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  targetType: SimulationTargetType;
  targetId: string;
  checkId?: string;
  failureType: SimulationFailureType;
  latencyMs?: number;
  simulatedSummary?: string;
  expectedStatus: HealthStatus | IntegrityCheckStatus | SecurityCheckStatus;
  expectedSeverity?: IncidentSeverity | CriticalityLevel;
  isSafe: boolean;
  safetyReason?: string;
  expectedPropagation: {
    probeStatus: string;
    targetStatus: string;
    incidentExpected: boolean;
    historyExpected: boolean;
  };
}

export interface SimulationValidationStage {
  stageId: string;
  stageName: string;
  status: 'passed' | 'failed' | 'timeout' | 'not_evaluated' | 'skipped';
  expected: string;
  actual: string;
  details?: string;
  durationMs?: number;
}

export interface SimulationValidationResult {
  scenarioId: string;
  scenarioName: string;
  targetType: SimulationTargetType;
  targetId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  passed: boolean;
  failureStage?: string;
  stages: SimulationValidationStage[];
  expected: Record<string, any>;
  actual: Record<string, any>;
  cleanupStatus: 'verified' | 'failed' | 'skipped';
  recoveryStatus: 'verified' | 'failed' | 'skipped';
  error?: string;
  limitations?: string[];
}

/**
 * ============================================================================
 * PHASE 5: DATA INTEGRITY TYPE DEFINITIONS
 * ============================================================================
 */

export type IntegrityCheckSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IntegrityCheckStatus = 'healthy' | 'warning' | 'failed' | 'not_verified';
export type IntegrityCategory =
  | 'referential'
  | 'required_data'
  | 'state_consistency'
  | 'duplicates'
  | 'freshness'
  | 'orphaned_records'
  | 'application_consistency';

export interface IntegrityIssueDetail {
  recordId?: string;
  table: string;
  field?: string;
  issue: string;
  severity: IntegrityCheckSeverity;
  remediationHint: string;
  timestamp?: string;
}

export interface IntegrityCheckResult {
  checkId: string;
  category: IntegrityCategory;
  name: string;
  targetTable: string;
  status: IntegrityCheckStatus;
  severity: IntegrityCheckSeverity;
  recordsChecked: number;
  issuesFound: number;
  evidence: string;
  timestamp: string;
  durationMs: number;
  details: IntegrityIssueDetail[];
  proves: string[];
  doesNotProve: string[];
  limitations?: string[];
  error?: string;
}

export interface IntegrityCategorySummary {
  category: IntegrityCategory;
  categoryId: IntegrityCategory;
  categoryName: string;
  description: string;
  status: HealthStatus;
  verificationStatus: VerificationStatus;
  totalChecks: number;
  healthyChecks: number;
  warningChecks: number;
  failedChecks: number;
  notVerifiedChecks: number;
  totalRecordsChecked: number;
  recordsChecked: number;
  totalIssuesFound: number;
  issuesFound: number;
  lastEvaluatedAt: string;
  checks: IntegrityCheckResult[];
}

export interface DataIntegritySummary {
  overallStatus: HealthStatus;
  overallVerificationStatus: VerificationStatus;
  lastEvaluatedAt: string;
  totalChecks: number;
  healthyCount: number;
  healthyChecks: number;
  warningCount: number;
  warningChecks: number;
  failedCount: number;
  failedChecks: number;
  notVerifiedCount: number;
  notVerifiedChecks: number;
  totalRecordsAudited: number;
  totalRecordsChecked: number;
  totalIssuesFound: number;
  categories: IntegrityCategorySummary[];
}

/**
 * ============================================================================
 * PHASE 10: FINAL HEALTH AGGREGATION & SYSTEM MONITOR HARDENING
 * ============================================================================
 */

/**
 * Diagnostic coverage breakdown detailing evaluated, verified, partially verified, and unverified checks.
 */
export interface DiagnosticCoverageSummary {
  totalChecksEvaluated: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  unknownCount: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  notVerifiedCount: number;
  coverageDescription: string;
}

/**
 * Individual entry in the proof boundary summary catalog defining what the system proves vs limitations.
 */
export interface ProofBoundaryItem {
  id: string;
  type: 'verified_fact' | 'known_limitation';
  category: 'infrastructure' | 'workflow' | 'integrity' | 'security' | 'delivery';
  title: string;
  description: string;
}

/**
 * Overall aggregated system health representation (Single Source of Truth).
 */
export interface SystemHealthSummary {
  overallStatus: HealthStatus;
  overallVerificationStatus: VerificationStatus;
  siteMode: OperationalSiteMode;
  components: ComponentHealth[];
  workflows: WorkflowHealth[];
  dataIntegrity?: DataIntegritySummary;
  security?: SecurityDashboardSummary;
  incidents: SystemIncident[];
  activeIncidentsCount?: number;
  criticalIncidentsCount?: number;
  highIncidentsCount?: number;
  diagnosticCoverage?: DiagnosticCoverageSummary;
  proofBoundaries?: ProofBoundaryItem[];
  summaryNarrative?: string;
  categoryAvailability?: Record<string, 'available' | 'evaluation_failed'>;
  limitations?: string[];
  lastEvaluatedAt: string;
  totalChecksCount: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  unknownCount: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  notVerifiedCount: number;
}

export type UnifiedSystemMonitorSummary = SystemHealthSummary;

/**
 * ============================================================================
 * KNOWN HEALTH CHECK CONTRACT CATALOGUE
 * Standardized contracts for all 11 checks identified in Phase 0.5.1
 * ============================================================================
 */
export const HEALTH_CHECK_IDS = {
  HC_01_DB_PING: 'HC-01',
  HC_02A_AUTH_GATEWAY: 'HC-02A',
  HC_02B_ADMIN_AUTH: 'HC-02B',
  HC_03_RLS_ACCESS: 'HC-03',
  HC_04_ANALYTICS_RPC: 'HC-04',
  HC_05A_TELEMETRY_QUERY: 'HC-05A',
  HC_05B_TELEMETRY_FRESH: 'HC-05B',
  HC_06A_EDGE_GATEWAY: 'HC-06A',
  HC_06B_WEBHOOK_TRIGGER: 'HC-06B',
  HC_07_EMAIL_WORKFLOW: 'HC-07',
  HC_08_SITE_MODE: 'HC-08',
} as const;

export const SYSTEM_MONITOR_CONTRACTS: Record<string, HealthCheckContract> = {
  [HEALTH_CHECK_IDS.HC_01_DB_PING]: {
    id: 'HC-01',
    name: 'Supabase Database Direct Read',
    component: 'PostgreSQL Database Engine',
    category: 'database',
    criticality: 'p0_critical',
    evidenceType: 'direct',
    description: 'Executes a lightweight SELECT query against public.portfolio_settings.',
    testOperation: 'SELECT id, site_mode FROM public.portfolio_settings LIMIT 1',
    successCondition: 'Database read returns valid response with error = null',
    failureCondition: 'Query fails or times out',
    proves: [
      'Monitored Supabase application read path can successfully access portfolio_settings',
      'Database access path is reachable',
      'Authenticated application database request succeeds'
    ],
    doesNotProve: [
      'All database tables are healthy',
      'PostgreSQL infrastructure is universally healthy',
      'All RLS policies are correct',
      'All RPCs work',
      'All triggers work',
      'Edge Functions work',
      'Email works',
      'Analytics works',
      'CMS data integrity is correct'
    ],
    affectedWorkflows: ['All Portfolio & Admin Workflows']
  },
  [HEALTH_CHECK_IDS.HC_02A_AUTH_GATEWAY]: {
    id: 'HC-02A',
    name: 'Auth Provider Gateway Availability',
    component: 'Supabase Auth Service',
    category: 'auth',
    criticality: 'p0_critical',
    evidenceType: 'synthetic',
    description: 'Issues getSession() to verify Auth gateway API responsiveness.',
    testOperation: 'supabase.auth.getSession()',
    successCondition: 'Auth gateway returns session state without network failure',
    failureCondition: 'Auth gateway unreachable or throws network exception',
    proves: ['Local browser context holds an active, valid authentication session'],
    doesNotProve: [
      'Supabase Auth infrastructure is universally healthy',
      'All authentication operations work',
      'All users can authenticate',
      'User has active admin authorization in public.admins'
    ],
    affectedWorkflows: ['Admin Authentication Workflow']
  },
  [HEALTH_CHECK_IDS.HC_02B_ADMIN_AUTH]: {
    id: 'HC-02B',
    name: 'Admin Authorization Rule Check',
    component: 'Admin Authorization Middleware',
    category: 'auth',
    criticality: 'p1_high',
    evidenceType: 'direct',
    description: 'Evaluates whether current authenticated user satisfies active admin authorization rules in public.admins.',
    testOperation: 'SELECT role FROM public.admins WHERE user_id = auth.uid() LIMIT 1',
    successCondition: 'Authenticated user matches active admin record in public.admins',
    failureCondition: 'User lacks admin record or admin query fails',
    proves: [
      'Logged-in user satisfies active administrator authorization rule in public.admins'
    ],
    doesNotProve: [
      'OAuth identity provider uptime for new logins',
      'Protected data access across all RLS tables'
    ],
    affectedWorkflows: ['Admin Dashboard Access Workflow']
  },
  [HEALTH_CHECK_IDS.HC_03_RLS_ACCESS]: {
    id: 'HC-03',
    name: 'Protected Data & RLS Read Path',
    component: 'Protected Data & RLS Policy Engine',
    category: 'auth',
    criticality: 'p0_critical',
    evidenceType: 'direct',
    description: 'Executes a read-only query against a protected table requiring authenticated admin privileges.',
    testOperation: 'SELECT id FROM public.access_requests LIMIT 1',
    successCondition: 'Query executes under active RLS without 42501 permission denial',
    failureCondition: 'RLS permission denied or query fails',
    proves: [
      'Current authorized application context can reach the monitored protected data path',
      'Protected data query executes successfully under active RLS'
    ],
    doesNotProve: [
      'Every RLS policy is correct across all tables',
      'Unauthorized users are blocked everywhere',
      'All database tables are healthy'
    ],
    affectedWorkflows: ['All Admin Protected Data Access Workflows']
  },
  [HEALTH_CHECK_IDS.HC_04_ANALYTICS_RPC]: {
    id: 'HC-04',
    name: 'Analytics RPC Execution & Mock Detector',
    component: 'Analytics Database Engine',
    category: 'analytics',
    criticality: 'p1_high',
    evidenceType: 'synthetic',
    description: 'Executes get_analytics_summary RPC and checks for mock fallback signatures.',
    testOperation: "supabase.rpc('get_analytics_summary', { p_start_date, p_end_date })",
    successCondition: 'PL/pgSQL RPC executes natively and returns structured telemetry rows',
    failureCondition: 'RPC missing, throws SQL exception, or times out',
    proves: ['Postgres RPC PL/pgSQL function executes natively without throwing SQL errors'],
    doesNotProve: ['Live visitor telemetry is actively being ingested'],
    affectedWorkflows: ['Visitor Analytics Dashboard Workflow']
  },
  [HEALTH_CHECK_IDS.HC_05A_TELEMETRY_QUERY]: {
    id: 'HC-05A',
    name: 'Visitor Telemetry Data Source Readability',
    component: 'Visitor Telemetry Ingestion',
    category: 'telemetry',
    criticality: 'p1_high',
    evidenceType: 'direct',
    description: 'Verifies readability of public.visitor_sessions table.',
    testOperation: 'SELECT session_id, created_at FROM public.visitor_sessions LIMIT 1',
    successCondition: 'public.visitor_sessions table is queryable and returns valid response',
    failureCondition: 'Table unreadable, RLS error, or query times out',
    proves: ['public.visitor_sessions table exists and is queryable'],
    doesNotProve: ['Recent visitors are currently arriving or JS tracking script is active'],
    affectedWorkflows: ['Visitor Tracking Workflow']
  },
  [HEALTH_CHECK_IDS.HC_05B_TELEMETRY_FRESH]: {
    id: 'HC-05B',
    name: 'Visitor Telemetry Freshness Audit',
    component: 'Visitor Telemetry Ingestion',
    category: 'telemetry',
    criticality: 'p1_high',
    evidenceType: 'indirect',
    description: 'Evaluates timestamp of latest visitor session in public.visitor_sessions.',
    testOperation: 'SELECT MAX(created_at) FROM public.visitor_sessions',
    successCondition: 'Recent visitor session activity recorded in database',
    failureCondition: 'Query execution fails (zero recent visitors evaluates to unknown, not failure)',
    proves: ['Recent visitor session activity was recorded'],
    doesNotProve: ['Tracking script works for 100% of browser environments'],
    affectedWorkflows: ['Visitor Tracking Workflow']
  },
  [HEALTH_CHECK_IDS.HC_06A_EDGE_GATEWAY]: {
    id: 'HC-06A',
    name: 'Edge Function Gateway Ping',
    component: 'Supabase Edge Gateway',
    category: 'edge_function',
    criticality: 'p1_high',
    evidenceType: 'external',
    description: 'Issues HTTP OPTIONS preflight to Edge Function endpoint.',
    testOperation: "fetch('${supabaseUrl}/functions/v1/notify-admins-new-request', { method: 'OPTIONS' })",
    successCondition: 'Edge gateway responds with valid HTTP status (200/204)',
    failureCondition: 'Edge gateway returns 5xx error or connection times out',
    proves: ['Edge Gateway responds to HTTP requests'],
    doesNotProve: [
      'Deno TypeScript execution logic succeeds',
      'Downstream Brevo email dispatch succeeds'
    ],
    affectedWorkflows: ['Notification Workflows']
  },
  [HEALTH_CHECK_IDS.HC_06B_WEBHOOK_TRIGGER]: {
    id: 'HC-06B',
    name: 'Webhook DB Trigger Infrastructure Audit',
    component: 'Postgres Webhook Triggers',
    category: 'edge_function',
    criticality: 'p1_high',
    evidenceType: 'indirect',
    description: 'Queries pg_extension for pg_net availability.',
    testOperation: "SELECT extname FROM pg_extension WHERE extname = 'pg_net'",
    successCondition: 'pg_net extension loaded and database webhook triggers active',
    failureCondition: 'Database webhook extension missing or query fails',
    proves: ['pg_net extension is loaded in Postgres'],
    doesNotProve: ['Edge Function executed or Brevo API key is valid'],
    affectedWorkflows: ['Contact Notification', 'Testimonial Notification', 'Access Request Alert']
  },
  [HEALTH_CHECK_IDS.HC_07_EMAIL_WORKFLOW]: {
    id: 'HC-07',
    name: 'Email Workflow Audit Log Check',
    component: 'Email Dispatch System',
    category: 'email',
    criticality: 'p1_high',
    evidenceType: 'direct',
    description: 'Audits latest records in public.maintenance_notification_logs.',
    testOperation: 'SELECT status, error_message FROM public.maintenance_notification_logs ORDER BY sent_at DESC LIMIT 10',
    successCondition: 'Email audit log reflects successful dispatches with zero recent errors',
    failureCondition: 'Delivery failure records logged or audit log unreadable',
    proves: ['Historical email dispatch attempts succeeded or failed'],
    doesNotProve: ['Email was delivered to recipient inbox'],
    affectedWorkflows: ['Maintenance Broadcast Workflow']
  },
  [HEALTH_CHECK_IDS.HC_08_SITE_MODE]: {
    id: 'HC-08',
    name: 'Portfolio Operational Mode Audit',
    component: 'Portfolio State Machine',
    category: 'portfolio_state',
    criticality: 'p2_medium',
    evidenceType: 'direct',
    description: 'Fetches site_mode configuration from public.portfolio_settings.',
    testOperation: 'SELECT site_mode FROM public.portfolio_settings LIMIT 1',
    successCondition: 'Settings query returns valid operational site mode',
    failureCondition: 'Settings table unreadable or invalid site mode value',
    proves: ['Current configured operational site mode (public, maintenance, private)'],
    doesNotProve: ['Public CDN edge server reachability'],
    affectedWorkflows: ['Global Portfolio Access Workflow']
  }
};

/**
 * ============================================================================
 * PURE HELPER UTILITIES
 * Non-mutating logic for status ranking, verification calculation, and health aggregation
 * ============================================================================
 */

/**
 * Rank order for severity aggregation (higher number = higher severity).
 */
const STATUS_SEVERITY_WEIGHT: Record<HealthStatus, number> = {
  down: 4,
  degraded: 3,
  unknown: 2,
  healthy: 1
};

/**
 * Pure function to calculate VerificationStatus from an array of HealthStatus results.
 * Separates Health from Evidence Completeness:
 * - 'not_verified': 0 checks provided or 100% of checks are 'unknown'.
 * - 'verified': All checks have active, evaluated evidence (0 are 'unknown').
 * - 'partially_verified': Mixed active evidence ('healthy'/'degraded'/'down') and 'unknown'.
 */
export function calculateVerificationStatus(statuses: HealthStatus[]): VerificationStatus {
  if (!statuses || statuses.length === 0) return 'not_verified';

  const evaluatedCount = statuses.filter(s => s === 'healthy' || s === 'degraded' || s === 'down').length;
  const unknownCount = statuses.filter(s => s === 'unknown').length;

  if (evaluatedCount === 0) return 'not_verified';
  if (unknownCount === 0) return 'verified';
  return 'partially_verified';
}

/**
 * Pure function to aggregate stage statuses into overall HealthStatus for a multi-stage workflow.
 * - 'down' if any evaluated stage is 'down'
 * - 'degraded' if any evaluated stage is 'degraded'
 * - 'healthy' if at least one stage is 'healthy' and none are down/degraded
 * - 'unknown' if all stages are 'unknown'
 */
export function calculateWorkflowHealthStatus(statuses: HealthStatus[]): HealthStatus {
  if (!statuses || statuses.length === 0) return 'unknown';

  if (statuses.includes('down')) return 'down';
  if (statuses.includes('degraded')) return 'degraded';
  if (statuses.includes('healthy')) return 'healthy';
  return 'unknown';
}

/**
 * Pure function to aggregate multiple HealthStatuses into the worst-case status.
 */
export function aggregateStatuses(statuses: HealthStatus[]): HealthStatus {
  if (!statuses || statuses.length === 0) return 'unknown';

  let worstStatus: HealthStatus = 'healthy';
  let maxWeight = STATUS_SEVERITY_WEIGHT.healthy;

  for (const status of statuses) {
    const weight = STATUS_SEVERITY_WEIGHT[status] || 0;
    if (weight > maxWeight) {
      maxWeight = weight;
      worstStatus = status;
    }
  }

  return worstStatus;
}

/**
 * Pure function to sanitize error messages, stripping potential API keys, JWTs, or secrets.
 */
export function sanitizeError(error: unknown): SanitizedErrorDetails {
  const timestamp = new Date().toISOString();
  if (!error) {
    return { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.', timestamp };
  }

  let rawMessage = typeof error === 'object' && error !== null && 'message' in error
    ? String((error as any).message)
    : String(error);

  // Redact potential Bearer tokens, API keys, JWTs, connection strings
  rawMessage = rawMessage
    .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [REDACTED]')
    .replace(/eyJ[a-zA-Z0-9._-]+/g, '[REDACTED_JWT]')
    .replace(/api[-_]?key[=\s:]+[a-zA-Z0-9._-]+/gi, 'api_key=[REDACTED]')
    .replace(/(postgres|postgresql):\/\/[^\s]+/gi, '[REDACTED_URL]');

  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as any).code)
    : 'ERROR';

  return {
    code: code.substring(0, 50),
    message: rawMessage.substring(0, 300),
    timestamp
  };
}

/**
 * Helper to generate a truthful, contextual summary narrative based on health and verification.
 */
export function generateSystemSummaryNarrative(
  status: HealthStatus,
  verification: VerificationStatus,
  hasActiveIncidents: boolean = false,
  activeIncidentCount: number = 0
): string {
  if (status === 'down') {
    return hasActiveIncidents
      ? `Critical system outage detected. ${activeIncidentCount} active incident${activeIncidentCount === 1 ? '' : 's'} require immediate administrator investigation.`
      : 'Critical system outage detected. Core infrastructure or high-criticality services are currently offline.';
  }

  if (status === 'degraded') {
    return hasActiveIncidents
      ? `System is experiencing degraded performance or partial service disruption with ${activeIncidentCount} active incident${activeIncidentCount === 1 ? '' : 's'}.`
      : 'System is experiencing degraded performance or partial service disruption.';
  }

  if (status === 'unknown') {
    return 'System operational state is unknown due to insufficient probe telemetry.';
  }

  // Healthy states
  if (verification === 'verified') {
    return 'All monitored components, workflows, data integrity constraints, and security policies are operational with full verification evidence.';
  }

  if (verification === 'partially_verified') {
    return 'Core infrastructure is operational; some monitored areas have limited verification evidence (e.g. unprobed external quotas).';
  }

  return 'Infrastructure reachability operational, but verification evidence is currently incomplete.';
}

/**
 * Helper to assemble a curated proof boundary catalog across portfolio monitoring layers.
 */
export function assembleProofBoundaries(
  components: ComponentHealth[] = [],
  workflows: WorkflowHealth[] = [],
  dataIntegrity?: DataIntegritySummary,
  security?: SecurityDashboardSummary
): ProofBoundaryItem[] {
  const boundaries: ProofBoundaryItem[] = [
    {
      id: 'pb-db-read',
      type: 'verified_fact',
      category: 'infrastructure',
      title: 'Database Read Reachability',
      description: 'Supabase PostgreSQL database connectivity and portfolio settings read path are verified.'
    },
    {
      id: 'pb-admin-auth',
      type: 'verified_fact',
      category: 'security',
      title: 'Admin Role Authorization',
      description: 'Logged-in user authorization is strictly verified against active admin records in public.admins.'
    },
    {
      id: 'pb-rls-read',
      type: 'verified_fact',
      category: 'security',
      title: 'Row Level Security Isolation',
      description: 'RLS policies prevent unauthorized reads on protected administrative and access request tables.'
    },
    {
      id: 'pb-telemetry-query',
      type: 'verified_fact',
      category: 'integrity',
      title: 'Visitor Telemetry Queryability',
      description: 'Visitor session tracking schemas and SQL functions are verified and readable.'
    },
    {
      id: 'pb-edge-gateway',
      type: 'verified_fact',
      category: 'workflow',
      title: 'Edge Function Gateway Routing',
      description: 'Supabase Edge Gateway preflight OPTIONS routes and webhook infrastructure are operational.'
    },
    {
      id: 'pb-email-quota',
      type: 'known_limitation',
      category: 'delivery',
      title: 'Email Provider API Quota Unprobed',
      description: 'Third-party email dispatch vendor API (Brevo) is not probed to protect quota and rate limits.'
    },
    {
      id: 'pb-access-delivery',
      type: 'known_limitation',
      category: 'delivery',
      title: 'Private Access Token Delivery',
      description: 'Access approval delivery is verified via logs; live tokens are not issued without pending requests.'
    },
    {
      id: 'pb-ad-blocker-drop',
      type: 'known_limitation',
      category: 'integrity',
      title: 'Client-Side Telemetry Drops',
      description: 'Browser ad-blocker drop rates cannot be measured from server-side database telemetry.'
    },
    {
      id: 'pb-batch-broadcast',
      type: 'known_limitation',
      category: 'delivery',
      title: 'Maintenance Batch Broadcast',
      description: 'Live batch email broadcast to real subscribers is reserved for actual maintenance events.'
    },
    {
      id: 'pb-security-pentest',
      type: 'known_limitation',
      category: 'security',
      title: 'Non-Destructive Security Boundary',
      description: 'Security audits perform safe read-only checks without executing intrusive penetration attacks.'
    }
  ];

  return boundaries;
}

/**
 * Pure function to aggregate Component, Workflow, Data Integrity, and Security health
 * into an authoritative, single-source-of-truth SystemHealthSummary.
 */
export function calculateSystemHealth(
  components: ComponentHealth[] = [],
  workflows: WorkflowHealth[] = [],
  siteModeOrIntegrity?: OperationalSiteMode | DataIntegritySummary,
  incidentsOrSecurity?: SystemIncident[] | SecurityDashboardSummary,
  dataIntegrity?: DataIntegritySummary,
  security?: SecurityDashboardSummary,
  categoryAvailability?: Record<string, 'available' | 'evaluation_failed'>
): SystemHealthSummary {
  const timestamp = new Date().toISOString();

  // Handle overloaded argument signatures
  let siteMode: OperationalSiteMode = 'public';
  let safeIncidents: SystemIncident[] = [];
  let effectiveIntegrity: DataIntegritySummary | undefined = dataIntegrity;
  let effectiveSecurity: SecurityDashboardSummary | undefined = security;
  let effectiveAvailability: Record<string, 'available' | 'evaluation_failed'> | undefined = categoryAvailability;

  for (const arg of [siteModeOrIntegrity, incidentsOrSecurity, dataIntegrity, security, categoryAvailability]) {
    if (typeof arg === 'string' && (arg === 'public' || arg === 'maintenance' || arg === 'private')) {
      siteMode = arg;
    } else if (Array.isArray(arg)) {
      safeIncidents = arg;
    } else if (arg && typeof arg === 'object') {
      if (
        'totalRecordsAudited' in arg ||
        'totalRecordsChecked' in arg ||
        'totalIssuesFound' in arg ||
        'healthyChecks' in arg ||
        'warningChecks' in arg ||
        ('categories' in arg && Array.isArray((arg as any).categories) && (arg as any).categories.some((c: any) => 'category' in c))
      ) {
        effectiveIntegrity = arg as DataIntegritySummary;
      } else if (
        'totalPoliciesAudited' in arg ||
        'passedChecks' in arg ||
        'degradedChecks' in arg ||
        'unknownChecks' in arg ||
        ('categories' in arg && Array.isArray((arg as any).categories) && (arg as any).categories.some((c: any) => 'categoryId' in c))
      ) {
        effectiveSecurity = arg as SecurityDashboardSummary;
      } else if ('components' in arg && typeof (arg as any).components === 'string') {
        effectiveAvailability = arg as Record<string, 'available' | 'evaluation_failed'>;
      }
    }
  }

  let healthyCount = 0;
  let degradedCount = 0;
  let downCount = 0;
  let unknownCount = 0;
  let totalChecksCount = 0;

  const allCheckStatuses: HealthStatus[] = [];
  const p0ComponentStatuses: HealthStatus[] = [];
  const p1ComponentStatuses: HealthStatus[] = [];

  for (const comp of components) {
    if (comp.checks && comp.checks.length > 0) {
      for (const check of comp.checks) {
        totalChecksCount++;
        allCheckStatuses.push(check.status);
        if (check.status === 'healthy') healthyCount++;
        else if (check.status === 'degraded') degradedCount++;
        else if (check.status === 'down') downCount++;
        else unknownCount++;

        const contract = SYSTEM_MONITOR_CONTRACTS[check.checkId];
        const checkCriticality = contract ? contract.criticality : comp.criticality;

        if (checkCriticality === 'p0_critical') {
          p0ComponentStatuses.push(check.status);
        } else if (checkCriticality === 'p1_high') {
          p1ComponentStatuses.push(check.status);
        }
      }
    } else {
      totalChecksCount++;
      allCheckStatuses.push(comp.status);
      if (comp.status === 'healthy') healthyCount++;
      else if (comp.status === 'degraded') degradedCount++;
      else if (comp.status === 'down') downCount++;
      else unknownCount++;

      if (comp.criticality === 'p0_critical') {
        p0ComponentStatuses.push(comp.status);
      } else if (comp.criticality === 'p1_high') {
        p1ComponentStatuses.push(comp.status);
      }
    }
  }

  // Process Workflow statuses
  const workflowStatuses: HealthStatus[] = workflows.map(w => w.status);

  // Collect all workflow stage statuses for verification coverage
  const allWorkflowStageStatuses: HealthStatus[] = [];
  for (const wf of workflows) {
    if (wf.stages && wf.stages.length > 0) {
      for (const s of wf.stages) {
        if (s.status) allWorkflowStageStatuses.push(s.status);
      }
    } else if (wf.triggerStatus || wf.functionStatus || wf.providerStatus || wf.deliveryStatus) {
      if (wf.triggerStatus) allWorkflowStageStatuses.push(wf.triggerStatus);
      if (wf.functionStatus) allWorkflowStageStatuses.push(wf.functionStatus);
      if (wf.providerStatus) allWorkflowStageStatuses.push(wf.providerStatus);
      if (wf.deliveryStatus) allWorkflowStageStatuses.push(wf.deliveryStatus);
    } else {
      allWorkflowStageStatuses.push(wf.status);
    }
  }

  // Collect Data Integrity check statuses if available
  const allIntegrityStatuses: HealthStatus[] = [];
  if (effectiveIntegrity && Array.isArray(effectiveIntegrity.categories) && effectiveIntegrity.categories.length > 0) {
    for (const cat of effectiveIntegrity.categories) {
      if (Array.isArray(cat.checks)) {
        for (const chk of cat.checks) {
          if (chk.status === 'healthy') allIntegrityStatuses.push('healthy');
          else if (chk.status === 'warning') allIntegrityStatuses.push('degraded');
          else if (chk.status === 'failed') allIntegrityStatuses.push('down');
          else allIntegrityStatuses.push('unknown');
        }
      }
    }
  } else if (effectiveIntegrity) {
    const hCount = (effectiveIntegrity as any).healthyCount ?? (effectiveIntegrity as any).healthyChecks ?? 0;
    const wCount = (effectiveIntegrity as any).warningCount ?? (effectiveIntegrity as any).warningChecks ?? 0;
    const fCount = (effectiveIntegrity as any).failedCount ?? (effectiveIntegrity as any).failedChecks ?? 0;
    const uCount = (effectiveIntegrity as any).notVerifiedChecks ?? (effectiveIntegrity as any).notVerifiedCount ?? 0;

    if (hCount + wCount + fCount + uCount > 0) {
      for (let i = 0; i < hCount; i++) allIntegrityStatuses.push('healthy');
      for (let i = 0; i < wCount; i++) allIntegrityStatuses.push('degraded');
      for (let i = 0; i < fCount; i++) allIntegrityStatuses.push('down');
      for (let i = 0; i < uCount; i++) allIntegrityStatuses.push('unknown');
    } else {
      if (effectiveIntegrity.overallStatus === 'healthy') allIntegrityStatuses.push('healthy');
      else if (effectiveIntegrity.overallStatus === 'degraded') allIntegrityStatuses.push('degraded');
      else if (effectiveIntegrity.overallStatus === 'down') allIntegrityStatuses.push('down');
      else allIntegrityStatuses.push('unknown');
    }
  }

  // Collect Security check statuses if available
  const allSecurityStatuses: HealthStatus[] = [];
  if (effectiveSecurity && Array.isArray(effectiveSecurity.categories) && effectiveSecurity.categories.length > 0) {
    for (const cat of effectiveSecurity.categories) {
      if (Array.isArray(cat.checks)) {
        for (const chk of cat.checks) {
          if (chk.status === 'healthy') allSecurityStatuses.push('healthy');
          else if (chk.status === 'degraded') allSecurityStatuses.push('degraded');
          else if (chk.status === 'failed') allSecurityStatuses.push('down');
          else allSecurityStatuses.push('unknown');
        }
      }
    }
  } else if (effectiveSecurity) {
    const hCount = effectiveSecurity.passedChecks || 0;
    const wCount = effectiveSecurity.degradedChecks || 0;
    const fCount = effectiveSecurity.failedChecks || 0;
    const uCount = effectiveSecurity.unknownChecks || 0;

    if (hCount + wCount + fCount + uCount > 0) {
      for (let i = 0; i < hCount; i++) allSecurityStatuses.push('healthy');
      for (let i = 0; i < wCount; i++) allSecurityStatuses.push('degraded');
      for (let i = 0; i < fCount; i++) allSecurityStatuses.push('down');
      for (let i = 0; i < uCount; i++) allSecurityStatuses.push('unknown');
    } else {
      if (effectiveSecurity.overallStatus === 'healthy') allSecurityStatuses.push('healthy');
      else if (effectiveSecurity.overallStatus === 'degraded') allSecurityStatuses.push('degraded');
      else if (effectiveSecurity.overallStatus === 'down') allSecurityStatuses.push('down');
      else allSecurityStatuses.push('unknown');
    }
  }

  // Deterministic Overall Status Evaluation (DOWN > DEGRADED > HEALTHY > UNKNOWN)
  let overallStatus: HealthStatus = 'healthy';

  // Rule 1: Any P0 Component DOWN => Overall DOWN
  if (p0ComponentStatuses.includes('down')) {
    overallStatus = 'down';
  }
  // Rule 2: Any P1 Component DOWN/DEGRADED, Workflow DOWN/DEGRADED, P0 DEGRADED, Security DOWN/DEGRADED, or Integrity FAILED/WARNING => Overall DEGRADED
  else if (
    p1ComponentStatuses.includes('down') ||
    p1ComponentStatuses.includes('degraded') ||
    workflowStatuses.includes('down') ||
    workflowStatuses.includes('degraded') ||
    p0ComponentStatuses.includes('degraded') ||
    (effectiveSecurity && (effectiveSecurity.overallStatus === 'down' || effectiveSecurity.overallStatus === 'degraded')) ||
    (effectiveIntegrity && (effectiveIntegrity.overallStatus === 'down' || effectiveIntegrity.overallStatus === 'degraded'))
  ) {
    overallStatus = 'degraded';
  }
  // Rule 3: All Checks UNKNOWN => Overall UNKNOWN
  else if (totalChecksCount > 0 && unknownCount === totalChecksCount) {
    overallStatus = 'unknown';
  }

  // Evaluate Overall Verification Status across all 4 layers
  const allEvaluatedStatuses = [
    ...allCheckStatuses,
    ...allWorkflowStageStatuses,
    ...allIntegrityStatuses,
    ...allSecurityStatuses
  ];
  const overallVerificationStatus: VerificationStatus = calculateVerificationStatus(allEvaluatedStatuses);

  // Verification Counts across Components
  let verifiedCount = 0;
  let partiallyVerifiedCount = 0;
  let notVerifiedCount = 0;

  for (const comp of components) {
    if (comp.verificationStatus === 'verified') verifiedCount++;
    else if (comp.verificationStatus === 'partially_verified') partiallyVerifiedCount++;
    else notVerifiedCount++;
  }

  // Calculate Active Incidents Metrics
  const activeIncidents = safeIncidents.filter(i => i.status === 'open' || i.status === 'acknowledged' || i.status === 'active');
  const activeIncidentsCount = activeIncidents.length;
  const criticalIncidentsCount = activeIncidents.filter(i => i.severity === 'critical' || i.severity === 'p0_critical').length;
  const highIncidentsCount = activeIncidents.filter(i => i.severity === 'high' || i.severity === 'p1_high').length;

  // Diagnostic Coverage
  const verifiedCheckCount = allEvaluatedStatuses.filter(s => s === 'healthy' || s === 'degraded' || s === 'down').length;
  const unverifiedCheckCount = allEvaluatedStatuses.filter(s => s === 'unknown').length;
  const diagnosticCoverage: DiagnosticCoverageSummary = {
    totalChecksEvaluated: allEvaluatedStatuses.length || totalChecksCount,
    healthyCount: allEvaluatedStatuses.filter(s => s === 'healthy').length,
    degradedCount: allEvaluatedStatuses.filter(s => s === 'degraded').length,
    downCount: allEvaluatedStatuses.filter(s => s === 'down').length,
    unknownCount: unverifiedCheckCount,
    verifiedCount: verifiedCheckCount,
    partiallyVerifiedCount,
    notVerifiedCount,
    coverageDescription: `${allEvaluatedStatuses.length} diagnostic checks evaluated across 4 system layers`
  };

  // Proof Boundaries & Limitations
  const proofBoundaries = assembleProofBoundaries(components, workflows, effectiveIntegrity, effectiveSecurity);
  const limitations = proofBoundaries.filter(pb => pb.type === 'known_limitation').map(pb => pb.description);

  // Summary Narrative
  const summaryNarrative = generateSystemSummaryNarrative(
    overallStatus,
    overallVerificationStatus,
    activeIncidentsCount > 0,
    activeIncidentsCount
  );

  return {
    overallStatus,
    overallVerificationStatus,
    siteMode,
    components,
    workflows,
    dataIntegrity: effectiveIntegrity,
    security: effectiveSecurity,
    incidents: safeIncidents,
    activeIncidentsCount,
    criticalIncidentsCount,
    highIncidentsCount,
    diagnosticCoverage,
    proofBoundaries,
    summaryNarrative,
    categoryAvailability: categoryAvailability || {
      components: 'available',
      workflows: 'available',
      dataIntegrity: effectiveIntegrity ? 'available' : 'evaluation_failed',
      security: effectiveSecurity ? 'available' : 'evaluation_failed'
    },
    limitations,
    lastEvaluatedAt: timestamp,
    totalChecksCount,
    healthyCount,
    degradedCount,
    downCount,
    unknownCount,
    verifiedCount,
    partiallyVerifiedCount,
    notVerifiedCount
  };
}

/**
 * Pure function to aggregate multiple IntegrityCheckResult objects into an IntegrityCategorySummary.
 */
export function calculateCategoryIntegritySummary(
  category: IntegrityCategory,
  categoryName: string,
  description: string,
  checks: IntegrityCheckResult[]
): IntegrityCategorySummary {
  const timestamp = new Date().toISOString();
  let totalRecords = 0;
  let totalIssues = 0;
  let healthyChecks = 0;
  let warningChecks = 0;
  let failedChecks = 0;
  let notVerifiedChecks = 0;

  const statuses: HealthStatus[] = [];
  const checkStatuses: HealthStatus[] = [];

  for (const chk of checks) {
    totalRecords += chk.recordsChecked || 0;
    totalIssues += chk.issuesFound || 0;

    if (chk.status === 'healthy') {
      healthyChecks++;
      statuses.push('healthy');
      checkStatuses.push('healthy');
    } else if (chk.status === 'warning') {
      warningChecks++;
      statuses.push('degraded');
      checkStatuses.push('degraded');
    } else if (chk.status === 'failed') {
      failedChecks++;
      statuses.push('down');
      checkStatuses.push('down');
    } else {
      notVerifiedChecks++;
      statuses.push('unknown');
      checkStatuses.push('unknown');
    }
  }

  const status = calculateWorkflowHealthStatus(statuses);
  const verificationStatus = calculateVerificationStatus(checkStatuses);

  return {
    category,
    categoryId: category,
    categoryName,
    description,
    status,
    verificationStatus,
    totalChecks: checks.length,
    healthyChecks,
    warningChecks,
    failedChecks,
    notVerifiedChecks,
    totalRecordsChecked: totalRecords,
    recordsChecked: totalRecords,
    totalIssuesFound: totalIssues,
    issuesFound: totalIssues,
    lastEvaluatedAt: timestamp,
    checks
  };
}

/**
 * Pure function to aggregate all IntegrityCategorySummary records into a top-level DataIntegritySummary.
 */
export function calculateDataIntegritySummary(
  categories: IntegrityCategorySummary[]
): DataIntegritySummary {
  const timestamp = new Date().toISOString();
  if (!categories || categories.length === 0) {
    return {
      overallStatus: 'healthy',
      overallVerificationStatus: 'not_verified',
      lastEvaluatedAt: timestamp,
      totalChecks: 0,
      healthyCount: 0,
      healthyChecks: 0,
      warningCount: 0,
      warningChecks: 0,
      failedCount: 0,
      failedChecks: 0,
      notVerifiedCount: 0,
      notVerifiedChecks: 0,
      totalRecordsAudited: 0,
      totalRecordsChecked: 0,
      totalIssuesFound: 0,
      categories: []
    };
  }

  let totalChecks = 0;
  let healthyCount = 0;
  let warningCount = 0;
  let failedCount = 0;
  let notVerifiedCount = 0;
  let totalRecordsAudited = 0;
  let totalIssuesFound = 0;

  const categoryStatuses: HealthStatus[] = [];
  const allCheckStatuses: HealthStatus[] = [];

  for (const cat of categories) {
    totalChecks += cat.totalChecks;
    healthyCount += cat.healthyChecks;
    warningCount += cat.warningChecks;
    failedCount += cat.failedChecks;
    notVerifiedCount += cat.notVerifiedChecks;
    totalRecordsAudited += cat.totalRecordsChecked;
    totalIssuesFound += cat.totalIssuesFound;

    categoryStatuses.push(cat.status);
    for (const chk of cat.checks) {
      if (chk.status === 'healthy') allCheckStatuses.push('healthy');
      else if (chk.status === 'warning') allCheckStatuses.push('degraded');
      else if (chk.status === 'failed') allCheckStatuses.push('down');
      else allCheckStatuses.push('unknown');
    }
  }

  const overallStatus = calculateWorkflowHealthStatus(categoryStatuses);
  const overallVerificationStatus = calculateVerificationStatus(allCheckStatuses);

  return {
    overallStatus,
    overallVerificationStatus,
    lastEvaluatedAt: timestamp,
    totalChecks,
    healthyCount,
    healthyChecks: healthyCount,
    warningCount,
    warningChecks: warningCount,
    failedCount,
    failedChecks: failedCount,
    notVerifiedCount,
    notVerifiedChecks: notVerifiedCount,
    totalRecordsAudited,
    totalRecordsChecked: totalRecordsAudited,
    totalIssuesFound,
    categories
  };
}

/**
 * ============================================================================
 * PHASE 6: SECURITY & AUTHORIZATION TYPE DEFINITIONS
 * ============================================================================
 */

/**
 * Execution status for an individual application security check.
 */
export type SecurityCheckStatus = 'healthy' | 'degraded' | 'failed' | 'unknown';

/**
 * Severity impact ranking for a detected security boundary anomaly.
 */
export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low';

/**
 * Strength and source of security evidence gathered.
 */
export type SecurityEvidenceType = 'direct' | 'indirect' | 'not_verified';

/**
 * 7 Defined Application Security Categories.
 */
export type SecurityCategory =
  | 'authentication'
  | 'admin_authorization'
  | 'database_access'
  | 'rls'
  | 'protected_actions'
  | 'session_security'
  | 'security_configuration';

/**
 * Diagnostic issue detail for a security boundary anomaly or non-compliance.
 */
export interface SecurityIssueDetail {
  issue: string;
  remediationHint: string;
  severity: SecuritySeverity;
  targetResource?: string;
  policyName?: string;
}

/**
 * Result of an individual security check verification.
 */
export interface SecurityCheckResult {
  checkId: string;
  category: SecurityCategory;
  name: string;
  status: SecurityCheckStatus;
  verificationStatus: VerificationStatus;
  severity: SecuritySeverity;
  evidenceType: SecurityEvidenceType;
  targetResource: string;
  description: string;
  operation: string;
  expected: string;
  observed: string;
  evidence: string;
  proves: string[];
  doesNotProve: string[];
  lastEvaluatedAt: string;
  durationMs: number;
  limitations: string[];
  sanitizedError?: string;
  diagnosticDetails?: SecurityIssueDetail;
}

/**
 * Summary rollup for an entire Security Category.
 */
export interface SecurityCategorySummary {
  categoryId: SecurityCategory;
  categoryName: string;
  description: string;
  status: HealthStatus;
  verificationStatus: VerificationStatus;
  totalChecks: number;
  passedChecks: number;
  degradedChecks: number;
  failedChecks: number;
  unknownChecks: number;
  lastEvaluatedAt: string;
  checks: SecurityCheckResult[];
}

/**
 * Overall Security & Authorization Dashboard Summary.
 */
export interface SecurityDashboardSummary {
  overallStatus: HealthStatus;
  overallVerificationStatus: VerificationStatus;
  lastEvaluatedAt: string;
  totalChecks: number;
  passedChecks: number;
  degradedChecks: number;
  failedChecks: number;
  unknownChecks: number;
  categories: SecurityCategorySummary[];
}

/**
 * Pure helper function to compute roll-up summary for a single Security category.
 */
export function calculateCategorySecuritySummary(
  categoryId: SecurityCategory,
  categoryName: string,
  description: string,
  checks: SecurityCheckResult[],
  timestamp: string = new Date().toISOString()
): SecurityCategorySummary {
  if (!checks || checks.length === 0) {
    return {
      categoryId,
      categoryName,
      description,
      status: 'healthy',
      verificationStatus: 'not_verified',
      totalChecks: 0,
      passedChecks: 0,
      degradedChecks: 0,
      failedChecks: 0,
      unknownChecks: 0,
      lastEvaluatedAt: timestamp,
      checks: []
    };
  }

  let passedChecks = 0;
  let degradedChecks = 0;
  let failedChecks = 0;
  let unknownChecks = 0;

  const healthStatuses: HealthStatus[] = [];

  for (const chk of checks) {
    if (chk.status === 'healthy') {
      passedChecks++;
      healthStatuses.push('healthy');
    } else if (chk.status === 'degraded') {
      degradedChecks++;
      healthStatuses.push('degraded');
    } else if (chk.status === 'failed') {
      failedChecks++;
      healthStatuses.push('down');
    } else {
      unknownChecks++;
      healthStatuses.push('unknown');
    }
  }

  const status = calculateWorkflowHealthStatus(healthStatuses);
  const verificationStatus = calculateVerificationStatus(healthStatuses);

  return {
    categoryId,
    categoryName,
    description,
    status,
    verificationStatus,
    totalChecks: checks.length,
    passedChecks,
    degradedChecks,
    failedChecks,
    unknownChecks,
    lastEvaluatedAt: timestamp,
    checks
  };
}

/**
 * Pure helper function to compute roll-up summary across all 7 Security categories.
 */
export function calculateSecurityDashboardSummary(
  categories: SecurityCategorySummary[],
  timestamp: string = new Date().toISOString()
): SecurityDashboardSummary {
  if (!categories || categories.length === 0) {
    return {
      overallStatus: 'healthy',
      overallVerificationStatus: 'not_verified',
      lastEvaluatedAt: timestamp,
      totalChecks: 0,
      passedChecks: 0,
      degradedChecks: 0,
      failedChecks: 0,
      unknownChecks: 0,
      categories: []
    };
  }

  let totalChecks = 0;
  let passedChecks = 0;
  let degradedChecks = 0;
  let failedChecks = 0;
  let unknownChecks = 0;

  const categoryStatuses: HealthStatus[] = [];
  const allCheckStatuses: HealthStatus[] = [];

  for (const cat of categories) {
    totalChecks += cat.totalChecks;
    passedChecks += cat.passedChecks;
    degradedChecks += cat.degradedChecks;
    failedChecks += cat.failedChecks;
    unknownChecks += cat.unknownChecks;

    categoryStatuses.push(cat.status);
    for (const chk of cat.checks) {
      if (chk.status === 'healthy') allCheckStatuses.push('healthy');
      else if (chk.status === 'degraded') allCheckStatuses.push('degraded');
      else if (chk.status === 'failed') allCheckStatuses.push('down');
      else allCheckStatuses.push('unknown');
    }
  }

  const overallStatus = calculateWorkflowHealthStatus(categoryStatuses);
  const overallVerificationStatus = calculateVerificationStatus(allCheckStatuses);

  return {
    overallStatus,
    overallVerificationStatus,
    lastEvaluatedAt: timestamp,
    totalChecks,
    passedChecks,
    degradedChecks,
    failedChecks,
    unknownChecks,
    categories
  };
}

