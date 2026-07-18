/* src/admin/services/resumeService.ts */
import { supabase } from '../../services/supabase/client';
import { ResumeSetting, SupabaseResumeSetting, mapSupabaseToResumeSetting } from '../types/resume';

export const resumeService = {
  /**
   * Uploads a resume PDF to Supabase Storage and saves its metadata.
   */
  async uploadResume(
    file: File,
    resumeName: string,
    version: string,
    isActive: boolean = false
  ): Promise<ResumeSetting> {
    const storagePath = `resumes/${Date.now()}-${file.name}`;

    // 1. Upload file to Storage Bucket
    const { error: uploadError } = await supabase.storage
      .from('resume-files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('[resumeService.uploadResume] Storage upload error:', uploadError);
      throw uploadError;
    }

    // 2. Retrieve Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resume-files')
      .getPublicUrl(storagePath);

    // 3. Insert record into database table
    const { data, error: dbError } = await (supabase as any)
      .from('resume_settings')
      .insert([
        {
          resume_name: resumeName,
          file_name: file.name,
          storage_path: storagePath,
          public_url: publicUrl,
          preview_url: publicUrl,
          version: version,
          file_size: file.size,
          is_active: isActive
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('[resumeService.uploadResume] Database insert error:', dbError);
      throw dbError;
    }

    return mapSupabaseToResumeSetting(data as SupabaseResumeSetting);
  },

  /**
   * Retrieves the currently active resume.
   */
  async getActiveResume(): Promise<ResumeSetting | null> {
    const { data, error } = await (supabase as any)
      .from('resume_settings')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('[resumeService.getActiveResume] Error:', error);
      throw error;
    }

    if (!data) return null;
    return mapSupabaseToResumeSetting(data as SupabaseResumeSetting);
  },

  /**
   * Updates an existing resume setting metadata.
   */
  async updateResume(id: string, updates: Partial<SupabaseResumeSetting>): Promise<ResumeSetting> {
    const { data, error } = await (supabase as any)
      .from('resume_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[resumeService.updateResume] Error:', error);
      throw error;
    }

    return mapSupabaseToResumeSetting(data as SupabaseResumeSetting);
  },

  /**
   * Deletes a resume setting record and deletes its storage PDF.
   */
  async deleteResume(id: string): Promise<boolean> {
    // 1. Fetch record to retrieve storage path
    const { data: resume, error: fetchError } = await (supabase as any)
      .from('resume_settings')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('[resumeService.deleteResume] Fetch record error:', fetchError);
      throw fetchError;
    }

    // 2. Delete database record
    const { error: dbError } = await (supabase as any)
      .from('resume_settings')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('[resumeService.deleteResume] Database delete error:', dbError);
      throw dbError;
    }

    // 3. Delete storage file
    if (resume && resume.storage_path) {
      try {
        const { error: storageError } = await supabase.storage
          .from('resume-files')
          .remove([resume.storage_path]);

        if (storageError) {
          console.warn('[resumeService.deleteResume] Storage delete warning:', storageError);
        }
      } catch (storageErr) {
        console.warn('[resumeService.deleteResume] Storage delete caught exception:', storageErr);
      }
    }

    return true;
  },

  /**
   * Sets a specific resume as the active resume.
   * Note: The Postgres trigger deactivates the other active resumes automatically.
   */
  async setActiveResume(id: string): Promise<ResumeSetting> {
    const { data, error } = await (supabase as any)
      .from('resume_settings')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[resumeService.setActiveResume] Error:', error);
      throw error;
    }

    return mapSupabaseToResumeSetting(data as SupabaseResumeSetting);
  }
};

export default resumeService;
