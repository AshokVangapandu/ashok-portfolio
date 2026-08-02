/* src/admin/pages/projects/components/ProjectDrawer.tsx */
import React, { useState, useEffect, useRef } from 'react';
import {
  AdminProject,
  generateUUID,
  isUUID,
  ProjectFeature,
  FeatureBullet,
  ProjectGallery
} from '../../../types/project';
import { projectService } from '../../../services/projectService';
import { FormContainer } from '../../../components/portfolio-content/FormContainer';
import { FormToggle } from '../../../components/portfolio-content/FormToggle';
import { supabase } from '../../../../services/supabase/client';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog';

interface ProjectDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  selectedProject: AdminProject | null;
  onClose: () => void;
  onSave: (data: AdminProject, shouldClose?: boolean) => void;
}

type TabType = 'general' | 'features' | 'metrics' | 'media' | 'technologies' | 'publish';

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  isOpen,
  mode,
  selectedProject,
  onClose,
  onSave
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loadedTabs, setLoadedTabs] = useState<TabType[]>(['general']);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);

  // --- GENERAL FORM FIELD STATES ---
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('');
  const [timeline, setTimeline] = useState('');
  const [platform, setPlatform] = useState('');
  const [users, setUsers] = useState('');
  const [businessValue, setBusinessValue] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [solution, setSolution] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  // --- MEDIA STATES ---
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverFileName, setCoverFileName] = useState<string>('');

  // --- Showcase V2 Sub-relations states ---
  const [featuresList, setFeaturesList] = useState<(ProjectFeature & { localFile?: File })[]>([]);
  const [deletedFeatureIds, setDeletedFeatureIds] = useState<string[]>([]);

  // --- TECHNOLOGIES STATE ---
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // --- METRICS STATE ---
  const [impactMetrics, setImpactMetrics] = useState<{ kpi: string; label: string }[]>([]);

  // --- EXTERNAL LINKS STATE ---
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');

  // Input references for trigger clicks
  const coverInputRef = useRef<HTMLInputElement>(null);
  const featureInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // --- TRACKING INITIAL STATE FOR UNSAVED CHANGES CHECK ---
  const initialStateRef = useRef<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancelClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, category, description, coverPreview, featuresList]);

  // Track lazy load
  useEffect(() => {
    if (!loadedTabs.includes(activeTab)) {
      setLoadedTabs([...loadedTabs, activeTab]);
    }
  }, [activeTab]);

  // Populate data when drawer opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('general');
      setLoadedTabs(['general']);
      setDeletedFeatureIds([]);

      if (mode === 'edit' && selectedProject) {
        setTitle(selectedProject.title || '');
        setCategory(selectedProject.category || '');
        setClient(selectedProject.client || '');
        setRole(selectedProject.role || '');
        setTimeline(selectedProject.timeline || '');
        setPlatform(selectedProject.platform || '');
        setUsers(selectedProject.users || '');
        setBusinessValue(selectedProject.businessValue || '');
        setDescription(selectedProject.description || '');
        setFullDescription(selectedProject.fullDescription || '');
        setProblemSolved(selectedProject.problemSolved || '');
        setSolution(selectedProject.solution || '');
        setTechnologies(selectedProject.technologies || []);
        setImpactMetrics(selectedProject.impactMetrics || []);
        setDemoUrl(selectedProject.demoUrl || '');
        setGithubUrl(selectedProject.githubUrl || '');
        setDocsUrl(selectedProject.docsUrl || '');
        setStatus(selectedProject.status || 'draft');
        setIsFeatured(selectedProject.isFeatured || false);
        setCoverPreview(selectedProject.coverImageUrl);
        setCoverFile(null);
        
        // Extract cover filename
        if (selectedProject.coverImageUrl) {
          const parts = selectedProject.coverImageUrl.split('/');
          setCoverFileName(parts[parts.length - 1]);
        } else {
          setCoverFileName('');
        }

        // Fetch sub-relation tables features and gallery
        loadSubRelations(selectedProject.id);
      } else {
        // Reset/Create mode
        setTitle('');
        setCategory('');
        setClient('');
        setRole('');
        setTimeline('');
        setPlatform('');
        setUsers('');
        setBusinessValue('');
        setDescription('');
        setFullDescription('');
        setProblemSolved('');
        setSolution('');
        setTechnologies([]);
        setImpactMetrics([]);
        setDemoUrl('');
        setGithubUrl('');
        setDocsUrl('');
        setStatus('draft');
        setIsFeatured(false);
        setCoverPreview(null);
        setCoverFile(null);
        setCoverFileName('');
        setFeaturesList([]);

        captureInitialState({
          title: '', category: '', client: '', role: '', timeline: '', platform: '',
          users: '', businessValue: '', description: '', fullDescription: '',
          problemSolved: '', solution: '', status: 'draft', isFeatured: false,
          coverPreview: null, technologies: [], impactMetrics: [], demoUrl: '',
          githubUrl: '', docsUrl: '', features: []
        });
      }
    }
  }, [isOpen, mode, selectedProject]);

  const loadSubRelations = async (projectId: string) => {
    setIsLoadingDetails(true);
    try {
      const features = await projectService.getProjectFeatures(projectId);
      setFeaturesList(features);

      captureInitialState({
        title: selectedProject?.title || '',
        category: selectedProject?.category || '',
        client: selectedProject?.client || '',
        role: selectedProject?.role || '',
        timeline: selectedProject?.timeline || '',
        platform: selectedProject?.platform || '',
        users: selectedProject?.users || '',
        businessValue: selectedProject?.businessValue || '',
        description: selectedProject?.description || '',
        fullDescription: selectedProject?.fullDescription || '',
        problemSolved: selectedProject?.problemSolved || '',
        solution: selectedProject?.solution || '',
        status: selectedProject?.status || 'draft',
        isFeatured: selectedProject?.isFeatured || false,
        coverPreview: selectedProject?.coverImageUrl || null,
        technologies: selectedProject?.technologies || [],
        impactMetrics: selectedProject?.impactMetrics || [],
        demoUrl: selectedProject?.demoUrl || '',
        githubUrl: selectedProject?.githubUrl || '',
        docsUrl: selectedProject?.docsUrl || '',
        features
      });
    } catch (e) {
      console.error('Failed to load project details:', e);
      (window as any).showToast?.('error', 'Fetch Error', 'Could not load V2 database details.', 4000);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const captureInitialState = (data: any) => {
    initialStateRef.current = JSON.stringify(data);
  };

  const hasUnsavedChanges = (): boolean => {
    const currentState = {
      title,
      category,
      client,
      role,
      timeline,
      platform,
      users,
      businessValue,
      description,
      fullDescription,
      problemSolved,
      solution,
      status,
      isFeatured,
      coverPreview,
      technologies,
      impactMetrics,
      demoUrl,
      githubUrl,
      docsUrl,
      features: featuresList.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        imageUrl: f.imageUrl,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
        bullets: (f.bullets || []).map(b => ({ text: b.text, displayOrder: b.displayOrder }))
      }))
    };

    try {
      const initial = JSON.parse(initialStateRef.current || '{}');
      const initialNormalized = {
        title: initial.title || '',
        category: initial.category || '',
        client: initial.client || '',
        role: initial.role || '',
        timeline: initial.timeline || '',
        platform: initial.platform || '',
        users: initial.users || '',
        businessValue: initial.businessValue || '',
        description: initial.description || '',
        fullDescription: initial.fullDescription || '',
        problemSolved: initial.problemSolved || '',
        solution: initial.solution || '',
        status: initial.status || 'draft',
        isFeatured: initial.isFeatured || false,
        coverPreview: initial.coverPreview || null,
        technologies: initial.technologies || [],
        impactMetrics: initial.impactMetrics || [],
        demoUrl: initial.demoUrl || '',
        githubUrl: initial.githubUrl || '',
        docsUrl: initial.docsUrl || '',
        features: (initial.features || []).map((f: any) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          imageUrl: f.imageUrl,
          displayOrder: f.displayOrder,
          isActive: f.isActive,
          bullets: (f.bullets || []).map((b: any) => ({ text: b.text, displayOrder: b.displayOrder }))
        }))
      };

      const isDiff = JSON.stringify(currentState) !== JSON.stringify(initialNormalized);
      if (isDiff) {
        console.log('[CMS Unsaved Check] Unsaved changes detected!');
        Object.keys(currentState).forEach(key => {
          const val1 = JSON.stringify((currentState as any)[key]);
          const val2 = JSON.stringify((initialNormalized as any)[key]);
          if (val1 !== val2) {
            console.log(`- Difference in key "${key}":`);
            console.log(`  Current:`, val1);
            console.log(`  Initial:`, val2);
          }
        });
      }
      return isDiff;
    } catch (e) {
      return true;
    }
  };

  const handleCancelClose = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedConfirm(true);
    } else {
      onClose();
    }
  };

  // --- CORE SUBMIT / SAVE TRIGGERS ---
  const handleSubmit = async (statusOverride?: 'draft' | 'published', shouldClose = true) => {
    setIsSubmitting(true);
    let step = 'VALIDATION';
    let lastPayload: any = null;

    try {
      console.log('[CMS Audit] Starting handleSubmit. statusOverride:', statusOverride, 'shouldClose:', shouldClose);

      if (!title.trim() || !category.trim()) {
        (window as any).showToast?.('error', 'Validation Error', 'Title and Category are required general fields.', 5000);
        setActiveTab('general');
        setIsSubmitting(false);
        return;
      }

      // Validation checks on inline features list
      for (const f of featuresList) {
        if (!f.title?.trim() || !f.description?.trim()) {
          (window as any).showToast?.('error', 'Feature Error', 'Title and Description are required for all feature sections.', 5000);
          setActiveTab('features');
          setIsSubmitting(false);
          return;
        }
        if (!f.imageUrl && !f.localFile) {
          (window as any).showToast?.('error', 'Feature Error', `An image is required for feature: "${f.title}"`, 5000);
          setActiveTab('features');
          setIsSubmitting(false);
          return;
        }
      }

      const currentStatus = statusOverride || status;
      const isMockId = selectedProject?.id && !isUUID(selectedProject.id);
      const projectId = (selectedProject?.id && !isMockId) ? selectedProject.id : generateUUID();
      const isCreateMode = mode === 'create' || isMockId;

      console.log('[CMS Audit] Dirty State:', hasUnsavedChanges());
      console.log('[CMS Audit] Changed sections status check:');
      console.log('- Title:', title);
      console.log('- Status:', currentStatus);
      console.log('- Technologies count:', technologies.length);
      console.log('- KPIs count:', impactMetrics.length);
      console.log('- Features count:', featuresList.length);
      
      console.log('[CMS Save Pipeline] Save & Sync clicked. projectId:', projectId, 'mode:', mode);
      if (statusOverride === 'published') {
        console.log('[CMS Publish Pipeline] Publish Started.');
      }
      // 1. Upload Cover Hero image
      step = 'UPLOAD_COVER';
      console.log('[CMS Save Pipeline] Saving Hero... Uploading cover file if present.');
      let finalCoverImageUrl = coverPreview;
      if (coverFile) {
        const path = projectService.getStoragePath(projectId, 'hero', coverFile.name);
        console.log(`[CMS Save Pipeline] Uploading cover asset. Path: ${path}, File:`, coverFile);
        finalCoverImageUrl = await projectService.uploadAsset(coverFile, path);
        console.log('[CMS Save Pipeline] Cover Hero image uploaded SUCCESS. URL:', finalCoverImageUrl);
      }

      // 2. Upload Features images
      step = 'UPLOAD_FEATURES';
      console.log('[CMS Save Pipeline] Saving Features... Uploading feature images if present.');
      const updatedFeatures = [...featuresList];
      for (let i = 0; i < updatedFeatures.length; i++) {
        const feat = updatedFeatures[i];
        if (feat.localFile) {
          const path = projectService.getStoragePath(projectId, 'features', feat.localFile.name);
          console.log(`[CMS Save Pipeline] Uploading feature screenshot asset for: "${feat.title}". Path: ${path}`);
          const uploadedUrl = await projectService.uploadAsset(feat.localFile, path);
          feat.imageUrl = uploadedUrl;
          feat.imageThumbnailUrl = uploadedUrl;
          delete feat.localFile;
          console.log(`[CMS Save Pipeline] Feature screenshot uploaded SUCCESS for: "${feat.title}". URL:`, uploadedUrl);
        }
      }

      // 4. Save Main Project row
      step = 'SAVE_HERO';
      console.log('[CMS Save Pipeline] Saving Hero Context to Supabase (projects table)...');
      console.log('[CMS Save Pipeline] Saving Technologies (technologies column):', technologies);
      console.log('[CMS Save Pipeline] Saving KPIs (impact_metrics column):', impactMetrics);
      console.log('[CMS Save Pipeline] Saving Publish Settings (status:', currentStatus, 'isFeatured:', isFeatured, ')');
      
      const projectPayload: AdminProject = {
        id: projectId,
        title,
        description,
        fullDescription,
        category,
        client: client || '',
        role: role || '',
        timeline: timeline || '',
        platform: platform || '',
        users: users || '',
        status: currentStatus,
        businessValue: businessValue || '',
        technologies,
        coverImageUrl: finalCoverImageUrl,
        images: selectedProject?.images || [],
        problemSolved,
        solution,
        features: updatedFeatures.map(f => f.title),
        impactMetrics,
        layoutType: isFeatured ? 'large' : 'medium',
        demoUrl: demoUrl || undefined,
        githubUrl: githubUrl || undefined,
        docsUrl: docsUrl || undefined,
        updatedAt: new Date().toISOString(),
        isFeatured
      };

      lastPayload = projectPayload;
      console.log('[CMS Save Pipeline] Projects table payload:', projectPayload);

      if (isCreateMode) {
        const res = await projectService.createProject(projectPayload);
        console.log('[CMS Save Pipeline] Supabase Response SUCCESS: Project row created successfully. Data:', res);
      } else {
        const res = await projectService.updateProject(projectId, projectPayload);
        console.log('[CMS Save Pipeline] Supabase Response SUCCESS: Project row updated successfully. Data:', res);
      }

      // 5. Delete removed database items
      step = 'DELETE_FEATURES';
      if (!isCreateMode) {
        console.log('[CMS Save Pipeline] Deleting removed feature blocks:', deletedFeatureIds);
        for (const fId of deletedFeatureIds) {
          await projectService.deleteProjectFeature(fId);
          console.log(`[CMS Save Pipeline] Deleted feature: ${fId} SUCCESS`);
        }
      }

      // 6. Save Feature Builder rows
      step = 'SAVE_FEATURES';
      console.log('[CMS Save Pipeline] Saving Features Canvas (project_features table)...');
      console.log('Features about to save:', updatedFeatures);
      for (const feat of updatedFeatures) {
        let savedFeature: any;
        const isNewFeature = feat.id.startsWith('temp-') || isCreateMode;
        if (isNewFeature) {
          const featurePayload = {
            projectId,
            title: feat.title,
            description: feat.description,
            imageUrl: feat.imageUrl,
            imageThumbnailUrl: feat.imageThumbnailUrl,
            imageAlt: feat.imageAlt || feat.title,
            displayOrder: feat.displayOrder,
            isActive: feat.isActive
          };
          lastPayload = featurePayload;
          console.log('[CMS Save Pipeline] Feature payload about to insert:', featurePayload);
          savedFeature = await projectService.createProjectFeature(featurePayload);
          console.log('[CMS Save Pipeline] Feature insert SUCCESS. Response:', savedFeature);
        } else {
          lastPayload = feat;
          console.log(`[CMS Save Pipeline] Updating existing Feature Block: "${feat.title}" (ID: ${feat.id})`);
          savedFeature = await projectService.updateProjectFeature(feat.id, {
            title: feat.title,
            description: feat.description,
            imageUrl: feat.imageUrl,
            imageThumbnailUrl: feat.imageThumbnailUrl,
            imageAlt: feat.imageAlt || feat.title,
            displayOrder: feat.displayOrder,
            isActive: feat.isActive
          });
          console.log('[CMS Save Pipeline] Feature update SUCCESS. Response:', savedFeature);
        }

        // Sync bullets
        step = 'SYNC_BULLETS';
        if (!isNewFeature) {
          console.log(`[CMS Save Pipeline] Syncing bullets for feature (deleting existing): "${feat.title}"`);
          const { data: existingBullets, error: bulletFetchErr } = await (supabase as any)
            .from('feature_bullets')
            .select('id')
            .eq('feature_id', savedFeature.id);
          if (bulletFetchErr) throw bulletFetchErr;
          if (existingBullets) {
            for (const b of existingBullets) {
              await projectService.deleteFeatureBullet(b.id);
            }
          }
        }

        console.log(`[CMS Save Pipeline] Feature bullets array for "${feat.title}":`, feat.bullets);
        if (feat.bullets && feat.bullets.length > 0) {
          console.log(`[CMS Save Pipeline] Creating ${feat.bullets.length} bullets for feature: "${feat.title}"`);
          for (const b of feat.bullets) {
            lastPayload = b;
            console.log('[CMS Save Pipeline] Bullet payload about to insert:', b);
            const bulletInsertPayload = {
              featureId: savedFeature.id,
              text: b.text,
              displayOrder: b.displayOrder
            };
            console.log('[CMS Save Pipeline] Formatted bullet payload:', bulletInsertPayload);
            const savedBullet = await projectService.createFeatureBullet(bulletInsertPayload);
            console.log('[CMS Save Pipeline] Bullet insert SUCCESS. Response:', savedBullet);
          }
        } else {
          console.log(`[CMS Save Pipeline] Skipped bullet creation for "${feat.title}" because bullets array is empty or undefined.`);
        }
      }
      console.log('[CMS Save Pipeline] SUCCESS. Hero, features, and bullets successfully synchronized.');

      let successMsg = `Project "${title}" updated successfully!`;
      let toastTitle = 'Changes Saved';
      if (statusOverride === 'published') {
        toastTitle = 'Project Published';
        successMsg = 'Project published successfully';
      } else if (statusOverride === 'draft') {
        toastTitle = 'Project Saved';
        successMsg = 'Project Saved as Draft';
      } else {
        successMsg = 'Changes Saved';
      }
      
      console.log('[CMS Callback] Triggering showToast(). type: success, title:', toastTitle, 'msg:', successMsg);
      (window as any).showToast?.('success', toastTitle, successMsg, 4000);
      
      console.log('[CMS Callback] Triggering onSave(). shouldClose:', shouldClose);
      onSave(projectPayload, shouldClose);
      
      if (shouldClose) {
        if (statusOverride === 'published') {
          console.log('[CMS Publish Pipeline] Publish Completed successfully.');
        }
        console.log('[CMS Callback] Triggering onClose() to close drawer.');
        onClose();
      } else {
        // Reload sub-relations from Supabase to replace temporary IDs with DB UUIDs
        console.log('[CMS Save Pipeline] Reloading latest features/bullets details from Supabase...');
        const refreshedFeatures = await projectService.getProjectFeatures(projectId);
        setFeaturesList(refreshedFeatures);
        setDeletedFeatureIds([]);
        setStatus(currentStatus);
        console.log('[CMS Save Pipeline] Reload Complete. Form local state refreshed.');
        
        // Update initial state tracking ref to match new DB records
        captureInitialState({
          title, category, client, role, timeline, platform,
          users, businessValue, description, fullDescription,
          problemSolved, solution, status: currentStatus, isFeatured,
          coverPreview: finalCoverImageUrl, technologies, impactMetrics, demoUrl,
          githubUrl, docsUrl, features: refreshedFeatures.map(f => ({
            id: f.id,
            title: f.title,
            description: f.description,
            imageUrl: f.imageUrl,
            displayOrder: f.displayOrder,
            isActive: f.isActive,
            bullets: f.bullets?.map(b => ({ text: b.text, displayOrder: b.displayOrder }))
          }))
        });
      }
    } catch (e: any) {
      console.error('[CMS Save Pipeline] FAILED.');
      console.error('Error Step:', step);
      console.error('Last Payload:', lastPayload);
      console.error('Error Details:', e);
      if (e.message) console.error('Error Message:', e.message);
      if (e.stack) console.error('Error Stack:', e.stack);
      if (e.code) console.error('Supabase Error Code:', e.code);
      if (e.details) console.error('Supabase Error Details:', e.details);
      if (e.hint) console.error('Supabase Error Hint:', e.hint);

      if (statusOverride === 'published') {
        (window as any).showToast?.('error', 'Publishing Failed', '❌ Publishing failed. Your changes are still saved as a draft.', 5000);
      } else {
        (window as any).showToast?.('error', 'Save Failed', '❌ Unable to save project. Please try again.', 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GENERAL SECTION 5 METRICS TRIGGERS ---
  const handleMetricChange = (index: number, field: 'kpi' | 'label', val: string) => {
    const updated = [...impactMetrics];
    updated[index][field] = val;
    setImpactMetrics(updated);
  };

  const handleAddMetric = () => {
    setImpactMetrics([...impactMetrics, { kpi: '', label: '' }]);
  };

  const handleRemoveMetric = (index: number) => {
    setImpactMetrics(impactMetrics.filter((_, idx) => idx !== index));
  };

  // --- GENERAL SECTION 6 TECH TAGS TRIGGERS ---
  const handleAddTech = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();

    const clean = techInput.trim();
    if (clean && !technologies.includes(clean)) {
      setTechnologies([...technologies, clean]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechnologies(technologies.filter(t => t !== tag));
  };

  const handleDragTechStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/tech-idx', index.toString());
  };

  const handleDragTechOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropTech = (e: React.DragEvent, targetIdx: number) => {
    const sourceIdx = parseInt(e.dataTransfer.getData('text/tech-idx'), 10);
    if (sourceIdx === targetIdx) return;
    const reordered = [...technologies];
    const [removed] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, removed);
    setTechnologies(reordered);
  };

  // --- TABS STYLES & LAYOUTS ---
  const sidebarItemStyles = (tab: TabType): React.CSSProperties => {
    const isActive = activeTab === tab;
    return {
      width: '100%',
      padding: '10px 14px',
      fontSize: '13px',
      fontWeight: isActive ? 700 : 550,
      color: isActive ? '#7C5CFF' : '#475569',
      backgroundColor: isActive ? 'rgba(124, 92, 255, 0.08)' : 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.15s ease',
      boxSizing: 'border-box'
    };
  };

  // --- VISUAL INLINE FEATURES BUILDER HANDLERS ---
  const handleFeatureFieldChange = (index: number, field: keyof ProjectFeature, val: any) => {
    const updated = [...featuresList];
    updated[index] = { ...updated[index], [field]: val };
    setFeaturesList(updated);
  };

  const handleFeatureBulletChange = (featIdx: number, bulletIdx: number, val: string) => {
    const updated = [...featuresList];
    const feat = updated[featIdx];
    if (feat.bullets) {
      const updatedBullets = [...feat.bullets];
      updatedBullets[bulletIdx] = { ...updatedBullets[bulletIdx], text: val };
      feat.bullets = updatedBullets;
      setFeaturesList(updated);
    }
  };

  const handleAddFeatureBullet = (featIdx: number) => {
    const updated = [...featuresList];
    const feat = updated[featIdx];
    const bullets = feat.bullets || [];
    const newBullet: FeatureBullet = {
      id: `temp-bullet-${Date.now()}-${Math.random()}`,
      featureId: feat.id,
      text: '',
      displayOrder: bullets.length
    };
    feat.bullets = [...bullets, newBullet];
    setFeaturesList(updated);
  };

  const handleRemoveFeatureBullet = (featIdx: number, bulletIdx: number) => {
    const updated = [...featuresList];
    const feat = updated[featIdx];
    if (feat.bullets) {
      feat.bullets = feat.bullets.filter((_, idx) => idx !== bulletIdx).map((b, idx) => ({ ...b, displayOrder: idx }));
      setFeaturesList(updated);
    }
  };

  const handleAddNewFeatureBlock = () => {
    const newFeature: ProjectFeature = {
      id: `temp-feat-${Date.now()}`,
      projectId: selectedProject?.id || '',
      title: '',
      description: '',
      imageUrl: null,
      imageThumbnailUrl: null,
      imageAlt: null,
      displayOrder: featuresList.length,
      isActive: true,
      bullets: []
    };
    setFeaturesList([...featuresList, newFeature]);
  };

  const handleDuplicateFeature = (index: number) => {
    const target = featuresList[index];
    const duplicated: ProjectFeature & { localFile?: File } = {
      ...target,
      id: `temp-${Date.now()}-${index}`,
      title: `${target.title} (Copy)`,
      displayOrder: featuresList.length,
      bullets: target.bullets ? target.bullets.map(b => ({ ...b, id: `temp-bullet-${Math.random()}` })) : []
    };
    setFeaturesList([...featuresList, duplicated]);
  };

  const handleDeleteFeature = (index: number) => {
    const target = featuresList[index];
    if (!target.id.startsWith('temp-')) {
      setDeletedFeatureIds([...deletedFeatureIds, target.id]);
    }
    const filtered = featuresList.filter((_, idx) => idx !== index);
    const reindexed = filtered.map((f, idx) => ({ ...f, displayOrder: idx }));
    setFeaturesList(reindexed);
  };

  // HTML5 Drag and Drop for features cards
  const handleFeatureDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/feat-idx', index.toString());
  };

  const handleFeatureDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFeatureDrop = (e: React.DragEvent, targetIndex: number) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('text/feat-idx'), 10);
    if (sourceIndex === targetIndex) return;

    const reordered = [...featuresList];
    const [removed] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const updated = reordered.map((item, idx) => ({
      ...item,
      displayOrder: idx
    }));
    setFeaturesList(updated);
  };

  // Bullet dragging reorder
  const handleBulletDragStart = (e: React.DragEvent, featIdx: number, bulletIdx: number) => {
    e.dataTransfer.setData('text/bullet-feat-idx', featIdx.toString());
    e.dataTransfer.setData('text/bullet-idx', bulletIdx.toString());
  };

  const handleBulletDrop = (e: React.DragEvent, featIdx: number, targetBulletIdx: number) => {
    const sourceFeatIdx = parseInt(e.dataTransfer.getData('text/bullet-feat-idx'), 10);
    const sourceBulletIdx = parseInt(e.dataTransfer.getData('text/bullet-idx'), 10);

    if (sourceFeatIdx !== featIdx || sourceBulletIdx === targetBulletIdx) return;

    const updated = [...featuresList];
    const feat = updated[featIdx];
    if (feat.bullets) {
      const reordered = [...feat.bullets];
      const [removed] = reordered.splice(sourceBulletIdx, 1);
      reordered.splice(targetBulletIdx, 0, removed);
      feat.bullets = reordered.map((b, idx) => ({ ...b, displayOrder: idx }));
      setFeaturesList(updated);
    }
  };





  if (!isOpen) return null;

  return (
    <FormContainer
      title={mode === 'create' ? 'Create Project Showcase' : 'Edit Project CMS'}
      description="Refactored Showcase V2 Case Study Builder"
      onClose={handleCancelClose}
      width="1000px"
      isSubmitting={isSubmitting}
      bodyStyle={{ padding: 0, gap: 0, overflowY: 'hidden' }}
      actions={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {hasUnsavedChanges() && (
              <span style={{ fontSize: '12px', color: '#E28743', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#E28743', borderRadius: '50%' }}></span>
                Unsaved changes
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={handleCancelClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1.5px solid var(--admin-border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--admin-text-secondary)',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(undefined, false)}
              disabled={isSubmitting}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#7C5CFF',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 650,
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(124, 92, 255, 0.2)'
              }}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save & Sync'}
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Left Sidebar Navigation */}
        <nav style={{
          width: '240px',
          height: '100%',
          backgroundColor: '#F8FAFC',
          borderRight: '1px solid var(--admin-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '24px 16px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          {/* Logical Group: CONTENT */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📋</span> CONTENT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" onClick={() => setActiveTab('general')} style={sidebarItemStyles('general')}>Hero & Context</button>
              <button type="button" onClick={() => setActiveTab('features')} style={sidebarItemStyles('features')}>Features Canvas</button>
            </div>
          </div>

          {/* Logical Group: ASSETS */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🖼</span> ASSETS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" onClick={() => setActiveTab('technologies')} style={sidebarItemStyles('technologies')}>Technologies Cloud</button>
              <button type="button" onClick={() => setActiveTab('metrics')} style={sidebarItemStyles('metrics')}>Impact KPIs</button>
            </div>
          </div>

          {/* Logical Group: PUBLISHING */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚀</span> PUBLISHING
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" onClick={() => setActiveTab('publish')} style={sidebarItemStyles('publish')}>Review & Publish</button>
            </div>
          </div>
        </nav>

        {/* Right Scrollable Content Pane */}
        <main style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: '32px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: '#F1F5F9' // Editorial builder backdrop
        }}>
          {isLoadingDetails ? (
            /* SKELETON LOADER FOR DETAILED RECORDS */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px', flex: 1 }}>
              <div style={{ height: '40px', backgroundColor: '#E2E8F0', borderRadius: '8px', width: '60%' }}></div>
              <div style={{ height: '140px', backgroundColor: '#E2E8F0', borderRadius: '8px', width: '100%' }}></div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ height: '80px', backgroundColor: '#E2E8F0', borderRadius: '8px', flex: 1 }}></div>
                <div style={{ height: '80px', backgroundColor: '#E2E8F0', borderRadius: '8px', flex: 1 }}></div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* TAB 1: VISUAL HERO & CONTEXT MOCKUP EDITOR */}
              {loadedTabs.includes('general') && (
                <div style={{ display: activeTab === 'general' ? 'flex' : 'none', flexDirection: 'column', gap: '24px' }}>
                  {/* Hero mockup box */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      backgroundColor: '#090D1A',
                      borderRadius: '16px',
                      padding: '36px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '40px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    {/* Left inline metadata input fields */}
                    <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: '#8B5CF6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Badge pill</span>
                        <input
                          type="text"
                          placeholder="e.g. HEALTHCARE CASE STUDY"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#A78BFA',
                            backgroundColor: 'rgba(139, 92, 246, 0.08)',
                            border: '1px dashed rgba(139, 92, 246, 0.4)',
                            borderRadius: '999px',
                            padding: '4px 12px',
                            width: 'fit-content',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Project Title</span>
                        <input
                          type="text"
                          placeholder="e.g. MediConnect"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          style={{
                            fontSize: '32px',
                            fontWeight: 900,
                            color: '#FFFFFF',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px dashed rgba(255,255,255,0.2)',
                            outline: 'none',
                            width: '100%',
                            letterSpacing: '-0.02em'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Short Summary description</span>
                        <textarea
                          placeholder="Short introductory summary..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={2}
                          style={{
                            fontSize: '14.5px',
                            lineHeight: '1.5',
                            color: '#94A3B8',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px dashed rgba(255,255,255,0.2)',
                            outline: 'none',
                            width: '100%',
                            fontFamily: 'inherit',
                            resize: 'none'
                          }}
                        />
                      </div>

                      {/* Meta stats inputs */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                        {[
                          { label: 'Timeline', val: timeline, set: setTimeline, ph: 'e.g. 2 Weeks' },
                          { label: 'My Contribution', val: role, set: setRole, ph: 'e.g. Lead Designer' },
                          { label: 'Client / Sponsor', val: client, set: setClient, ph: 'e.g. Lowcode Labs' },
                          { label: 'Platform Interface', val: platform, set: setPlatform, ph: 'e.g. Web Application' }
                        ].map((meta, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontSize: '9px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>{meta.label}</span>
                            <input
                              type="text"
                              placeholder={meta.ph}
                              value={meta.val}
                              onChange={(e) => meta.set(e.target.value)}
                              style={{
                                fontSize: '12.5px',
                                fontWeight: 600,
                                color: '#E2E8F0',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px dashed rgba(255,255,255,0.15)',
                                outline: 'none',
                                width: '90%'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right column: cover image mockup uploader */}
                    <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        ref={coverInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCoverFile(file);
                            setCoverPreview(URL.createObjectURL(file));
                            setCoverFileName(file.name);
                          }
                        }}
                      />
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        style={{
                          position: 'relative',
                          width: '280px',
                          aspectRatio: '16/10',
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          border: '2px dashed rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                      >
                        {coverPreview ? (
                          <>
                            <img src={coverPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover" />
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                              <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 700 }}>Click to Replace Cover</span>
                            </div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '16px', color: '#64748B' }}>
                            <span style={{ display: 'block', fontSize: '20px', marginBottom: '4px' }}>💻</span>
                            <span style={{ fontSize: '11px', fontWeight: 650, display: 'block' }}>Add Cover Screenshot</span>
                            <span style={{ fontSize: '9px', opacity: 0.7 }}>Click to select uploader</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Context and problem solved section inputs */}
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '14.5px', color: '#0F172A', fontWeight: 700 }}>00. Detailed Story Context</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-secondary)' }}>Detailed solution architecture & Goal</label>
                      <textarea
                        placeholder="Detailed outline of the solution goals and results..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        rows={4}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13.5px', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-secondary)' }}>Problem solved statement</label>
                      <textarea
                        placeholder="What specific user/business blockers did this address?"
                        value={problemSolved}
                        onChange={(e) => setProblemSolved(e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13.5px', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-secondary)' }}>Full Description (Fallback Overview)</label>
                      <textarea
                        placeholder="Fallback project overview description..."
                        value={fullDescription}
                        onChange={(e) => setFullDescription(e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13.5px', fontFamily: 'inherit', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISUAL INLINE FEATURES BUILDER CANVAS */}
              {loadedTabs.includes('features') && (
                <div style={{ display: activeTab === 'features' ? 'flex' : 'none', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '13.5px', color: '#64748B', fontWeight: 550 }}>
                      Edit repeatable feature sections inline. Drag cards using the handle to reorder the layout.
                    </span>
                  </div>

                  {featuresList.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--admin-border)', borderRadius: '12px', padding: '60px', color: '#94A3B8', backgroundColor: '#FFFFFF' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>No features created yet</span>
                      <span style={{ fontSize: '12px' }}>Click "+ Add Feature Block" to build case study sections.</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {featuresList.map((feature, idx) => {
                        const isLeftImage = idx % 2 === 0;
                        const isEven = idx % 2 === 1;

                        return (
                          <div
                            key={feature.id}
                            draggable
                            onDragStart={(e) => handleFeatureDragStart(e, idx)}
                            onDragOver={handleFeatureDragOver}
                            onDrop={(e) => handleFeatureDrop(e, idx)}
                            style={{
                              position: 'relative',
                              backgroundColor: isEven ? '#F8FAFC' : '#FFFFFF',
                              color: '#0F172A',
                              borderRadius: '16px',
                              border: '1.5px solid var(--admin-border)',
                              padding: '32px',
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '24px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                            }}
                          >
                            {/* Feature top action buttons row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ cursor: 'grab', color: '#94A3B8', fontSize: '16px' }}>⋮⋮</span>
                                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#8B5CF6' }}>Feature #{idx + 1} ({isLeftImage ? 'Image Left' : 'Image Right'} Layout)</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={feature.isActive}
                                    onChange={(e) => handleFeatureFieldChange(idx, 'isActive', e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  Active (Show in public)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateFeature(idx)}
                                  style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--admin-border)', backgroundColor: '#FFFFFF', fontSize: '11px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                                >
                                  Duplicate
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFeature(idx)}
                                  style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #FEE2E2', backgroundColor: '#FEF2F2', fontSize: '11px', fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            {/* Split layout editor */}
                            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                              {/* IMAGE UPLOADER BOX COLUMN */}
                              <div style={{ flex: 0.9, order: isLeftImage ? 1 : 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Screenshot Image *</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={(el) => { featureInputRefs.current[feature.id] = el; }}
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const updated = [...featuresList];
                                      updated[idx] = {
                                        ...updated[idx],
                                        localFile: file,
                                        imageUrl: URL.createObjectURL(file)
                                      };
                                      setFeaturesList(updated);
                                    }
                                  }}
                                />
                                <div
                                  onClick={() => featureInputRefs.current[feature.id]?.click()}
                                  style={{
                                    width: '100%',
                                    aspectRatio: '16/10',
                                    borderRadius: '12px',
                                    border: '2.5px dashed rgba(0,0,0,0.1)',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                                  }}
                                >
                                  {feature.imageUrl ? (
                                    <>
                                      <img src={feature.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Feature Preview" />
                                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                                        <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 700 }}>Click to Replace Screenshot</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div style={{ textAlign: 'center', padding: '16px', color: '#94A3B8' }}>
                                      <span style={{ fontSize: '20px', display: 'block' }}>📷</span>
                                      <span style={{ fontSize: '11px', fontWeight: 650, display: 'block', marginTop: '4px' }}>Upload Feature Screenshot</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* INLINE TEXT FIELDS COLUMN */}
                              <div style={{ flex: 1.1, order: isLeftImage ? 2 : 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Feature Title *</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Appointment Booking Engine"
                                    value={feature.title}
                                    onChange={(e) => handleFeatureFieldChange(idx, 'title', e.target.value)}
                                    style={{
                                      width: '100%',
                                      padding: '10px 14px',
                                      border: '1.5px solid var(--admin-border)',
                                      borderRadius: '8px',
                                      boxSizing: 'border-box',
                                      fontSize: '13.5px',
                                      fontWeight: 650,
                                      color: '#0F172A',
                                      backgroundColor: '#FFFFFF'
                                    }}
                                  />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Description *</label>
                                  <textarea
                                    placeholder="Provide concise capability description..."
                                    value={feature.description || ''}
                                    onChange={(e) => handleFeatureFieldChange(idx, 'description', e.target.value)}
                                    rows={3}
                                    style={{
                                      width: '100%',
                                      padding: '10px 14px',
                                      border: '1.5px solid var(--admin-border)',
                                      borderRadius: '8px',
                                      boxSizing: 'border-box',
                                      fontSize: '13.5px',
                                      color: '#475569',
                                      fontFamily: 'inherit',
                                      backgroundColor: '#FFFFFF'
                                    }}
                                  />
                                </div>

                                {/* Dynamic Bullets Lists */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Inline Bullets details</span>
                                    <button
                                      type="button"
                                      onClick={() => handleAddFeatureBullet(idx)}
                                      style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #8B5CF6', color: '#8B5CF6', backgroundColor: '#FFFFFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      + Add Bullet
                                    </button>
                                  </div>

                                  {(feature.bullets && feature.bullets.length > 0) ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      {feature.bullets.map((bullet, bIdx) => (
                                        <div
                                          key={bullet.id}
                                          draggable
                                          onDragStart={(e) => handleBulletDragStart(e, idx, bIdx)}
                                          onDragOver={(e) => e.preventDefault()}
                                          onDrop={(e) => handleBulletDrop(e, idx, bIdx)}
                                          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                                        >
                                          <span style={{ cursor: 'grab', color: '#CBD5E1', fontSize: '12px' }}>⋮⋮</span>
                                          <input
                                            type="text"
                                            placeholder="Enter bullet details..."
                                            value={bullet.text}
                                            onChange={(e) => handleFeatureBulletChange(idx, bIdx, e.target.value)}
                                            style={{
                                              flex: 1,
                                              padding: '8px 12px',
                                              border: '1px solid var(--admin-border)',
                                              borderRadius: '6px',
                                              fontSize: '13px',
                                              backgroundColor: '#FFFFFF',
                                              color: '#334155'
                                            }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveFeatureBullet(idx, bIdx)}
                                            style={{ border: 'none', backgroundColor: 'transparent', color: '#94A3B8', fontSize: '16px', cursor: 'pointer', padding: '0 4px' }}
                                          >
                                            &times;
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>No bullets set. Add bullets to highlight details.</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={handleAddNewFeatureBlock}
                      style={{ padding: '12px 28px', borderRadius: '8px', border: '2px dashed #8B5CF6', backgroundColor: '#FFFFFF', color: '#8B5CF6', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                    >
                      + Add Feature Block
                    </button>
                  </div>
                </div>
              )}



              {/* TAB 4: IMPACT KPIS */}
              {loadedTabs.includes('metrics') && (
                <div style={{ display: activeTab === 'metrics' ? 'flex' : 'none', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                      Highlight quantitative key metrics (e.g. ROI, satisfied rating, performance gains).
                    </span>
                    <button
                      type="button"
                      onClick={handleAddMetric}
                      style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#8B5CF6', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Impact KPI
                    </button>
                  </div>

                  {impactMetrics.length === 0 ? (
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--admin-border)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>No KPIs set. Add impact metrics to highlight key project results.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {impactMetrics.map((metric, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', backgroundColor: '#FFFFFF' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveMetric(idx)}
                            style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', backgroundColor: 'transparent', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}
                          >
                            &times;
                          </button>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '20px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>KPI Value</label>
                            <input
                              type="text"
                              placeholder="e.g. 40% Reduction or 99.9%"
                              value={metric.kpi}
                              onChange={(e) => handleMetricChange(idx, 'kpi', e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', boxSizing: 'border-box', fontSize: '13px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>KPI Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Server Response Latency"
                              value={metric.label}
                              onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', boxSizing: 'border-box', fontSize: '13px' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TECHNOLOGIES INLINE FOOTER CLOUD MOCKUP */}
              {loadedTabs.includes('technologies') && (
                <div style={{ display: activeTab === 'technologies' ? 'flex' : 'none', flexDirection: 'column', gap: '24px' }}>
                  {/* Mock Footer Container */}
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--admin-border)',
                      borderRadius: '16px',
                      padding: '32px 40px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '40px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Branding left */}
                    <div style={{ flex: 1.1, display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '20px' }}>⚙</span>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B', lineHeight: 1.5 }}>
                        <strong>{title || 'MediConnect'}</strong> delivers a modern, intuitive, and data-driven healthcare experience.
                      </p>
                    </div>

                    {/* Badge Cloud input right */}
                    <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          TECHNOLOGIES USED
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Add technology (e.g. Mendix, SCSS) and press Enter..."
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleAddTech}
                            style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '13px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTech()}
                            style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#8B5CF6', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Active Badges Drag reorder */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', border: '1px dashed var(--admin-border)', borderRadius: '8px', padding: '12px', backgroundColor: '#F8FAFC' }}>
                        {technologies.length === 0 ? (
                          <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>No technologies defined yet.</span>
                        ) : (
                          technologies.map((tag, idx) => (
                            <span
                              key={tag}
                              draggable
                              onDragStart={(e) => handleDragTechStart(e, idx)}
                              onDragOver={handleDragTechOver}
                              onDrop={(e) => handleDropTech(e, idx)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid var(--admin-border)',
                                fontSize: '12px',
                                color: '#475569',
                                fontWeight: 700,
                                cursor: 'grab'
                              }}
                            >
                              <span style={{ cursor: 'grab', color: '#CBD5E1', fontSize: '10px' }}>⋮</span>
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTech(tag)}
                                style={{ border: 'none', backgroundColor: 'transparent', color: '#94A3B8', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: REVIEW & PUBLISH */}
              {loadedTabs.includes('publish') && (
                <div style={{ display: activeTab === 'publish' ? 'flex' : 'none', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>Publish Status Review</h3>

                    {/* Visibility status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Project Visibility Status</span>
                      <span style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>
                        Set whether this showcase is published live or kept as a private draft.
                      </span>
                      <div style={{ display: 'flex', gap: '30px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#475569', fontWeight: 650 }}>
                          <input
                            type="radio"
                            name="publishStatus"
                            checked={status === 'draft'}
                            onChange={() => setStatus('draft')}
                            disabled={isSubmitting}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          Draft Mode
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#475569', fontWeight: 650 }}>
                          <input
                            type="radio"
                            name="publishStatus"
                            checked={status === 'published'}
                            onChange={() => setStatus('published')}
                            disabled={isSubmitting}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          Publish Live
                        </label>
                      </div>
                    </div>

                    {/* Featured study settings */}
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>
                      <FormToggle
                        label="Featured Case Study Layout"
                        checked={isFeatured}
                        onChange={setIsFeatured}
                        activeColor="#8B5CF6"
                        disabled={isSubmitting}
                      />
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '6px' }}>
                        Featured projects occupy prominent display size layouts on the homepage showcase grid.
                      </span>
                    </div>

                    {/* Project external URLs links */}
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Project External URLs</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 750, color: '#64748B' }}>Live Demo Link</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '13px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 750, color: '#64748B' }}>Source Code GitHub Link</label>
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline audit values */}
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Last Updated</span>
                        <span style={{ fontSize: '13px', color: '#475569', fontWeight: 650 }}>
                          {selectedProject?.updatedAt ? new Date(selectedProject.updatedAt).toLocaleString() : 'Never'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Project ID</span>
                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: 550, fontFamily: 'monospace' }}>
                          {selectedProject?.id || 'Temporary/New'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
                    <button
                      type="button"
                      onClick={() => handleSubmit('draft')}
                      disabled={isSubmitting}
                      style={{ padding: '10px 18px', borderRadius: '8px', border: '1.5px solid var(--admin-border)', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save as Draft & Lock'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit('published')}
                      disabled={isSubmitting}
                      style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '13px', fontWeight: 650, cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Immediately'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
      {/* Custom Confirmation dialog */}
      <ConfirmationDialog
        isOpen={showUnsavedConfirm}
        title="Unsaved Changes"
        description="You have unsaved changes. If you leave now, your latest edits will be discarded. Would you like to continue?"
        cancelText="Stay & Continue Editing"
        confirmText="Discard Changes"
        variant="warning"
        onConfirm={() => {
          setShowUnsavedConfirm(false);
          onClose(); // Discard and close drawer
        }}
        onCancel={() => {
          setShowUnsavedConfirm(false); // Close dialog and stay editing
        }}
      />
    </FormContainer>
  );
};

export default ProjectDrawer;
