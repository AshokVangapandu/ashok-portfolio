/* src/admin/pages/projects/components/ProjectsTable.tsx */
import React, { useState } from 'react';
import { Button } from '../../../components/buttons/Button';
import { AdminProject } from '../../../types/project';
import { EmptyState } from '../../../components/portfolio-content/EmptyState';
import { StatusBadge } from '../../../components/portfolio-content/StatusBadge';

interface ProjectsTableProps {
  projects: AdminProject[];
  onClearFilters?: () => void;
  isFiltered?: boolean;
  onEditClick: (proj: AdminProject) => void;
  onDeleteClick: (id: string) => void;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onClearFilters,
  isFiltered = false,
  onEditClick,
  onDeleteClick
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(p => p.id));
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
        title={isFiltered ? 'No matching projects' : 'No projects found'}
        description={
          isFiltered
            ? "We couldn't find any projects matching your search/filters. Try clearing your filters."
            : 'Start showcasing your portfolio by adding your first project.'
        }
        actionButton={
          isFiltered && onClearFilters ? (
            <Button
              variant="primary"
              onClick={onClearFilters}
              style={{ backgroundColor: '#7C5CFF', borderRadius: 'var(--admin-radius-sm)', marginTop: '8px' }}
            >
              Clear Search & Filters
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div
      className="admin-table-container"
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 'var(--admin-radius-md)',
        border: '1px solid var(--admin-border)',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
            <th style={{ padding: '14px 24px', width: '48px', backgroundColor: '#F8FAFC' }}>
              <input
                type="checkbox"
                checked={projects.length > 0 && selectedIds.length === projects.length}
                onChange={handleSelectAll}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
            </th>
            <th style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 16px', backgroundColor: '#F8FAFC' }}>
              Project
            </th>
            <th style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 16px', backgroundColor: '#F8FAFC' }}>
              Category
            </th>
            <th style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 16px', backgroundColor: '#F8FAFC' }}>
              Updated
            </th>
            <th style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 16px', backgroundColor: '#F8FAFC' }}>
              Status
            </th>
            <th style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 24px', backgroundColor: '#F8FAFC', textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => {
            const isSelected = selectedIds.includes(proj.id);
            const isHovered = hoveredRow === proj.id;

            return (
              <tr
                key={proj.id}
                onMouseEnter={() => setHoveredRow(proj.id)}
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
                <td style={{ padding: '0 24px', verticalAlign: 'middle' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectRow(proj.id)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </td>

                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(124, 92, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#7C5CFF',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {proj.coverImageUrl ? (
                        <img src={proj.coverImageUrl} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', lineHeight: '1.2' }}>
                        {proj.title}
                      </span>
                      {proj.client && (
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 550, marginTop: '2px' }}>
                          {proj.client}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 650 }}>
                    {proj.category}
                  </span>
                </td>

                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 550 }}>
                    {new Date(proj.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </td>

                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <StatusBadge status={proj.status} />
                </td>

                <td style={{ padding: '12px 24px', verticalAlign: 'middle', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      title="View"
                      onClick={() => console.log('TODO: View Project', proj.id)}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid rgba(59, 130, 246, 0.15)', backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#3B82F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEditClick(proj)}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid rgba(16, 185, 129, 0.15)', backgroundColor: 'rgba(16, 185, 129, 0.05)', color: '#10B981', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDeleteClick(proj.id)}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid rgba(239, 68, 68, 0.15)', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#EF4444', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
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
  );
};
