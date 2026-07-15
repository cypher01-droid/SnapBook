import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface Photographer {
  _id: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  pricing?: { name: string; price: number }[];
}

const ClientDiscoverTab: React.FC = () => {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const res = await api.get('/photographers');
        setPhotographers(res.data);
      } catch {
        toast.error('Failed to load photographers');
      } finally {
        setLoading(false);
      }
    };
    fetchPhotographers();
  }, []);

  if (loading) return <div className="tab-loading">Discovering photographers…</div>;

  return (
    <div className="client-dashboard">
      <h2 style={{ marginBottom: '1rem', padding: '1rem' }}>Discover Photographers</h2>
      {photographers.length === 0 ? (
        <p className="empty-state">No photographers available yet.</p>
      ) : (
        <div className="photographer-grid">
          {photographers.map((p) => (
            <Link to={`/photographer/${p._id}`} key={p._id} className="photographer-card-client glass">
              <div className="card-img">
                {p.profilePicture ? (
                  <img src={p.profilePicture} alt={p.name} />
                ) : (
                  <div className="card-img-placeholder">{p.name.charAt(0)}</div>
                )}
              </div>
              <div className="card-info">
                <h3>{p.name}</h3>
                {p.location && <p className="loc">📍 {p.location}</p>}
                {p.bio && <p className="bio-preview">{p.bio.slice(0, 60)}…</p>}
                {p.pricing && p.pricing.length > 0 && (
                  <p className="price-from">
                    From {Math.min(...p.pricing.map(x => x.price)).toLocaleString()} FCFA
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDiscoverTab;