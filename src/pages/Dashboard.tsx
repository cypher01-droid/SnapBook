import React from 'react';
import { useAuth } from '../context/AuthContext';
import PhotographerDashboard from '../components/dashboard/PhotographerDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import { Navigate, useSearchParams } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chat') || undefined;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'photographer') {
    return <PhotographerDashboard />;
  }

  return <ClientDashboard initialChatId={chatId} />;
};

export default Dashboard;