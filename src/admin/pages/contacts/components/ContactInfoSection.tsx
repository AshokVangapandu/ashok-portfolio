/* src/admin/pages/contacts/components/ContactInfoSection.tsx */
import React from 'react';
import { ContactSubmission } from '../../../types/contact';
import { Avatar } from '../../../components/avatars/Avatar';
import { StatusBadge } from './StatusBadge';

interface ContactInfoSectionProps {
  contact: ContactSubmission;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ contact }) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--admin-space-4)',
        paddingBottom: 'var(--admin-space-4)',
        borderBottom: '1px solid var(--admin-border)'
      }}
    >
      <h3 
        style={{ 
          fontSize: '14.5px', 
          fontWeight: 600, 
          color: 'var(--admin-text)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--admin-space-2)'
        }}
      >
        <span>👤</span> Contact Information
      </h3>

      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
        <Avatar 
          src={contact.avatarUrl} 
          name={contact.name} 
          size={56} 
          style={{ borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h4 
            style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              color: 'var(--admin-text)', 
              margin: 0 
            }}
          >
            {contact.name}
          </h4>
          <a 
            href={`mailto:${contact.email}`} 
            style={{ 
              fontSize: '13px', 
              color: 'var(--admin-secondary)', 
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            {contact.email}
          </a>
        </div>
      </div>

      {/* Grid Fields */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 'var(--admin-space-3) var(--admin-space-4)',
          marginTop: 'var(--admin-space-2)' 
        }}
      >
        <div>
          <span 
            style={{ 
              display: 'block', 
              fontSize: '11px', 
              color: 'var(--admin-text-secondary)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}
          >
            Company
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--admin-text)' }}>
            {contact.company || 'Not Provided'}
          </span>
        </div>

        <div>
          <span 
            style={{ 
              display: 'block', 
              fontSize: '11px', 
              color: 'var(--admin-text-secondary)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}
          >
            Phone
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--admin-text)' }}>
            {contact.phoneNumber || 'Not Provided'}
          </span>
        </div>

        <div>
          <span 
            style={{ 
              display: 'block', 
              fontSize: '11px', 
              color: 'var(--admin-text-secondary)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}
          >
            Status
          </span>
          <div style={{ display: 'inline-block', marginTop: '2px' }}>
            <StatusBadge status={contact.status} />
          </div>
        </div>

        <div>
          <span 
            style={{ 
              display: 'block', 
              fontSize: '11px', 
              color: 'var(--admin-text-secondary)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}
          >
            Submitted
          </span>
          <span style={{ fontSize: '13.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
            {contact.date}
          </span>
        </div>

        {contact.updatedAt && (
          <div style={{ gridColumn: 'span 2' }}>
            <span 
              style={{ 
                display: 'block', 
                fontSize: '11px', 
                color: 'var(--admin-text-secondary)', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '2px'
              }}
            >
              Last Updated
            </span>
            <span style={{ fontSize: '13.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              {contact.updatedAt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoSection;
