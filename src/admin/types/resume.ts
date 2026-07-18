/* src/admin/types/resume.ts */

export interface SupabaseResumeSetting {
  id: string;
  resume_name: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  preview_url: string;
  version: string;
  file_size: number;
  uploaded_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ResumeSetting {
  id: string;
  resumeName: string;
  fileName: string;
  storagePath: string;
  publicUrl: string;
  previewUrl: string;
  version: string;
  fileSize: number;
  uploadedAt: string;
  updatedAt: string;
  isActive: boolean;
}

export const mapSupabaseToResumeSetting = (db: SupabaseResumeSetting): ResumeSetting => {
  return {
    id: db.id,
    resumeName: db.resume_name,
    fileName: db.file_name,
    storagePath: db.storage_path,
    publicUrl: db.public_url,
    previewUrl: db.preview_url,
    version: db.version,
    fileSize: db.file_size,
    uploadedAt: db.uploaded_at,
    updatedAt: db.updated_at,
    isActive: db.is_active,
  };
};
