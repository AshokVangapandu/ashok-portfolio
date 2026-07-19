/* src/admin/services/portfolioSettingsService.ts */
import { supabase } from '../../services/supabase/client';
import { PortfolioSettings } from '../types/portfolioSettings';

export const portfolioSettingsService = {
  async getSettings(): Promise<PortfolioSettings> {
    const { data, error } = await (supabase as any)
      .from('portfolio_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[portfolioSettingsService] Error loading settings:', error);
      throw error;
    }

    // Fallback default in case row doesn't exist yet
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
      visibility: data.visibility as any,
      isOpenForWork: data.is_open_for_work,
      resumeFileName: 'Resume_v4_2026.pdf', // Keep dummy values for resume fields since they are deprecated in Settings
      resumeLastUpdated: '09 July 2026',
      resumeStatus: 'Active'
    };
  },

  async updateSettings(settings: PortfolioSettings): Promise<boolean> {
    // Retrieve the active row to find its identifier
    const { data: current, error: fetchError } = await (supabase as any)
      .from('portfolio_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('[portfolioSettingsService] Error checking settings key:', fetchError);
      throw fetchError;
    }

    const payload = {
      visibility: settings.visibility,
      is_open_for_work: settings.isOpenForWork
    };

    if (current) {
      const { error: updateError } = await (supabase as any)
        .from('portfolio_settings')
        .update(payload)
        .eq('id', current.id);

      if (updateError) {
        console.error('[portfolioSettingsService] Error updating settings row:', updateError);
        throw updateError;
      }
    } else {
      // Create config row if not populated by migrations
      const { error: insertError } = await (supabase as any)
        .from('portfolio_settings')
        .insert(payload);

      if (insertError) {
        console.error('[portfolioSettingsService] Error inserting settings row:', insertError);
        throw insertError;
      }
    }

    return true;
  }
};

export default portfolioSettingsService;
