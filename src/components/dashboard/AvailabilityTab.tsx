import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface DaySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Override {
  _id?: string;
  date: string;
  type: 'blocked' | 'available';
  startTime?: string;
  endTime?: string;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityTab: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(() =>
    daysOfWeek.map((_, i) => ({ dayOfWeek: i, startTime: '09:00', endTime: '17:00', isActive: false }))
  );
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [newOverride, setNewOverride] = useState<Override>({ date: '', type: 'blocked', startTime: '', endTime: '' });

  useEffect(() => {
    (async () => {
      try {
        const [schRes, ovRes] = await Promise.all([api.get('/availability'), api.get('/availability/overrides')]);
        if (schRes.data.length) {
          setSchedule(prev =>
            prev.map((day, i) => {
              const found = schRes.data.find((s: any) => s.dayOfWeek === i);
              return found ? { ...day, startTime: found.startTime, endTime: found.endTime, isActive: found.isActive } : day;
            })
          );
        }
        setOverrides(ovRes.data.map((o: any) => ({
          _id: o._id,
          date: o.date?.slice(0, 10),
          type: o.type,
          startTime: o.startTime || '',
          endTime: o.endTime || '',
        })));
      } catch {
        toast.error('Failed to load availability');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDayToggle = (idx: number) => {
    setSchedule(prev => prev.map((d, i) => i === idx ? { ...d, isActive: !d.isActive } : d));
  };

  const handleTimeChange = (idx: number, field: 'startTime' | 'endTime', val: string) => {
    setSchedule(prev => prev.map((d, i) => i === idx ? { ...d, [field]: val } : d));
  };

  const saveSchedule = async () => {
    setSavingSchedule(true);
    try {
      await api.post('/availability', { schedule });
      toast.success('Weekly schedule saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSavingSchedule(false);
    }
  };

  const addOverride = async () => {
    if (!newOverride.date) { toast.error('Select a date'); return; }
    try {
      const res = await api.post('/availability/override', newOverride);
      setOverrides(prev => [...prev, { ...newOverride, _id: res.data._id }]);
      setNewOverride({ date: '', type: 'blocked', startTime: '', endTime: '' });
      toast.success('Override added');
    } catch {
      toast.error('Failed to add override');
    }
  };

  const deleteOverride = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete(`/availability/override/${id}`);
      setOverrides(prev => prev.filter(o => o._id !== id));
      toast.success('Override removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="tab-loading">Loading availability…</div>;

  return (
    <div className="tab-container">
      <h2>Manage Availability</h2>

      <div className="section">
        <h3>Weekly Schedule</h3>
        <div className="weekly-schedule">
          {schedule.map((day, idx) => (
            <div key={idx} className={`day-row ${day.isActive ? 'active' : ''}`}>
              <label className="day-label">
                <input type="checkbox" checked={day.isActive} onChange={() => handleDayToggle(idx)} />
                <span>{daysOfWeek[idx]}</span>
              </label>
              {day.isActive && (
                <div className="time-inputs">
                  <input type="time" value={day.startTime} onChange={e => handleTimeChange(idx, 'startTime', e.target.value)} />
                  <span>to</span>
                  <input type="time" value={day.endTime} onChange={e => handleTimeChange(idx, 'endTime', e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={saveSchedule} disabled={savingSchedule}>
          {savingSchedule ? 'Saving…' : 'Save Schedule'}
        </button>
      </div>

      <div className="section">
        <h3>Date Overrides</h3>
        <div className="override-form">
          <input type="date" value={newOverride.date} onChange={e => setNewOverride({...newOverride, date: e.target.value})} />
          <select value={newOverride.type} onChange={e => setNewOverride({...newOverride, type: e.target.value as any})}>
            <option value="blocked">Blocked</option>
            <option value="available">Available (custom hours)</option>
          </select>
          {newOverride.type === 'available' && (
            <>
              <input type="time" value={newOverride.startTime} onChange={e => setNewOverride({...newOverride, startTime: e.target.value})} placeholder="Start" />
              <input type="time" value={newOverride.endTime} onChange={e => setNewOverride({...newOverride, endTime: e.target.value})} placeholder="End" />
            </>
          )}
          <button className="btn-primary" onClick={addOverride}>Add Override</button>
        </div>
        <ul className="override-list">
          {overrides.map(o => (
            <li key={o._id} className="override-item">
              <span>{o.date}</span> – <span className={`badge ${o.type}`}>{o.type}</span>
              {o.type === 'available' && <span> ({o.startTime || '?'} – {o.endTime || '?'})</span>}
              <button className="btn-icon" onClick={() => deleteOverride(o._id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityTab;