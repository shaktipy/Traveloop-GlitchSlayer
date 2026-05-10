import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function PackingChecklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Other');
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    fetchTrip();
    loadItems();
  }, []);

  const fetchTrip = async () => {
    const { data } = await supabase.from('trips').select('*').eq('id', tripId).single();
    if (data) setTrip(data);
  };

  const loadItems = () => {
    const saved = localStorage.getItem(`checklist_${tripId}`);
    if (saved) setItems(JSON.parse(saved));
  };

  const saveItems = (newItems) => {
    localStorage.setItem(`checklist_${tripId}`, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = {
      id: Date.now(),
      name: newItem,
      category,
      packed: false
    };
    saveItems([...items, item]);
    setNewItem('');
  };

  const toggleItem = (id) => {
    saveItems(items.map(i => i.id === id ? { ...i, packed: !i.packed } : i));
  };

  const deleteItem = (id) => {
    saveItems(items.filter(i => i.id !== id));
  };

  const resetAll = () => {
    saveItems(items.map(i => ({ ...i, packed: false })));
  };

  const categories = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Medicine', 'Other'];
  const categoryEmoji = {
    'Clothing': '👕', 'Documents': '📄', 'Electronics': '💻',
    'Toiletries': '🧴', 'Medicine': '💊', 'Other': '🎒'
  };
  const packed = items.filter(i => i.packed).length;

  // Glass card style
  const glassCard = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
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
      <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>

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
            🎒 Packing Checklist
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
            ← Back
          </button>
        </div>

        {/* Trip name (if available) */}
        {trip && (
          <div style={{
            ...glassCard,
            padding: '16px 20px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))',
            border: 'none',
          }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>
              ✈️ {trip.name}
            </p>
          </div>
        )}

        {/* Progress Card */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '600', color: '#2d3748' }}>
              {packed}/{items.length} items packed
            </span>
            <span style={{ color: '#667eea', fontWeight: '600' }}>
              {items.length > 0 ? Math.round((packed / items.length) * 100) : 0}%
            </span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              width: `${items.length > 0 ? (packed / items.length) * 100 : 0}%`,
              height: '100%',
              borderRadius: '999px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          {packed === items.length && items.length > 0 && (
            <p style={{ color: '#38a169', fontWeight: '600', textAlign: 'center', marginTop: '12px' }}>
              🎉 Everything is packed! Ready for the trip!
            </p>
          )}
        </div>

        {/* Add Item Card */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: '600', color: '#2d3748' }}>➕ Add Item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Item name *"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addItem()}
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid #667eea'}
              onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
            />
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{
                ...inputStyle,
                padding: '14px',
                border: '2px solid rgba(226, 232, 240, 0.8)',
              }}
              onFocus={e => e.target.style.border = '2px solid #667eea'}
              onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
            >
              {categories.map(c => (
                <option key={c} value={c}>{categoryEmoji[c]} {c}</option>
              ))}
            </select>
          </div>
          <button onClick={addItem} disabled={!newItem.trim()}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              background: !newItem.trim() ? '#a0aec0' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              cursor: !newItem.trim() ? 'not-allowed' : 'pointer',
              boxShadow: !newItem.trim() ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontFamily: "'Inter', sans-serif",
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={e => {
              if (newItem.trim()) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            + Add Item
          </button>
        </div>

        {/* Category Groups */}
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} style={{
              ...glassCard,
              padding: '20px',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 12px', color: '#2d3748', fontWeight: '600' }}>
                {categoryEmoji[cat]} {cat} ({catItems.filter(i => i.packed).length}/{catItems.length})
              </h4>
              {catItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '6px',
                  background: item.packed ? 'rgba(56, 161, 105, 0.1)' : 'rgba(255,255,255,0.5)',
                  border: item.packed ? '1px solid rgba(56, 161, 105, 0.3)' : '1px solid rgba(255,255,255,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={item.packed}
                      onChange={() => toggleItem(item.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#667eea'
                      }}
                    />
                    <span style={{
                      color: item.packed ? '#38a169' : '#2d3748',
                      textDecoration: item.packed ? 'line-through' : 'none',
                      fontWeight: item.packed ? '400' : '600'
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <button onClick={() => deleteItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#fc8181',
                      fontSize: '16px'
                    }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          );
        })}

        {items.length > 0 && (
          <button onClick={resetAll}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              color: '#4a5568',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.8)';
              e.target.style.borderColor = '#667eea';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(255, 255, 255, 0.5)';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            🔄 Reset All
          </button>
        )}
      </div>
    </div>
  );
}