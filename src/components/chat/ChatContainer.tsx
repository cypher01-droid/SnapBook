import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import api from '../../utils/api';

interface ChatContainerProps {
  initialConversationId?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ initialConversationId }) => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  useEffect(() => {
    if (initialConversationId) {
      const fetchConversation = async () => {
        try {
          const res = await api.get(`/chat/conversations/${initialConversationId}`);
          setSelectedConversation(res.data);
        } catch (error) {
          console.error('Failed to load conversation', error);
        }
      };
      fetchConversation();
    }
  }, [initialConversationId]);

  return (
    <div className="chat-container">
      {!selectedConversation ? (
        <ChatList onSelect={setSelectedConversation} />
      ) : (
        <ChatWindow conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
      )}
    </div>
  );
};

export default ChatContainer;