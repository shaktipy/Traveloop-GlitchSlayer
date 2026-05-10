import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

// 📅 Calendar View Component (updated glass style)
function CalendarView({ trip, stops, activities }) {
  if (!trip || !trip.start_date || !trip.end_date) return <p style={{ color: '#888' }}>No dates set for this trip.</p>;

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const getActivitiesForDay = (date) => {
    const dayStr = date.toISOString().split('T')[0];
    const dayStops = stops.filter(stop => stop.start_date && stop.end_date && dayStr >= stop.start_date && dayStr <= stop.end_date);
    return dayStops.map(stop => {
      const acts = activities[stop.id] || [];
      return { stop, acts };
    });
  };

  return (
    <div>
      {days.map((day, i) => {
        const dayData = getActivitiesForDay(day);
        const hasContent = dayData.some(d => d.acts.length > 0);
        return (
          <div key={i} style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 16px rgba(31, 38, 135, 0.06)',
            borderLeft: `4px solid ${hasContent ? '#667eea' : '#e2e8f0'}`
          }}>
            <h4 style={{ margin: '0 0 8px', color: '#2d3748', fontWeight: '600' }}>
              📅 {day.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </h4>
            {!hasContent && <p style={{ color: '#aaa', margin: 0 }}>No activities planned</p>}
            {dayData.map(({ stop, acts }) => (
              <div key={stop.id} style={{ marginBottom: '8px' }}>
                <p style={{ fontWeight: '600', color: '#667eea', margin: '0 0 4px' }}>
                  📍 {stop.city} {stop.country ? `(${stop.country})` : ''}
                </p>
                {acts.map(act => (
                  <div key={act.id} style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{act.name} {act.duration ? `(${act.duration})` : ''}</span>
                    {act.cost > 0 && <span style={{ color: '#38a169', fontWeight: '600' }}>₹{act.cost}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ✈️ Main Itinerary Builder Component
export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [stopStart, setStopStart] = useState('');
  const [stopEnd, setStopEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStop, setActiveStop] = useState(null);
  const [activities, setActivities] = useState({});
  const [actName, setActName] = useState('');
  const [actType, setActType] = useState('');
  const [actCost, setActCost] = useState('');
  const [actDuration, setActDuration] = useState('');
  const [shareMsg, setShareMsg] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchTrip();
    fetchStops();
  }, []);

  const fetchTrip = async () => {
    const { data } = await supabase.from('trips').select('*').eq('id', tripId).single();
    if (data) setTrip(data);
  };

  const fetchStops = async () => {
    const { data } = await supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index');
    if (data) {
      setStops(data);
      data.forEach(stop => fetchActivities(stop.id));
    }
  };

  const fetchActivities = async (stopId) => {
    const { data } = await supabase.from('activities').select('*').eq('stop_id', stopId);
    if (data) setActivities(prev => ({ ...prev, [stopId]: data }));
  };

  const addStop = async () => {
    if (!city) return;
    setLoading(true);
    const { data } = await supabase.from('stops').insert([{
      trip_id: tripId,
      city,
      country,
      start_date: stopStart,
      end_date: stopEnd,
      order_index: stops.length
    }]).select();
    if (data) {
      setStops([...stops, data[0]]);
      setActivities(prev => ({ ...prev, [data[0].id]: [] }));
    }
    setCity(''); setCountry(''); setStopStart(''); setStopEnd('');
    setLoading(false);
  };

  const deleteStop = async (stopId) => {
    await supabase.from('stops').delete().eq('id', stopId);
    setStops(stops.filter(s => s.id !== stopId));
    const newActs = { ...activities };
    delete newActs[stopId];
    setActivities(newActs);
  };

  const addActivity = async (stopId) => {
    if (!actName) return;
    const { data } = await supabase.from('activities').insert([{
      stop_id: stopId,
      name: actName,
      type: actType,
      cost: parseFloat(actCost) || 0,
      duration: actDuration
    }]).select();
    if (data) {
      setActivities(prev => ({
        ...prev,
        [stopId]: [...(prev[stopId] || []), data[0]]
      }));
    }
    setActName(''); setActType(''); setActCost(''); setActDuration('');
    setActiveStop(null);
  };

  const deleteActivity = async (stopId, actId) => {
    await supabase.from('activities').delete().eq('id', actId);
    setActivities(prev => ({
      ...prev,
      [stopId]: prev[stopId].filter(a => a.id !== actId)
    }));
  };

  const getTotalBudget = () => {
    let total = 0;
    Object.values(activities).forEach(acts => {
      acts.forEach(a => { total += parseFloat(a.cost) || 0; });
    });
    return total.toFixed(2);
  };

  const shareTrip = async () => {
    let token = trip?.share_token;
    if (!token) {
      token = crypto.randomUUID();
      const { error } = await supabase.from('trips').update({ share_token: token }).eq('id', tripId);
      if (error) {
        setShareMsg('❌ Could not share, try again!');
        setTimeout(() => setShareMsg(''), 3000);
        return;
      }
      setTrip(prev => ({ ...prev, share_token: token }));
    }
    const shareUrl = `${window.location.origin}/share/${token}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMsg('🔗 Link copied! Share now!');
    } catch {
      setShareMsg('📋 ' + shareUrl);
    }
    setTimeout(() => setShareMsg(''), 4000);
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
      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            🗺️ {trip?.name || 'Itinerary Builder'}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => navigate(`/budget/${tripId}`)}
              style={actionBtnStyle('#38a169')}>
              💰 Budget
            </button>
            <button onClick={() => navigate(`/notes/${tripId}`)}
              style={actionBtnStyle('#764ba2')}>
              📝 Notes
            </button>
            <button onClick={() => navigate(`/packing-checklist/${tripId}`)}
              style={actionBtnStyle('#f6ad55')}>
              🎒 Checklist
            </button>
            <button onClick={shareTrip}
              style={actionBtnStyle('#1da1f2')}>
              🔗 Share
            </button>
            <button onClick={() => navigate('/my-trips')}
              style={actionBtnStyle('#667eea')}>
              My Trips →
            </button>
          </div>
        </div>

        {/* Share message */}
        {shareMsg && (
          <div style={{
            background: shareMsg.includes('❌') ? 'rgba(255, 245, 245, 0.8)' : 'rgba(240, 255, 244, 0.8)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${shareMsg.includes('❌') ? '#fc8181' : '#68d391'}`,
            color: shareMsg.includes('❌') ? '#c53030' : '#38a169',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {shareMsg}
          </div>
        )}

        {/* Trip Info */}
        {trip && (
          <div style={{
            ...glassCard,
            padding: '20px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            border: 'none',
          }}>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: '600' }}>📅 {trip.start_date} → {trip.end_date}</p>
              <p style={{ margin: 0, opacity: 0.9 }}>{trip.description}</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)'
            }}>
              <div style={{ fontSize: '22px', fontWeight: '700' }}>💰 ₹{getTotalBudget()}</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Total Budget</div>
            </div>
          </div>
        )}

        {/* Add Stop (only in list mode) */}
        {viewMode === 'list' && (
          <div style={{
            ...glassCard,
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: '600', color: '#2d3748' }}>➕ Add New Stop</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" placeholder="City *" value={city} onChange={e => setCity(e.target.value)}
                style={inputStyle} />
              <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)}
                style={inputStyle} />
              <input type="date" value={stopStart} onChange={e => setStopStart(e.target.value)}
                style={inputStyle} />
              <input type="date" value={stopEnd} onChange={e => setStopEnd(e.target.value)}
                style={inputStyle} />
            </div>
            <button onClick={addStop} disabled={loading || !city}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                fontFamily: "'Inter', sans-serif",
              }}>
              {loading ? 'Adding...' : '+ Add Stop'}
            </button>
          </div>
        )}

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => setViewMode('list')}
            style={toggleBtnStyle(viewMode === 'list')}>
            📋 List
          </button>
          <button onClick={() => setViewMode('calendar')}
            style={toggleBtnStyle(viewMode === 'calendar')}>
            📅 Calendar
          </button>
        </div>

        {/* Stops / Calendar View */}
        {viewMode === 'list' ? (
          <>
            <h3 style={{ color: '#2d3748', fontWeight: '600', marginBottom: '16px' }}>📍 Stops ({stops.length})</h3>
            {stops.length === 0 ? (
              <div style={{ ...glassCard, padding: '32px', textAlign: 'center', color: '#888' }}>
                There's no stop added. Add one on top! 🌍
              </div>
            ) : (
              stops.map((stop, index) => (
                <div key={stop.id} style={{
                  ...glassCard,
                  padding: '20px',
                  marginBottom: '16px',
                  borderLeft: '4px solid #667eea'
                }}>
                  {/* Stop Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', color: '#2d3748', fontWeight: '600' }}>
                        {index + 1}. {stop.city} {stop.country && `(${stop.country})`}
                      </h4>
                      <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
                        📅 {stop.start_date || 'TBD'} → {stop.end_date || 'TBD'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setActiveStop(activeStop === stop.id ? null : stop.id)}
                        style={{
                          background: 'rgba(102, 126, 234, 0.15)',
                          color: '#667eea',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}>
                        + Activity
                      </button>
                      <button onClick={() => deleteStop(stop.id)}
                        style={{
                          background: 'rgba(252, 129, 129, 0.1)',
                          border: '1px solid #fc8181',
                          color: '#fc8181',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}>
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Activities List */}
                  {(activities[stop.id] || []).map(act => (
                    <div key={act.id} style={{
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>{act.name}</span>
                        {act.type && <span style={{ color: '#718096', fontSize: '13px', marginLeft: '8px' }}>• {act.type}</span>}
                        {act.duration && <span style={{ color: '#718096', fontSize: '13px', marginLeft: '8px' }}>• {act.duration}</span>}
                        {act.cost > 0 && <span style={{ color: '#38a169', fontSize: '13px', marginLeft: '8px' }}>• ₹{act.cost}</span>}
                      </div>
                      <button onClick={() => deleteActivity(stop.id, act.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fc8181', fontSize: '16px' }}>
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add Activity Form */}
                  {activeStop === stop.id && (
                    <div style={{
                      background: 'rgba(240, 244, 255, 0.8)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginTop: '12px'
                    }}>
                      <h4 style={{ margin: '0 0 12px', color: '#667eea', fontWeight: '600' }}>Add Activity</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        <input type="text" placeholder="Activity Name *" value={actName} onChange={e => setActName(e.target.value)}
                          style={smallInputStyle} />
                        <select value={actType} onChange={e => setActType(e.target.value)}
                          style={smallInputStyle}>
                          <option value="">Type select karo</option>
                          <option value="Sightseeing">Sightseeing</option>
                          <option value="Food">Food</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Transport">Transport</option>
                          <option value="Stay">Stay</option>
                          <option value="Other">Other</option>
                        </select>
                        <input type="number" placeholder="Cost (₹)" value={actCost} onChange={e => setActCost(e.target.value)}
                          style={smallInputStyle} />
                        <input type="text" placeholder="Duration (e.g. 2 hours)" value={actDuration} onChange={e => setActDuration(e.target.value)}
                          style={smallInputStyle} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => addActivity(stop.id)} disabled={!actName}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}>
                          + Add
                        </button>
                        <button onClick={() => setActiveStop(null)}
                          style={{
                            padding: '10px 16px',
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        ) : (
          <CalendarView trip={trip} stops={stops} activities={activities} />
        )}
      </div>
    </div>
  );
}

// Helper styles
function actionBtnStyle(color) {
  return {
    background: `${color}20`,
    border: `2px solid ${color}`,
    color: color,
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: "'Inter', sans-serif",
  };
}

function toggleBtnStyle(active) {
  return {
    padding: '8px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    border: `2px solid ${active ? '#667eea' : '#cbd5e0'}`,
    background: active ? '#667eea' : 'transparent',
    color: active ? 'white' : '#4a5568',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: "'Inter', sans-serif",
  };
}

const inputStyle = {
  padding: '14px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '16px',
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(4px)',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
  transition: 'border 0.2s',
};

const smallInputStyle = {
  padding: '10px',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(4px)',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};