/* src/admin/pages/contacts/components/ContactMessageSection.tsx */
import React from 'react';
import { ContactSubmission } from '../../../types/contact';

interface ContactMessageSectionProps {
  contact: ContactSubmission;
}

export const ContactMessageSection: React.FC<ContactMessageSectionProps> = ({ contact }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
      {/* Subject Section */}
      <div 
        style={{ 
          paddingBottom: 'var(--admin-space-4)',
          borderBottom: '1px solid var(--admin-border)' 
        }}
      >
        <span 
          style={{ 
            display: 'block', 
            fontSize: '11.5px', 
            color: 'var(--admin-text-secondary)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--admin-space-1)'
          }}
        >
          Subject
        </span>
        <h3 
          style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            color: 'var(--admin-text)', 
            margin: 0,
            lineHeight: 1.4 
          }}
        >
          {contact.subject}
        </h3>
      </div>

      {/* Message Content Section */}
      <div>
        <span 
          style={{ 
            display: 'block', 
            fontSize: '11.5px', 
            color: 'var(--admin-text-secondary)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--admin-space-2)'
          }}
        >
          Message
        </span>
        <div 
          style={{ 
            fontSize: '13.5px', 
            lineHeight: 1.6, 
            color: 'var(--admin-text)', 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            background: 'var(--admin-surface)',
            padding: 'var(--admin-space-4)',
            borderRadius: 'var(--admin-radius-md)',
            border: '1px solid var(--admin-border)',
            fontFamily: 'inherit'
          }}
        >
          {contact.message}
        </div>
      </div>
    </div>
  );
};

export default ContactMessageSection;
