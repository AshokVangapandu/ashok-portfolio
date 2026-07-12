/* src/admin/pages/certifications/CertificationsPage.tsx */
import React, { useState } from 'react';
import { CertificationsHeader } from './components/CertificationsHeader';
import { CertificationsSummaryCards } from './components/CertificationsSummaryCards';
import { CertificationsToolbar } from './components/CertificationsToolbar';
import { CertificationsTable } from './components/CertificationsTable';
import { CertificationDrawer } from './components/CertificationDrawer';
import { MOCK_CERTIFICATIONS, Certification } from './mockCertifications';

export const CertificationsPage: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>(MOCK_CERTIFICATIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

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
  const handleSave = (savedData: Partial<Certification>) => {
    if (drawerMode === 'create') {
      const newCert: Certification = {
        id: savedData.id || `cert-${Date.now()}`,
        title: savedData.title || '',
        issuer: savedData.issuer || '',
        issueDate: savedData.issueDate || '',
        status: savedData.status || 'Published',
        thumbnailUrl: savedData.thumbnailUrl || ''
      };
      setCertifications([newCert, ...certifications]);
    } else {
      setCertifications(
        certifications.map(c => 
          c.id === selectedCert?.id 
            ? { ...c, ...savedData } 
            : c
        )
      );
    }
    setIsDrawerOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-5)' }}>
      {/* 1. Page Header */}
      <CertificationsHeader onAddClick={handleAddClick} />

      {/* 2. Overview Statistics Cards */}
      <CertificationsSummaryCards />

      {/* 3. Search Bar and Table contents */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CertificationsToolbar />
        <CertificationsTable 
          certifications={certifications} 
          onEditClick={handleEditClick} 
        />
      </div>

      {/* 4. Slide-in Edit/Create Drawer */}
      <CertificationDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        selectedCertification={selectedCert}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default CertificationsPage;
