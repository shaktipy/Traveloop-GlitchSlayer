import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import Budget from './pages/Budget';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import CitySearch from './pages/CitySearch';
import Profile from './pages/Profile';
import ActivitySearch from './pages/ActivitySearch';
import SharedTrip from './pages/SharedTrip';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/itinerary/:tripId" element={<ItineraryBuilder />} />
        <Route path="/budget/:tripId" element={<Budget />} />
        <Route path="/packing-checklist/:tripId" element={<PackingChecklist />} />
        <Route path="/notes/:tripId" element={<TripNotes />} />
        <Route path="/city-search" element={<CitySearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity-search" element={<ActivitySearch />} />
        <Route path="/share/:shareToken" element={<SharedTrip />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;