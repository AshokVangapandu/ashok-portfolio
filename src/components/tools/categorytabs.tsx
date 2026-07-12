/* src/components/tools/CategoryTabs.tsx */
import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        margin: '24px 0 32px 0',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className="hover-scale active-press"
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              border: isActive ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
              backgroundColor: isActive ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              color: isActive ? '#C4B5FD' : '#94A3B8',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              boxShadow: isActive ? '0 0 20px rgba(124, 58, 237, 0.1)' : 'none',
            }}
            onMouseOver={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              }
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
