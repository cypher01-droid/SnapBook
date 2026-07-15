import React from 'react';
import { FiUser, FiCalendar, FiBookOpen, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Workaround: cast icons to valid JSX components
const UserIcon = FiUser as React.FC<{ className?: string }>;
const CalendarIcon = FiCalendar as React.FC<{ className?: string }>;
const BookOpenIcon = FiBookOpen as React.FC<{ className?: string }>;
const LogOutIcon = FiLogOut as React.FC<{ className?: string }>;

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { key: 'profile', icon: UserIcon, label: 'Profile' },
    { key: 'availability', icon: CalendarIcon, label: 'Availability' },
    { key: 'bookings', icon: BookOpenIcon, label: 'Bookings' },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">SB</div>
        <div className="sidebar-user">
          <p className="user-name">{user?.name}</p>
          <span className="user-role">📸 Photographer</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`sidebar-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <tab.icon className="sidebar-icon" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      <button className="sidebar-btn logout-btn" onClick={handleLogout}>
        <LogOutIcon className="sidebar-icon" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;