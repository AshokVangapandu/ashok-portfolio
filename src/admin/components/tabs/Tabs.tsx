/* src/admin/components/tabs/Tabs.tsx */
import React from 'react';

interface TabOption {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeId,
  onChange,
  className = '',
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--admin-border)',
        width: '100%',
        gap: 'var(--admin-space-4)',
        fontFamily: "'Manrope', sans-serif",
        ...style
      }}
    >
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              padding: 'var(--admin-space-3) 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '13.5px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-space-1.5)',
              transition: 'color 0.15s ease'
            }}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  fontSize: '10px',
                  background: isActive ? 'var(--admin-primary)' : 'var(--admin-border)',
                  color: isActive ? '#FFFFFF' : 'var(--admin-text-secondary)',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                {opt.count}
              </span>
            )}
            {isActive && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'var(--admin-primary)',
                  borderRadius: '9999px'
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
