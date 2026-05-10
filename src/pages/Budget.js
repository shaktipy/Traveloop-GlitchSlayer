import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function Budget() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single();
    if (tripData) setTrip(tripData);

    const { data: stopsData } = await supabase.from('stops').select('*').eq('trip_id', tripId);
    if (stopsData) setStops(stopsData);

    const { data: actsData } = await supabase
      .from('activities')
      .select('*')
      .in('stop_id', stopsData?.map(s => s.id) || []);
    if (actsData) setActivities(actsData);
    setLoading(false);
  };

  const getTotal = () => activities.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
  const getByType = () => {
    const types = {};
    activities.forEach(a => {
      const type = a.type || 'Other';
      types[type] = (types[type] || 0) + (parseFloat(a.cost) || 0);
    });
    return types;
  };
  const getByStop = () => {
    const byStop = {};
    stops.forEach(stop => {
      const stopActs = activities.filter(a => a.stop_id === stop.id);
      byStop[stop.city] = stopActs.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
    });
    return byStop;
  };
  const getDays = () => {
    if (!trip?.start_date || !trip?.end_date) return 1;
    const diff = new Date(trip.end_date) - new Date(trip.start_date);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const typeColors = {
    'Sightseeing': '#667eea',
    'Food': '#f6ad55',
    'Adventure': '#fc8181',
    'Shopping': '#68d391',
    'Transport': '#76e4f7',
    'Stay': '#b794f4',
    'Other': '#a0aec0'
  };

  const byType = getByType();
  const byStop = getByStop();
  const total = getTotal();

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
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>✈️</div>
        <p style={{ color: '#555', fontWeight: '500', fontSize: '18px' }}>Loading budget...</p>
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
            💰 Budget Breakdown
          </h2>
          <button onClick={() => navigate(`/itinerary/${tripId}`)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: '2px solid #667eea',
              background: 'transparent',
              color: '#667eea',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
            }}
          >
            ← Back to Itinerary
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Budget', value: `₹${total.toFixed(2)}`, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
            { label: 'Per Day', value: `₹${(total / getDays()).toFixed(2)}`, gradient: 'linear-gradient(135deg, #f6ad55, #ed8936)' },
            { label: 'Total Activities', value: activities.length, gradient: 'linear-gradient(135deg, #68d391, #38a169)' }
          ].map((card, i) => (
            <div key={i} style={{
              ...glassCard,
              padding: '24px',
              textAlign: 'center',
              color: 'white',
              background: card.gradient,
              backdropFilter: 'blur(8px)',
              border: 'none',
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '6px' }}>{card.value}</div>
              <div style={{ opacity: 0.9, fontWeight: '500' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Cost by Category */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontWeight: '600', color: '#2d3748' }}>📊 Cost by Category</h3>
          {Object.keys(byType).length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No activities added yet</p>
          ) : (
            Object.entries(byType).map(([type, cost]) => (
              <div key={type} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>{type}</span>
                  <span style={{ fontWeight: '600', color: '#667eea' }}>₹{cost.toFixed(2)}</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                  <div style={{
                    background: typeColors[type] || '#667eea',
                    width: `${total > 0 ? (cost / total) * 100 : 0}%`,
                    height: '100%',
                    borderRadius: '999px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <div style={{ color: '#718096', fontSize: '13px', marginTop: '6px' }}>
                  {total > 0 ? ((cost / total) * 100).toFixed(1) : 0}% of total
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cost by City */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontWeight: '600', color: '#2d3748' }}>🌍 Cost by City</h3>
          {Object.entries(byStop).length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No stops added yet</p>
          ) : (
            Object.entries(byStop).map(([city, cost]) => (
              <div key={city} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px',
                marginBottom: '12px', border: '1px solid rgba(255,255,255,0.4)'
              }}>
                <span style={{ fontWeight: '600', color: '#2d3748' }}>📍 {city}</span>
                <span style={{
                  background: 'rgba(102, 126, 234, 0.12)',
                  color: '#667eea',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>₹{cost.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {/* All Activities */}
        <div style={{ ...glassCard, padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontWeight: '600', color: '#2d3748' }}>📋 All Activities</h3>
          {activities.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No activities added yet</p>
          ) : (
            activities.map(act => (
              <div key={act.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>{act.name}</span>
                  {act.type && (
                    <span style={{
                      marginLeft: '10px',
                      background: typeColors[act.type] || '#e2e8f0',
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>{act.type}</span>
                  )}
                </div>
                <span style={{ color: '#38a169', fontWeight: '600' }}>₹{parseFloat(act.cost || 0).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}