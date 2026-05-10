import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function TripNotes() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrip();
    fetchNotes();
  }, []);

  const fetchTrip = async () => {
    const { data } = await supabase.from('trips').select('*').eq('id', tripId).single();
    if (data) setTrip(data);
  };

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    if (data) setNotes(data);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    const { data } = await supabase.from('notes').insert([{
      trip_id: tripId,
      content: newNote
    }]).select();
    if (data) setNotes([data[0], ...notes]);
    setNewNote('');
    setLoading(false);
  };

  const deleteNote = async (noteId) => {
    await supabase.from('notes').delete().eq('id', noteId);
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
            📝 Trip Notes
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

        {/* Trip Info Bar */}
        {trip && (
          <div style={{
            ...glassCard,
            padding: '16px 20px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
            border: 'none',
          }}>
            <h3 style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>✈️ {trip.name}</h3>
            <p style={{ margin: '4px 0 0', color: '#4a5568', fontSize: '14px' }}>📅 {trip.start_date} → {trip.end_date}</p>
          </div>
        )}

        {/* Add Note Card */}
        <div style={{ ...glassCard, padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: '600', color: '#2d3748' }}>➕ New Note</h3>
          <textarea
            placeholder="Write something important... hotel info, contacts, reminders..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '12px',
              fontSize: '16px',
              boxSizing: 'border-box',
              resize: 'vertical',
              marginBottom: '16px',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(4px)',
              outline: 'none',
              transition: 'border 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => e.target.style.border = '2px solid #667eea'}
            onBlur={e => e.target.style.border = '2px solid rgba(226, 232, 240, 0.8)'}
          />
          <button onClick={addNote} disabled={loading || !newNote.trim()}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              background: loading || !newNote.trim() ? '#a0aec0' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading || !newNote.trim() ? 'not-allowed' : 'pointer',
              boxShadow: loading || !newNote.trim() ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontFamily: "'Inter', sans-serif",
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={e => {
              if (!loading && newNote.trim()) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              if (!loading) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? 'Saving...' : '💾 Save Note'}
          </button>
        </div>

        {/* Notes List */}
        <h3 style={{ color: '#2d3748', fontWeight: '600', marginBottom: '16px' }}>
          📋 All Notes ({notes.length})
        </h3>
        {notes.length === 0 ? (
          <div style={{
            ...glassCard,
            padding: '40px',
            textAlign: 'center',
            color: '#718096'
          }}>
            No notes yet! Add one above 📝
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} style={{
              ...glassCard,
              padding: '20px',
              marginBottom: '16px',
              borderLeft: '4px solid #667eea'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ margin: '0 0 8px', color: '#2d3748', lineHeight: '1.6', flex: 1, fontWeight: '500' }}>
                  {note.content}
                </p>
                <button onClick={() => deleteNote(note.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fc8181',
                    marginLeft: '12px',
                    fontSize: '16px'
                  }}>
                  🗑️
                </button>
              </div>
              <p style={{ margin: 0, color: '#718096', fontSize: '13px', fontWeight: '500' }}>
                🕐 {formatDate(note.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}