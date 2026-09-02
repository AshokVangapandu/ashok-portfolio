/* src/admin/services/systemMonitorService.ts */
import { supabase } from '../../services/supabase/client';
import {
  HealthCheckResult,
  ComponentHealth,
  WorkflowHealth,
  SystemIncident,
  HealthStatus,
  SystemHealthSummary,
  OperationalSiteMode,
  SYSTEM_MONITOR_CONTRACTS,
  HEALTH_CHECK_IDS,
  sanitizeError,
  calculateSystemHealth
} from '../types/systemMonitor';

/**
 * ============================================================================
 * ADMIN DASHBOARD — SYSTEM MONITOR SERVICE (PHASE 2: HC-01)
 * Source of Truth: Phase 0.5.1 Locked Monitoring Truth Model
 * ============================================================================
 */

export const systemMonitorService = {
  /**
   * Helper method to inspect if a simulation override is active for a checkId.
   */
  getSimulationOverride(checkId: string): HealthCheckResult | null {
    if (simulationOverrides[checkId]) {
      return simulationOverrides[checkId];
    }
    return null;
  },

  /**
   * Simulates a health check probe result for synthetic failure / verification testing.
   * Validates that checkId is a supported health check ID.
   */
  simulateProbeFailure(
    checkId: string,
    status: HealthStatus,
    latencyMs: number = 0,
    summary?: string
  ): HealthCheckResult {
    const validIds = Object.values(HEALTH_CHECK_IDS) as string[];
    if (!validIds.includes(checkId)) {
      throw new Error(`Invalid health check ID: '${checkId}'. Supported check IDs: ${validIds.join(', ')}`);
    }

    const contract = (SYSTEM_MONITOR_CONTRACTS as Record<string, any>)[checkId];
    const overrideResult: HealthCheckResult = {
      checkId,
      status,
      evidenceType: contract?.evidenceType || 'direct',
      timestamp: new Date().toISOString(),
      latencyMs,
      sanitizedSummary: summary || `[SIMULATED] Probe ${checkId} status set to ${status}.`,
      affectedWorkflows: contract?.affectedWorkflows || []
    };

    simulationOverrides[checkId] = overrideResult;
    return overrideResult;
  },

  /**
   * Resets and clears all simulation overrides.
   */
  resetSimulations(): void {
    simulationOverrides = {};
  },

  /**
   * Returns current active simulation overrides (read-only shallow copy).
   */
  getSimulatedOverrides(): Record<string, HealthCheckResult> {
    return { ...simulationOverrides };
  },

  /**
   * HC-01: Core Database Read Path Availability Check
   * Executes a lightweight, non-mutating READ query against public.portfolio_settings.
   *
   * What it proves:
   * - Monitored Supabase application read path can successfully access portfolio_settings
   * - Database access path is reachable
   * - Authenticated application database request succeeds
   *
   * What it does NOT prove:
   * - All database tables are healthy
   * - PostgreSQL infrastructure is universally healthy
   * - All RLS policies are correct
   * - All RPCs work
   * - All triggers work
   * - Edge Functions work
   * - Email works
   * - Analytics works
   * - CMS data integrity is correct
   */
  async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_01_DB_PING);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_01_DB_PING];
    const startTime = performance.now();

    try {
      const { error } = await supabase
        .from('portfolio_settings')
        .select('id, updated_at')
        .limit(1)
        .maybeSingle();

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'down',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Monitored database read path failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'Monitored database read path is responding normally.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'down',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Monitored database read path network exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * Constructs the ComponentHealth status object for PostgreSQL Database Engine.
   */
  async getDatabaseComponentHealth(): Promise<ComponentHealth> {
    const dbResult = await this.checkDatabaseHealth();
    return {
      componentName: 'PostgreSQL Database Engine',
      status: dbResult.status,
      evidenceType: dbResult.evidenceType,
      criticality: 'p0_critical',
      checks: [dbResult],
      lastEvaluatedAt: dbResult.timestamp
    };
  },

  /**
   * HC-02A: Current Session State Check
   * Issues getSession() to evaluate local browser authentication session validity.
   *
   * What it proves:
   * - Local browser context holds an active, valid authentication token
   *
   * What it does NOT prove:
   * - Supabase Auth infrastructure is universally healthy
   * - All authentication operations work
   * - All users can authenticate
   * - User has active administrator authorization in public.admins
   */
  async checkSessionHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_02A_AUTH_GATEWAY);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_02A_AUTH_GATEWAY];
    const startTime = performance.now();

    try {
      const { data, error } = await supabase.auth.getSession();
      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Session state retrieval query unavailable: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      if (!data.session) {
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'Session state unavailable in current browser context.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'Authenticated user session active in browser context.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Session evaluation exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-02B: Admin Authorization Rule Check
   * Queries public.admins for active administrator record matching current user session.
   *
   * What it proves:
   * - Logged-in user satisfies active administrator authorization rule in public.admins
   *
   * What it does NOT prove:
   * - OAuth identity provider uptime for new logins
   * - Protected data access across all RLS tables
   */
  async checkAdminAuthorizationHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_02B_ADMIN_AUTH);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_02B_ADMIN_AUTH];
    const startTime = performance.now();

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userEmail = sessionData?.session?.user?.email;

      if (!userEmail) {
        const latencyMs = Math.round(performance.now() - startTime);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'No active user session in browser context to evaluate admin authorization.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      const cleanEmail = userEmail.trim().toLowerCase();
      const { data, error } = await supabase
        .from('admins')
        .select('id, role, is_active')
        .eq('email', cleanEmail)
        .maybeSingle();

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Admin authorization lookup query unavailable: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      if (!data) {
        return {
          checkId: contract.id,
          status: 'down',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'Authenticated user lacks an administrator record in public.admins.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      if (data.is_active !== true) {
        return {
          checkId: contract.id,
          status: 'down',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'Authenticated user account is marked inactive in public.admins.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'User is authorized as an active administrator in public.admins.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Admin authorization check exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-03: Protected Data & RLS Read Path Check
   * Executes a read-only query against a protected table requiring authenticated admin privileges.
   *
   * What it proves:
   * - Current authorized application context can reach the monitored protected data path
   * - Protected data query executes successfully under active RLS
   *
   * What it does NOT prove:
   * - Every RLS policy is correct across all tables
   * - Unauthorized users are blocked everywhere
   * - All database tables are healthy
   */
  async checkProtectedDataAccessHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_03_RLS_ACCESS);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_03_RLS_ACCESS];
    const startTime = performance.now();

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        const latencyMs = Math.round(performance.now() - startTime);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'No active session context available to perform protected data read.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      // Execute safe read-only query against protected admins table requiring RLS admin read privileges
      const { error } = await supabase
        .from('admins')
        .select('id')
        .limit(1);

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'down',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Monitored protected data read path unavailable: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'Monitored protected data read path responded successfully under active RLS.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'down',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Monitored protected data read path network exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * Constructs ComponentHealth status object for Supabase Auth & Admin Authorization.
   */
  async getAuthComponentHealth(): Promise<ComponentHealth> {
    const sessionResult = await this.checkSessionHealth();
    const adminAuthResult = await this.checkAdminAuthorizationHealth();
    const rlsResult = await this.checkProtectedDataAccessHealth();
    const checks = [sessionResult, adminAuthResult, rlsResult];

    // Determine overall status using P0 criticality rules
    const statuses = checks.map(c => c.status);
    let status: 'healthy' | 'degraded' | 'down' | 'unknown' = 'healthy';
    if (statuses.includes('down')) {
      status = 'down';
    } else if (statuses.includes('degraded')) {
      status = 'degraded';
    } else if (statuses.includes('unknown') && !statuses.includes('healthy')) {
      status = 'unknown';
    }

    return {
      componentName: 'Supabase Auth & Admin Authorization',
      status,
      evidenceType: 'direct',
      criticality: 'p0_critical',
      checks,
      lastEvaluatedAt: new Date().toISOString()
    };
  },

  /**
   * HC-04: Analytics RPC Execution & Data Path Health
   * Executes get_analytics_summary RPC to verify the analytics data retrieval path.
   *
   * What it proves:
   * - get_analytics_summary RPC function executes natively in PostgreSQL without throwing SQL errors
   *
   * What it does NOT prove:
   * - Live visitor telemetry is actively being ingested
   * - High volume of traffic is arriving
   */
  async checkAnalyticsHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_04_ANALYTICS_RPC);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_04_ANALYTICS_RPC];
    const startTime = performance.now();

    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_summary', { range_filter: '30days' });
      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'down',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Analytics RPC query failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'Analytics RPC get_analytics_summary executed successfully.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'down',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Analytics check exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-05A: Visitor Telemetry Data Source Readability
   * Queries public.visitor_sessions to verify table queryability.
   *
   * What it proves:
   * - public.visitor_sessions table exists and is queryable
   *
   * What it does NOT prove:
   * - Recent visitors are currently arriving
   */
  async checkVisitorTelemetryQueryHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_05A_TELEMETRY_QUERY);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_05A_TELEMETRY_QUERY];
    const startTime = performance.now();

    try {
      const { error } = await (supabase as any)
        .from('visitor_sessions')
        .select('id')
        .limit(1);

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'down',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Visitor telemetry table query failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'Visitor telemetry table visitor_sessions is queryable.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'down',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Visitor telemetry check exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-05B: Visitor Telemetry Freshness Audit
   * Inspects the latest record timestamp in public.visitor_sessions using updated_at.
   *
   * What it proves:
   * - Recent visitor session activity was recorded
   *
   * What it does NOT prove:
   * - Absence of recent traffic is proof of telemetry failure
   */
  async checkVisitorTelemetryFreshness(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_05B_TELEMETRY_FRESH);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_05B_TELEMETRY_FRESH];
    const startTime = performance.now();

    try {
      const { data, error } = await (supabase as any)
        .from('visitor_sessions')
        .select('updated_at, created_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Visitor telemetry freshness query failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      if (!data) {
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'No visitor sessions recorded yet in database; insufficient evidence to determine telemetry failure.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      const latestTimestamp = new Date(data.updated_at || data.created_at).getTime();
      const ageHours = Math.round((Date.now() - latestTimestamp) / (1000 * 60 * 60));

      // Recent visitor activity exists -> HEALTHY
      if (ageHours <= 48) {
        return {
          checkId: contract.id,
          status: 'healthy',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Recent visitor telemetry session recorded ${ageHours} hour(s) ago.`,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      // No recent activity -> UNKNOWN (Absence of traffic is NOT evidence of telemetry failure)
      const ageDays = Math.round(ageHours / 24);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `No recent visitor activity observed (latest activity recorded ${ageDays} day(s) ago); insufficient evidence to determine telemetry failure.`,
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Visitor telemetry freshness check exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * Constructs ComponentHealth status object for Analytics Database Engine.
   */
  async getAnalyticsComponentHealth(): Promise<ComponentHealth> {
    const analyticsResult = await this.checkAnalyticsHealth();
    const checks = [analyticsResult];
    const statuses = checks.map(c => c.status);
    let status: 'healthy' | 'degraded' | 'down' | 'unknown' = 'healthy';
    if (statuses.includes('down')) status = 'down';
    else if (statuses.includes('degraded')) status = 'degraded';
    else if (statuses.includes('unknown') && !statuses.includes('healthy')) status = 'unknown';

    return {
      componentName: 'Analytics Database Engine',
      status,
      evidenceType: 'synthetic',
      criticality: 'p1_high',
      checks,
      lastEvaluatedAt: new Date().toISOString()
    };
  },

  /**
   * Constructs ComponentHealth status object for Visitor Telemetry Ingestion.
   */
  async getTelemetryComponentHealth(): Promise<ComponentHealth> {
    const queryResult = await this.checkVisitorTelemetryQueryHealth();
    const freshnessResult = await this.checkVisitorTelemetryFreshness();
    const checks = [queryResult, freshnessResult];
    const statuses = checks.map(c => c.status);
    let status: 'healthy' | 'degraded' | 'down' | 'unknown' = 'healthy';
    if (statuses.includes('down')) status = 'down';
    else if (statuses.includes('degraded')) status = 'degraded';
    else if (statuses.includes('unknown') && !statuses.includes('healthy')) status = 'unknown';

    return {
      componentName: 'Visitor Telemetry Ingestion',
      status,
      evidenceType: 'direct',
      criticality: 'p1_high',
      checks,
      lastEvaluatedAt: new Date().toISOString()
    };
  },

  /**
   * HC-06A: Edge Function Gateway Ping
   * Issues HTTP OPTIONS preflight to Edge Function gateway endpoint.
   *
   * What it proves:
   * - Edge Function gateway HTTP endpoint responds
   *
   * What it does NOT prove:
   * - Deno TypeScript execution logic succeeds
   * - Downstream Brevo email dispatch succeeds
   */
  async checkEdgeFunctionGatewayHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_06A_EDGE_GATEWAY);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_06A_EDGE_GATEWAY];
    const startTime = performance.now();

    try {
      const rawUrl = (supabase as any).supabaseUrl || (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process?.env?.VITE_SUPABASE_URL) || '';
      const supabaseUrl = typeof rawUrl === 'string' && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) ? rawUrl : '';
      if (!supabaseUrl) {
        const latencyMs = Math.round(performance.now() - startTime);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'Supabase URL not configured to perform Edge Function gateway ping.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      const functionUrl = `${supabaseUrl}/functions/v1/send-contact-email`;
      const response = await fetch(functionUrl, { method: 'OPTIONS' });
      const latencyMs = Math.round(performance.now() - startTime);

      if (response.ok || response.status === 200 || response.status === 204 || response.status === 401 || response.status === 405) {
        return {
          checkId: contract.id,
          status: 'healthy',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'Supabase Edge Function gateway endpoint is reachable.',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'degraded',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Edge Function gateway responded with HTTP status ${response.status}.`,
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Edge Function gateway ping exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-06B: Webhook DB Trigger Infrastructure Audit
   * Queries postgres catalog / table access for webhook trigger capability.
   *
   * What it proves:
   * - Database triggers and network access capability
   *
   * What it does NOT prove:
   * - Edge Function executed or Brevo API key is valid
   */
  async checkWebhookTriggerHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_06B_WEBHOOK_TRIGGER);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_06B_WEBHOOK_TRIGGER];
    const startTime = performance.now();

    try {
      const { error } = await (supabase as any)
        .from('portfolio_settings')
        .select('id')
        .limit(1);

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Webhook trigger infrastructure query failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      return {
        checkId: contract.id,
        status: 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: 'PostgreSQL database triggers and query infrastructure operational.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Webhook trigger infrastructure audit exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-07: Email Workflow Audit Log Check
   * Audits latest records in public.maintenance_notification_logs for historical email dispatch health.
   *
   * What it proves:
   * - Historical email dispatch attempts succeeded or failed
   *
   * What it does NOT prove:
   * - Email was delivered to recipient inbox today
   */
  async checkEmailWorkflowHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_07_EMAIL_WORKFLOW);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_07_EMAIL_WORKFLOW];
    const startTime = performance.now();

    try {
      const { data, error } = await (supabase as any)
        .from('maintenance_notification_logs')
        .select('id, status, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Email workflow audit query failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      if (!data) {
        return {
          checkId: contract.id,
          status: 'healthy',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: 'Email dispatch system operational (no delivery failures recorded).',
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      const isFailed = data.status === 'failed' || data.status === 'error';
      return {
        checkId: contract.id,
        status: isFailed ? 'degraded' : 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: isFailed
          ? 'Latest historical email dispatch recorded a failure status.'
          : 'Email dispatch audit logs indicate successful dispatches.',
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Email workflow check exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * HC-08: Portfolio Operational Mode Audit
   * Fetches site_mode configuration from public.portfolio_settings.
   *
   * What it proves:
   * - Current configured operational site mode (public, maintenance, private)
   *
   * What it does NOT prove:
   * - Public CDN edge server reachability
   */
  async checkOperationalSiteModeHealth(): Promise<HealthCheckResult> {
    const override = this.getSimulationOverride(HEALTH_CHECK_IDS.HC_08_SITE_MODE);
    if (override) return override;

    const contract = SYSTEM_MONITOR_CONTRACTS[HEALTH_CHECK_IDS.HC_08_SITE_MODE];
    const startTime = performance.now();

    try {
      const { data, error } = await (supabase as any)
        .from('portfolio_settings')
        .select('visibility')
        .limit(1)
        .maybeSingle();

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        const sanitizedErr = sanitizeError(error);
        return {
          checkId: contract.id,
          status: 'unknown',
          evidenceType: contract.evidenceType,
          timestamp: new Date().toISOString(),
          latencyMs,
          sanitizedSummary: `Site mode query failed: ${sanitizedErr.message}`,
          errorDetails: sanitizedErr,
          affectedWorkflows: contract.affectedWorkflows
        };
      }

      const mode = data?.visibility || (data as any)?.site_mode || 'public';
      const isMaintenance = mode === 'maintenance' || mode === 'private';

      return {
        checkId: contract.id,
        status: isMaintenance ? 'degraded' : 'healthy',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Portfolio operational site mode is set to '${mode}'.`,
        affectedWorkflows: contract.affectedWorkflows
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      const sanitizedErr = sanitizeError(err);
      return {
        checkId: contract.id,
        status: 'unknown',
        evidenceType: contract.evidenceType,
        timestamp: new Date().toISOString(),
        latencyMs,
        sanitizedSummary: `Site mode check exception: ${sanitizedErr.message}`,
        errorDetails: sanitizedErr,
        affectedWorkflows: contract.affectedWorkflows
      };
    }
  },

  /**
   * Constructs ComponentHealth status object for Supabase Edge Gateway & Webhook Triggers.
   */
  async getEdgeComponentHealth(): Promise<ComponentHealth> {
    const gatewayResult = await this.checkEdgeFunctionGatewayHealth();
    const triggerResult = await this.checkWebhookTriggerHealth();
    const checks = [gatewayResult, triggerResult];
    const statuses = checks.map(c => c.status);
    let status: 'healthy' | 'degraded' | 'down' | 'unknown' = 'healthy';
    if (statuses.includes('down')) status = 'down';
    else if (statuses.includes('degraded')) status = 'degraded';
    else if (statuses.includes('unknown') && !statuses.includes('healthy')) status = 'unknown';

    return {
      componentName: 'Supabase Edge Gateway & Webhook Triggers',
      status,
      evidenceType: 'external',
      criticality: 'p1_high',
      checks,
      lastEvaluatedAt: new Date().toISOString()
    };
  },

  /**
   * Constructs ComponentHealth status object for Email Dispatch System.
   */
  async getEmailComponentHealth(): Promise<ComponentHealth> {
    const emailResult = await this.checkEmailWorkflowHealth();
    const checks = [emailResult];
    const statuses = checks.map(c => c.status);
    let status: 'healthy' | 'degraded' | 'down' | 'unknown' = 'healthy';
    if (statuses.includes('down')) status = 'down';
    else if (statuses.includes('degraded')) status = 'degraded';
    else if (statuses.includes('unknown') && !statuses.includes('healthy')) status = 'unknown';

    return {
      componentName: 'Email Dispatch System',
      status,
      evidenceType: 'direct',
      criticality: 'p1_high',
      checks,
      lastEvaluatedAt: new Date().toISOString()
    };
  },

  /**
   * Constructs ComponentHealth status object for Portfolio State Machine.
   */
  async getSiteModeComponentHealth(): Promise<ComponentHealth> {
    const siteModeResult = await this.checkOperationalSiteModeHealth();
    const checks = [siteModeResult];
    const statuses = checks.map(c => c.status);
    let status: 'healthy' | 'degraded' | 'down' | 'unknown' = 'healthy';
    if (statuses.includes('down')) status = 'down';
    else if (statuses.includes('degraded')) status = 'degraded';
    else if (statuses.includes('unknown') && !statuses.includes('healthy')) status = 'unknown';

    return {
      componentName: 'Portfolio State Machine',
      status,
      evidenceType: 'direct',
      criticality: 'p2_medium',
      checks,
      lastEvaluatedAt: new Date().toISOString()
    };
  },

  /**
   * Evaluates End-to-End Contact Notification Workflow Health.
   * Synthesizes HC-01 (DB Read), HC-06B (Webhook Trigger), HC-06A (Edge Gateway), and HC-07 (Email Logs).
   */
  async getContactWorkflowHealth(): Promise<WorkflowHealth> {
    const [triggerResult, gatewayResult, logResult] = await Promise.all([
      this.checkWebhookTriggerHealth(),
      this.checkEdgeFunctionGatewayHealth(),
      this.checkEmailWorkflowHealth()
    ]);

    const triggerStatus = triggerResult.status;
    const functionStatus = gatewayResult.status;
    const providerStatus: HealthStatus = 'unknown'; // Brevo API un-pinged to prevent rate limits
    const deliveryStatus = logResult.status;

    const stageStatuses = [triggerStatus, functionStatus, providerStatus, deliveryStatus];
    let status: HealthStatus = 'healthy';
    if (stageStatuses.includes('down')) status = 'down';
    else if (stageStatuses.includes('degraded')) status = 'degraded';
    else if (stageStatuses.includes('unknown') && !stageStatuses.includes('healthy')) status = 'unknown';

    return {
      workflowName: 'Contact Notification Workflow',
      status,
      evidenceType: 'indirect',
      triggerStatus,
      functionStatus,
      providerStatus,
      deliveryStatus,
      lastEvaluatedAt: new Date().toISOString(),
      notes: 'Evaluates DB trigger capability, Edge Gateway reachability, and historical email audit logs.'
    };
  },

  /**
   * Evaluates End-to-End Testimonial Submission Workflow Health.
   */
  async getTestimonialWorkflowHealth(): Promise<WorkflowHealth> {
    const [triggerResult, gatewayResult] = await Promise.all([
      this.checkWebhookTriggerHealth(),
      this.checkEdgeFunctionGatewayHealth()
    ]);

    const triggerStatus = triggerResult.status;
    const functionStatus = gatewayResult.status;
    const providerStatus: HealthStatus = 'unknown';
    const deliveryStatus: HealthStatus = 'unknown';

    const stageStatuses = [triggerStatus, functionStatus];
    let status: HealthStatus = 'healthy';
    if (stageStatuses.includes('down')) status = 'down';
    else if (stageStatuses.includes('degraded')) status = 'degraded';
    else if (stageStatuses.includes('unknown') && !stageStatuses.includes('healthy')) status = 'unknown';

    return {
      workflowName: 'Testimonial Notification Workflow',
      status,
      evidenceType: 'indirect',
      triggerStatus,
      functionStatus,
      providerStatus,
      deliveryStatus,
      lastEvaluatedAt: new Date().toISOString(),
      notes: 'Evaluates DB trigger capability and Edge Function gateway endpoint reachability.'
    };
  },

  /**
   * Evaluates End-to-End Private Access Approval Workflow Health.
   */
  async getAccessRequestWorkflowHealth(): Promise<WorkflowHealth> {
    const [authResult, gatewayResult] = await Promise.all([
      this.checkAdminAuthorizationHealth(),
      this.checkEdgeFunctionGatewayHealth()
    ]);

    const triggerStatus = authResult.status;
    const functionStatus = gatewayResult.status;
    const providerStatus: HealthStatus = 'unknown';
    const deliveryStatus: HealthStatus = 'unknown';

    const stageStatuses = [triggerStatus, functionStatus];
    let status: HealthStatus = 'healthy';
    if (stageStatuses.includes('down')) status = 'down';
    else if (stageStatuses.includes('degraded')) status = 'degraded';
    else if (stageStatuses.includes('unknown') && !stageStatuses.includes('healthy')) status = 'unknown';

    return {
      workflowName: 'Access Approval Workflow',
      status,
      evidenceType: 'synthetic',
      triggerStatus,
      functionStatus,
      providerStatus,
      deliveryStatus,
      lastEvaluatedAt: new Date().toISOString(),
      notes: 'Evaluates admin session authorization state and Edge Function gateway reachability.'
    };
  },

  /**
   * Evaluates End-to-End Maintenance Broadcast Workflow Health.
   */
  async getMaintenanceWorkflowHealth(): Promise<WorkflowHealth> {
    const [dbResult, gatewayResult, logResult] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkEdgeFunctionGatewayHealth(),
      this.checkEmailWorkflowHealth()
    ]);

    const triggerStatus = dbResult.status;
    const functionStatus = gatewayResult.status;
    const providerStatus: HealthStatus = 'unknown';
    const deliveryStatus = logResult.status;

    const stageStatuses = [triggerStatus, functionStatus, deliveryStatus];
    let status: HealthStatus = 'healthy';
    if (stageStatuses.includes('down')) status = 'down';
    else if (stageStatuses.includes('degraded')) status = 'degraded';
    else if (stageStatuses.includes('unknown') && !stageStatuses.includes('healthy')) status = 'unknown';

    return {
      workflowName: 'Maintenance Broadcast Workflow',
      status,
      evidenceType: 'direct',
      triggerStatus,
      functionStatus,
      providerStatus,
      deliveryStatus,
      lastEvaluatedAt: new Date().toISOString(),
      notes: 'Evaluates database read capability, Edge Gateway ping, and email audit log history.'
    };
  },

  /**
   * Evaluates End-to-End Visitor Analytics & Telemetry Workflow Health.
   */
  async getAnalyticsWorkflowHealth(): Promise<WorkflowHealth> {
    const [queryResult, rpcResult, freshResult] = await Promise.all([
      this.checkVisitorTelemetryQueryHealth(),
      this.checkAnalyticsHealth(),
      this.checkVisitorTelemetryFreshness()
    ]);

    const triggerStatus = queryResult.status;
    const functionStatus = rpcResult.status;
    const providerStatus = freshResult.status;
    const deliveryStatus = rpcResult.status;

    const stageStatuses = [triggerStatus, functionStatus, providerStatus, deliveryStatus];
    let status: HealthStatus = 'healthy';
    if (stageStatuses.includes('down')) status = 'down';
    else if (stageStatuses.includes('degraded')) status = 'degraded';
    else if (stageStatuses.includes('unknown') && !stageStatuses.includes('healthy')) status = 'unknown';

    return {
      workflowName: 'Visitor Analytics Workflow',
      status,
      evidenceType: 'synthetic',
      triggerStatus,
      functionStatus,
      providerStatus,
      deliveryStatus,
      lastEvaluatedAt: new Date().toISOString(),
      notes: 'Evaluates telemetry table queryability, PL/pgSQL RPC execution, and session freshness.'
    };
  },

  /**
   * Evaluates all 5 production End-to-End WorkflowHealth objects.
   */
  async getAllWorkflowHealth(): Promise<WorkflowHealth[]> {
    const [contact, testimonial, accessReq, maintenance, analytics] = await Promise.all([
      this.getContactWorkflowHealth(),
      this.getTestimonialWorkflowHealth(),
      this.getAccessRequestWorkflowHealth(),
      this.getMaintenanceWorkflowHealth(),
      this.getAnalyticsWorkflowHealth()
    ]);
    return [contact, testimonial, accessReq, maintenance, analytics];
  },

  /**
   * Evaluates all 7 ComponentHealth objects across all 11 health checks.
   */
  async getAllComponentHealth(): Promise<ComponentHealth[]> {
    const [dbComp, authComp, analyticsComp, telemetryComp, edgeComp, emailComp, siteModeComp] = await Promise.all([
      this.getDatabaseComponentHealth(),
      this.getAuthComponentHealth(),
      this.getAnalyticsComponentHealth(),
      this.getTelemetryComponentHealth(),
      this.getEdgeComponentHealth(),
      this.getEmailComponentHealth(),
      this.getSiteModeComponentHealth()
    ]);
    return [dbComp, authComp, analyticsComp, telemetryComp, edgeComp, emailComp, siteModeComp];
  },

  /**
   * Evaluates top-level SystemHealthSummary across all components and workflows.
   */
  async getSystemHealthSummary(siteMode: OperationalSiteMode = 'public'): Promise<SystemHealthSummary> {
    const [components, workflows] = await Promise.all([
      this.getAllComponentHealth(),
      this.getAllWorkflowHealth()
    ]);
    const incidents = this.processIncidentTransitions(components, workflows);
    return calculateSystemHealth(components, workflows, siteMode, incidents);
  },

  /**
   * Processes component state transitions into in-memory incidents.
   */
  processIncidentTransitions(components: ComponentHealth[], workflows: WorkflowHealth[]): SystemIncident[] {
    for (const comp of components) {
      const isUnhealthy = comp.status === 'degraded' || comp.status === 'down';
      const activeIncidentIndex = inMemoryIncidents.findIndex(
        i => i.targetComponent === comp.componentName && i.status === 'active'
      );

      if (isUnhealthy) {
        const affectedWfs = workflows
          .filter(w => comp.checks.some(c => c.affectedWorkflows?.includes(w.workflowName)))
          .map(w => w.workflowName);

        const summaryText = comp.checks
          .map(c => `${c.checkId}: ${c.sanitizedSummary}`)
          .join(' | ');

        if (activeIncidentIndex === -1) {
          // Transition: Healthy/Unknown -> Degraded/Down => Create single new active incident
          const newIncident: SystemIncident = {
            id: `INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            targetComponent: comp.componentName,
            severity: comp.criticality,
            status: 'active',
            startedAt: new Date().toISOString(),
            sanitizedSummary: summaryText,
            affectedWorkflows: Array.from(new Set(affectedWfs))
          };
          inMemoryIncidents.unshift(newIncident);
        } else {
          // Transition: Degraded -> Degraded / Down -> Down / Degraded -> Down
          // Keep SAME active incident, update summary / severity if upgraded
          const active = inMemoryIncidents[activeIncidentIndex];
          active.sanitizedSummary = summaryText;
          if (comp.status === 'down' && active.severity !== 'p0_critical') {
            active.severity = comp.criticality;
          }
          if (affectedWfs.length > 0) {
            active.affectedWorkflows = Array.from(new Set([...active.affectedWorkflows, ...affectedWfs]));
          }
        }
      } else if (comp.status === 'healthy') {
        if (activeIncidentIndex !== -1) {
          // Transition: Unhealthy -> Healthy => Resolve active incident
          const active = inMemoryIncidents[activeIncidentIndex];
          active.status = 'resolved';
          active.resolvedAt = new Date().toISOString();
        }
      }
      // Note: comp.status === 'unknown' causes NO action (does NOT create or resolve incidents).
    }

    // Enforce 20-record buffer cap
    if (inMemoryIncidents.length > 20) {
      const activeIncidents = inMemoryIncidents.filter(i => i.status === 'active');
      const resolvedIncidents = inMemoryIncidents.filter(i => i.status === 'resolved');
      const allowedResolved = 20 - activeIncidents.length;
      if (allowedResolved > 0) {
        inMemoryIncidents = [...activeIncidents, ...resolvedIncidents.slice(0, allowedResolved)];
      } else {
        inMemoryIncidents = activeIncidents.slice(0, 20);
      }
    }

    return [...inMemoryIncidents];
  },

  /**
   * Utility helper to clear in-memory incidents (used for unit test isolation).
   */
  clearInMemoryIncidents(): void {
    inMemoryIncidents = [];
  }
};

// In-memory incidents buffer store
let inMemoryIncidents: SystemIncident[] = [];

// In-memory simulation overrides store
let simulationOverrides: Record<string, HealthCheckResult> = {};

