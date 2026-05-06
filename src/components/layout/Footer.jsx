import './Footer.css';
import { Ticket } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Ticket className="logo-icon" size={20} />
            <span className="text-gradient font-bold">EventHub</span>
          </div>
          <p className="footer-desc">Your premium platform for booking department events, fests, and workshops.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about">About Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EventHub Internal System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
