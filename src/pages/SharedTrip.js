import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SharedTrip() {
  const { shareToken } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedData();
  }, []);

  const fetchSharedData = async () => {
    const { data: tripData } = await supabase
      .from('trips')
      .select('*')
      .eq('share_token', shareToken)
      .single();

    if (tripData) {
      setTrip(tripData);

      const { data: stopsData } = await supabase
        .from('stops')
        .select('*')
        .eq('trip_id', tripData.id)
        .order('order_index');
      setStops(stopsData || []);

      const actsByStop = {};
      for (const stop of stopsData || []) {
        const { data: acts } = await supabase
          .from('activities')
          .select('*')
          .eq('stop_id', stop.id);
        actsByStop[stop.id] = acts || [];
      }
      setActivities(actsByStop);
    }
    setLoading(false);
  };

  const totalBudget = Object.values(activities)
    .flat()
    .reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);

  const glassCard = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
          <p style={{ color: '#555', fontWeight: '500', fontSize: '18px' }}>Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
          <p style={{ color: '#555', fontWeight: '500', fontSize: '18px' }}>Trip not found or link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '32px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header Card */}
        <div style={{
          ...glassCard,
          padding: '32px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85), rgba(118, 75, 162, 0.85))',
          backdropFilter: 'blur(16px)',
          border: 'none',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontWeight: '700' }}>✈️ {trip.name}</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.9 }}>{trip.description}</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
            <p style={{ margin: 0 }}>📅 {trip.start_date} → {trip.end_date}</p>
            <p style={{ margin: 0 }}>💰 Total Budget: ₹{totalBudget.toFixed(2)}</p>
          </div>
        </div>

        {/* Stops & Activities */}
        {stops.map((stop) => (
          <div key={stop.id} style={{
            ...glassCard,
            padding: '20px',
            marginBottom: '20px',
            borderLeft: '4px solid #667eea'
          }}>
            <h3 style={{ margin: '0 0 8px', fontWeight: '600', color: '#2d3748' }}>
              📍 {stop.city} {stop.country && `(${stop.country})`}
            </h3>
            <p style={{ margin: '0 0 16px', color: '#718096', fontSize: '14px' }}>
              {stop.start_date || 'TBD'} → {stop.end_date || 'TBD'}
            </p>

            {(activities[stop.id] || []).map(act => (
              <div key={act.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '10px', marginBottom: '8px', border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>{act.name}</span>
                  {act.type && <span style={{ marginLeft: 8, fontSize: 13, color: '#718096' }}>• {act.type}</span>}
                  {act.duration && <span style={{ marginLeft: 8, fontSize: 13, color: '#718096' }}>• {act.duration}</span>}
                </div>
                {act.cost > 0 && <span style={{ color: '#38a169', fontWeight: '600' }}>₹{act.cost}</span>}
              </div>
            ))}
          </div>
        ))}

        <p style={{ textAlign: 'center', color: '#718096', marginTop: '28px', fontWeight: '500' }}>
          Created with Traveloop ✈️
        </p>
      </div>
    </div>
  );
}