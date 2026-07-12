/* src/admin/pages/contacts/ContactsPage.tsx */
import React from 'react';
import { useContacts } from '../../hooks/useContacts';
import { Card } from '../../components/cards/Card';
import { Pagination } from '../../components/pagination/Pagination';
import { ContactsHeader } from './components/ContactsHeader';
import { ContactsFilters } from './components/ContactsFilters';
import { ContactsSearch } from './components/ContactsSearch';
import { ContactsTable } from './components/ContactsTable';
import { ExportButton } from './components/ExportButton';

export const ContactsPage: React.FC = () => {
  const {
    submissions,
    allFilteredCount,
    stats,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  } = useContacts();

  const handleExport = () => {
    alert('Exporting contacts to CSV format...');
  };

  const handleView = (contact: any) => {
    alert(`Viewing message from ${contact.name}:\n\n"${contact.message}"`);
  };

  const handleReply = (contact: any) => {
    alert(`Replying to ${contact.name} (${contact.email})...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
      {/* Header Info */}
      <ContactsHeader />

      {/* Main card containing contacts table */}
      <Card
        title="Submissions"
        subtitle={`${stats.total} Total • ${stats.awaitingReply} Awaiting Reply`}
        headerAction={
          <div style={{ display: 'flex', gap: 'var(--admin-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <ContactsFilters value={statusFilter} onChange={setStatusFilter} />
            <ContactsSearch value={searchQuery} onChange={setSearchQuery} />
            <ExportButton onExport={handleExport} />
          </div>
        }
      >
        {isLoading ? (
          <div 
            style={{ 
              padding: 'var(--admin-space-12)', 
              textAlign: 'center', 
              color: 'var(--admin-text-secondary)'
            }}
          >
            Loading contact submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div 
            style={{ 
              padding: 'var(--admin-space-12)', 
              textAlign: 'center', 
              color: 'var(--admin-text-secondary)',
              border: '1px dashed var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)'
            }}
          >
            No contact submissions found matching the criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-3)' }}>
            <ContactsTable
              contacts={submissions}
              onViewContact={handleView}
              onReplyContact={handleReply}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalCount={allFilteredCount}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContactsPage;
