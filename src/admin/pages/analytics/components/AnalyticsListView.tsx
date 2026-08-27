/* src/admin/pages/analytics/components/AnalyticsListView.tsx */
import React from 'react';
import { VisitorSession } from '../../../types/analytics';
import { DownloadStatusBadge } from '../../resume/components/DownloadStatusBadge';

interface AnalyticsListViewProps {
  visitorSessions: VisitorSession[];
  totalCount: number;
  search: string;
  setSearch: (val: string) => void;
  page: number;
  setPage: (val: number | ((prev: number) => number)) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  onRefresh?: () => void;
  onViewDetails?: (v: VisitorSession) => void;
}

const formatDuration = (sec: number) => {
  const durationMin = Math.floor(sec / 60);
  const durationRemSec = sec % 60;
  return durationMin > 0 ? `${durationMin}m ${durationRemSec}s` : `${durationRemSec}s`;
};

const getCountryFlag = (countryNameOrCode: string | null): string => {
  if (!countryNameOrCode) return '🏳️';
  const name = countryNameOrCode.toLowerCase().trim();
  if (name === 'india' || name === 'in') return '🇮🇳';
  if (name === 'united states' || name === 'us' || name === 'usa') return '🇺🇸';
  if (name === 'germany' || name === 'de') return '🇩🇪';
  if (name === 'united kingdom' || name === 'uk' || name === 'gb') return '🇬🇧';
  if (name === 'canada' || name === 'ca') return '🇨🇦';
  if (name === 'singapore' || name === 'sg') return '🇸🇬';
  if (name === 'south korea' || name === 'kr') return '🇰🇷';
  if (name === 'spain' || name === 'es') return '🇪🇸';
  if (name === 'denmark' || name === 'dk') return '🇩🇰';
  if (name === 'australia' || name === 'au') return '🇦🇺';
  if (name === 'france' || name === 'fr') return '🇫🇷';
  if (name === 'japan' || name === 'jp') return '🇯🇵';
  
  if (countryNameOrCode.length === 2) {
    const codePoints = countryNameOrCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    try {
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return '🏳️';
    }
  }
  return '🏳️';
};

const formatCountry = (country: string | null): string => {
  if (!country || country === 'Unknown') return '🏳️ Unknown';
  const flag = getCountryFlag(country);
  return `${flag} ${country}`;
};

