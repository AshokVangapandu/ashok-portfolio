/* src/admin/pages/contacts/components/ContactsTable.tsx */
import React from 'react';
import { ContactSubmission } from '../../../types/contact';
import { Table } from '../../../components/tables/Table';
import { ContactRow } from './ContactRow';

interface ContactsTableProps {
  contacts: ContactSubmission[];
  onViewContact?: (contact: ContactSubmission) => void;
  onReplyContact?: (contact: ContactSubmission) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onViewContact,
  onReplyContact,
}) => {
  return (
    <Table headers={['Contact', 'Company', 'Subject', 'Date', 'Status', 'Actions']}>
      {contacts.map((contact) => (
        <ContactRow
          key={contact.id}
          contact={contact}
          onView={onViewContact}
          onReply={onReplyContact}
        />
      ))}
    </Table>
  );
};

export default ContactsTable;
