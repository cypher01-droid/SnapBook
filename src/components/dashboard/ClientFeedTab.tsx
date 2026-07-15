import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PostCardSocial from './PostCardSocial';
import toast from 'react-hot-toast';

const ClientFeedTab: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get('/posts/feed');
        setPosts(res.data);
      } catch {
        toast.error('Failed to load feed');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return <div className="feed-loading">Loading posts…</div>;

  return (
    <div className="feed-container">
      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Follow photographers to see their work.</p>
      ) : (
        <div className="post-list">
          {posts.map((post: any) => (
            <PostCardSocial key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientFeedTab;