interface ActionButtonsProps {
  onView?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onView }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* 1. View button */}
      <button
        onClick={onView}
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
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#F8FAFC';
          e.currentTarget.style.borderColor = '#CBD5E1';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.borderColor = '#E2E8F0';
        }}
      >
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>View</span>
      </button>

      {/* 2. Later button */}
      <button
        className="hover-scale active-press"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          border: '1px solid #FFEDD5', // Light orange border
          borderRadius: '20px',
          backgroundColor: '#FFF9F2', // Light orange surface bg
          color: '#D97706', // Orange text
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#FFEDD5';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#FFF9F2';
        }}
      >
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Later</span>
      </button>
    </div>
  );
};

export default ActionButtons;
