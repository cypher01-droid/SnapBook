import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PricingItem {
  name: string;
  price: string;
}

const ProfileTab: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For the large name display (not editable yet, but we load it)
  const [photographerName, setPhotographerName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/photographers/me');
        const user = res.data;
        setPhotographerName(user.name || '');
        setBio(user.bio || '');
        setLocation(user.location || '');
        setContactNumber(user.contactNumber || '');
        setProfilePicture(user.profilePicture || '');
        setPricing(
          user.pricing?.map((p: any) => ({
            name: p.name,
            price: String(p.price),
          })) || []
        );
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddPricing = () => {
    if (pricing.length >= 20) {
      toast.error('Maximum 20 pricing items');
      return;
    }
    setPricing([...pricing, { name: '', price: '' }]);
  };

  const handlePricingChange = (idx: number, field: 'name' | 'price', value: string) => {
    const updated = [...pricing];
    updated[idx][field] = value;
    setPricing(updated);
  };

  const handleRemovePricing = (idx: number) => {
    setPricing(pricing.filter((_, i) => i !== idx));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileFile(e.target.files[0]);
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let profilePicUrl = profilePicture;
      if (newProfileFile) {
        const formData = new FormData();
        formData.append('images', newProfileFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        profilePicUrl = uploadRes.data.urls[0];
      }

      await api.put('/photographers/profile', {
        bio,
        location,
        contactNumber,
        pricing: pricing.map((p) => ({
          name: p.name,
          price: Number(p.price) || 0,
        })),
        profilePicture: profilePicUrl,
      });
      toast.success('Profile updated!');
      setNewProfileFile(null);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  if (loading) return <div className="tab-loading">Loading profile…</div>;

  return (
    <div className="profile-fb">
      {/* Cover Photo */}
      <div className="cover-photo">
        <div className="cover-gradient"></div>
        <div className="cover-edit-btn">
          <span>📷 Edit Cover</span>
        </div>
      </div>

      {/* Profile Picture & Name */}
      <div className="profile-header-fb">
        <div className="profile-pic-container">
          <label htmlFor="profile-pic-upload" className="profile-pic-wrapper">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-pic-img" />
            ) : (
              <div className="profile-pic-placeholder">
                {photographerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="pic-overlay">
              <span>📷</span>
            </div>
          </label>
          <input
            type="file"
            id="profile-pic-upload"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: 'none' }}
          />
        </div>
        <h1 className="profile-name">{photographerName}</h1>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="profile-form-fb">
        <div className="card-section glass">
          <h3>Bio</h3>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell clients about yourself..."
            className="input-field"
          />
        </div>

        <div className="card-section glass">
          <h3>Contact & Location</h3>
          <div className="two-col">
            <div className="input-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+237..."
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card-section glass">
          <h3>Pricing (up to 20 services)</h3>
          {pricing.map((item, idx) => (
            <div key={idx} className="pricing-row">
              <input
                type="text"
                placeholder="Service name"
                value={item.name}
                onChange={(e) => handlePricingChange(idx, 'name', e.target.value)}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Price (FCFA)"
                value={item.price}
                onChange={(e) => handlePricingChange(idx, 'price', e.target.value)}
                className="input-field"
                required
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => handleRemovePricing(idx)}
              >
                ✕
              </button>
            </div>
          ))}
          {pricing.length < 20 && (
            <button type="button" className="btn-add-service" onClick={handleAddPricing}>
              + Add Service
            </button>
          )}
        </div>

        <button type="submit" className="btn-save-profile" disabled={saving}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>

      {/* Logout */}
      <div className="logout-container">
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;