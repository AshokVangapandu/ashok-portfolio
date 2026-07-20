/* src/admin/hooks/usePortfolioSettings.ts */
import { useState, useEffect, useCallback } from 'react';
import { portfolioSettingsService } from '../services/portfolioSettingsService';
import { PortfolioSettings, PortfolioVisibility } from '../types/portfolioSettings';

export interface AlertState {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export const usePortfolioSettings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [initialSettings, setInitialSettings] = useState<PortfolioSettings | null>(null);

  // Form Fields
  const [visibility, setVisibility] = useState<PortfolioVisibility>('public');
  const [isOpenForWork, setIsOpenForWork] = useState<boolean>(true);
  const [resumeFileName, setResumeFileName] = useState<string>('Resume_v4_2026.pdf');
  const [resumeLastUpdated, setResumeLastUpdated] = useState<string>('09 July 2026');
  const [resumeStatus, setResumeStatus] = useState<string>('Active');

  // Alert State
  const [alert, setAlert] = useState<AlertState | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await portfolioSettingsService.getSettings();
      setInitialSettings(data);
      setVisibility(data.visibility);
      setIsOpenForWork(data.isOpenForWork);
      setResumeFileName(data.resumeFileName);
      setResumeLastUpdated(data.resumeLastUpdated);
      setResumeStatus(data.resumeStatus);
    } catch (err) {
      console.error('[usePortfolioSettings] Fetch error:', err);
      setAlert({
        type: 'error',
        title: 'Error Loading Settings',
        message: 'Failed to load portfolio settings from database. Please refresh the page.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Check if form fields changed
  const isDirty = initialSettings
    ? visibility !== initialSettings.visibility || isOpenForWork !== initialSettings.isOpenForWork
    : false;

  const handleSave = async () => {
    if (saving) return; // Prevent duplicate submissions
    setSaving(true);
    setAlert(null);
    try {
      const updated: PortfolioSettings = {
        visibility,
        isOpenForWork,
        resumeFileName,
        resumeLastUpdated,
        resumeStatus
      };
      const res = await portfolioSettingsService.updateSettings(updated);
      setInitialSettings(updated);
      setAlert({
        type: 'success',
        title: 'Settings Saved',
        message: res.workflowMessage || 'Your global portfolio visibility settings have been updated successfully.'
      });
    } catch (err: any) {
      console.error('[usePortfolioSettings] Save error:', err);
      setAlert({
        type: 'error',
        title: 'Save Failed',
        message: err?.message || 'Failed to save portfolio visibility settings. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (initialSettings) {
      setVisibility(initialSettings.visibility);
      setIsOpenForWork(initialSettings.isOpenForWork);
      setAlert(null);
    }
  };

  return {
    loading,
    saving,
    visibility,
    setVisibility,
    isOpenForWork,
    setIsOpenForWork,
    resumeFileName,
    resumeLastUpdated,
    resumeStatus,
    
    // Alert handles
    alert,
    setAlert,

    // Actions
    isDirty,
    handleSave,
    handleDiscard,
    refresh: fetchSettings
  };
};

export default usePortfolioSettings;
