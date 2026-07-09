import React from 'react';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  collapsed = false,
  onClick,
}) => {
  return (
    <li className="sidebar-menu-item">
      <a
        className={`sidebar-link ${active ? 'active' : ''}`}
        onClick={onClick}
        title={collapsed ? label : undefined}
      >
        <span className="sidebar-link-icon">{icon}</span>
        <span className="sidebar-link-label">{label}</span>
      </a>
    </li>
  );
};

export default SidebarItem;
