import React, { useState } from 'react';
import TopBar from './TopBar';
import BottomNavClient from './BottomNavClient';
import ClientFeedTab from './ClientFeedTab';
import ClientDiscoverTab from './ClientDiscoverTab';
import ChatContainer from '../chat/ChatContainer';
import ClientProfileTab from './ClientProfileTab';

interface ClientDashboardProps {
  initialChatId?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ initialChatId }) => {
  const [activeTab, setActiveTab] = useState(initialChatId ? 'chats' : 'feed');

  const renderTab = () => {
    switch (activeTab) {
      case 'feed': return <ClientFeedTab />;
      case 'discover': return <ClientDiscoverTab />;
      case 'chats': return <ChatContainer initialConversationId={initialChatId} />;
      case 'profile': return <ClientProfileTab />;
      default: return <ClientFeedTab />;
    }
  };

  return (
    <div className="dashboard-app">
      <TopBar />
      <main className="dashboard-content" style={{ paddingBottom: '70px' }}>
        {renderTab()}
      </main>
      <BottomNavClient
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};

export default ClientDashboard;