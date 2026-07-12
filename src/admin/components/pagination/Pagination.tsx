/* src/admin/components/pagination/Pagination.tsx */
import React from 'react';
import { Button } from '../buttons/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalCount = 0,
  pageSize = 8,
  onPageSizeChange,
  className = '',
  style,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--admin-space-4) 0',
        width: '100%',
        fontFamily: "'Inter', sans-serif",
        flexWrap: 'wrap',
        gap: 'var(--admin-space-3)',
        ...style
      }}
    >
      {/* Bottom Left: Showing X-Y of Z */}
      <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
        {totalCount > 0 ? (
          <span>
            Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{totalCount}</strong>
          </span>
        ) : (
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Bottom Center: Paging button controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-1.5)' }}>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '6px 12px' }}
        >
          Previous
        </Button>

        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span 
                key={`ellipsis-${idx}`} 
                style={{ 
                  padding: '0 6px', 
                  color: 'var(--admin-text-secondary)',
                  fontSize: '13px'
                }}
              >
                ...
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p as number)}
              className="active-press"
              style={{
                width: '32px',
                height: '32px',
                border: isCurrent ? 'none' : '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius-sm)',
                background: isCurrent ? 'var(--admin-primary)' : '#FFFFFF',
                color: isCurrent ? '#FFFFFF' : 'var(--admin-text)',
                fontSize: '13px',
                fontWeight: isCurrent ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.borderColor = 'var(--admin-primary)';
                  e.currentTarget.style.color = 'var(--admin-primary)';
                  e.currentTarget.style.background = 'var(--admin-surface)';
                }
              }}
              onMouseOut={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.borderColor = 'var(--admin-border)';
                  e.currentTarget.style.color = 'var(--admin-text)';
                  e.currentTarget.style.background = '#FFFFFF';
                }
              }}
            >
              {p}
            </button>
          );
        })}

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '6px 12px' }}
        >
          Next
        </Button>
      </div>

      {/* Bottom Right: Rows per page dropdown */}
      {onPageSizeChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2)', fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: '4px 24px 4px 8px',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-sm)',
              background: '#FFFFFF',
              color: 'var(--admin-text)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 6px center',
              backgroundSize: '10px',
            }}
          >
            {[4, 8, 12, 16, 24, 32].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
