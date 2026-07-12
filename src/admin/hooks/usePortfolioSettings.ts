/* src/admin/hooks/usePortfolioSettings.ts */
import { useState, useEffect, useCallback } from 'react';
import { portfolioSettingsService } from '../services/portfolioSettingsService';
import { PortfolioSettings, PortfolioVisibility } from '../types/portfolioSettings';

export const usePortfolioSettings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialSettings, setInitialSettings] = useState<PortfolioSettings | null>(null);

  // Form Fields
  const [visibility, setVisibility] = useState<PortfolioVisibility>('public');
  const [isOpenForWork, setIsOpenForWork] = useState<boolean>(true);
  const [resumeFileName, setResumeFileName] = useState<string>('Resume_v4_2026.pdf');
  const [resumeLastUpdated, setResumeLastUpdated] = useState<string>('09 July 2026');
  const [resumeStatus, setResumeStatus] = useState<string>('Active');

  // Success alert visibility
  const [showAlert, setShowAlert] = useState<boolean>(true); // Display by default like in design

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
    setLoading(true);
    try {
      const updated: PortfolioSettings = {
        visibility,
        isOpenForWork,
        resumeFileName,
        resumeLastUpdated,
        resumeStatus
      };
      await portfolioSettingsService.updateSettings(updated);
      setInitialSettings(updated);
      setShowAlert(true);
    } catch (err) {
      console.error('[usePortfolioSettings] Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (initialSettings) {
      setVisibility(initialSettings.visibility);
      setIsOpenForWork(initialSettings.isOpenForWork);
    }
  };

  return {
    loading,
    visibility,
    setVisibility,
    isOpenForWork,
    setIsOpenForWork,
    resumeFileName,
    resumeLastUpdated,
    resumeStatus,
    
    // Alert handles
    showAlert,
    setShowAlert,

    // Actions
    isDirty,
    handleSave,
    handleDiscard,
    refresh: fetchSettings
  };
};

export default usePortfolioSettings;
