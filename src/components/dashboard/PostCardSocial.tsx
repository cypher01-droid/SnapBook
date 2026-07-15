import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiMessageCircle, FiBookmark, FiShare2, FiSend } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Lightbox from './Lightbox';

// Icons typed
const HeartIcon = FiHeart as React.FC<{ className?: string; onClick?: () => void }>;
const EyeIcon = FiEye as React.FC<{ className?: string }>;
const CommentIcon = FiMessageCircle as React.FC<{ className?: string; onClick?: () => void }>;
const BookmarkIcon = FiBookmark as React.FC<{ className?: string; onClick?: () => void }>;
const ShareIcon = FiShare2 as React.FC<{ className?: string; onClick?: () => void }>;
const SendIcon = FiSend as React.FC<{ className?: string }>;

interface PostCardProps {
  post: any;
  onLike?: (postId: string) => void;
}

const PostCardSocial: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const navigate = useNavigate();

  const photographer = post.photographer || {};
  const photographerName = photographer.name || 'Unknown';
  const profilePic = photographer.profilePicture || '';
  const photographerId = photographer._id;
  const initials = photographerName.charAt(0).toUpperCase();

  // Check if current user has liked the post
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId && post.likes) {
      setLiked(post.likes.some((id: string) => id === userId));
    }
  }, [post.likes]);

  // Check if post is saved (works for any logged-in user)
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/photographers/me'); // works for both roles
        const saved = res.data.savedPosts || [];
        setIsSaved(saved.some((id: string) => id === post._id));
      } catch {}
    };
    checkSaved();
  }, [post._id]);

  const loadComments = async () => {
    if (comments.length > 0) return;
    setLoadingComments(true);
    try {
      const res = await api.get(`/comments/${post._id}`);
      setComments(res.data);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showCommentInput) {
      setShowCommentInput(true);
      loadComments();
    } else {
      setShowCommentInput(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.patch(`/posts/${post._id}/like`);
      setLiked(res.data.likes.includes(localStorage.getItem('userId')));
      setLikesCount(res.data.likes.length);
      if (onLike) onLike(post._id);
    } catch {
      toast.error('Login required to like');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/comments/${post._id}`, { text: commentText });
      setComments([res.data, ...comments]);
      setCommentText('');
    } catch {
      toast.error('Login required to comment');
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.patch(`/posts/${post._id}/save`);
      setIsSaved(res.data.saved);
      toast.success(res.data.saved ? 'Post saved' : 'Post unsaved');
    } catch {
      toast.error('Login required to save');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/photographer/${photographerId}`;
    navigator.clipboard.writeText(url);
    toast.success('Profile link copied!');
  };

  const handleBookNow = async () => {
  try {
    const res = await api.post('/chat/conversations', { participantId: photographerId });
    toast.success('Opening chat...');
    navigate(`/dashboard?chat=${res.data._id}`);
  } catch (err) {
    toast.error('Login required to book');
  }
};

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="post-card glass">
        {/* Header */}
        <div className="post-header">
          <Link to={`/photographer/${photographerId}`} className="post-avatar-link">
            {profilePic ? (
              <img src={profilePic} alt={photographerName} className="post-avatar-img" />
            ) : (
              <div className="post-avatar">{initials}</div>
            )}
          </Link>
          <div className="post-meta">
            <Link to={`/photographer/${photographerId}`} className="post-author-link">
              <p className="post-author">{photographerName}</p>
            </Link>
            <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Caption */}
        {post.caption && <p className="post-caption">{post.caption}</p>}

        {/* Media */}
        {post.video ? (
          <div className="post-video-container">
            <video controls className="post-video">
              <source src={post.video} type="video/mp4" />
            </video>
          </div>
        ) : post.images && post.images.length > 0 ? (
          <div className="post-images-container">
            {post.images.length === 1 ? (
              <div className="single-image-wrapper" onClick={() => openLightbox(0)}>
                <img src={post.images[0]} alt="Post" className="post-image single" />
                <div className="click-overlay">🔍 Tap to view</div>
              </div>
            ) : (
              <div className="multi-image-grid">
                {post.images.slice(0, 4).map((img: string, i: number) => (
                  <div
                    key={i}
                    className={`grid-item ${post.images.length === 2 ? 'two' : post.images.length === 3 ? 'three' : ''}`}
                    onClick={() => openLightbox(i)}
                  >
                    <img src={img} alt={`Post ${i+1}`} className="post-image" />
                    {i === 3 && post.images.length > 4 && (
                      <div className="more-overlay">+{post.images.length - 4}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Action Bar */}
        <div className="post-actions">
          <div className="post-stats">
            <span className="stat" onClick={handleLike}>
              <HeartIcon className={`stat-icon ${liked ? 'liked' : ''}`} /> {likesCount}
            </span>
            <span className="stat" onClick={handleToggleComments}>
              <CommentIcon className="stat-icon" /> {comments.length}
            </span>
            <span className="stat">
              <EyeIcon className="stat-icon" /> {post.views}
            </span>
          </div>
          <div className="post-actions-right">
            <span className="stat" onClick={handleSave}>
              <BookmarkIcon className={`stat-icon ${isSaved ? 'saved' : ''}`} />
            </span>
            <span className="stat" onClick={handleShare}>
              <ShareIcon className="stat-icon" />
            </span>
          </div>
        </div>

        {/* Book Now */}
        <button className="book-now-btn-full" onClick={handleBookNow}>
          💬 Book Now
        </button>

        {/* Comments Section */}
        {showCommentInput && (
          <div className="comments-section">
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="comment-input"
              />
              <button onClick={handleAddComment} className="send-comment-btn">
                <SendIcon />
              </button>
            </div>
            {loadingComments ? (
              <p className="loading-text">Loading comments…</p>
            ) : (
              <div className="comments-list">
                {comments.map(c => (
                  <div key={c._id} className="comment-item">
                    <img
                      src={c.user?.profilePicture || ''}
                      alt=""
                      className="comment-avatar"
                    />
                    <div>
                      <span className="comment-user">{c.user?.name || 'User'}</span>
                      <p className="comment-text">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {lightboxOpen && post.images && (
        <Lightbox images={post.images} currentIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
};

export default PostCardSocial;