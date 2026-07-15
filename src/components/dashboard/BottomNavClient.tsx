import React from 'react';
import { FiHome, FiCompass, FiMessageCircle, FiUser } from 'react-icons/fi';

const HomeIcon = FiHome as React.FC<{ className?: string }>;
const CompassIcon = FiCompass as React.FC<{ className?: string }>;
const ChatIcon = FiMessageCircle as React.FC<{ className?: string }>;
const UserIcon = FiUser as React.FC<{ className?: string }>;

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: 'feed', icon: HomeIcon, label: 'Feed' },
  { key: 'discover', icon: CompassIcon, label: 'Discover' },
  { key: 'chats', icon: ChatIcon, label: 'Chats' },
  { key: 'profile', icon: UserIcon, label: 'Profile' },
];

const BottomNavClient: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => (
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

export default BottomNavClient;