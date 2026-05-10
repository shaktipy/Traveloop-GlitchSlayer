import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data: userData } = await supabase.auth.getUser();

    // ✅ Auth check – अगर user नहीं है तो login पर भेजो
    if (!userData?.user) {
      navigate('/');
      return;
    }

    const { data } = await supabase
      .from('trips')
      .select('*, stops(count)')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (data) setTrips(data);
    setLoading(false);
  };

  const deleteTrip = async (tripId) => {
    await supabase.from('trips').delete().eq('id', tripId);
    setTrips(trips.filter(t => t.id !== tripId));
  };

  const getDays = (start, end) => {
    if (!start || !end) return '?';
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Glass card style
  const glassCard = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            🧳 My Trips
          </h2>
          <button
            onClick={() => navigate('/create-trip')}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontFamily: "'Inter', sans-serif",
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            + New Trip
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
            <p style={{ color: '#555', fontWeight: '500', fontSize: '18px' }}>Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            ...glassCard,
            padding: '60px',
            textAlign: 'center',
            color: '#888'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
            <h3 style={{ color: '#2d3748', fontWeight: '600', marginBottom: '8px' }}>Koi trip nahi hai abhi!</h3>
            <button
              onClick={() => navigate('/create-trip')}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                marginTop: '16px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                fontFamily: "'Inter', sans-serif",
              }}>
              Pehli Trip Banao 🚀
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {trips.map(trip => (
              <div key={trip.id} style={{
                ...glassCard,
                padding: '24px',
                borderTop: '4px solid #667eea',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(31, 38, 135, 0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.08)';
                }}
              >
                <h3 style={{ margin: '0 0 8px', color: '#2d3748', fontWeight: '600' }}>{trip.name}</h3>
                <p style={{ margin: '0 0 12px', color: '#4a5568', fontSize: '14px' }}>
                  {trip.description || 'No description'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(102, 126, 234, 0.15)',
                    color: '#667eea',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    📅 {getDays(trip.start_date, trip.end_date)} days
                  </span>
                  <span style={{
                    background: 'rgba(56, 161, 105, 0.15)',
                    color: '#38a169',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    📍 {trip.stops?.[0]?.count || 0} stops
                  </span>
                </div>
                <p style={{ margin: '0 0 16px', color: '#718096', fontSize: '13px', fontWeight: '500' }}>
                  {trip.start_date} → {trip.end_date}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(252, 129, 129, 0.1)',
                      color: '#fc8181',
                      border: '1px solid #fc8181',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}