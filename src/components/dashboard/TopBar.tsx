import React from 'react';
import { FiBell } from 'react-icons/fi';

const BellIcon = FiBell as React.FC<{ className?: string }>;

const TopBar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="topbar-logo">SnapBook</div>
      <div className="topbar-actions">
        <button className="icon-btn">
          <BellIcon className="bell-icon" />
          <span className="notification-badge">3</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;