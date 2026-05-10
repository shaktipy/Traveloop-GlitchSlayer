import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ACTIVITIES = [
  { name: 'Eiffel Tower Visit', type: 'Sightseeing', cost: 'Medium', emoji: '🗼', desc: 'Iconic Paris landmark' },
  { name: 'Sushi Making Class', type: 'Food', cost: 'Low', emoji: '🍣', desc: 'Learn from a master chef' },
  { name: 'Skydiving', type: 'Adventure', cost: 'High', emoji: '🪂', desc: 'Feel the adrenaline rush' },
  { name: 'Local Market Shopping', type: 'Shopping', cost: 'Low', emoji: '🛍️', desc: 'Street bargains & souvenirs' },
  { name: 'Museum Tour', type: 'Sightseeing', cost: 'Low', emoji: '🏛️', desc: 'History & art combined' },
  { name: 'Street Food Walk', type: 'Food', cost: 'Low', emoji: '🌮', desc: 'Taste the local flavors' },
  { name: 'Scuba Diving', type: 'Adventure', cost: 'High', emoji: '🤿', desc: 'Explore underwater world' },
  { name: 'Sunset Cruise', type: 'Sightseeing', cost: 'Medium', emoji: '⛵', desc: 'Romantic evening on water' },
  { name: 'Cooking Workshop', type: 'Food', cost: 'Medium', emoji: '👨‍🍳', desc: 'Cook local dishes yourself' },
  { name: 'Heritage Walk', type: 'Sightseeing', cost: 'Low', emoji: '🚶‍♂️', desc: 'Walk through history' },
  { name: 'Jungle Safari', type: 'Adventure', cost: 'Medium', emoji: '🦁', desc: 'Wildlife in natural habitat' },
  { name: 'Art Gallery', type: 'Sightseeing', cost: 'Low', emoji: '🎨', desc: 'Modern & classic art' },
];

export default function ActivitySearch() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');

  const types = ['All', 'Sightseeing', 'Food', 'Adventure', 'Shopping'];
  const costs = ['All', 'Low', 'Medium', 'High'];
  const costColors = { Low: '#38a169', Medium: '#f6ad55', High: '#fc8181' };

  const filtered = ACTIVITIES.filter(a => {
    const matchQuery = a.name.toLowerCase().includes(query.toLowerCase()) ||
                       a.desc.toLowerCase().includes(query.toLowerCase());
    const matchType = typeFilter === 'All' ? true : a.type === typeFilter;
    const matchCost = costFilter === 'All' ? true : a.cost === costFilter;
    return matchQuery && matchType && matchCost;
  });

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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Title */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px'
        }}>
          🎯 Activity Search
        </h2>

        {/* Search + Filters card */}
        <div style={{
          ...glassCard,
          padding: '24px',
          marginBottom: '32px'
        }}>
          <input
            type="text"
            placeholder="Search activities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '16px',
              boxSizing: 'border-box',
              marginBottom: '20px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(4px)',
              outline: 'none',
              transition: 'border 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => e.target.style.border = '2px solid #667eea'}
            onBlur={e => e.target.style.border = '2px solid #e2e8f0'}
          />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: `2px solid ${typeFilter === t ? '#667eea' : '#cbd5e0'}`,
                  fontWeight: '600',
                  background: typeFilter === t ? '#667eea' : 'transparent',
                  color: typeFilter === t ? 'white' : '#4a5568',
                  transition: 'all 0.2s',
                  fontFamily: "'Inter', sans-serif",
                }}>
                {t === 'All' ? 'All Types' : t}
              </button>
            ))}
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
            {costs.map(c => {
              const color = costColors[c] || '#667eea';
              const active = costFilter === c;
              return (
                <button key={c} onClick={() => setCostFilter(c)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    border: `2px solid ${active ? color : '#cbd5e0'}`,
                    fontWeight: '600',
                    background: active ? color : 'transparent',
                    color: active ? 'white' : color,
                    transition: 'all 0.2s',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  {c === 'All' ? 'All Cost' : `${c} Cost`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p style={{ color: '#555', fontWeight: '500', marginBottom: '20px' }}>
          {filtered.length} {filtered.length === 1 ? 'activity' : 'activities'} found
        </p>

        {/* Activity Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map(act => (
            <div key={act.name} style={{
              ...glassCard,
              padding: '24px',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
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
              {/* Emoji - clean & sharp */}
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {act.emoji}
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#2d3748', fontWeight: '600' }}>{act.name}</h3>
              <p style={{ margin: '0 0 12px', color: '#4a5568', fontSize: '14px' }}>{act.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  background: 'rgba(102, 126, 234, 0.15)',
                  color: '#667eea',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {act.type}
                </span>
                <span style={{
                  background: `${costColors[act.cost]}20`,
                  color: costColors[act.cost],
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  💰 {act.cost}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}