/* src/admin/pages/certifications/components/CertificationsTable.tsx */
import React, { useState } from 'react';
import { Card } from '../../../components/cards/Card';
import { Button } from '../../../components/buttons/Button';
import { Certification } from '../mockCertifications';

interface CertificationsTableProps {
  certifications: Certification[];
  onEditClick: (cert: Certification) => void;
}

export const CertificationsTable: React.FC<CertificationsTableProps> = ({ certifications, onEditClick }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Toggle selection for individual rows
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Toggle selection for all rows
  const handleSelectAll = () => {
    if (selectedIds.length === certifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(certifications.map(c => c.id));
    }
  };

  // Empty state handler
  if (!certifications || certifications.length === 0) {
    return (
      <Card style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--admin-surface)',
              color: 'var(--admin-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
              <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
              No certifications found
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-secondary)', maxWidth: '320px' }}>
              Add your first credential to showcase your professional certifications on your portfolio.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => console.log('TODO: Add Certification')}
            style={{ backgroundColor: '#7C5CFF', borderRadius: 'var(--admin-radius-sm)', marginTop: '8px' }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Certification
          </Button>
        </div>
      </Card>
    );
  }

  // Get color styles for status badges
  const getBadgeStyle = (status: Certification['status']) => {
    switch (status) {
      case 'Published':
      case 'Featured':
        return {
          bg: 'rgba(16, 185, 129, 0.08)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.15)'
        };
      case 'Draft':
        return {
          bg: 'rgba(245, 158, 11, 0.08)',
          color: '#F59E0B',
          border: '1px solid rgba(245, 158, 11, 0.15)'
        };
      case 'Expired':
        return {
          bg: 'rgba(239, 68, 68, 0.08)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.15)'
        };
      case 'Archived':
        return {
          bg: 'rgba(100, 116, 139, 0.08)',
          color: '#64748B',
          border: '1px solid rgba(100, 116, 139, 0.15)'
        };
    }
  };

  return (
    <div
      className="admin-table-container"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(226, 232, 240, 0.8)',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Scrollbar styling injected via CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-table-scroll-wrapper::-webkit-scrollbar {
          height: 6px;
        }
        .admin-table-scroll-wrapper::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }
        .admin-table-scroll-wrapper::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.8);
          border-radius: 99px;
        }
        .admin-table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }
      `}} />

      <div className="admin-table-scroll-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
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
                backgroundColor: 'rgba(248, 250, 252, 0.7)',
                borderBottom: '1.5px solid rgba(226, 232, 240, 0.8)',
                height: '48px'
              }}
            >
              {/* Checkbox Column (Sticky Table Header) */}
              <th
                style={{
                  padding: '0 24px',
                  width: '40px',
                  verticalAlign: 'middle',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#F8FAFC'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.length === certifications.length}
                  onChange={handleSelectAll}
                  style={{
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1.5px solid rgba(203, 213, 225, 1)'
                  }}
                />
              </th>
              {/* Certificate Detail Column (Sticky Table Header) */}
              <th
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '14px 16px',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#F8FAFC'
                }}
              >
                Certificate
              </th>
              {/* Organization Column (Sticky Table Header) */}
              <th
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '14px 16px',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#F8FAFC'
                }}
              >
                Organization
              </th>
              {/* Date Issued Column (Sticky Table Header) */}
              <th
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '14px 16px',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#F8FAFC'
                }}
              >
                Issued
              </th>
              {/* Status Badge Column (Sticky Table Header) */}
              <th
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '14px 16px',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#F8FAFC'
                }}
              >
                Status
              </th>
              {/* Action Buttons Column (Sticky Table Header) */}
              <th
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '14px 24px',
                  textAlign: 'right',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#F8FAFC'
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => {
              const badge = getBadgeStyle(cert.status);
              const isSelected = selectedIds.includes(cert.id);
              const isHovered = hoveredRow === cert.id;

              return (
                <tr
                  key={cert.id}
                  onMouseEnter={() => setHoveredRow(cert.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
                    backgroundColor: isSelected 
                      ? 'rgba(124, 92, 255, 0.03)' 
                      : isHovered 
                        ? 'rgba(124, 92, 255, 0.015)' 
                        : 'transparent',
                    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '60px'
                  }}
                >
                  {/* Select Checkbox Cell */}
                  <td style={{ padding: '0 24px', verticalAlign: 'middle' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(cert.id)}
                      style={{
                        cursor: 'pointer',
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: '1.5px solid rgba(203, 213, 225, 1)'
                      }}
                    />
                  </td>

                  {/* Certificate Title & View link Cell */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#0F172A'
                        }}
                      >
                        {cert.title}
                      </span>
                      <a
                        href="/certifications"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('TODO: Navigate to preview full cert');
                        }}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#7C5CFF',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          width: 'fit-content'
                        }}
                      >
                        View credential →
                      </a>
                    </div>
                  </td>

                  {/* Organization Issuer Cell */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 650 }}>
                      {cert.issuer}
                    </span>
                  </td>

                  {/* Issue Date Cell */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>
                      {cert.issueDate}
                    </span>
                  </td>

                  {/* Status Badge Cell (Standardized Badges) */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        height: '24px',
                        padding: '0 12px',
                        borderRadius: '999px',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: badge.border,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      {cert.status}
                    </span>
                  </td>

                  {/* Row Actions Cell */}
                  <td style={{ padding: '12px 24px', verticalAlign: 'middle', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {/* Preview Button */}
                      <button
                        type="button"
                        title="Preview"
                        onClick={() => console.log('TODO: Preview', cert.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1.5px solid rgba(59, 130, 246, 0.15)',
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          color: '#3B82F6',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#3B82F6';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                          e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEditClick(cert)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1.5px solid rgba(124, 92, 255, 0.15)',
                          backgroundColor: 'rgba(124, 92, 255, 0.05)',
                          color: '#7C5CFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(124, 92, 255, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(124, 92, 255, 0.05)';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#7C5CFF';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 92, 255, 0.2)';
                          e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.15)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => console.log('TODO: Delete', cert.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '1.5px solid rgba(100, 116, 139, 0.15)',
                          backgroundColor: 'rgba(100, 116, 139, 0.05)',
                          color: '#64748B',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.05)';
                          e.currentTarget.style.color = '#64748B';
                          e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.15)';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#EF4444';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                          e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.15)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Placeholder */}
      <div
        style={{
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF'
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: '#64748B',
            fontWeight: 500
          }}
        >
          Showing 6 of {certifications.length} certifications
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Previous Arrow */}
          <button
            type="button"
            disabled
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              backgroundColor: '#FFFFFF',
              color: '#94A3B8',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'not-allowed',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
          >
            &lt;
          </button>
          
          {/* Active 1 Indicator */}
          <button
            type="button"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#7C5CFF',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
          >
            1
          </button>

          {/* Inactive 2 Indicator */}
          <button
            type="button"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#7C5CFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            2
          </button>

          {/* Inactive 3 Indicator */}
          <button
            type="button"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#7C5CFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            3
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              backgroundColor: '#FFFFFF',
              color: '#94A3B8',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
              e.currentTarget.style.color = '#7C5CFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificationsTable;
