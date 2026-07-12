/* src/components/tools/AchievementsPanel.tsx */
import React from 'react';

export const AchievementsPanel: React.FC = () => {
  const achievements = [
    { label: 'Marketplace Ready', color: '#10B981', bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Enterprise', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.15)' },
    { label: 'Reusable', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.05)', border: 'rgba(139, 92, 246, 0.15)' },
    { label: 'Cross Platform', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.05)', border: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Performance', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.15)' },
    { label: 'Responsive', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.05)', border: 'rgba(6, 182, 212, 0.15)' },
    { label: 'Accessible', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.05)', border: 'rgba(236, 72, 153, 0.15)' },
    { label: 'Open Source', color: '#10B981', bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.15)' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: '#A78BFA' }}>★</span>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Key Achievements & Qualities
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          width: '100%'
        }}
      >
        {achievements.map((a, idx) => (
          <span
            key={idx}
            style={{
              padding: '8px 16px',
              backgroundColor: a.bg,
              border: `1px solid ${a.border}`,
              borderRadius: '999px',
              color: a.color,
              fontSize: '12px',
              fontWeight: 650,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            className="achievement-badge"
          >
            <span style={{ width: '5px', height: '5px', backgroundColor: a.color, borderRadius: '50%' }} />
            {a.label}
          </span>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .achievement-badge:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          transform: translateY(-1px);
        }
      `}} />
    </div>
  );
};

export default AchievementsPanel;
