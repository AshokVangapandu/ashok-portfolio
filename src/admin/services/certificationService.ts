/* src/admin/services/certificationService.ts */
import { supabase } from '../../services/supabase/client';
import { Certification, SupabaseCertification, mapSupabaseToCertification } from '../types/certification';

export const certificationService = {
  /**
   * Retrieves all certifications from Supabase.
   */
  async getCertifications(): Promise<Certification[]> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[certificationService.getCertifications] Error:', error);
      throw error;
    }

    return (data as SupabaseCertification[] || []).map(mapSupabaseToCertification);
  },
  /**
   * Uploads a file (image or PDF) to the certifications storage bucket.
   * Returns the public URL of the uploaded asset.
   */
  async uploadAsset(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('certifications')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('[certificationService.uploadAsset] Error uploading:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('certifications')
      .getPublicUrl(path);

    return publicUrl;
  },

  /**
   * Creates a new certification in Supabase.
   */
  async createCertification(certData: Omit<SupabaseCertification, 'id' | 'created_at' | 'updated_at'>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .insert([certData])
      .select()
      .single();

    if (error) {
      console.error('[certificationService.createCertification] Error:', error);
      throw error;
    }

    return mapSupabaseToCertification(data as SupabaseCertification);
  },

  /**
   * Updates an existing certification in Supabase.
   */
  async updateCertification(id: string, updates: Partial<SupabaseCertification>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[certificationService.updateCertification] Error:', error);
      throw error;
    }

    return mapSupabaseToCertification(data as SupabaseCertification);
  },

  /**
   * Deletes a certification and its associated assets from Supabase.
   */
  async deleteCertification(id: string): Promise<boolean> {
    // 1. Fetch the certification record to identify associated assets
    const { data: cert, error: fetchError } = await supabase
      .from('certifications')
      .select('certificate_image_url, certificate_file_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('[certificationService.deleteCertification] Fetch error:', fetchError);
      throw fetchError;
    }

    // 2. Extract asset paths relative to the bucket
    const filesToDelete: string[] = [];
    const getPath = (url: string | null) => {
      if (!url) return null;
      const parts = url.split('/storage/v1/object/public/certifications/');
      return parts.length === 2 ? parts[1] : null;
    };

    if (cert) {
      const iconPath = getPath(cert.certificate_image_url);
      if (iconPath) filesToDelete.push(iconPath);

      const mediaPath = getPath(cert.certificate_file_url);
      if (mediaPath) filesToDelete.push(mediaPath);
    }

    // 3. Delete database record
    const { error: dbError } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('[certificationService.deleteCertification] Database delete error:', dbError);
      throw dbError;
    }

    // 4. Clean up storage assets asynchronously/gracefully if any exist
    if (filesToDelete.length > 0) {
      try {
        const { error: storageError } = await supabase.storage
          .from('certifications')
          .remove(filesToDelete);

        if (storageError) {
          console.warn('[certificationService.deleteCertification] Storage cleanup warning:', storageError);
        }
      } catch (storageErr) {
        console.warn('[certificationService.deleteCertification] Storage cleanup caught warning:', storageErr);
      }
    }

    return true;
  }
};

export default certificationService;
