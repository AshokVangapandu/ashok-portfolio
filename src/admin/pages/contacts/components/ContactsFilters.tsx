/* src/admin/pages/contacts/components/ContactsFilters.tsx */
import React from 'react';

interface ContactsFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export const ContactsFilters: React.FC<ContactsFiltersProps> = ({
  value,
  onChange,
}) => {
  const filters = [
    { label: 'All', id: 'all' },
    { label: 'Open', id: 'open' },
    { label: 'Replied', id: 'replied' },
    { label: 'Archived', id: 'archived' }
  ];

  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: 'var(--admin-space-2)',
        background: 'var(--admin-surface)',
        padding: '4px',
        borderRadius: 'var(--admin-radius-sm)',
        width: 'fit-content'
      }}
    >
      {filters.map((filter) => {
        const isActive = value === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className="active-press"
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              background: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
              boxShadow: isActive ? 'var(--admin-shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              fontFamily: "'Manrope', sans-serif"
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default ContactsFilters;
