/* src/admin/pages/resume/ResumePage.tsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase/client';
import { resumeService } from '../../services/resumeService';
import { ResumeSetting, mapSupabaseToResumeSetting } from '../../types/resume';
import { ResumeSettingsTable } from './components/ResumeSettingsTable';
import { UploadResumeModal } from './components/UploadResumeModal';
import { ResumeDetailsModal } from './components/ResumeDetailsModal';

// Downloads elements
import { useResumeDownloads } from '../../hooks/useResumeDownloads';
import { ResumeDownloadsToolbar } from './components/ResumeDownloadsToolbar';
import { ResumeDownloadsTable } from './components/ResumeDownloadsTable';
import { DownloadDetailsModal } from './components/DownloadDetailsModal';
import { ResumeDownload } from '../../types/resumeDownload';

export const ResumePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'management'>('downloads');

  // --- Tab 1: Downloads States ---
  const [selectedDownload, setSelectedDownload] = useState<ResumeDownload | null>(null);
  const {
    downloads,
    loading: downloadsLoading,
    totalCount: downloadsTotal,
    error: downloadsError,
    search,
    setSearch,
    dateRange,
    setDateRange,
    page,
    setPage,
    pageSize,
    setPageSize,
    refresh: refreshDownloads,
    exportCSV
  } = useResumeDownloads();

  const totalPages = Math.ceil(downloadsTotal / pageSize);
  const showingStart = downloadsTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingEnd = Math.min(page * pageSize, downloadsTotal);

  // --- Tab 2: Management States ---
  const [resumes, setResumes] = useState<ResumeSetting[]>([]);
  const [mgmtLoading, setMgmtLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'replace'>('upload');
  const [selectedResume, setSelectedResume] = useState<ResumeSetting | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Helper toast notifier
  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(type, title, message, 4000);
    } else {
      console.log(`[Toast ${type}] ${title}: ${message}`);
    }
  };

  // Fetch resumes from database
  const fetchResumes = async () => {
    setMgmtLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('resume_settings')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setResumes((data || []).map(mapSupabaseToResumeSetting));
    } catch (err: any) {
      console.error('[ResumePage.fetchResumes] Error:', err);
      showToast('error', 'Fetch Failed', err.message || 'Failed to load resumes.');
    } finally {
      setMgmtLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'management') {
      fetchResumes();
    }
  }, [activeTab]);

  // Handle uploading or replacing a resume PDF
  const handleSaveResume = async (file: File, resumeName: string, version: string) => {
    try {
      if (uploadMode === 'replace' && selectedResume) {
        await resumeService.deleteResume(selectedResume.id);
      }

      await resumeService.uploadResume(file, resumeName, version, true);
      showToast(
        'success',
        uploadMode === 'replace' ? 'Resume Replaced' : 'Resume Uploaded',
        'Resume PDF uploaded and set to active.'
      );
      fetchResumes();
    } catch (err: any) {
      console.error('[ResumePage.handleSaveResume] Error:', err);
      showToast('error', 'Upload Failed', err.message || 'Failed to upload resume.');
      throw err;
    }
  };

  // Handle activating a resume
  const handleActivate = async (id: string) => {
    try {
      await resumeService.setActiveResume(id);
      showToast('success', 'Resume Activated', 'The selected resume is now active.');
      fetchResumes();
    } catch (err: any) {
      console.error('[ResumePage.handleActivate] Error:', err);
      showToast('error', 'Activation Failed', err.message || 'Failed to activate resume.');
    }
  };

  // Handle deleting a resume
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume? This will delete the file from storage and cannot be undone.')) return;
    try {
      await resumeService.deleteResume(id);
      showToast('success', 'Resume Deleted', 'Resume settings and storage file removed.');
      fetchResumes();
    } catch (err: any) {
      console.error('[ResumePage.handleDelete] Error:', err);
      showToast('error', 'Delete Failed', err.message || 'Failed to delete resume.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--admin-space-2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--admin-text)',
              letterSpacing: '-0.02em'
            }}
          >
            {activeTab === 'downloads' ? 'Resume Downloads' : 'Resume Management'}
          </h1>
          <p
            style={{
              margin: 0,
              color: 'var(--admin-text-secondary)',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            {activeTab === 'downloads'
              ? 'Track visitors who downloaded your resume and view their session details.'
              : 'Upload, replace, and activate your resume PDF available for download on the public portfolio.'}
          </p>
        </div>

        {/* Management Only Action Button */}
        {activeTab === 'management' && (
          <button
            type="button"
            onClick={() => {
              setUploadMode('upload');
              setSelectedResume(null);
              setUploadModalOpen(true);
            }}
            className="hover-scale active-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'var(--admin-primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(124, 92, 255, 0.2)'
            }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Upload Resume PDF
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--admin-border)',
          gap: '24px',
          marginBottom: 'var(--admin-space-4)'
        }}
      >
        <button
          onClick={() => setActiveTab('downloads')}
          style={{
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'downloads' ? '2.5px solid var(--admin-primary)' : '2.5px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'downloads' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
        >
          Downloads Log
        </button>
        <button
          onClick={() => setActiveTab('management')}
          style={{
            padding: '12px 4px',
            border: 'none',
            borderBottom: activeTab === 'management' ? '2.5px solid var(--admin-primary)' : '2.5px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'management' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
        >
          File Management
        </button>
      </div>

      {/* Tab contents */}
      {activeTab === 'downloads' ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ResumeDownloadsToolbar
            search={search}
            setSearch={setSearch}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onRefresh={refreshDownloads}
            onExportCSV={exportCSV}
          />

          {downloadsError ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--admin-border)',
                borderTop: 'none',
                borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
                color: '#EF4444',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Error loading logs: {downloadsError}
            </div>
          ) : downloadsLoading ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--admin-border)',
                borderTop: 'none',
                borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
                color: 'var(--admin-text-secondary)',
                fontSize: '14px'
              }}
            >
              Loading downloads log...
            </div>
          ) : (
            <>
              <ResumeDownloadsTable
                downloads={downloads}
                onViewDownload={setSelectedDownload}
              />

              {/* Pagination footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--admin-space-4)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--admin-border)',
                  borderTop: 'none',
                  borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: 'var(--admin-text-secondary)',
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  Showing <strong style={{ color: 'var(--admin-text)' }}>{showingStart}–{showingEnd}</strong> of <strong style={{ color: 'var(--admin-text)' }}>{downloadsTotal}</strong>
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: page === 1 ? '#D1D5DB' : 'var(--admin-text)',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: page === pNum ? 'var(--admin-primary)' : '#FFFFFF',
                        color: page === pNum ? '#FFFFFF' : 'var(--admin-text)',
                        borderStyle: page === pNum ? 'none' : 'solid',
                        borderWidth: page === pNum ? 'none' : '1px',
                        borderColor: 'var(--admin-border)',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {pNum}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: (page === totalPages || totalPages === 0) ? '#D1D5DB' : 'var(--admin-text)',
                      cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                  >
                    Next
                  </button>
                </div>

                {/* Page Size selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--admin-text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Details Modal */}
          <DownloadDetailsModal
            download={selectedDownload}
            onClose={() => setSelectedDownload(null)}
          />
        </div>
      ) : (
        /* Tab 2: Resume file list */
        mgmtLoading ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              color: 'var(--admin-text-secondary)'
            }}
          >
            Loading resumes...
          </div>
        ) : (
          <>
            <ResumeSettingsTable
              resumes={resumes}
              onViewDetails={(r) => {
                setSelectedResume(r);
                setDetailsModalOpen(true);
              }}
              onActivate={handleActivate}
              onDelete={handleDelete}
              onReplace={(r) => {
                setSelectedResume(r);
                setUploadMode('replace');
                setUploadModalOpen(true);
              }}
            />

            <UploadResumeModal
              isOpen={uploadModalOpen}
              mode={uploadMode}
              selectedResume={selectedResume}
              onClose={() => {
                setUploadModalOpen(false);
                setSelectedResume(null);
              }}
              onSave={handleSaveResume}
            />

            <ResumeDetailsModal
              resume={selectedResume}
              onClose={() => {
                setDetailsModalOpen(false);
                setSelectedResume(null);
              }}
            />
          </>
        )
      )}
    </div>
  );
};

export default ResumePage;
