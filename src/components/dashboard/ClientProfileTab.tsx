import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ClientProfileTab: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For client, we can update name/email via a generic user update endpoint
      // We'll use the existing /api/auth/me endpoint or create a simple update
      await api.put('/api/auth/update', { name, email }); // we need to add this endpoint
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-fb">
      <div className="cover-photo">
        <div className="cover-gradient"></div>
      </div>
      <div className="profile-header-fb">
        <div className="profile-pic-placeholder" style={{ width: 100, height: 100 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-name">{user?.name}</h1>
      </div>
      <form onSubmit={handleSave} className="profile-form-fb">
        <div className="card-section glass">
          <h3>Profile Info</h3>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <button type="submit" className="btn-save-profile" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
      <div className="logout-container">
        <button className="btn-logout" onClick={() => { logout(); window.location.href = '/'; }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ClientProfileTab;