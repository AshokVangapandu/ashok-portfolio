/* src/admin/pages/resume/components/ResumeSettingsTable.tsx */
import React from 'react';
import { ResumeSetting } from '../../../types/resume';

interface ResumeSettingsTableProps {
  resumes: ResumeSetting[];
  onViewDetails: (resume: ResumeSetting) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onReplace: (resume: ResumeSetting) => void;
}

export const ResumeSettingsTable: React.FC<ResumeSettingsTableProps> = ({
  resumes,
  onViewDetails,
  onActivate,
  onDelete,
  onReplace
}) => {
  const headers = [
    'Resume Name',
    'Version',
    'File Size',
    'Upload Date',
    'Status',
    'Actions'
  ];

  // Helper to format file size cleanly
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to format date cleanly
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        background: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid var(--admin-border)'
            }}
          >
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: '14px var(--admin-space-4)',
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
          {resumes.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: 'var(--admin-text-secondary)',
                  fontSize: '14px'
                }}
              >
                No resumes uploaded yet. Click Upload Resume PDF to add one.
              </td>
            </tr>
          ) : (
            resumes.map((r) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: '1px solid var(--admin-border)',
                  backgroundColor: '#FFFFFF',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Resume Name */}
                <td style={{ padding: '14px var(--admin-space-4)', fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  {r.resumeName}
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 400, marginTop: '2px' }}>
                    {r.fileName}
                  </div>
                </td>

                {/* Version */}
                <td style={{ padding: '14px var(--admin-space-4)', fontSize: '13.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  {r.version}
                </td>

                {/* File Size */}
                <td style={{ padding: '14px var(--admin-space-4)', fontSize: '13.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  {formatFileSize(r.fileSize)}
                </td>

                {/* Upload Date */}
                <td style={{ padding: '14px var(--admin-space-4)', fontSize: '13.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  {formatDate(r.uploadedAt)}
                </td>

                {/* Status */}
                <td style={{ padding: '14px var(--admin-space-4)' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: r.isActive ? '#ECFDF5' : '#F1F5F9',
                      color: r.isActive ? '#10B981' : '#64748B',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: r.isActive ? '#10B981' : '#94A3B8'
                      }}
                    />
                    {r.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px var(--admin-space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onViewDetails(r)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--admin-text)',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      Details
                    </button>

                    {/* Activate button */}
                    {!r.isActive && (
                      <button
                        type="button"
                        onClick={() => onActivate(r.id)}
                        style={{
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                      >
                        Activate
                      </button>
                    )}

                    {/* Replace button */}
                    <button
                      type="button"
                      onClick={() => onReplace(r)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid rgba(124, 92, 255, 0.2)',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(124, 92, 255, 0.04)',
                        color: '#7C5CFF',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(124, 92, 255, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(124, 92, 255, 0.04)';
                      }}
                    >
                      Replace
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(239, 68, 68, 0.04)',
                        color: '#EF4444',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
