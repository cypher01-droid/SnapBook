import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  client: { name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  location?: string;
  notes?: string;
}

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  cancelled: '#ef4444',
  completed: '#3b82f6',
};

const BookingsTab: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/photographers/bookings');
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      fetchBookings();
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="tab-loading">Loading bookings…</div>;

  return (
    <div className="tab-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="empty-state">No bookings yet.</p>
      ) : (
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td>{b.client?.name || 'Unknown'}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.startTime} – {b.endTime}</td>
                  <td>{b.sessionType}</td>
                  <td>
                    <span className="status-badge" style={{ background: statusColors[b.status] }}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {b.status === 'pending' && (
                        <>
                          <button className="btn-sm btn-success" onClick={() => handleStatusChange(b._id, 'confirmed')}>Confirm</button>
                          <button className="btn-sm btn-danger" onClick={() => handleStatusChange(b._id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="btn-sm btn-info" onClick={() => handleStatusChange(b._id, 'completed')}>Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;