/* src/admin/services/portfolioSettingsService.ts */
import { supabase } from '../../services/supabase/client';
import { PortfolioSettings, SiteMode } from '../types/portfolioSettings';
import { notificationWorkflowService } from '../../services/notificationWorkflowService';

export interface UpdateSettingsResult {
  success: boolean;
  workflowMessage?: string;
}

export const portfolioSettingsService = {
  async getSiteMode(): Promise<SiteMode> {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('visibility')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[portfolioSettingsService] Error loading site mode:', error);
      throw error;
    }

    if (!data?.visibility) {
      throw new Error('Portfolio visibility setting is unavailable.');
    }

    return data.visibility as SiteMode;
  },

  async getSettings(): Promise<PortfolioSettings> {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[portfolioSettingsService] Error loading settings:', error);
      throw error;
    }

    if (!data) {
      return {
        visibility: 'public',
        isOpenForWork: true,
        resumeFileName: 'Resume_v4_2026.pdf',
        resumeLastUpdated: '09 July 2026',
        resumeStatus: 'Active'
      };
    }

    return {
      visibility: data.visibility as SiteMode,
      isOpenForWork: data.is_open_for_work,
      resumeFileName: 'Resume_v4_2026.pdf',
      resumeLastUpdated: '09 July 2026',
      resumeStatus: 'Active'
    };
  },

  async updateSettings(settings: PortfolioSettings): Promise<UpdateSettingsResult> {
    const { data: current, error: fetchError } = await supabase
      .from('portfolio_settings')
      .select('id, visibility')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('[portfolioSettingsService] Error checking settings key:', fetchError);
      throw fetchError;
    }

    const previousMode: SiteMode = (current?.visibility as SiteMode) || 'public';
    const newMode: SiteMode = settings.visibility;

    const payload = {
      visibility: settings.visibility,
      is_open_for_work: settings.isOpenForWork
    };

    if (current) {
      const { error: updateError } = await supabase
        .from('portfolio_settings')
        .update(payload)
        .eq('id', current.id);

      if (updateError) {
        console.error('[portfolioSettingsService] Error updating settings row:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('portfolio_settings')
        .insert(payload);

      if (insertError) {
        console.error('[portfolioSettingsService] Error inserting settings row:', insertError);
        throw insertError;
      }
    }

    // Trigger recovery workflow if transition is maintenance -> public
    let workflowMessage: string | undefined = undefined;
    if (previousMode === 'maintenance' && newMode === 'public') {
      const workflowRes = await notificationWorkflowService.triggerRecoveryWorkflow(previousMode, newMode);
      workflowMessage = workflowRes.message;
    }

    return { success: true, workflowMessage };
  }
};

export default portfolioSettingsService;
