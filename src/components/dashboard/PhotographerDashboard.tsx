import React, { useState } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';   // photographer bottom nav (Feed / Profile / Availability / Bookings)
import FeedTab from './FeedTab';
import ProfileTab from './ProfileTab';
import AvailabilityTab from './AvailabilityTab';
import BookingsTab from './BookingsTab';
import ChatContainer from '../chat/ChatContainer';


const PhotographerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const renderTab = () => {
    switch (activeTab) {
      case 'feed': return <FeedTab />;
      case 'profile': return <ProfileTab />;
      case 'availability': return <AvailabilityTab />;
      case 'bookings': return <BookingsTab />;
      default: return <FeedTab />;
      case 'chats': return <ChatContainer />;

    }
  };

  return (
    <div className="dashboard-app">
      <TopBar />
      <main className="dashboard-content" style={{ paddingBottom: '70px' }}>
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default PhotographerDashboard;