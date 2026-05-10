import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function CreateTrip() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError('');
    if (!name) { setError('Trip ka naam bharo!'); return; }
    if (!startDate || !endDate) { setError('Dates bharo!'); return; }
    if (startDate > endDate) { setError('End date galat hai!'); return; }

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('trips')
      .insert([{
        user_id: userData.user.id,
        name: name,
        description: description,
        start_date: startDate,
        end_date: endDate
      }])
      .select();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate(`/itinerary/${data[0].id}`);
    setLoading(false);
  };

  // Glass card style (consistent with other pages)
  const glassCard = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
    padding: '32px',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(4px)',
    outline: 'none',
    transition: 'border 0.2s',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Title */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          🗺️ Create New Trip
        </h2>

        {/* Form Container */}
        <div style={glassCard}>
          {error && (
            <div style={{
              background: 'rgba(255, 245, 245, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #fc8181',
              color: '#c53030',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontWeight: '500',
            }}>
              {error}
            </div>
          )}

          <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '6px', display: 'block' }}>
            Trip Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Europe Summer Trip"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ ...inputStyle, marginBottom: '20px' }}
            onFocus={e => e.target.style.border = '2px solid #667eea'}
            onBlur={e => e.target.style.border = '2px solid #e2e8f0'}
          />

          <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '6px', display: 'block' }}>
            Description
          </label>
          <textarea
            placeholder="Trip ke baare mein kuch likho..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{
              ...inputStyle,
              marginBottom: '20px',
              resize: 'vertical',
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => e.target.style.border = '2px solid #667eea'}
            onBlur={e => e.target.style.border = '2px solid #e2e8f0'}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '6px', display: 'block' }}>
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.border = '2px solid #667eea'}
                onBlur={e => e.target.style.border = '2px solid #e2e8f0'}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '6px', display: 'block' }}>
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.border = '2px solid #667eea'}
                onBlur={e => e.target.style.border = '2px solid #e2e8f0'}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? '#a0aec0'
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              transition: 'transform 0.1s ease, box-shadow 0.2s',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            {loading ? 'Creating...' : '🚀 Create Trip'}
          </button>
        </div>
      </div>
    </div>
  );
}