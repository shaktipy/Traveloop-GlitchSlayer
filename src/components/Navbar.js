import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Glass button style helper
  const btnStyle = (color) => ({
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(6px)',
    border: `1.5px solid ${color}30`,
    color: color,
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
  });

  const primaryBtn = {
    ...btnStyle('#667eea'),
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      padding: '12px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Logo */}
      <h2
        onClick={() => navigate('/dashboard')}
        style={{
          cursor: 'pointer',
          margin: 0,
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        ✈️ Traveloop
      </h2>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/city-search')}
          style={btnStyle('#38a169')}
          onMouseEnter={e => e.currentTarget.style.background = '#38a16915'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
        >
          🔍 Cities
        </button>

        <button onClick={() => navigate('/activity-search')}
          style={btnStyle('#f6ad55')}
          onMouseEnter={e => e.currentTarget.style.background = '#f6ad5515'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
        >
          🎯 Activities
        </button>

        <button onClick={() => navigate('/my-trips')}
          style={btnStyle('#667eea')}
          onMouseEnter={e => e.currentTarget.style.background = '#667eea15'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
        >
          My Trips
        </button>

        <button onClick={() => navigate('/create-trip')}
          style={primaryBtn}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          + New Trip
        </button>
        <button
          onClick={() => navigate('/admin')}
          style={{
            background: 'none', border: '2px solid #f6ad55',
            color: '#f6ad55', padding: '8px 16px',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}
>
            ⚙️ Admin
        </button>

        {/* Profile icon */}
        <button onClick={() => navigate('/profile')}
          style={{
            background: 'rgba(102, 126, 234, 0.12)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.12)'}
          title="Profile"
        >
          👤
        </button>

        <button onClick={handleLogout}
          style={btnStyle('#fc8181')}
          onMouseEnter={e => e.currentTarget.style.background = '#fc818115'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}