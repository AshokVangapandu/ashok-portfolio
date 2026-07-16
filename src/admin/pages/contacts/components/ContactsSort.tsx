/* src/admin/pages/contacts/components/ContactsSort.tsx */
import React from 'react';

interface ContactsSortProps {
  value: 'newest' | 'oldest';
  onChange: (value: 'newest' | 'oldest') => void;
}

export const ContactsSort: React.FC<ContactsSortProps> = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: "'Inter', sans-serif" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'newest' | 'oldest')}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-sm)',
          fontSize: '13px',
          fontWeight: 500,
          outline: 'none',
          color: 'var(--admin-text-secondary)',
          background: '#FFFFFF',
          boxShadow: 'var(--admin-shadow-sm)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-primary)';
          e.currentTarget.style.color = 'var(--admin-text)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.color = 'var(--admin-text-secondary)';
        }}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default ContactsSort;
