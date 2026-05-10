import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CITIES = [
  { city: 'Paris', country: 'France', emoji: '🗼', cost: 'High', popular: true, desc: 'City of Love & Art' },
  { city: 'Tokyo', country: 'Japan', emoji: '🗾', cost: 'High', popular: true, desc: 'Land of Rising Sun' },
  { city: 'Bali', country: 'Indonesia', emoji: '🌴', cost: 'Low', popular: true, desc: 'Island Paradise' },
  { city: 'New York', country: 'USA', emoji: '🗽', cost: 'High', popular: true, desc: 'The Big Apple' },
  { city: 'London', country: 'UK', emoji: '🎡', cost: 'High', popular: true, desc: 'Historic Capital' },
  { city: 'Dubai', country: 'UAE', emoji: '🏙️', cost: 'High', popular: true, desc: 'City of Gold' },
  { city: 'Bangkok', country: 'Thailand', emoji: '🛕', cost: 'Low', popular: true, desc: 'Temple City' },
  { city: 'Singapore', country: 'Singapore', emoji: '🦁', cost: 'Medium', popular: true, desc: 'Lion City' },
  { city: 'Mumbai', country: 'India', emoji: '🌊', cost: 'Low', popular: true, desc: 'City of Dreams' },
  { city: 'Delhi', country: 'India', emoji: '🕌', cost: 'Low', popular: false, desc: 'Heart of India' },
  { city: 'Goa', country: 'India', emoji: '🏖️', cost: 'Low', popular: true, desc: 'Beach Paradise' },
  { city: 'Barcelona', country: 'Spain', emoji: '🎨', cost: 'Medium', popular: true, desc: 'City of Gaudi' },
  { city: 'Rome', country: 'Italy', emoji: '🏛️', cost: 'Medium', popular: true, desc: 'Eternal City' },
  { city: 'Amsterdam', country: 'Netherlands', emoji: '🚲', cost: 'Medium', popular: false, desc: 'Canal City' },
  { city: 'Sydney', country: 'Australia', emoji: '🦘', cost: 'High', popular: false, desc: 'Harbour City' },
  { city: 'Istanbul', country: 'Turkey', emoji: '🕌', cost: 'Medium', popular: false, desc: 'City of Two Continents' },
  { city: 'Prague', country: 'Czech Republic', emoji: '🏰', cost: 'Low', popular: false, desc: 'City of Spires' },
  { city: 'Kyoto', country: 'Japan', emoji: '⛩️', cost: 'Medium', popular: false, desc: 'Ancient Capital' },
  { city: 'Jaipur', country: 'India', emoji: '🏯', cost: 'Low', popular: false, desc: 'Pink City' },
  { city: 'Maldives', country: 'Maldives', emoji: '🏝️', cost: 'High', popular: true, desc: 'Ocean Paradise' },
];

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const navigate = useNavigate();

  const filtered = CITIES.filter(c => {
    const matchQuery = c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase());
    const matchPopular = filter === 'Popular' ? c.popular : true;
    const matchCost = costFilter === 'All' ? true : c.cost === costFilter;
    return matchQuery && matchPopular && matchCost;
  });

  const costColor = { 'Low': '#38a169', 'Medium': '#f6ad55', 'High': '#fc8181' };

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
          🔍 City Search
        </h2>

        {/* Search & Filters */}
        <div style={{
          ...glassCard,
          padding: '24px',
          marginBottom: '32px'
        }}>
          <input
            type="text"
            placeholder="Search city or country..."
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
            {['All', 'Popular'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: `2px solid ${filter === f ? '#667eea' : '#cbd5e0'}`,
                  fontWeight: '600',
                  background: filter === f ? '#667eea' : 'transparent',
                  color: filter === f ? 'white' : '#4a5568',
                  transition: 'all 0.2s',
                  fontFamily: "'Inter', sans-serif",
                }}>
                {f}
              </button>
            ))}
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
            {['All', 'Low', 'Medium', 'High'].map(c => {
              const color = costColor[c] || '#667eea';
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
          {filtered.length} {filtered.length === 1 ? 'city' : 'cities'} found
        </p>

        {/* City Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map(city => (
            <div key={city.city} style={{
              ...glassCard,
              padding: '24px',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(31, 38, 135, 0.12)';
                e.currentTarget.style.border = '2px solid #667eea';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.08)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{city.emoji}</div>
              <h3 style={{ margin: '0 0 4px', color: '#2d3748', fontWeight: '600' }}>{city.city}</h3>
              <p style={{ margin: '0 0 8px', color: '#4a5568', fontSize: '14px' }}>{city.country}</p>
              <p style={{ margin: '0 0 12px', color: '#718096', fontSize: '13px' }}>{city.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  background: `${costColor[city.cost]}20`,
                  color: costColor[city.cost],
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  💰 {city.cost} Cost
                </span>
                {city.popular && (
                  <span style={{
                    background: 'rgba(102, 126, 234, 0.15)',
                    color: '#667eea',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ⭐ Popular
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}