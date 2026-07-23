/* src/admin/pages/tools-products/components/ToolsProductsToolbar.tsx */
import React from 'react';
import { PortfolioContentToolbar } from '../../../layout/PortfolioContentLayout';
import { SearchBar } from '../../../components/portfolio-content/SearchBar';
import { FilterControl } from '../../../components/portfolio-content/FilterControl';
import { SortControl } from '../../../components/portfolio-content/SortControl';

interface ToolsProductsToolbarProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  filterVal: string;
  setFilterVal: (val: string) => void;
  sortVal: string;
  setSortVal: (val: string) => void;
}

export const ToolsProductsToolbar: React.FC<ToolsProductsToolbarProps> = ({
  searchVal,
  setSearchVal,
  filterVal,
  setFilterVal,
  sortVal,
  setSortVal
}) => {
  const filterOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Featured', value: 'featured' }
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name A–Z', value: 'title_asc' },
    { label: 'Name Z–A', value: 'title_desc' }
  ];

  return (
    <PortfolioContentToolbar>
      <SearchBar
        value={searchVal}
        onChange={setSearchVal}
        placeholder="Search tools & products by name, category, or tags..."
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <FilterControl
          value={filterVal}
          onChange={setFilterVal}
          options={filterOptions}
        />

        <SortControl
          value={sortVal}
          onChange={setSortVal}
          options={sortOptions}
        />
      </div>
    </PortfolioContentToolbar>
  );
};

export default ToolsProductsToolbar;
