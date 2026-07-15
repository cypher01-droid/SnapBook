import React from 'react';
import { FiHome, FiUser, FiCalendar, FiBookOpen } from 'react-icons/fi';

const HomeIcon = FiHome as React.FC<{ className?: string }>;
const UserIcon = FiUser as React.FC<{ className?: string }>;
const CalendarIcon = FiCalendar as React.FC<{ className?: string }>;
const BookOpenIcon = FiBookOpen as React.FC<{ className?: string }>;

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: 'feed', icon: HomeIcon, label: 'Feed' },
  { key: 'profile', icon: UserIcon, label: 'Profile' },
  { key: 'availability', icon: CalendarIcon, label: 'Hours' },
  { key: 'bookings', icon: BookOpenIcon, label: 'Bookings' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => (
  <nav className="bottom-nav">
    {tabs.map(tab => (
      <button
        key={tab.key}
        className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
        onClick={() => onTabChange(tab.key)}
      >
        <tab.icon className="nav-icon" />
        <span>{tab.label}</span>
      </button>
    ))}
  </nav>
);

export default BottomNav;