/* src/admin/hooks/useEdithInsights.ts */
import { useState, useEffect, useCallback } from 'react';
import { edithInsightService } from '../services/edithInsightService';
import { EdithInsight, EdithEngineDiagnostics } from '../types/edithInsight';

export interface UseEdithInsightsResult {
  insights: EdithInsight[];
  loading: boolean;
  error: boolean;
  diagnostics: EdithEngineDiagnostics | null;
  refetch: () => Promise<void>;
}

export const useEdithInsights = (): UseEdithInsightsResult => {
  const [insights, setInsights] = useState<EdithInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<EdithEngineDiagnostics | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await edithInsightService.generateInsights();
      setInsights(res.insights || []);
      setDiagnostics(res.diagnostics || null);
    } catch (err) {
      console.warn('[useEdithInsights] Failed to generate Edith insights:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    diagnostics,
    refetch: fetchInsights
  };
};

export default useEdithInsights;
