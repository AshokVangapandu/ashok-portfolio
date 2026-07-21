/* src/admin/pages/settings/components/PortfolioStatusSelector.tsx */
import React from 'react';
import { PortfolioVisibility } from '../../../types/portfolioSettings';

interface StatusOption {
  value: PortfolioVisibility;
  title: string;
  desc: string;
  visitorAccess: string;
  adminAccess: string;
  icon: React.ReactNode;
  dotColor: string;
}

interface PortfolioStatusSelectorProps {
  selected: PortfolioVisibility;
  onChange: (val: PortfolioVisibility) => void;
}

export const PortfolioStatusSelector: React.FC<PortfolioStatusSelectorProps> = ({
  selected,
  onChange,
}) => {
  const options: StatusOption[] = [
    {
      value: 'public',
      title: 'Public',
      desc: 'Your portfolio is publicly accessible to everyone.',
      visitorAccess: 'Full Access',
      adminAccess: 'Full Access',
      dotColor: '#10B981', // green
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      value: 'maintenance',
      title: 'Maintenance',
      desc: 'Visitors will see a maintenance page while updates are in progress.',
      visitorAccess: 'Maintenance Page',
      adminAccess: 'Full Access (Bypass)',
      dotColor: '#F59E0B', // amber
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      value: 'private',
      title: 'Private',
      desc: 'Only authorized users can access the portfolio.',
      visitorAccess: 'Private Access Page',
      adminAccess: 'Full Access (Bypass)',
      dotColor: '#6366F1', // indigo
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  const currentOption = options.find((o) => o.value === selected) || options[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Portfolio Status
        </label>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
          Control who can access your portfolio and preview visitor vs admin experiences.
        </p>
      </div>

      {/* Grid wrapper - responsive row layout */}
      <div
        className="responsive-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          boxSizing: 'border-box'
        }}
      >
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="hover-scale active-press"
              style={{
                backgroundColor: '#FFFFFF',
                border: isSelected ? '1.5px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                boxSizing: 'border-box',
                boxShadow: isSelected ? '0 4px 12px rgba(124, 58, 237, 0.08)' : 'var(--admin-shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top Row: Icon & Checkmark indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.06)' : '#F8FAFC',
                    color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {opt.icon}
                </div>

                {isSelected && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--admin-primary)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title & Desc */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: opt.dotColor }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    {opt.title}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
                  {opt.desc}
                </p>
              </div>

              {/* Access Rights Breakdown */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Public Visitors:</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{opt.visitorAccess}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Administrator:</span>
                  <span style={{ fontWeight: 700, color: '#7C3AED' }}>{opt.adminAccess}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visibility Informational Preview Card */}
      <div
        style={{
          marginTop: '4px',
          padding: '16px 20px',
          borderRadius: '12px',
          backgroundColor: selected === 'maintenance' ? '#FEF3C7' : selected === 'private' ? '#EEF2FF' : '#ECFDF5',
          border: selected === 'maintenance' ? '1px solid #FDE68A' : selected === 'private' ? '1px solid #C7D2FE' : '1px solid #A7F3D0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px' }}>
            {selected === 'maintenance' ? '🟠' : selected === 'private' ? '🔒' : '🟢'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: selected === 'maintenance' ? '#92400E' : selected === 'private' ? '#3730A3' : '#065F46' }}>
            Visibility Preview: {currentOption.title} Mode
          </span>
        </div>

        <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: selected === 'maintenance' ? '#78350F' : selected === 'private' ? '#312E81' : '#047857' }}>
          {selected === 'maintenance' && (
            <>
              <strong>Public Visitors will see:</strong> ✔ Maintenance Page & "Notify Me" subscription.<br />
              <strong>Authenticated Administrators:</strong> ✔ Will continue to have full access (Admin Mode bypass).
            </>
          )}
          {selected === 'private' && (
            <>
              <strong>Public Visitors will see:</strong> ✔ Private Access Page & Request Access workflow.<br />
              <strong>Authenticated Administrators:</strong> ✔ Will continue to have full access (Admin Preview bypass).
            </>
          )}
          {selected === 'public' && (
            <>
              <strong>Public Visitors will see:</strong> ✔ Full live portfolio.<br />
              <strong>Everyone:</strong> ✔ Full access enabled for all visitors and administrators.
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioStatusSelector;
