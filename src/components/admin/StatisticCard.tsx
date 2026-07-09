import React from 'react';

interface StatisticCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  growth: string;
  loading?: boolean;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ label, value, icon, growth, loading = false }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        <span className="stat-card-growth">{growth}</span>
      </div>
      <div className="stat-card-body">
        {loading ? (
          <div className="skeleton-cell" style={{ width: '80px', height: '28px', margin: '4px 0 8px 0', borderRadius: '4px' }} />
        ) : (
          <h3 className="stat-card-value">{value}</h3>
        )}
        <p className="stat-card-label">{label}</p>
      </div>
    </div>
  );
};

export default StatisticCard;
