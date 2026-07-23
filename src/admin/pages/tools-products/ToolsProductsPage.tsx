/* src/admin/pages/tools-products/ToolsProductsPage.tsx */
import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioContentLayout } from '../../layout/PortfolioContentLayout';
import { ToolsProductsSummaryCards } from './components/ToolsProductsSummaryCards';
import { ToolsProductsToolbar } from './components/ToolsProductsToolbar';
import { ToolsProductsTable } from './components/ToolsProductsTable';
import { LoadingState } from '../../components/portfolio-content/LoadingState';
import { toolsProductsService } from '../../services/toolsProductsService';
import { ToolsProduct } from '../../types/toolsProducts';
import { ToolsProductsDrawer } from './components/ToolsProductsDrawer';
import { DeleteDialog } from '../../components/portfolio-content/DeleteDialog';

export const ToolsProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ToolsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter, Sort States
  const [searchVal, setSearchVal] = useState('');
  const [filterVal, setFilterVal] = useState('all');
  const [sortVal, setSortVal] = useState('newest');

  // Overlay states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<ToolsProduct | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ToolsProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all products
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await toolsProductsService.getToolsProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('[ToolsProductsPage] Fetch data failed:', err);
      setError(err.message || 'Failed to fetch tools and products.');
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Error Loading Data', err.message || 'Failed to load products.', 5000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search + Filter + Sort calculations
  const displayedProducts = React.useMemo(() => {
    let result = [...products];

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
        const versionMatch = p.version?.toLowerCase().includes(query);
        const techMatch = p.technologies?.some(t => t.toLowerCase().includes(query));
        return titleMatch || categoryMatch || versionMatch || techMatch;
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
  }, [products, searchVal, filterVal, sortVal]);

  const handleClearFilters = () => {
    setSearchVal('');
    setFilterVal('all');
    setSortVal('newest');
  };

  // Stats Counters
  const total = products.length;
  const published = products.filter(p => p.status === 'published').length;
  const draft = products.filter(p => p.status === 'draft').length;
  const featured = products.filter(p => p.isFeatured).length;

  const handleAddClick = () => {
    setDrawerMode('create');
    setSelectedProduct(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (prod: ToolsProduct) => {
    setDrawerMode('edit');
    setSelectedProduct(prod);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setProductToDelete(prod);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await toolsProductsService.deleteToolsProduct(productToDelete.id);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('success', 'Product Deleted', 'Product deleted successfully.', 4000);
      }
      fetchData();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Delete Failed', err.message || 'Failed to delete product.', 5000);
      }
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleSave = (saved: ToolsProduct) => {
    fetchData();
    setIsDrawerOpen(false);
  };

  return (
    <PortfolioContentLayout
      title="🛠️ Tools & Products"
      description="Manage your custom tools, widgets, plugins, libraries, utilities, and other engineering products displayed in your portfolio."
      primaryAction={{
        label: 'Add Tool',
        onClick: handleAddClick
      }}
      stats={
        <ToolsProductsSummaryCards 
          total={total}
          published={published}
          draft={draft}
          featured={featured}
        />
      }
      toolbar={
        <ToolsProductsToolbar 
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
        <LoadingState />
      ) : error ? (
        <div 
          style={{ 
            padding: '40px 24px', 
            textAlign: 'center', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 'var(--admin-radius-md)', 
            border: '1px solid var(--admin-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <span style={{ color: '#EF4444', fontWeight: 600, fontSize: '15px' }}>
            Error: {error}
          </span>
          <button
            type="button"
            onClick={fetchData}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#7C5CFF',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <ToolsProductsTable 
          products={displayedProducts} 
          onClearFilters={handleClearFilters}
          isFiltered={searchVal.trim() !== '' || filterVal !== 'all'}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      )}

      {/* Shared Form Framework Drawer for Tools/Products */}
      <ToolsProductsDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        selectedProduct={selectedProduct}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
      />

      {/* Shared Confirmation Dialog for Delete */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.title || 'this product'}"? This action cannot be undone.`}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </PortfolioContentLayout>
  );
};

export default ToolsProductsPage;
