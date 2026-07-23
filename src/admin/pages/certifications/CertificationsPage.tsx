/* src/admin/pages/certifications/CertificationsPage.tsx */
import React, { useState, useEffect, useCallback } from 'react';
import { CertificationsSummaryCards } from './components/CertificationsSummaryCards';
import { CertificationsToolbar } from './components/CertificationsToolbar';
import { CertificationsTable } from './components/CertificationsTable';
import { CertificationDrawer } from './components/CertificationDrawer';
import { Certification } from './mockCertifications';
import { certificationService } from '../../services/certificationService';
import { LoadingSkeleton } from '../testimonials/components/LoadingSkeleton';
import { PortfolioContentLayout } from '../../layout/PortfolioContentLayout';
import { DeleteDialog } from '../../components/portfolio-content/DeleteDialog';

export const CertificationsPage: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Delete modal states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search, Filter, Sort States
  const [searchVal, setSearchVal] = useState('');
  const [filterVal, setFilterVal] = useState('all');
  const [sortVal, setSortVal] = useState('newest');

  // Fetch all certifications
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificationService.getCertifications();
      setCertifications(data as any);
    } catch (err: any) {
      console.error('[CertificationsPage] Failed to fetch data:', err);
      setError(err.message || 'Failed to fetch certifications.');
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Error Loading Data', err.message || 'Failed to load certifications.', 5000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combined Search + Filter + Sort
  const displayedCertifications = React.useMemo(() => {
    let result = [...certifications];

    // 1. Filter
    if (filterVal === 'published') {
      result = result.filter(c => c.status === 'published' || c.status === 'Published');
    } else if (filterVal === 'draft') {
      result = result.filter(c => c.status === 'draft' || c.status === 'Draft');
    } else if (filterVal === 'featured') {
      result = result.filter(c => c.isFeatured);
    }

    // 2. Search
    const query = searchVal.toLowerCase().trim();
    if (query) {
      result = result.filter(c => {
        const titleMatch = c.title?.toLowerCase().includes(query);
        const issuerMatch = c.issuer?.toLowerCase().includes(query);
        const categoryMatch = c.category?.toLowerCase().includes(query);
        const credentialIdMatch = c.credentialId?.toLowerCase().includes(query);
        const skillsMatch = c.skills?.some(s => s.toLowerCase().includes(query));
        return titleMatch || issuerMatch || categoryMatch || credentialIdMatch || skillsMatch;
      });
    }

    // 3. Sort
    if (sortVal === 'newest') {
      result.sort((a, b) => {
        const dateA = a.issueDate ? Date.parse(a.issueDate) : 0;
        const dateB = b.issueDate ? Date.parse(b.issueDate) : 0;
        return dateB - dateA;
      });
    } else if (sortVal === 'oldest') {
      result.sort((a, b) => {
        const dateA = a.issueDate ? Date.parse(a.issueDate) : 0;
        const dateB = b.issueDate ? Date.parse(b.issueDate) : 0;
        return dateA - dateB;
      });
    } else if (sortVal === 'title_asc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortVal === 'title_desc') {
      result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    return result;
  }, [certifications, searchVal, filterVal, sortVal]);

  const handleClearFilters = () => {
    setSearchVal('');
    setFilterVal('all');
    setSortVal('newest');
  };

  // Calculate dynamic stats from full certifications list (always global)
  const total = certifications.length;
  const published = certifications.filter(c => c.status === 'published' || c.status === 'Published').length;
  const draft = certifications.filter(c => c.status === 'draft' || c.status === 'Draft').length;
  const featured = certifications.filter(c => c.isFeatured).length;

  // Trigger Add drawer
  const handleAddClick = () => {
    setDrawerMode('create');
    setSelectedCert(null);
    setIsDrawerOpen(true);
  };

  // Trigger Edit drawer
  const handleEditClick = (cert: Certification) => {
    setDrawerMode('edit');
    setSelectedCert(cert);
    setIsDrawerOpen(true);
  };

  // Save changes callback
  const handleSave = (savedData: any) => {
    fetchData();
    setIsDrawerOpen(false);
  };

  // Trigger Delete confirmation modal
  const handleDeleteClick = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    if (!cert) return;
    setCertToDelete(cert);
    setDeleteDialogOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      await certificationService.deleteCertification(certToDelete.id);
      
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('success', 'Certification Deleted', 'Certification deleted successfully.', 4000);
      }
      
      fetchData();
      setDeleteDialogOpen(false);
    } catch (err: any) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Delete Failed', err.message || 'Failed to delete certification.', 5000);
      }
    } finally {
      setIsDeleting(false);
      setCertToDelete(null);
    }
  };

  return (
    <PortfolioContentLayout
      title="🏆 Certifications"
      description="Manage and publish professional certifications displayed on your portfolio."
      primaryAction={{
        label: 'Add Certification',
        onClick: handleAddClick
      }}
      stats={
        <CertificationsSummaryCards 
          total={total}
          published={published}
          draft={draft}
          featured={featured}
        />
      }
      toolbar={
        <CertificationsToolbar 
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          filterVal={filterVal}
          setFilterVal={setFilterVal}
          sortVal={sortVal}
          setSortVal={setSortVal}
        />
      }
    >
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FFFFFF', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
          Error loading certifications: {error}
        </div>
      ) : (
        <CertificationsTable 
          certifications={displayedCertifications} 
          onEditClick={handleEditClick} 
          onDeleteClick={handleDeleteClick}
          isFiltered={searchVal.trim() !== '' || filterVal !== 'all'}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Slide-in Edit/Create Drawer */}
      <CertificationDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        selectedCertification={selectedCert}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCertToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Certification"
        description={`Are you sure you want to delete the certification "${certToDelete?.title || ''}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </PortfolioContentLayout>
  );
};

export default CertificationsPage;
