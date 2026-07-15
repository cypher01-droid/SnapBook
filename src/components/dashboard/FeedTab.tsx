import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import toast from 'react-hot-toast';

const FeedTab: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/mine');
      setPosts(res.data);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleLike = async (postId: string) => {
    try {
      const res = await api.patch(`/posts/${postId}/like`);
      setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="feed-loading">Loading your work…</div>;

  return (
    <div className="feed-container">
      {/* Post Composer (Facebook‑style) */}
      <div className="composer-card glass">
        <div className="composer-avatar">SB</div>
        <button className="composer-input" onClick={() => setShowCreate(true)}>
          What’s on your mind? Share your latest work...
        </button>
        <div className="composer-actions">
          <button className="composer-media-btn" onClick={() => setShowCreate(true)}>
            📷 Photo
          </button>
          <button className="composer-media-btn" onClick={() => setShowCreate(true)}>
            🎞️ Album
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="empty-state">You haven’t posted anything yet. Share your work!</p>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <PostCard key={post._id} post={post} onLike={handleLike} />
          ))}
        </div>
      )}

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onPostCreated={() => { setShowCreate(false); fetchPosts(); }} />}
    </div>
  );
};

export default FeedTab;