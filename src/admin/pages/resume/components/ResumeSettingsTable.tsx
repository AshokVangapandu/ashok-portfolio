/* src/admin/pages/resume/components/ResumeSettingsTable.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ResumeSetting } from '../../../types/resume';

interface ResumeSettingsTableProps {
  resumes: ResumeSetting[];
  onViewDetails: (resume: ResumeSetting) => void;
  onActivate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReplace: (resume: ResumeSetting) => void;
  onDownload: (resume: ResumeSetting) => Promise<void>;
  processingRowId: string | null;
  processingAction: 'activating' | 'downloading' | 'deleting' | 'replacing' | null;
}

export const ResumeSettingsTable: React.FC<ResumeSettingsTableProps> = ({
  resumes,
  onViewDetails,
  onActivate,
  onDelete,
  onReplace,
  onDownload,
  processingRowId,
  processingAction
}) => {
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLButtonElement | null>(null);
  const [activeResume, setActiveResume] = useState<ResumeSetting | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number, openUpward: boolean } | null>(null);
  
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openMenuRowId) {
          triggerRefs.current[openMenuRowId]?.focus();
          setOpenMenuRowId(null);
          setActiveTrigger(null);
          setActiveResume(null);
          setMenuPosition(null);
        }
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.overflow-menu-container') && !target.closest('.portal-overflow-menu')) {
        setOpenMenuRowId(null);
        setActiveTrigger(null);
        setActiveResume(null);
        setMenuPosition(null);
      }
    };

    if (openMenuRowId !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuRowId]);

  // Handle updates to menu coordinates on resize and scroll
  useEffect(() => {
    if (!activeTrigger || !activeResume) return;

    const updatePosition = () => {
      const rect = activeTrigger.getBoundingClientRect();
      const menuWidth = 180;
      const itemsCount = activeResume.isActive ? 3 : 4;
      const menuHeight = itemsCount * 36 + 12; // 36px per item + 12px padding
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight + 10 && rect.top > menuHeight;
      
      setMenuPosition({
        x: rect.right - menuWidth,
        y: openUpward ? rect.top - 6 - menuHeight : rect.bottom + 6,
        openUpward
      });
    };

    // Initial position trigger
    updatePosition();

    // Resize and Scroll listeners
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true); // true captures events inside table wrappers

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [activeTrigger, activeResume]);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, resume: ResumeSetting) => {
    e.stopPropagation();
    if (openMenuRowId === resume.id) {
      setOpenMenuRowId(null);
      setActiveTrigger(null);
      setActiveResume(null);
      setMenuPosition(null);
    } else {
      setOpenMenuRowId(resume.id);
      setActiveTrigger(e.currentTarget);
      setActiveResume(resume);
    }
  };

  const handleMenuAction = async (action: string, resume: ResumeSetting) => {
    setOpenMenuRowId(null);
    setActiveTrigger(null);
    setActiveResume(null);
    setMenuPosition(null);
    
    if (action === 'details') {
      onViewDetails(resume);
    } else if (action === 'download') {
      await onDownload(resume);
    } else if (action === 'replace') {
      onReplace(resume);
    } else if (action === 'delete') {
      if (resume.isActive) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('error', 'Delete Prevented', 'The active resume cannot be deleted. Please activate another resume first.', 4000);
        } else {
          alert('The active resume cannot be deleted. Please activate another resume first.');
        }
        return;
      }
      await onDelete(resume.id);
    }
  };

  const isAnyActionProcessing = processingRowId !== null;

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
      {/* Styles block injecting custom premium variables, animations, and hover states */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes dropdownFadeInUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .resume-row {
          transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .resume-row:hover {
          background-color: #F8FAFC !important;
        }

        .btn-primary-action {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary-action:hover:not(:disabled) {
          background-color: #6D4EE0 !important;
          transform: translateY(-0.5px);
          box-shadow: 0 4px 8px rgba(124, 92, 255, 0.22) !important;
        }

        .btn-primary-action:active:not(:disabled) {
          transform: translateY(0.5px);
        }

        .btn-overflow-trigger {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-overflow-trigger:hover:not(:disabled) {
          background-color: #F8FAFC !important;
          border-color: rgba(203, 213, 225, 0.8) !important;
          color: var(--admin-text) !important;
        }

        .btn-overflow-trigger:active:not(:disabled) {
          background-color: #F1F5F9 !important;
        }

        .animate-dropdown {
          animation: dropdownFadeIn 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }

        .animate-dropdown-up {
          animation: dropdownFadeInUp 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: bottom right;
        }

        .dropdown-item {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dropdown-item:hover {
          background-color: #F1F5F9 !important;
        }

        .dropdown-item-destructive:hover {
          background-color: #FEF2F2 !important;
        }
      `}} />

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
            resumes.map((r, index) => {
              const isRowProcessing = processingRowId === r.id;
              
              return (
                <tr
                  key={r.id}
                  className="resume-row"
                  style={{
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: '#FFFFFF'
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
                  <td style={{ 
                    padding: '14px var(--admin-space-4)',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Primary Button */}
                      {r.isActive ? (
                        <button
                          type="button"
                          disabled
                          style={{
                            width: '125px',
                            height: '32px',
                            border: '1px solid rgba(22, 163, 74, 0.15)',
                            borderRadius: '6px',
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            boxSizing: 'border-box'
                          }}
                        >
                          ✓ Active
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onActivate(r.id)}
                          disabled={isRowProcessing || isAnyActionProcessing}
                          className="btn-primary-action"
                          style={{
                            width: '125px',
                            height: '32px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: (isRowProcessing || isAnyActionProcessing) ? '#E2E8F0' : 'var(--admin-primary)',
                            color: (isRowProcessing || isAnyActionProcessing) ? '#94A3B8' : '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: (isRowProcessing || isAnyActionProcessing) ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxSizing: 'border-box',
                            boxShadow: (isRowProcessing || isAnyActionProcessing) ? 'none' : '0 2px 4px rgba(124, 92, 255, 0.15)'
                          }}
                        >
                          {isRowProcessing && processingAction === 'activating' ? 'Making Active...' : 
                           isRowProcessing && processingAction === 'downloading' ? 'Downloading...' :
                           isRowProcessing && processingAction === 'deleting' ? 'Deleting...' :
                           isRowProcessing && processingAction === 'replacing' ? 'Replacing...' :
                           'Make Active'}
                        </button>
                      )}

                      {/* Overflow Menu Trigger */}
                      <div style={{ position: 'relative' }} className="overflow-menu-container">
                        <button
                          ref={(el) => {
                            triggerRefs.current[r.id] = el;
                          }}
                          type="button"
                          aria-label="Actions menu"
                          aria-haspopup="true"
                          aria-expanded={openMenuRowId === r.id}
                          disabled={isAnyActionProcessing}
                          onClick={(e) => handleOpenMenu(e, r)}
                          className="btn-overflow-trigger"
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF',
                            color: '#64748B',
                            cursor: isAnyActionProcessing ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isAnyActionProcessing ? 0.6 : 1,
                            boxSizing: 'border-box'
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Render menu inside React Portal to overlay on document.body and prevent clipping */}
      {openMenuRowId && menuPosition && activeResume && createPortal(
        <div
          role="menu"
          className={`portal-overflow-menu ${menuPosition.openUpward ? 'animate-dropdown-up' : 'animate-dropdown'}`}
          style={{
            position: 'fixed',
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            width: '180px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
            zIndex: 99999,
            padding: '6px',
            boxSizing: 'border-box'
          }}
        >
          {[
            {
              label: 'View Details', action: 'details', icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )
            },
            {
              label: 'Download', action: 'download', icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )
            },
            {
              label: 'Replace', action: 'replace', icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              )
            },
            {
              label: 'Delete', action: 'delete', isDestructive: true, icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              )
            }
          ]
          .filter((item) => !(activeResume.isActive && item.action === 'delete')) // Hide delete for active resume
          .map((item) => {
            const itemClass = item.isDestructive ? 'dropdown-item dropdown-item-destructive' : 'dropdown-item';
            
            return (
              <button
                key={item.action}
                role="menuitem"
                type="button"
                onClick={() => handleMenuAction(item.action, activeResume)}
                className={itemClass}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: item.isDestructive ? '#EF4444' : '#475569',
                  fontSize: '13px',
                  fontWeight: 550,
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  color: item.isDestructive ? '#EF4444' : '#94A3B8'
                }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};
