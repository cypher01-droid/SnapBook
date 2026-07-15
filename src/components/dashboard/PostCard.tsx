import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye } from 'react-icons/fi';
import Lightbox from './Lightbox';

const HeartIcon = FiHeart as React.FC<{ className?: string; onClick?: () => void }>;
const EyeIcon = FiEye as React.FC<{ className?: string }>;

interface PostCardProps {
  post: any;
  onLike?: (postId: string) => void;   // optional now
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photographer = post.photographer || {};
  const photographerName = photographer.name || 'Unknown';
  const profilePic = photographer.profilePicture || '';
  const photographerId = photographer._id;
  const initials = photographerName.charAt(0).toUpperCase();

  const likedByMe = post.likes.includes(localStorage.getItem('userId') || '');

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="post-card glass">
        {/* Header with clickable avatar & name */}
        <div className="post-header">
          <Link
            to={photographerId ? `/photographer/${photographerId}` : '#'}
            className="post-avatar-link"
          >
            {profilePic ? (
              <img src={profilePic} alt={photographerName} className="post-avatar-img" />
            ) : (
              <div className="post-avatar">{initials}</div>
            )}
          </Link>
          <div className="post-meta">
            <Link
              to={photographerId ? `/photographer/${photographerId}` : '#'}
              className="post-author-link"
            >
              <p className="post-author">{photographerName}</p>
            </Link>
            <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Caption */}
        {post.caption && <p className="post-caption">{post.caption}</p>}

        {/* Media: video first, then images */}
        {post.video ? (
          <div className="post-video-container">
            <video controls className="post-video">
              <source src={post.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : post.images && post.images.length > 0 ? (
          <div className="post-images-container">
            {post.images.length === 1 ? (
              <div className="single-image-wrapper" onClick={() => openLightbox(0)}>
                <img
                  src={post.images[0]}
                  alt="Post"
                  className="post-image single"
                />
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
                    <img src={img} alt={`Post ${i + 1}`} className="post-image" />
                    {i === 3 && post.images.length > 4 && (
                      <div className="more-overlay">+{post.images.length - 4}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Actions */}
        <div className="post-actions">
          <div className="post-stats">
            <span className="stat" onClick={() => onLike && onLike(post._id)}>
              <HeartIcon className={`stat-icon ${likedByMe ? 'liked' : ''}`} /> {post.likes.length}
            </span>
            <span className="stat">
              <EyeIcon className="stat-icon" /> {post.views}
            </span>
          </div>
          <button className="book-now-btn">Book Now</button>
        </div>
      </div>

      {lightboxOpen && post.images && post.images.length > 0 && (
        <Lightbox
          images={post.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default PostCard;