const formatTimeAgo = (dateInput: string | Date | null): string => {
  if (!dateInput) return 'Unknown';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Unknown';
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const AnalyticsListView: React.FC<AnalyticsListViewProps> = ({
  visitorSessions,
  totalCount,
  search,
  setSearch,
  page,
  setPage,
  pageSize,
  setPageSize,
  onRefresh,
  onViewDetails,
}) => {
  // Visitor avatar helper
  const defaultAvatar = (
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        border: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        flexShrink: 0
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  const showingStart = visitorSessions.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const showingEnd = visitorSessions.length > 0 ? (page - 1) * pageSize + visitorSessions.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* TOOLBAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--admin-space-4)',
          padding: 'var(--admin-space-4)',
          background: '#FFFFFF',
          borderRadius: 'var(--admin-radius-md) var(--admin-radius-md) 0 0',
          border: '1px solid var(--admin-border)',
          borderBottom: 'none',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--admin-space-3)', flex: 1 }}>
          {/* Search box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '240px', boxSizing: 'border-box' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search downloads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                fontSize: '13.5px',
                color: 'var(--admin-text)',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
            />
          </div>

          {/* Date Selector */}
          <select
            defaultValue="all"
            style={{
              padding: '8px 12px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '13.5px',
              color: 'var(--admin-text-secondary)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '130px'
            }}
          >
            <option value="all">Date Range</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Export / Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="hover-scale active-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--admin-text)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            onClick={onRefresh}
            className="hover-scale active-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: 'var(--admin-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          background: '#FFFFFF',
          border: '1px solid var(--admin-border)',
          borderRadius: '0',
          boxSizing: 'border-box'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: "'Manrope', sans-serif" }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--admin-border)' }}>
              {['Date & Time', 'Visitor', 'Country', 'Device', 'Source', 'Downloaded From', 'Duration', 'Status', 'Action'].map((h) => (
                <th key={h} style={{ padding: '12px var(--admin-space-4)', fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visitorSessions.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: 'var(--admin-text-secondary)',
                    fontFamily: "'Manrope', sans-serif"
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--admin-text-secondary)', opacity: 0.5 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--admin-text)' }}>
                      No visitor sessions available.
                    </div>
                    <div style={{ fontSize: '12.5px', opacity: 0.7, maxWidth: '380px', lineHeight: '1.5' }}>
                      Live analytics data will appear here once the table is connected to the analytics service.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              visitorSessions.map((v) => {
                const formattedDate = v.visitedAt.split('\n');
                return (
                  <tr
                    key={v.id}
                    style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background-color 0.15s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.6)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Date & Time / Last Activity */}
                    <td style={{ padding: '16px var(--admin-space-4)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>{formattedDate[0]}</span>
                        <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{formattedDate[1]}</span>
                          <span style={{ opacity: 0.4 }}>•</span>
                          <span style={{ fontWeight: 500, color: 'var(--admin-primary)' }}>{formatTimeAgo(v.lastActivity)}</span>
                        </span>
                      </div>
                    </td>

                    {/* Visitor */}
                    <td style={{ padding: '16px var(--admin-space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {v.avatarUrl ? (
                          <img
                            src={v.avatarUrl}
                            alt={v.visitorName || 'Visitor'}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--admin-surface)',
                            color: 'var(--admin-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {(v.visitorName || 'Anonymous Visitor').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>{v.visitorName || 'Anonymous Visitor'}</span>
                          {v.visitorEmail && <span style={{ fontSize: '11.5px', color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap' }}>{v.visitorEmail}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Country & City */}
                    <td style={{ padding: '16px var(--admin-space-4)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>{formatCountry(v.country)}</span>
                        {v.city && v.city !== 'Unknown' && <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', marginLeft: '24px' }}>{v.city}</span>}
                      </div>
                    </td>

                    {/* Device / Browser & OS */}
                    <td style={{ padding: '16px var(--admin-space-4)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>{v.device || 'Unknown Device'}</span>
                        <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)' }}>
                          {v.browser || 'Unknown Browser'}{v.os && v.os !== 'Unknown' ? ` on ${v.os}` : ''}
                        </span>
                      </div>
                    </td>

                    {/* Traffic Source */}
                    <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                      {v.source || 'Direct Traffic'}
                    </td>

                    {/* Landing Page */}
                    <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                      {v.landingPage || 'Home Page'}
                    </td>

                    {/* Duration */}
                    <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                      {formatDuration(v.sessionDuration)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px var(--admin-space-4)' }}>
                      <DownloadStatusBadge isKnown={v.isKnownVisitor} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px var(--admin-space-4)' }}>
                      <button
                        onClick={() => onViewDetails?.(v)}
                        className="hover-scale active-press"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '20px',
                          backgroundColor: '#FFFFFF',
                          color: '#0F172A',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--admin-space-4)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--admin-border)',
          borderTop: 'none',
          borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '13px',
          color: 'var(--admin-text-secondary)',
          boxSizing: 'border-box'
        }}
      >
        <div>
          Showing <strong style={{ color: 'var(--admin-text)' }}>{showingStart}–{showingEnd}</strong> of <strong style={{ color: 'var(--admin-text)' }}>{totalCount}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            style={{ padding: '6px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: '#FFFFFF', color: page === 1 ? '#D1D5DB' : 'var(--admin-text)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '12px' }}
          >
            Previous
          </button>
          <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--admin-primary)', color: '#FFFFFF', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
            1
          </button>
          {[2, 3].map((pNum) => (
            <button
              key={pNum}
              onClick={() => setPage(pNum)}
              style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: '#FFFFFF', color: 'var(--admin-text)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
            >
              {pNum}
            </button>
          ))}
          <span style={{ margin: '0 4px', opacity: 0.6 }}>...</span>
          <button onClick={() => setPage(43)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: '#FFFFFF', color: 'var(--admin-text)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
            43
          </button>
          <button
            disabled={page === 43}
            onClick={() => setPage((prev) => Math.min(43, prev + 1))}
            style={{ padding: '6px 12px', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: '#FFFFFF', color: page === 43 ? '#D1D5DB' : 'var(--admin-text)', cursor: page === 43 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '12px' }}
          >
            Next
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
            style={{ padding: '4px 8px', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: '#FFFFFF', color: 'var(--admin-text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsListView;
