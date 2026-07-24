/* src/admin/pages/tools-products/components/ToolsProductsDrawer.tsx */
import React, { useState, useEffect } from 'react';
import { ToolsProduct, ProductCapability } from '../../../types/toolsProducts';
import { toolsProductsService } from '../../../services/toolsProductsService';
import { MediaUpload } from '../../../components/portfolio-content/MediaUpload';
import { FormContainer } from '../../../components/portfolio-content/FormContainer';
import { FormSection } from '../../../components/portfolio-content/FormSection';
import { FormTextField } from '../../../components/portfolio-content/FormTextField';
import { FormToggle } from '../../../components/portfolio-content/FormToggle';
import { FormTagSelector } from '../../../components/portfolio-content/FormTagSelector';
import { supabase } from '../../../../services/supabase/client';

interface ToolsProductsDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  selectedProduct: ToolsProduct | null;
  onClose: () => void;
  onSave: (data: ToolsProduct) => void;
}

export const ToolsProductsDrawer: React.FC<ToolsProductsDrawerProps> = ({
  isOpen,
  mode,
  selectedProduct,
  onClose,
  onSave
}) => {
  // Form Fields States
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Widget' | 'Action' | 'Template' | 'Plugin' | 'Tool'>('Widget');
  const [version, setVersion] = useState('1.0.0');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [problemSolved, setProblemSolved] = useState('');

  // Stats
  const [rating, setRating] = useState('5.0');
  const [downloads, setDownloads] = useState('0');
  const [views, setViews] = useState('0');

  // Links
  const [marketplaceUrl, setMarketplaceUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  // Toggles
  const [isFeatured, setIsFeatured] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Media
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewPreview, setPreviewPreview] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Technologies state
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // Capabilities repeater state
  const [capabilities, setCapabilities] = useState<ProductCapability[]>([]);

  // Escape key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Populate data when drawer opens or changes mode
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selectedProduct) {
        setTitle(selectedProduct.title || '');
        setType(selectedProduct.type || 'Widget');
        setVersion(selectedProduct.version || '1.0.0');
        setCategory(selectedProduct.category || '');
        setDescription(selectedProduct.description || '');
        setProblemSolved(selectedProduct.problemSolved || '');
        setRating(String(selectedProduct.rating || 5.0));
        setDownloads(String(selectedProduct.downloads || 0));
        setViews(String(selectedProduct.views || 0));
        setMarketplaceUrl(selectedProduct.marketplaceUrl || '');
        setGithubUrl(selectedProduct.githubUrl || '');
        setDocsUrl(selectedProduct.docsUrl || '');
        setDemoUrl(selectedProduct.demoUrl || '');
        setIsFeatured(selectedProduct.isFeatured || false);
        setIsComingSoon(selectedProduct.isComingSoon || false);
        setStatus(selectedProduct.status || 'draft');
        setCoverPreview(selectedProduct.coverImageUrl || null);
        setPreviewPreview(selectedProduct.previewImageUrl || null);
        setTechnologies(selectedProduct.technologies || []);
        setCapabilities(selectedProduct.capabilities || []);
        setCoverFile(null);
        setPreviewFile(null);
      } else {
        // Clear all fields for Create Mode
        setTitle('');
        setType('Widget');
        setVersion('1.0.0');
        setCategory('');
        setDescription('');
        setProblemSolved('');
        setRating('5.0');
        setDownloads('0');
        setViews('0');
        setMarketplaceUrl('');
        setGithubUrl('');
        setDocsUrl('');
        setDemoUrl('');
        setIsFeatured(false);
        setIsComingSoon(false);
        setStatus('draft');
        setCoverPreview(null);
        setPreviewPreview(null);
        setTechnologies([]);
        setTechInput('');
        setCapabilities([]);
        setCoverFile(null);
        setPreviewFile(null);
      }
    }
  }, [isOpen, mode, selectedProduct]);

  if (!isOpen) return null;

  // Technology List events
  const handleRemoveTech = (techToRemove: string) => {
    setTechnologies(technologies.filter(t => t !== techToRemove));
  };

  // Capabilities List events
  const handleAddCapability = () => {
    setCapabilities([...capabilities, { title: '', description: '', icon: 'check-circle' }]);
  };

  const handleRemoveCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, idx) => idx !== index));
  };

  const handleCapabilityChange = (index: number, field: keyof ProductCapability, value: string) => {
    const updated = [...capabilities];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setCapabilities(updated);
  };

  // Trigger form submission
  const handleSubmit = async (statusOverride?: 'draft' | 'published') => {
    // Validation
    if (!title.trim() || !category.trim()) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Validation Error', 'Please fill in all required fields (*).', 5000);
      }
      return;
    }

    const currentStatus = statusOverride || status;

    setIsSubmitting(true);
    try {
      let coverUrl = coverPreview;
      let previewUrl = previewPreview;

      // Simulate file upload mapping urls
      if (coverFile) {
        const path = `cover-${Date.now()}-${coverFile.name}`;
        coverUrl = supabase.storage.from('tools-products').getPublicUrl(path).data.publicUrl;
      }
      if (previewFile) {
        const path = `preview-${Date.now()}-${previewFile.name}`;
        previewUrl = supabase.storage.from('tools-products').getPublicUrl(path).data.publicUrl;
      }

      const payload: ToolsProduct = {
        id: selectedProduct?.id || `tool-${Date.now()}`,
        title,
        description,
        type,
        version,
        category,
        coverImageUrl: coverUrl,
        previewImageUrl: previewUrl,
        rating: Number(rating) || 5.0,
        downloads: Number(downloads) || 0,
        views: Number(views) || 0,
        updatedAt: new Date().toISOString(),
        marketplaceUrl: marketplaceUrl || null,
        githubUrl: githubUrl || null,
        docsUrl: docsUrl || null,
        demoUrl: demoUrl || null,
        isFeatured,
        isComingSoon,
        problemSolved: problemSolved || null,
        status: currentStatus,
        capabilities,
        technologies,
        features: capabilities.map(c => c.title)
      };

      if (mode === 'create') {
        await toolsProductsService.createToolsProduct(payload);
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('success', 'Product Created', 'Product created successfully.', 4000);
        }
      } else {
        await toolsProductsService.updateToolsProduct(payload.id, payload);
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('success', 'Product Updated', 'Product updated successfully.', 4000);
        }
      }

      onSave(payload);
    } catch (err: any) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Submission Failed', err.message || 'Failed to save product.', 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerActions = (
    <>
      <button
        type="button"
        onClick={onClose}
        style={{
          padding: '10px 20px',
          border: '1px solid rgba(226, 232, 240, 1)',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          color: '#475569',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
      >
        Cancel
      </button>

      {mode === 'create' ? (
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(226, 232, 240, 1)',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: isSubmitting ? '#94A3B8' : '#475569',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: isSubmitting ? '#94A3B8' : '#7C5CFF',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(124, 92, 255, 0.25)',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#6D4EE3';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#7C5CFF';
            }}
          >
            Publish
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(226, 232, 240, 1)',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: isSubmitting ? '#94A3B8' : '#475569',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: isSubmitting ? '#94A3B8' : '#7C5CFF',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(124, 92, 255, 0.25)',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#6D4EE3';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#7C5CFF';
            }}
          >
            Update & Publish
          </button>
        </>
      )}
    </>
  );

  return (
    <FormContainer
      title={mode === 'create' ? 'Add New Product' : 'Edit Product'}
      description={
        mode === 'create'
          ? 'Add a new action, plugin, template or widget to your portfolio.'
          : 'Update product properties, listing assets, and capability items.'
      }
      onClose={onClose}
      isSubmitting={isSubmitting}
      actions={footerActions}
    >
      <FormSection title="Section 1 — Basic Information" columns="1fr 1fr">
        <FormTextField
          label="Product Name"
          placeholder="e.g., Gantt Chart Action Scheduler"
          value={title}
          onChange={setTitle}
          required
          disabled={isSubmitting}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 650, color: 'var(--admin-text)', marginBottom: '4px' }}>
            Product Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontFamily: 'inherit',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box'
            }}
          >
            <option value="Widget">Widget</option>
            <option value="Action">Action</option>
            <option value="Template">Template</option>
            <option value="Plugin">Plugin</option>
            <option value="Tool">Tool</option>
          </select>
        </div>
        <FormTextField
          label="Version"
          placeholder="e.g., 1.2.0"
          value={version}
          onChange={setVersion}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Category"
          placeholder="e.g., Scheduler, Data, Connectors"
          value={category}
          onChange={setCategory}
          required
          disabled={isSubmitting}
        />
        <FormTextField
          label="Problem Solved"
          placeholder="What challenges does this product solve?"
          value={problemSolved}
          onChange={setProblemSolved}
          type="textarea"
          rows={2}
          disabled={isSubmitting}
        />
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', marginTop: '16px' }}>
          <FormToggle
            label="Is Coming Soon?"
            checked={isComingSoon}
            onChange={setIsComingSoon}
            activeColor="#F59E0B"
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Section 2 — Media" columns="1fr 1fr">
        <MediaUpload
          label="Hero Image / Icon"
          helperText="PNG, JPG or SVG up to 5MB"
          previewUrl={coverPreview}
          file={coverFile}
          onChange={(file, preview) => {
            setCoverFile(file);
            setCoverPreview(preview);
          }}
          disabled={isSubmitting}
        />
        <MediaUpload
          label="Preview Screenshot"
          helperText="PNG or JPG up to 10MB"
          previewUrl={previewPreview}
          file={previewFile}
          onChange={(file, preview) => {
            setPreviewFile(file);
            setPreviewPreview(preview);
          }}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 3 — Product Details">
        <FormTextField
          label="Description"
          placeholder="Add a detailed description of the product features..."
          value={description}
          onChange={setDescription}
          type="textarea"
          rows={3}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 4 — Capabilities (Normalized Repeater)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--admin-text-secondary)', display: 'block' }}>
            List capabilities with custom icons & notes
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {capabilities.map((cap, idx) => (
              <div key={idx} style={{ padding: '16px', border: '1px solid var(--admin-border)', borderRadius: '10px', backgroundColor: 'var(--admin-bg-hover)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => handleRemoveCapability(idx)}
                  disabled={isSubmitting}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 700
                  }}
                  title="Remove Capability"
                >
                  &times;
                </button>
                <div style={{ display: 'flex', gap: '10px', width: '92%' }}>
                  <div style={{ flex: 2 }}>
                    <input
                      type="text"
                      placeholder="Capability Title * (e.g. Export PDF)"
                      value={cap.title}
                      onChange={(e) => handleCapabilityChange(idx, 'title', e.target.value)}
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Icon Name (e.g. download)"
                      value={cap.icon || ''}
                      onChange={(e) => handleCapabilityChange(idx, 'icon', e.target.value)}
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Detail explanation for this capability..."
                  value={cap.description || ''}
                  onChange={(e) => handleCapabilityChange(idx, 'description', e.target.value)}
                  disabled={isSubmitting}
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCapability}
              disabled={isSubmitting}
              style={{
                alignSelf: 'flex-start',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.5px dashed #7C5CFF',
                backgroundColor: 'rgba(124, 92, 255, 0.05)',
                color: '#7C5CFF',
                fontSize: '12.5px',
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 92, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 92, 255, 0.05)'}
            >
              + Add Capability Card
            </button>
          </div>
        </div>
      </FormSection>

      <FormSection title="Section 5 — Technologies">
        <FormTagSelector
          label="Technologies & SDKs Used"
          tags={technologies}
          inputVal={techInput}
          onInputChange={setTechInput}
          onAddTag={(tag) => setTechnologies([...technologies, tag])}
          onRemoveTag={handleRemoveTech}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 6 — Metrics & External Links" columns="1fr 1fr">
        <FormTextField
          label="Downloads Count"
          placeholder="e.g., 2500"
          value={downloads}
          onChange={setDownloads}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Views Count"
          placeholder="e.g., 10450"
          value={views}
          onChange={setViews}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Rating (0.00 to 5.00)"
          placeholder="e.g., 4.8"
          value={rating}
          onChange={setRating}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Marketplace URL"
          placeholder="https://marketplace.mendix.com/link"
          value={marketplaceUrl}
          onChange={setMarketplaceUrl}
          disabled={isSubmitting}
        />
        <FormTextField
          label="GitHub Link"
          placeholder="https://github.com/username/project"
          value={githubUrl}
          onChange={setGithubUrl}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Documentation URL"
          placeholder="https://docs.example.com"
          value={docsUrl}
          onChange={setDocsUrl}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Live Demo Link"
          placeholder="https://example.com/demo"
          value={demoUrl}
          onChange={setDemoUrl}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 7 — Status">
        <FormToggle
          label="Featured Product"
          checked={isFeatured}
          onChange={setIsFeatured}
          activeColor="#8B5CF6"
          disabled={isSubmitting}
        />
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: 'var(--admin-text)', fontWeight: 550 }}>
            <input
              type="radio"
              name="prodStatus"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              disabled={isSubmitting}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Draft Mode
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: 'var(--admin-text)', fontWeight: 550 }}>
            <input
              type="radio"
              name="prodStatus"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              disabled={isSubmitting}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Publish Live
          </label>
        </div>
      </FormSection>
    </FormContainer>
  );
};
