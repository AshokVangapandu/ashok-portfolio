/* src/admin/hooks/useAdminNotifications.ts */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../hooks/useAuth';

export interface AdminNotification {
  id: string;
  type: 'testimonial' | 'contact' | 'download';
  title: string;
  description: string;
  timestamp: string;
  createdAt: string;
  iconBg: string;
  iconColor: string;
  isRead: boolean;
  sourceId: string;
}

export function formatNotificationTimeAgo(isoDate?: string | null): string {
  if (!isoDate) return 'Just now';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Just now';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 90) return '1 min ago';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const STORAGE_KEY = 'read_notification_ids';
const LEGACY_STORAGE_KEY = 'read_testimonial_ids';

const loadReadIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    const readSet = new Set<string>();

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id: string) => readSet.add(id));
      }
    }

    // Migrate legacy testimonial read IDs
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        legacyParsed.forEach((id: string) => {
          readSet.add(id.startsWith('testimonial-') ? id : `testimonial-${id}`);
        });
      }
    }

    return Array.from(readSet);
  } catch {
    return [];
  }
};

export const useAdminNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [readIds, setReadIds] = useState<string[]>(loadReadIds);
  const readIdsRef = useRef<string[]>(readIds);
  readIdsRef.current = readIds;

  const fetchNotifications = useCallback(async () => {
    try {
      // 1. Fetch Testimonials independently
      let rawTestData: any[] = [];
      try {
        const { data, error } = await (supabase as any)
          .from('testimonials')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data) rawTestData = data;
        else if (error) console.warn('[useAdminNotifications] Testimonials error:', error);
      } catch (e) {
        console.warn('[useAdminNotifications] Testimonials exception:', e);
      }

      // 2. Fetch Contact Messages independently
      let rawContactData: any[] = [];
      try {
        const { data, error } = await (supabase as any)
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data) rawContactData = data;
        else if (error) console.warn('[useAdminNotifications] Contacts error:', error);
      } catch (e) {
        console.warn('[useAdminNotifications] Contacts exception:', e);
      }

      // 3. Fetch Resume Downloads independently
      let rawDlData: any[] = [];
      try {
        const { data, error } = await (supabase as any)
          .from('resume_downloads')
          .select('*')
          .order('downloaded_at', { ascending: false })
          .limit(20);
        if (!error && data) rawDlData = data;
        else if (error) console.warn('[useAdminNotifications] Downloads error:', error);
      } catch (e) {
        console.warn('[useAdminNotifications] Downloads exception:', e);
      }

      // Filter in JS for maximum reliability
      const testData = rawTestData.slice(0, 10);
      const contactData = rawContactData
        .filter((c) => {
          const st = (c.status || 'open').toLowerCase();
          return st !== 'archived';
        })
        .slice(0, 10);
      const dlData = rawDlData
        .filter((d) => (d.download_status || 'completed').toLowerCase() !== 'failed')
        .slice(0, 10);

      // Batch fetch visitor profiles for resume downloads
      const visitorIds = Array.from(new Set(dlData.map((d) => d.visitor_id).filter(Boolean)));
      const profilesMap = new Map<string, { full_name?: string | null; email?: string | null }>();

      if (visitorIds.length > 0) {
        try {
          const { data: profiles, error: profErr } = await (supabase as any)
            .from('visitor_profiles')
            .select('visitor_id, full_name, email')
            .in('visitor_id', visitorIds);

          if (!profErr && profiles) {
            profiles.forEach((p: any) => {
              profilesMap.set(p.visitor_id, p);
            });
          }
        } catch (profErr) {
          console.warn('[useAdminNotifications] Error fetching visitor profiles for notifications:', profErr);
        }
      }

      const combined: AdminNotification[] = [];
      const currentReadIds = readIdsRef.current;

      // Map Testimonials
      testData.forEach((t) => {
        const notifId = `testimonial-${t.id}`;
        const isRead = currentReadIds.includes(notifId);
        const dateVal = t.created_at || new Date().toISOString();
        const isPending = (t.status || 'pending').toLowerCase() === 'pending';
        const isApproved = (t.status || '').toLowerCase() === 'approved';

        combined.push({
          id: notifId,
          type: 'testimonial',
          title: isPending ? 'New Testimonial Received' : isApproved ? 'Testimonial Approved & Live' : 'Testimonial Submitted',
          description: isPending
            ? `${t.full_name?.trim() || 'A visitor'} submitted a testimonial awaiting review.`
            : `${t.full_name?.trim() || 'A visitor'}'s testimonial is live on your portfolio.`,
          timestamp: formatNotificationTimeAgo(dateVal),
          createdAt: dateVal,
          iconBg: isRead ? 'rgba(245, 158, 11, 0.08)' : isPending ? 'rgba(245, 158, 11, 0.18)' : 'rgba(124, 58, 237, 0.15)',
          iconColor: isRead ? '#D97706' : isPending ? '#D97706' : 'var(--admin-primary)',
          isRead,
          sourceId: t.id
        });
      });

      // Map Contact Messages
      contactData.forEach((c) => {
        const notifId = `contact-${c.id}`;
        const isRead = currentReadIds.includes(notifId);
        const contactName = c.full_name?.trim() || (c.email ? c.email.split('@')[0] : 'Someone');
        const dateVal = c.created_at || new Date().toISOString();
        combined.push({
          id: notifId,
          type: 'contact',
          title: 'New Contact Received',
          description: `${contactName} submitted a contact request.`,
          timestamp: formatNotificationTimeAgo(dateVal),
          createdAt: dateVal,
          iconBg: isRead ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.18)',
          iconColor: '#2563EB',
          isRead,
          sourceId: c.id
        });
      });

      // Map Resume Downloads
      dlData.forEach((d) => {
        const notifId = `download-${d.id}`;
        const isRead = currentReadIds.includes(notifId);
        const profile = profilesMap.get(d.visitor_id);
        const hasName = Boolean(profile?.full_name && profile.full_name.trim());
        const hasEmail = Boolean(profile?.email && profile.email.trim());
        
        let desc = 'Anonymous Visitor downloaded your resume.';
        if (hasName) {
          desc = `${profile!.full_name!.trim()} downloaded your resume.`;
        } else if (hasEmail) {
          desc = `${profile!.email!.trim()} downloaded your resume.`;
        } else if (d.city || d.country) {
          const loc = d.city ? `${d.city}, ${d.country || ''}`.replace(/,\s*$/, '') : d.country;
          desc = `Anonymous Visitor from ${loc} downloaded your resume.`;
        }

        const dateVal = d.downloaded_at || d.created_at || new Date().toISOString();

        combined.push({
          id: notifId,
          type: 'download',
          title: 'Resume Downloaded',
          description: desc,
          timestamp: formatNotificationTimeAgo(dateVal),
          createdAt: dateVal,
          iconBg: isRead ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.18)',
          iconColor: '#16A34A',
          isRead,
          sourceId: d.id
        });
      });

      // Chronological sort: newest first
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(combined);
    } catch (err) {
      console.error('[useAdminNotifications] Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRef = useRef(fetchNotifications);
  fetchRef.current = fetchNotifications;

  // Refresh when user auth status changes or is verified
  useEffect(() => {
    fetchRef.current();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchRef.current();
      }
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [user]);

  // Realtime multi-table subscription & window visibility handlers
  useEffect(() => {
    fetchRef.current();

    const channel = supabase
      .channel('topbar-admin-notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'testimonials' },
        () => fetchRef.current()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => fetchRef.current()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resume_downloads' },
        () => fetchRef.current()
      )
      .subscribe();

    const handleWindowFocus = () => {
      fetchRef.current();
    };

    const handleCustomDownload = () => {
      fetchRef.current();
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('visibilitychange', handleWindowFocus);
    window.addEventListener('resume_downloaded', handleCustomDownload);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('visibilitychange', handleWindowFocus);
      window.removeEventListener('resume_downloaded', handleCustomDownload);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = useCallback(() => {
    const currentIds = notifications.map((n) => n.id);
    const updatedSet = new Set([...readIdsRef.current, ...currentIds]);
    const updatedArray = Array.from(updatedSet);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArray));
    } catch (e) {
      console.warn('Failed to save read notifications to localStorage:', e);
    }
    setReadIds(updatedArray);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    if (readIdsRef.current.includes(id)) return;
    const updatedArray = [...readIdsRef.current, id];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArray));
    } catch (e) {
      console.warn('Failed to save read notification to localStorage:', e);
    }
    setReadIds(updatedArray);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAllAsRead,
    markAsRead
  };
};

export default useAdminNotifications;
