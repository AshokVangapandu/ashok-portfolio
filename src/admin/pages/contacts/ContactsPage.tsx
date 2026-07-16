/* src/admin/pages/contacts/ContactsPage.tsx */
import React, { useState } from 'react';
import { useContacts } from '../../hooks/useContacts';
import { Card } from '../../components/cards/Card';
import { Pagination } from '../../components/pagination/Pagination';
import { ContactsHeader } from './components/ContactsHeader';
import { ContactsFilters } from './components/ContactsFilters';
import { ContactsSearch } from './components/ContactsSearch';
import { ContactsTable } from './components/ContactsTable';
import { ExportButton } from './components/ExportButton';
import { ContactDetailsDrawer } from './components/ContactDetailsDrawer';
import { ContactsSort } from './components/ContactsSort';
import { contactExportService } from '../../services/contactExportService';
import { contactService } from '../../services/contactService';
import { ArchiveConfirmModal } from './components/ArchiveConfirmModal';
import { ContactSubmission } from '../../types/contact';

export const ContactsPage: React.FC = () => {
  const {
    submissions,
    allFilteredCount,
    stats,
    isLoading,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    refresh,
    clearFilters
  } = useContacts();

  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Archiving States
  const [contactToArchive, setContactToArchive] = useState<ContactSubmission | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [isArchiving, setIsArchiving] = useState<boolean>(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all records matching active search & filters (unpaginated)
      const { data } = await contactService.getSubmissions({
        search: searchInput,
        status: statusFilter,
        sortBy
      });

      if (!data || data.length === 0) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('error', 'Export Failed', 'No contacts available to export.', 5600);
        } else {
          alert('No contacts available to export.');
        }
        return;
      }

      // Execute export
      contactExportService.exportContacts(data, 'csv');

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('success', 'Export Succeeded', 'Contacts exported successfully.', 5600);
      } else {
        alert('Contacts exported successfully.');
      }
    } catch (err: any) {
      console.error('[ContactsPage] Export failed:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Export Failed', err.message || 'Failed to export contacts.', 5600);
      } else {
        alert(err.message || 'Failed to export contacts.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleView = (contact: ContactSubmission) => {
    setSelectedContactId(contact.id);
    setIsDrawerOpen(true);
  };

  const handleArchiveClick = (contact: ContactSubmission) => {
    setContactToArchive(contact);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (!contactToArchive) return;
    setIsArchiving(true);
    try {
      await contactService.archiveContact(contactToArchive.id);

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('success', 'Action Succeeded', 'Contact archived successfully.', 5600);
      } else {
        alert('Contact archived successfully.');
      }

      setIsArchiveModalOpen(false);
      setContactToArchive(null);
      refresh();
    } catch (err: any) {
      console.error('[ContactsPage] Archiving failed:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Action Failed', err.message || 'Failed to archive contact.', 5600);
      } else {
        alert(err.message || 'Failed to archive contact.');
      }
    } finally {
      setIsArchiving(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContactId(null);
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
            <ContactsSort value={sortBy} onChange={setSortBy} />
            <ContactsSearch value={searchInput} onChange={setSearchInput} />
            <ExportButton onExport={handleExport} isLoading={isExporting} />
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
              borderRadius: 'var(--admin-radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--admin-space-4)'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 500 }}>No contacts found.</span>
            <button
              onClick={clearFilters}
              style={{
                padding: '8px 16px',
                background: 'var(--admin-surface, #F4F4F5)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--admin-text)',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--admin-border)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--admin-surface)'}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-3)' }}>
            <ContactsTable
              contacts={submissions}
              onViewContact={handleView}
              onArchiveContact={handleArchiveClick}
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

      {/* Details Slide-out Drawer */}
      <ContactDetailsDrawer
        isOpen={isDrawerOpen}
        contactId={selectedContactId}
        onClose={handleCloseDrawer}
        onReplySuccess={refresh}
      />

      {/* Archive Confirmation dialog */}
      <ArchiveConfirmModal
        isOpen={isArchiveModalOpen}
        contactName={contactToArchive?.name || ''}
        isArchiving={isArchiving}
        onClose={() => {
          setIsArchiveModalOpen(false);
          setContactToArchive(null);
        }}
        onConfirm={handleArchiveConfirm}
      />
    </div>
  );
};

export default ContactsPage;
