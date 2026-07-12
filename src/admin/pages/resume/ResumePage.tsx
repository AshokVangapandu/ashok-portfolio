/* src/admin/pages/resume/ResumePage.tsx */
import React, { useState } from 'react';
import { useResumeDownloads } from '../../hooks/useResumeDownloads';
import { ResumeDownloadsToolbar } from './components/ResumeDownloadsToolbar';
import { ResumeDownloadsTable } from './components/ResumeDownloadsTable';
import { DownloadDetailsModal } from './components/DownloadDetailsModal';
import { ResumeDownload } from '../../types/resumeDownload';

export const ResumePage: React.FC = () => {
  const [selectedDownload, setSelectedDownload] = useState<ResumeDownload | null>(null);

  const {
    downloads,
    loading,
    totalCount,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    refresh
  } = useResumeDownloads();

  // Static pagination details
  const showingStart = 1;
  const showingEnd = Math.min(downloads.length, pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-5)' }}>
      {/* Page header title & subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--admin-space-2)' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--admin-text)',
            letterSpacing: '-0.02em'
          }}
        >
          Resume Downloads
        </h1>
        <p
          style={{
            margin: 0,
            color: 'var(--admin-text-secondary)',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Track visitors who downloaded your resume and view their session details.
        </p>
      </div>

      {/* Toolbar & Grid Log */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ResumeDownloadsToolbar
          search={search}
          setSearch={setSearch}
          onRefresh={refresh}
        />

        <ResumeDownloadsTable
          downloads={downloads}
          onViewDownload={setSelectedDownload}
        />

        {/* Paging Footer actions */}
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
          {/* Bottom Left: Showing stats */}
          <div>
            Showing <strong style={{ color: 'var(--admin-text)' }}>{showingStart}–{showingEnd}</strong> of <strong style={{ color: 'var(--admin-text)' }}>{totalCount}</strong>
          </div>

          {/* Bottom Center: Pagination selectors */}
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

            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--admin-primary)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              1
            </button>

            {[2, 3].map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--admin-border)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--admin-text)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {pNum}
              </button>
            ))}

            <span style={{ margin: '0 4px', opacity: 0.6 }}>...</span>

            <button
              onClick={() => setPage(43)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid var(--admin-border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--admin-text)',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              43
            </button>

            <button
              disabled={page === 43}
              onClick={() => setPage((prev) => Math.min(43, prev + 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: page === 43 ? '#D1D5DB' : 'var(--admin-text)',
                cursor: page === 43 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              Next
            </button>
          </div>

          {/* Bottom Right: Rows dropdown */}
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
      </div>

      {/* Details View dialog modal */}
      <DownloadDetailsModal
        download={selectedDownload}
        onClose={() => setSelectedDownload(null)}
      />
    </div>
  );
};

export default ResumePage;
