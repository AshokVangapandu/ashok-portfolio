/* src/admin/pages/projects/ProjectsPage.tsx */
import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioContentLayout } from '../../layout/PortfolioContentLayout';
import { ProjectsSummaryCards } from './components/ProjectsSummaryCards';
import { ProjectsToolbar } from './components/ProjectsToolbar';
import { ProjectsTable } from './components/ProjectsTable';
import { LoadingSkeleton } from '../testimonials/components/LoadingSkeleton';
import { projectService } from '../../services/projectService';
import { AdminProject } from '../../types/project';
import { Pagination } from '../../components/pagination/Pagination';
import { ProjectDrawer } from './components/ProjectDrawer';
import { DeleteDialog } from '../../components/portfolio-content/DeleteDialog';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);

  // Delete Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<AdminProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search, Filter, Sort, Pagination States
  const [searchVal, setSearchVal] = useState('');
  const [filterVal, setFilterVal] = useState('all');
  const [sortVal, setSortVal] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Fetch all projects
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('[ProjectsPage] Failed to fetch projects:', err);
      setError(err.message || 'Failed to fetch projects.');
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Error Loading Data', err.message || 'Failed to load projects.', 5000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchVal, filterVal]);

  // Combined Search + Filter + Sort
  const processedProjects = React.useMemo(() => {
    let result = [...projects];

    // 1. Filter
    if (filterVal === 'published') {
      result = result.filter(p => p.status === 'published');
    } else if (filterVal === 'draft') {
      result = result.filter(p => p.status === 'draft');
    } else if (filterVal === 'featured') {
      result = result.filter(p => p.isFeatured);
    }

    // 2. Search
    const query = searchVal.toLowerCase().trim();
    if (query) {
      result = result.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(query);
        const categoryMatch = p.category?.toLowerCase().includes(query);
        const clientMatch = p.client?.toLowerCase().includes(query);
        const techMatch = p.technologies?.some(t => t.toLowerCase().includes(query));
        return titleMatch || categoryMatch || clientMatch || techMatch;
      });
    }

    // 3. Sort
    if (sortVal === 'newest') {
      result.sort((a, b) => {
        const dateA = a.updatedAt ? Date.parse(a.updatedAt) : 0;
        const dateB = b.updatedAt ? Date.parse(b.updatedAt) : 0;
        return dateB - dateA;
      });
    } else if (sortVal === 'oldest') {
      result.sort((a, b) => {
        const dateA = a.updatedAt ? Date.parse(a.updatedAt) : 0;
        const dateB = b.updatedAt ? Date.parse(b.updatedAt) : 0;
        return dateA - dateB;
      });
    } else if (sortVal === 'title_asc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortVal === 'title_desc') {
      result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    return result;
  }, [projects, searchVal, filterVal, sortVal]);

  // Paginated chunk
  const paginatedProjects = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedProjects.slice(startIndex, startIndex + pageSize);
  }, [processedProjects, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processedProjects.length / pageSize));

  const handleClearFilters = () => {
    setSearchVal('');
    setFilterVal('all');
    setSortVal('newest');
  };

  // Calculate dynamic stats from full projects list (always global)
  const totalCount = projects.length;
  const publishedCount = projects.filter(p => p.status === 'published').length;
  const draftCount = projects.filter(p => p.status === 'draft').length;
  const featuredCount = projects.filter(p => p.isFeatured).length;

  const handleAddClick = () => {
    setDrawerMode('create');
    setSelectedProject(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (proj: AdminProject) => {
    setDrawerMode('edit');
    setSelectedProject(proj);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjectToDelete(proj);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await projectService.deleteProject(projectToDelete.id);
      
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('success', 'Project Deleted', 'Project deleted successfully.', 4000);
      }
      
      fetchData();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Delete Failed', err.message || 'Failed to delete project.', 5000);
      }
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  const handleSave = (savedData: AdminProject, shouldClose = true) => {
    fetchData();
    if (shouldClose) {
      setIsDrawerOpen(false);
    } else {
      setSelectedProject(savedData);
      setDrawerMode('edit');
    }
  };

  return (
    <PortfolioContentLayout
      title="📂 Projects"
      description="Manage and publish portfolio projects displayed on your portfolio website."
      primaryAction={{
        label: 'Add Project',
        onClick: handleAddClick
      }}
      stats={
        <ProjectsSummaryCards 
          total={totalCount}
          published={publishedCount}
          draft={draftCount}
          featured={featuredCount}
        />
      }
      toolbar={
        <ProjectsToolbar 
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
          Error loading projects: {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
          <ProjectsTable 
            projects={paginatedProjects} 
            isFiltered={searchVal.trim() !== '' || filterVal !== 'all'}
            onClearFilters={handleClearFilters}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={processedProjects.length}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Shared Form Framework Drawer for Add/Edit */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        selectedProject={selectedProject}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
      />

      {/* Shared Confirmation Dialog for Delete */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.title || 'this project'}"? This action cannot be undone.`}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </PortfolioContentLayout>
  );
};

export default ProjectsPage;
