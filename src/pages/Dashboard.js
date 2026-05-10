import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate('/');
      else setUser(data.user);
    };
    getUser();
    fetchRecentTrips();
  }, []);

  const fetchRecentTrips = async () => {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setTrips(data);
  };

  const destinations = [
    { city: 'Paris', emoji: '🗼', desc: 'City of Love', gradient: 'linear-gradient(135deg, #fce4ec, #f8bbd0)' },
    { city: 'Tokyo', emoji: '🗾', desc: 'Land of Rising Sun', gradient: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' },
    { city: 'Bali', emoji: '🌴', desc: 'Island Paradise', gradient: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)' },
    { city: 'New York', emoji: '🗽', desc: 'The Big Apple', gradient: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' },
  ];

  // glass card style
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)', // soft light gradient
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Welcome Section */}
        <div style={{
          ...glassCard,
          padding: '40px',
          marginBottom: '32px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 10px 40px rgba(31, 38, 135, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                👋 Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p style={{ margin: '12px 0 24px', color: '#555', fontSize: '18px', fontWeight: '500' }}>
                Ready to plan your next adventure? ✈️
              </p>
              <button
                onClick={() => navigate('/create-trip')}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.1s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                + Plan New Trip
              </button>
            </div>
            <div style={{ fontSize: '80px', opacity: 0.7, filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}>
              🌍
            </div>
          </div>
        </div>

        {/* Recent Trips */}
        <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: '600' }}>🧳 Recent Trips</h2>
        {trips.length === 0 ? (
          <div style={{
            ...glassCard,
            padding: '48px',
            textAlign: 'center',
            color: '#777',
            marginBottom: '32px',
            fontWeight: '500',
          }}>
            No trips yet! Create your first trip 🚀
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {trips.map(trip => (
              <div
                key={trip.id}
                onClick={() => navigate(`/itinerary/${trip.id}`)}
                style={{
                  ...glassCard,
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  borderLeft: '4px solid rgba(102, 126, 234, 0.6)',
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
                <h3 style={{ margin: '0 0 8px', color: '#333', fontWeight: '600' }}>{trip.name}</h3>
                <p style={{ margin: '0 0 12px', color: '#777', fontSize: '14px' }}>{trip.description || 'No description'}</p>
                <p style={{ margin: 0, color: '#667eea', fontSize: '13px', fontWeight: '500' }}>
                  📅 {trip.start_date} → {trip.end_date}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Popular Destinations */}
        <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: '600' }}>🌍 Popular Destinations</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {destinations.map(dest => (
            <div
              key={dest.city}
              style={{
                ...glassCard,
                padding: '28px 20px',
                textAlign: 'center',
                background: dest.gradient,
                border: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                {dest.emoji}
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#2d3748', fontWeight: '600' }}>{dest.city}</h3>
              <p style={{ margin: 0, color: '#4a5568', fontSize: '14px' }}>{dest.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}