import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [tripCount, setTripCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) { navigate('/'); return; }
    setUser(data.user);
    setEmail(data.user.email);

    // Check if user row exists in users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('name')
      .eq('id', data.user.id)
      .single();

    if (userData) {
      setName(userData.name || '');
    } else {
      // No row found → auto-create user row with empty name
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name: ''
      });
      setName('');
    }

    const { count } = await supabase
      .from('trips')
      .select('*', { count: 'exact' })
      .eq('user_id', data.user.id);
    setTripCount(count || 0);
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    // Update existing row
    const { error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', user.id);

    if (!error) {
      setSuccess('Profile updated successfully! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setSuccess('Update failed, please try again');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? All data will be deleted!')) {
      await supabase.from('trips').delete().eq('user_id', user.id);
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
      fontFamily: "'Inter', sans-serif"
    }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>

        <h2 style={{
          fontSize: '28px', fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '32px', textAlign: 'center'
        }}>
          👤 Profile & Settings
        </h2>

        {/* Profile Card */}
        <div style={{
          ...glassCard,
          padding: '32px', marginBottom: '24px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85), rgba(118, 75, 162, 0.85))',
          backdropFilter: 'blur(16px)', border: 'none', color: 'white'
        }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '44px', margin: '0 auto 16px',
            border: '3px solid rgba(255,255,255,0.4)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            ✈️
          </div>
          <h3 style={{ margin: '0 0 4px', fontWeight: '700' }}>
            {name || 'Traveler'}
          </h3>
          <p style={{ margin: '0 0 20px', opacity: 0.9 }}>{email}</p>
          <div style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: '12px',
            padding: '12px 24px', display: 'inline-block', backdropFilter: 'blur(4px)'
          }}>
            <span style={{ fontWeight: '700', fontSize: '24px' }}>{tripCount}</span>
            <span style={{ opacity: 0.9, marginLeft: '8px' }}>Trips Created</span>
          </div>
        </div>

        {/* Edit Profile */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontWeight: '600', color: '#2d3748' }}>
            ✏️ Edit Profile
          </h3>

          {success && (
            <div style={{
              background: success.includes('fail') ? 'rgba(255, 245, 245, 0.8)' : 'rgba(240, 255, 244, 0.8)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${success.includes('fail') ? '#fc8181' : '#68d391'}`,
              color: success.includes('fail') ? '#c53030' : '#38a169',
              padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
              fontWeight: '500',
            }}>
              {success}
            </div>
          )}

          <label style={{ fontWeight: '600', color: '#2d3748', display: 'block', marginBottom: '6px' }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Apna naam likho"
            style={{
              width: '100%', padding: '14px', marginBottom: '20px',
              border: '2px solid rgba(226, 232, 240, 0.8)', borderRadius: '12px',
              fontSize: '16px', boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(4px)',
              outline: 'none', transition: 'border 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => e.target.style.border = '2px solid #667eea'}
            onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
          />

          <label style={{ fontWeight: '600', color: '#2d3748', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            style={{
              width: '100%', padding: '14px', marginBottom: '24px',
              border: '2px solid rgba(226, 232, 240, 0.8)', borderRadius: '12px',
              fontSize: '16px', boxSizing: 'border-box',
              background: 'rgba(247, 248, 252, 0.6)', backdropFilter: 'blur(4px)',
              color: '#718096', fontFamily: "'Inter', sans-serif",
            }}
          />

          <button
            onClick={handleUpdate}
            disabled={loading || !name.trim()}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
              background: loading || !name.trim()
                ? '#a0aec0'
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', fontWeight: '600', fontSize: '16px',
              cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
              boxShadow: loading || !name.trim() ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontFamily: "'Inter', sans-serif",
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={e => {
              if (!loading && name.trim()) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              if (!loading) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{
          ...glassCard, padding: '24px',
          border: '2px solid rgba(252, 129, 129, 0.5)',
          background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)',
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#c53030', fontWeight: '600' }}>
            ⚠️ Danger Zone
          </h3>
          <button onClick={handleLogout}
            style={{
              width: '100%', padding: '12px', background: 'transparent',
              color: '#667eea', border: '2px solid #667eea', borderRadius: '12px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              marginBottom: '12px', fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s',
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
            🚪 Logout
          </button>
          <button onClick={handleDeleteAccount}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(252, 129, 129, 0.1)', color: '#c53030',
              border: '2px solid #fc8181', borderRadius: '12px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.background = '#fc8181';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(252, 129, 129, 0.1)';
              e.target.style.color = '#c53030';
            }}
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}