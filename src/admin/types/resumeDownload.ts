/* src/admin/types/resumeDownload.ts */

export interface ResumeDownload {
  id: string;
  dateTime: string; // e.g., Jan 15, 2024, 10:42 AM
  visitorName: string;
  visitorEmail?: string | null;
  avatarUrl?: string | null;
  isKnown: boolean;
  visitorId?: string | null;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  source: string; // e.g., LinkedIn, Google Search
  duration: string; // e.g., 8m 22s
  browser: string;
  os: string;
  submissionTime: string; // e.g., 10:42 AM
  ipAddress?: string | null;
  status?: string;
  resumeVersion?: string;
  sessionId?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  pageSource?: string | null;
}

export interface SupabaseResumeDownload {
  id: string;
  resume_id: string | null;
  downloaded_at: string;
  session_id: string | null;
  visitor_id: string | null;
  page_source: string | null;
  referrer: string | null;
  user_agent: string | null;
  browser: string | null;
  operating_system: string | null;
  device_type: string | null;
  country: string | null;
  city: string | null;
  ip_address: string | null;
  download_status: string;
  resume_settings?: { version: string } | null;
  visitor_profiles?: {
    full_name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  } | null;
  visitor_sessions?: {
    id: string;
    duration_seconds?: number | null;
    created_at?: string | null;
  } | null;
}

export const formatResumeDuration = (session?: { duration_seconds?: number | null } | null): string => {
  if (!session) return '—';
  const sec = typeof session.duration_seconds === 'number' ? session.duration_seconds : 0;
  if (sec < 15) return '< 15s';
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (mins > 0) {
    return remSec > 0 ? `${mins}m ${remSec}s` : `${mins}m`;
  }
  return `${remSec}s`;
};

export const mapSupabaseToResumeDownload = (db: SupabaseResumeDownload): ResumeDownload => {
  const d = new Date(db.downloaded_at);
  const formattedDate = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const profile = db.visitor_profiles || null;
  const hasName = Boolean(profile?.full_name && profile.full_name.trim());
  const hasEmail = Boolean(profile?.email && profile.email.trim());
  const isKnown = hasName || hasEmail;

  const visitorName = hasName
    ? profile!.full_name!.trim()
    : hasEmail
      ? profile!.email!.trim()
      : 'Anonymous Visitor';
  const visitorEmail = hasEmail ? profile!.email!.trim() : null;
  const avatarUrl = (profile?.avatar_url && profile.avatar_url.trim()) || null;

  let deviceMapped: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (db.device_type === 'Mobile' || db.device_type === 'Tablet') {
    deviceMapped = db.device_type;
  }

  // Parse referrer for cleaner display source
  let cleanSource = db.referrer || 'Direct';
  if (cleanSource.includes('linkedin.com')) {
    cleanSource = 'LinkedIn';
  } else if (cleanSource.includes('github.com')) {
    cleanSource = 'GitHub';
  } else if (cleanSource.includes('google.com')) {
    cleanSource = 'Google Search';
  } else if (cleanSource.startsWith('http')) {
    try {
      const url = new URL(cleanSource);
      cleanSource = url.hostname;
    } catch {
      // keep original
    }
  }

  // Resolve duration from visitor_sessions
  const cleanDuration = formatResumeDuration(db.visitor_sessions);

  return {
    id: db.id,
    dateTime: `${formattedDate}, ${formattedTime}`,
    visitorName,
    visitorEmail,
    avatarUrl,
    isKnown,
    visitorId: db.visitor_id,
    country: db.country || 'Unknown',
    city: db.city || 'Unknown',
    device: deviceMapped,
    source: cleanSource,
    duration: cleanDuration,
    browser: db.browser || 'Unknown',
    os: db.operating_system || 'Unknown',
    submissionTime: formattedTime,
    ipAddress: db.ip_address,
    status: db.download_status,
    resumeVersion: db.resume_settings ? db.resume_settings.version : 'Unknown',
    sessionId: db.session_id,
    userAgent: db.user_agent,
    referrer: db.referrer,
    pageSource: db.page_source
  };
};
