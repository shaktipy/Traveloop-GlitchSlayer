import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalActivities: 0,
    totalNotes: 0
  });
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: userCount } = await supabase
      .from('users').select('*', { count: 'exact' });

    const { count: tripCount } = await supabase
      .from('trips').select('*', { count: 'exact' });

    const { count: actCount } = await supabase
      .from('activities').select('*', { count: 'exact' });

    const { count: noteCount } = await supabase
      .from('notes').select('*', { count: 'exact' });

    setStats({
      totalUsers: userCount || 0,
      totalTrips: tripCount || 0,
      totalActivities: actCount || 0,
      totalNotes: noteCount || 0
    });

    const { data: tripsData } = await supabase
      .from('trips')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false })
      .limit(10);
    if (tripsData) setTrips(tripsData);

    const { data: usersData } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (usersData) setUsers(usersData);

    setLoading(false);
  };

  const deleteTrip = async (tripId) => {
    if (window.confirm('Delete this trip?')) {
      await supabase.from('trips').delete().eq('id', tripId);
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  // Glass card style
  const glassCard = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
        <p style={{ color: '#555', fontWeight: '500', fontSize: '18px' }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>

        <h2 style={{
          fontSize: '28px', fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '32px'
        }}>
          ⚙️ Admin Dashboard
        </h2>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers, emoji: '👥', color: '#667eea', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
            { label: 'Total Trips', value: stats.totalTrips, emoji: '✈️', color: '#f6ad55', gradient: 'linear-gradient(135deg, #f6ad55, #ed8936)' },
            { label: 'Total Activities', value: stats.totalActivities, emoji: '🎯', color: '#68d391', gradient: 'linear-gradient(135deg, #68d391, #38a169)' },
            { label: 'Total Notes', value: stats.totalNotes, emoji: '📝', color: '#fc8181', gradient: 'linear-gradient(135deg, #fc8181, #e53e3e)' },
          ].map(stat => (
            <div key={stat.label} style={{
              ...glassCard,
              padding: '24px',
              textAlign: 'center',
              borderTop: `4px solid ${stat.color}`,
              background: stat.gradient,
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: 'white'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.emoji}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontWeight: '600', color: '#2d3748' }}>👥 Users ({users.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(102, 126, 234, 0.08)' }}>
                  {['Name', 'Email', 'Joined'].map(h => (
                    <th key={h} style={{
                      padding: '14px 16px', textAlign: 'left',
                      color: '#4a5568', fontWeight: '600', borderBottom: '2px solid rgba(0,0,0,0.05)',
                      fontSize: '14px'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '14px 16px', color: '#2d3748', fontWeight: '600' }}>
                      {user.name || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#718096' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px', color: '#a0aec0', fontSize: '14px' }}>
                      {new Date(user.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trips Table */}
        <div style={{ ...glassCard, padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontWeight: '600', color: '#2d3748' }}>✈️ Recent Trips ({trips.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(102, 126, 234, 0.08)' }}>
                  {['Trip Name', 'User', 'Dates', 'Action'].map(h => (
                    <th key={h} style={{
                      padding: '14px 16px', textAlign: 'left',
                      color: '#4a5568', fontWeight: '600', borderBottom: '2px solid rgba(0,0,0,0.05)',
                      fontSize: '14px'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map(trip => (
                  <tr key={trip.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '14px 16px', color: '#2d3748', fontWeight: '600' }}>{trip.name}</td>
                    <td style={{ padding: '14px 16px', color: '#718096' }}>{trip.users?.email || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', color: '#a0aec0', fontSize: '14px' }}>
                      {trip.start_date} → {trip.end_date}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => deleteTrip(trip.id)}
                        style={{
                          background: 'rgba(252, 129, 129, 0.1)',
                          border: '1px solid #fc8181',
                          color: '#fc8181',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontFamily: "'Inter', sans-serif",
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = '#fc8181';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'rgba(252, 129, 129, 0.1)';
                          e.target.style.color = '#fc8181';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>No trips yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}