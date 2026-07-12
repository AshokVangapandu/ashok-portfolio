/* src/admin/components/tables/Table.tsx */
import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  className = '',
  style,
}) => {
  return (
    <div 
      className={className}
      style={{
        width: '100%',
        overflowX: 'auto',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        background: '#FFFFFF',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      <table 
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '13.5px',
        }}
      >
        <thead>
          <tr 
            style={{
              background: 'var(--admin-surface)',
              borderBottom: '1px solid var(--admin-border)',
            }}
          >
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                style={{
                  padding: 'var(--admin-space-3) var(--admin-space-4)',
                  fontWeight: 600,
                  color: 'var(--admin-text-secondary)',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody 
          style={{
            color: 'var(--admin-text)',
          }}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
