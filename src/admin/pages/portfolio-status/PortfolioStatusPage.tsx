/* src/admin/pages/portfolio-status/PortfolioStatusPage.tsx */
import React from 'react';
import { Card } from '../../components/cards/Card';
import { Badge } from '../../components/badges/Badge';
import { Button } from '../../components/buttons/Button';

export const PortfolioStatusPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-6)' }}>
      <Card title="System Services Health" subtitle="Verification logs for integrated external APIs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
          {[
            { service: 'Supabase Database Connection', status: 'operational', delay: '12ms' },
            { service: 'Google OAuth API Provider', status: 'operational', delay: '42ms' },
            { service: 'GitHub Pages CDN Server', status: 'operational', delay: '110ms' },
          ].map((srv, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 'var(--admin-space-3)', 
                background: 'var(--admin-surface)', 
                borderRadius: 'var(--admin-radius-sm)',
                fontSize: '13.5px'
              }}
            >
              <span style={{ fontWeight: 600 }}>{srv.service}</span>
              <div style={{ display: 'flex', gap: 'var(--admin-space-3)', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--admin-text-secondary)' }}>{srv.delay}</span>
                <Badge variant="success">{srv.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Build & Deployment Logs">
        <div style={{ background: 'var(--admin-text)', color: '#A7F3D0', fontFamily: 'monospace', padding: 'var(--admin-space-4)', borderRadius: 'var(--admin-radius-sm)', fontSize: '12px', lineHeight: 1.6 }}>
          <div>[2026-07-10 17:11:32] Run build compiler task...</div>
          <div>[2026-07-10 17:11:35] Built static files to /dist directory successfully.</div>
          <div>[2026-07-10 17:11:40] Deployed commits to production branch gh-pages.</div>
          <div style={{ color: 'white' }}>[2026-07-10 17:11:42] Static site server operational.</div>
        </div>
      </Card>
    </div>
  );
};

export default PortfolioStatusPage;
