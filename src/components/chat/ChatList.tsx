import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface ChatListProps {
  onSelect: (conversation: any) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelect }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data);
      } catch {
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="tab-loading">Loading chats…</div>;

  return (
    <div className="chat-list">
      <h2 className="chat-list-header">Messages</h2>
      {conversations.length === 0 ? (
        <p className="empty-state">No conversations yet. Start a chat from a photographer's profile.</p>
      ) : (
        conversations.map(conv => {
          const otherUser = conv.participants.find((p: any) => p._id !== localStorage.getItem('userId'));
          return (
            <div key={conv._id} className="chat-list-item" onClick={() => onSelect(conv)}>
              <img
                src={otherUser?.profilePicture || ''}
                alt=""
                className="chat-avatar"
              />
              <div className="chat-list-info">
                <div className="chat-list-name">{otherUser?.name || 'Unknown'}</div>
                <div className="chat-list-last">{conv.lastMessage}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;