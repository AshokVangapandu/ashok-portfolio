/* src/admin/pages/contacts/components/ContactsTable.tsx */
import React from 'react';
import { ContactSubmission } from '../../../types/contact';
import { Table } from '../../../components/tables/Table';
import { ContactRow } from './ContactRow';

interface ContactsTableProps {
  contacts: ContactSubmission[];
  onViewContact?: (contact: ContactSubmission) => void;
  onArchiveContact?: (contact: ContactSubmission) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onViewContact,
  onArchiveContact,
}) => {
  return (
    <Table headers={['Contact', 'Company', 'Subject', 'Date', 'Status', 'Actions']}>
      {contacts.map((contact) => (
        <ContactRow
          key={contact.id}
          contact={contact}
          onView={onViewContact}
          onArchive={onArchiveContact}
        />
      ))}
    </Table>
  );
};

export default ContactsTable;
