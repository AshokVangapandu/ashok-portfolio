/* src/admin/pages/resume/components/ResumeDownloadsTable.tsx */
import React from 'react';
import { ResumeDownload } from '../../../types/resumeDownload';
import { ResumeDownloadRow } from './ResumeDownloadRow';

interface ResumeDownloadsTableProps {
  downloads: ResumeDownload[];
  onViewDownload?: (d: ResumeDownload) => void;
}

export const ResumeDownloadsTable: React.FC<ResumeDownloadsTableProps> = ({
  downloads,
  onViewDownload,
}) => {
  const headers = [
    'Date & Time',
    'Visitor',
    'Country',
    'Device',
    'Source',
    'Downloaded From',
    'Duration',
    'Status',
    'Action'
  ];

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        background: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
        boxSizing: 'border-box'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: "'Manrope', sans-serif"
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#F8FAFC', // Slate-50 background header
              borderBottom: '1px solid var(--admin-border)'
            }}
          >
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: '12px var(--admin-space-4)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--admin-text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {downloads.map((d) => (
            <ResumeDownloadRow
              key={d.id}
              download={d}
              onView={() => onViewDownload?.(d)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeDownloadsTable;
