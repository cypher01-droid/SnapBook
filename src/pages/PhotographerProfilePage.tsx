import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PostCardSocial from '../components/dashboard/PostCardSocial'; // ✅ changed
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const BackIcon = FiArrowLeft as React.FC<{ className?: string }>;

interface ProfileData {
  photographer: any;
  posts: any[];
}

const PhotographerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/photographers/${id}/public`);
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="tab-loading">Loading profile…</div>;
  if (!data) return <div className="tab-loading">Profile not found.</div>;

  const { photographer, posts } = data;

  return (
    <div className="profile-public">
      {/* Header */}
      <header className="profile-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <BackIcon className="back-icon" />
        </button>
        <h2 className="profile-header-title">{photographer.name}</h2>
        <div />
      </header>

      <div className="profile-public-content">
        {/* Profile Info Card */}
        <div className="profile-header-card glass">
          {photographer.profilePicture ? (
            <img src={photographer.profilePicture} alt={photographer.name} className="profile-pic-large" />
          ) : (
            <div className="profile-pic-placeholder">{photographer.name?.charAt(0)}</div>
          )}
          <h1>{photographer.name}</h1>
          {photographer.bio && <p className="bio">{photographer.bio}</p>}
          <div className="details-grid">
            {photographer.location && <span>📍 {photographer.location}</span>}
            {photographer.contactNumber && <span>📞 {photographer.contactNumber}</span>}
            {photographer.email && <span>✉️ {photographer.email}</span>}
          </div>

          {photographer.pricing && photographer.pricing.length > 0 && (
            <div className="pricing-section">
              <h3>Pricing</h3>
              <ul className="pricing-list">
                {photographer.pricing.map((item: any, idx: number) => (
                  <li key={idx}>
                    <span>{item.name}</span>
                    <span className="price">{item.price.toLocaleString()} FCFA</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Removed the duplicate Book Now button – bookings are per post now */}
        </div>

        {/* Posts with full social interactions */}
        <div className="profile-posts">
          <h2>Recent Work</h2>
          {posts.length === 0 ? (
            <p className="empty-state">No posts yet.</p>
          ) : (
            <div className="post-list">
              {posts.map((post: any) => (
                <PostCardSocial key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotographerProfilePage;