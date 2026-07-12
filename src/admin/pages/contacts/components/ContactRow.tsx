/* src/admin/pages/contacts/components/ContactRow.tsx */
import React from 'react';
import { ContactSubmission } from '../../../types/contact';
import { Avatar } from '../../../components/avatars/Avatar';
import { StatusBadge } from './StatusBadge';
import { ActionButtons } from './ActionButtons';

interface ContactRowProps {
  contact: ContactSubmission;
  onView?: (contact: ContactSubmission) => void;
  onReply?: (contact: ContactSubmission) => void;
}

export const ContactRow: React.FC<ContactRowProps> = ({
  contact,
  onView,
  onReply,
}) => {
  return (
    <tr 
      style={{ 
        borderBottom: '1px solid var(--admin-border)',
        transition: 'background 0.15s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'var(--admin-surface)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'none'}
    >
      {/* Contact info: Avatar, Name, Email */}
      <td style={{ padding: 'var(--admin-space-3) var(--admin-space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3)' }}>
          <Avatar 
            src={contact.avatarUrl} 
            name={contact.name} 
            size={36} 
            style={{ borderRadius: '50%' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span 
              style={{ 
                fontWeight: 600, 
                color: 'var(--admin-text)',
                fontSize: '13.5px' 
              }}
            >
              {contact.name}
            </span>
            <span 
              style={{ 
                fontSize: '11.5px', 
                color: 'var(--admin-text-secondary)' 
              }}
            >
              {contact.email}
            </span>
          </div>
        </div>
      </td>

      {/* Company */}
      <td 
        style={{ 
          padding: 'var(--admin-space-3) var(--admin-space-4)',
          fontWeight: 500,
          color: 'var(--admin-text)',
          fontSize: '13px'
        }}
      >
        {contact.company}
      </td>

      {/* Subject */}
      <td 
        style={{ 
          padding: 'var(--admin-space-3) var(--admin-space-4)',
          color: 'var(--admin-text)',
          fontSize: '13px',
          maxWidth: '240px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
        title={contact.subject}
      >
        {contact.subject}
      </td>

      {/* Date */}
      <td 
        style={{ 
          padding: 'var(--admin-space-3) var(--admin-space-4)',
          color: 'var(--admin-text-secondary)',
          fontSize: '13px',
          whiteSpace: 'nowrap'
        }}
      >
        {contact.date}
      </td>

      {/* Status */}
      <td style={{ padding: 'var(--admin-space-3) var(--admin-space-4)' }}>
        <StatusBadge status={contact.status} />
      </td>

      {/* Actions */}
      <td style={{ padding: 'var(--admin-space-3) var(--admin-space-4)' }}>
        <ActionButtons 
          onView={onView ? () => onView(contact) : undefined}
          onReply={onReply ? () => onReply(contact) : undefined}
        />
      </td>
    </tr>
  );
};

export default ContactRow;
