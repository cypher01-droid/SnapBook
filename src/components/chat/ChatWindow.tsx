import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

const BackIcon = FiArrowLeft as React.FC<{ className?: string; onClick?: () => void }>;
const SendIcon = FiSend as React.FC<{ className?: string }>;

interface ChatWindowProps {
  conversation: any;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('userId') || '';

  const otherUser = conversation.participants.find((p: any) => p._id !== currentUserId);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/${conversation._id}/messages`);
      setMessages(res.data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversation._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post(`/chat/${conversation._id}/messages`, { text });
      setMessages([...messages, res.data]);
      setText('');
    } catch {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          <BackIcon />
        </button>
        <img src={otherUser?.profilePicture || ''} alt="" className="chat-header-avatar" />
        <span className="chat-header-name">{otherUser?.name || 'Unknown'}</span>
      </div>
      <div className="chat-messages">
        {loading ? (
          <p className="loading-text">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="empty-state">No messages yet. Say hello!</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg._id}
              className={`message-bubble ${msg.sender._id === currentUserId ? 'sent' : 'received'}`}
            >
              <p>{msg.text}</p>
              <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="chat-input"
        />
        <button onClick={handleSend} className="send-btn">
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;