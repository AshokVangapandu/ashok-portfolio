/* src/admin/pages/contacts/components/ContactsSearch.tsx */
import React from 'react';

interface ContactsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ContactsSearch: React.FC<ContactsSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search contacts...',
}) => {
  return (
    <div 
      style={{
        position: 'relative',
        width: '240px',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <span 
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--admin-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px 8px 32px',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-sm)',
          fontSize: '13px',
          outline: 'none',
          color: 'var(--admin-text)',
          background: '#FFFFFF',
          boxShadow: 'var(--admin-shadow-sm)',
          transition: 'all 0.15s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-primary)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
        }}
      />
    </div>
  );
};

export default ContactsSearch;
