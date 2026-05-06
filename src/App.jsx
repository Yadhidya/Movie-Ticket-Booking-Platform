import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { mockEvents } from './data/mockEvents';
import { useEffect } from 'react';
import './index.css';

function App() {
  useEffect(() => {
    // V2: Re-seeding database to include user's 10 new additional events dynamically.
    if (!localStorage.getItem('smart_events_seeded_v2')) {
      localStorage.setItem('smart_events', JSON.stringify(mockEvents));
      localStorage.setItem('smart_events_seeded_v2', 'true');
    }

    // Spring Boot & ORM Integration Test
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        console.log("Current Tickets in H2 DB (Global View):", data);
      })
      .catch(err => console.log("Spring Boot backend may not be running yet.", err));
  }, []);
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
