/* src/admin/types/systemMonitor.ts */

/**
 * ============================================================================
 * ADMIN DASHBOARD — SYSTEM MONITOR DOMAIN CONTRACTS
 * Source of Truth: Phase 0.5.1 Locked Monitoring Truth Model
 * ============================================================================
 */

/**
 * Standardized health status representation for components, workflows, and system evaluation.
 */
export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

/**
 * Formal evidence confidence levels based on the locked Phase 0.5.1 evidence hierarchy.
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
  proves: string[];
  doesNotProve: string[];
  affectedWorkflows: string[];
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
  evidenceType: EvidenceLevel;
  criticality: CriticalityLevel;
  checks: HealthCheckResult[];
  lastEvaluatedAt: string;
}

/**
 * Aggregated health status of an end-to-end user process.
 */
export interface WorkflowHealth {
  workflowName: string;
  status: HealthStatus;
  evidenceType: EvidenceLevel;
  triggerStatus: HealthStatus;
  functionStatus: HealthStatus;
  providerStatus: HealthStatus;
  deliveryStatus: HealthStatus;
  lastEvaluatedAt: string;
  notes?: string;
}

/**
 * In-memory incident tracking record representing an operational issue lifecycle.
 */
export interface SystemIncident {
  id: string;
  targetComponent: string;
  severity: CriticalityLevel;
  status: 'active' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
  sanitizedSummary: string;
  affectedWorkflows: string[];
}

/**
 * Overall aggregated system health representation.
 */
export interface SystemHealthSummary {
  overallStatus: HealthStatus;
  siteMode: OperationalSiteMode;
  components: ComponentHealth[];
  workflows: WorkflowHealth[];
  incidents: SystemIncident[];
  lastEvaluatedAt: string;
  totalChecksCount: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  unknownCount: number;
}

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
    proves: ['Current configured operational site mode (public, maintenance, private)'],
    doesNotProve: ['Public CDN edge server reachability'],
    affectedWorkflows: ['Global Portfolio Access Workflow']
  }
};

/**
 * ============================================================================
 * PURE HELPER UTILITIES
 * Non-mutating logic for status ranking, error sanitization, and health aggregation
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
    .replace(/postgres:\/\/[^\s]+/gi, 'postgres://[REDACTED_URL]');

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
 * Pure function to aggregate Component and Workflow health into an overall SystemHealthSummary.
 */
export function calculateSystemHealth(
  components: ComponentHealth[],
  workflows: WorkflowHealth[] = [],
  siteMode: OperationalSiteMode = 'public',
  incidents: SystemIncident[] = []
): SystemHealthSummary {
  const timestamp = new Date().toISOString();

  let healthyCount = 0;
  let degradedCount = 0;
  let downCount = 0;
  let unknownCount = 0;
  let totalChecksCount = 0;

  // Process Component statuses
  const p0ComponentStatuses: HealthStatus[] = [];
  const p1ComponentStatuses: HealthStatus[] = [];

  for (const comp of components) {
    for (const check of comp.checks) {
      totalChecksCount++;
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
  }

  // Process Workflow statuses
  const workflowStatuses: HealthStatus[] = workflows.map(w => w.status);

  // Evaluate Overall System Status
  let overallStatus: HealthStatus = 'healthy';

  // Rule 1: Any P0 Component DOWN => Overall DOWN
  if (p0ComponentStatuses.includes('down')) {
    overallStatus = 'down';
  }
  // Rule 2: Any P1 Component DOWN/DEGRADED or Workflow DOWN => Overall DEGRADED
  else if (
    p1ComponentStatuses.includes('down') ||
    p1ComponentStatuses.includes('degraded') ||
    workflowStatuses.includes('down') ||
    workflowStatuses.includes('degraded') ||
    p0ComponentStatuses.includes('degraded')
  ) {
    overallStatus = 'degraded';
  }
  // Rule 3: All Checks UNKNOWN => Overall UNKNOWN
  else if (totalChecksCount > 0 && unknownCount === totalChecksCount) {
    overallStatus = 'unknown';
  }

  return {
    overallStatus,
    siteMode,
    components,
    workflows,
    incidents,
    lastEvaluatedAt: timestamp,
    totalChecksCount,
    healthyCount,
    degradedCount,
    downCount,
    unknownCount
  };
}
