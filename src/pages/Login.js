import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError('');
    if (!email || !password) { setError('Enter Email and Password!'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address!'); return; }
    if (password.length < 6) { setError('Password must be 6+ characters long!'); return; }
    if (isSignup && !name) { setError('Enter your name!'); return; }

    setLoading(true);
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      
      await supabase.from('users').insert({
        id: data.user.id,
        name: name,
        email: email
      });
      navigate('/dashboard');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError('Email or password is incorrect!'); setLoading(false); return; }
      navigate('/dashboard');
    }
    setLoading(false);
  };

  // Glass card style (consistent)
  const glassCard = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 20px 60px rgba(31, 38, 135, 0.12)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    fontSize: '16px',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(4px)',
    outline: 'none',
    transition: 'border 0.3s',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '16px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 50%, #fce4ec 100%)', // soft pastel gradient
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '20px',
    }}>
      <div style={glassCard}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>✈️</div>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Traveloop
          </h1>
          <p style={{ color: '#4a5568', marginTop: '8px', fontWeight: '500' }}>
            {isSignup ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        {/* Error message */}
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

        {/* Signup extra fields */}
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid #667eea'}
              onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
            />
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid #667eea'}
              onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
            />
          </>
        )}

        {/* Email & Password */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.border = '2px solid #667eea'}
          onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ ...inputStyle, marginBottom: '24px' }}
          onFocus={e => e.target.style.border = '2px solid #667eea'}
          onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
        />

        {/* Submit button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            background: loading
              ? '#a0aec0'
              : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'transform 0.1s ease',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            if (!loading) e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
        </button>

        {/* Toggle between Login / Signup */}
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#4a5568', fontWeight: '500' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            style={{
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: '600',
              marginLeft: '6px',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}