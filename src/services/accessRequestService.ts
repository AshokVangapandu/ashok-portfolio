/* src/services/accessRequestService.ts */
import { supabase } from './supabase/client';
import { AccessRequest, RequestStatus, SubmitAccessRequestPayload } from '../admin/types/accessRequests';

export interface AccessRequestResult {
  success: boolean;
  message: string;
}

export const accessRequestService = {
  async submitAccessRequest(payload: SubmitAccessRequestPayload): Promise<AccessRequestResult> {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const cleanName = (payload.fullName || '').trim();
    const cleanReason = (payload.reason || '').trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!cleanName) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!cleanReason) {
      return { success: false, message: 'Please provide a reason for your access request.' };
    }

    try {
      // 1. Check for existing pending request with same email
      const { data: pendingReq } = await supabase
        .from('access_requests')
        .select('id')
        .ilike('email', cleanEmail)
        .eq('request_status', 'pending')
        .maybeSingle();

      if (pendingReq) {
        return {
          success: false,
          message: "An access request for this email address is already pending review. You'll be notified once it's reviewed."
        };
      }

      // 2. Insert new access request
      const { error: insertError } = await supabase
        .from('access_requests')
        .insert({
          email: cleanEmail,
          full_name: cleanName,
          company: payload.company?.trim() || null,
          job_title: payload.jobTitle?.trim() || null,
          reason: cleanReason,
          linkedin_url: payload.linkedinUrl?.trim() || null,
          request_status: 'pending'
        });

      if (insertError) {
        console.error('[accessRequestService] Submit error:', insertError);
        throw insertError;
      }

      return {
        success: true,
        message: "Your request has been submitted successfully. You'll be notified once it's reviewed."
      };
    } catch (err: any) {
      console.error('[accessRequestService] Unexpected submit error:', err);
      return {
        success: false,
        message: 'Failed to submit request. Please try again.'
      };
    }
  },

  async getRequests(): Promise<AccessRequest[]> {
    const { data, error } = await supabase
      .from('access_requests')
      .select('*')
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('[accessRequestService] Fetch error:', error);
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      fullName: item.full_name,
      email: item.email,
      company: item.company,
      jobTitle: item.job_title,
      linkedinUrl: item.linkedin_url,
      reason: item.reason,
      requestStatus: item.request_status as RequestStatus,
      requestedAt: item.requested_at,
      reviewedAt: item.reviewed_at,
      reviewedBy: item.reviewed_by,
      notes: item.notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  async approveRequest(
    id: string,
    adminEmail?: string,
    options?: { role?: string; comment?: string; sendEmail?: boolean }
  ): Promise<{ success: boolean; warning?: string }> {
    // 1. Fetch request details
    const { data: request, error: fetchError } = await supabase
      .from('access_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !request) {
      console.error('[accessRequestService] Error fetching request for approval:', fetchError);
      throw fetchError || new Error('Request not found');
    }

    const targetRole = (options?.role || 'viewer') as 'viewer' | 'recruiter' | 'client' | 'admin';
    const targetNotes = options?.comment?.trim() || `Approved access request from ${request.company || 'visitor'}`;

    // 2. Upsert into authorized_users table
    const { data: existingUser } = await supabase
      .from('authorized_users')
      .select('id')
      .ilike('email', request.email)
      .maybeSingle();

    let upsertError: any = null;
    if (existingUser) {
      const { error } = await supabase
        .from('authorized_users')
        .update({
          access_status: 'enabled',
          access_level: targetRole,
          notes: targetNotes,
          full_name: request.full_name || undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);
      upsertError = error;
    } else {
      const { error } = await supabase
        .from('authorized_users')
        .insert({
          email: request.email,
          full_name: request.full_name,
          access_status: 'enabled',
          access_level: targetRole,
          notes: targetNotes
        });
      upsertError = error;
    }

    if (upsertError) {
      console.error('[accessRequestService] Error upserting authorized user:', upsertError);
      throw upsertError;
    }

    // 3. Update request status to approved
    const { error: updateError } = await supabase
      .from('access_requests')
      .update({
        request_status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminEmail || 'admin',
        notes: options?.comment?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('[accessRequestService] Error marking request approved:', updateError);
      throw updateError;
    }

    // 4. Invoke email Edge Function after successful DB updates, only if enabled
    let warning: string | undefined = undefined;
    if (options?.sendEmail !== false) {
      try {
        const { error: invokeError } = await supabase.functions.invoke('send-access-approval-email', {
          body: {
            name: request.full_name,
            email: request.email
          }
        });
        if (invokeError) {
          console.error('[accessRequestService] send-access-approval-email function returned error:', invokeError);
          warning = 'Failed to send approval email notification.';
        }
      } catch (err: any) {
        console.error('[accessRequestService] send-access-approval-email function invocation exception:', err);
        warning = 'Failed to send approval email notification.';
      }
    }

    return { success: true, warning };
  },

  async rejectRequest(id: string, adminEmail?: string, notes?: string): Promise<boolean> {
    const { error } = await supabase
      .from('access_requests')
      .update({
        request_status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminEmail || 'admin',
        notes: notes?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('[accessRequestService] Error rejecting request:', error);
      throw error;
    }

    return true;
  }
};

export default accessRequestService;
