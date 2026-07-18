/* src/admin/types/resumeDownload.ts */

export interface ResumeDownload {
  id: string;
  dateTime: string; // e.g., Jan 15, 2024, 10:42 AM
  visitorName: string;
  visitorEmail?: string | null;
  avatarUrl?: string | null;
  isKnown: boolean;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  source: string; // e.g., LinkedIn, Google Search
  downloadedFrom: string; // e.g., Hero Section
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
}

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

  const visitorShort = db.visitor_id ? `Visitor (${db.visitor_id.substring(0, 6)})` : 'Anonymous Visitor';

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

  return {
    id: db.id,
    dateTime: `${formattedDate}, ${formattedTime}`,
    visitorName: visitorShort,
    visitorEmail: null,
    avatarUrl: null,
    isKnown: false,
    country: db.country || 'Unknown',
    city: db.city || 'Unknown',
    device: deviceMapped,
    source: cleanSource,
    downloadedFrom: db.page_source || 'Homepage',
    duration: '--',
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
