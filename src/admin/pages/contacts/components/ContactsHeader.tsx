/* src/admin/pages/contacts/components/ContactsHeader.tsx */
import React from 'react';

export const ContactsHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: 'var(--admin-space-4)', fontFamily: "'Inter', sans-serif" }}>
      <h2 
        className="text-heading-lg" 
        style={{ 
          margin: 0, 
          fontSize: '26px', 
          fontWeight: 700, 
          color: 'var(--admin-text)' 
        }}
      >
        Contacts
      </h2>
      <p 
        className="text-subtitle" 
        style={{ 
          margin: 'var(--admin-space-1.5) 0 0 0', 
          fontSize: '14px', 
          color: 'var(--admin-text-secondary)' 
        }}
      >
        Manage and respond to portfolio contact submissions.
      </p>
    </div>
  );
};

export default ContactsHeader;
