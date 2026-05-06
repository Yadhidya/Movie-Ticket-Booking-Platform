import { Link } from 'react-router-dom';
import { Ticket, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', email: '', phone: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('smart_user_profile');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (isRegistering && (!otpSent || !authForm.otp.trim())) {
      alert("Please send and enter the OTP to register.");
      return;
    }
    if (authForm.username.trim() && authForm.password.trim()) {
      try {
        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
        const payload = isRegistering 
          ? { username: authForm.username, password: authForm.password, email: authForm.email, otp: authForm.otp }
          : { username: authForm.username, password: authForm.password };
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) {
          const user = await res.json();
          const newProfile = { username: user.username, isAdmin: user.role === 'ADMIN' };
          localStorage.setItem('smart_user_profile', JSON.stringify(newProfile));
          setUserProfile(newProfile);
          setIsLoggedIn(true);
          setShowSignInModal(false);
          alert(isRegistering ? "Registration successful! Welcome to EventHub." : "Login successful! Welcome back.");
        } else {
          let errorMsg;
          // 502/503/504 = Vite proxy can't reach Spring Boot
          if (res.status === 502 || res.status === 503 || res.status === 504) {
            errorMsg = 'Cannot reach the backend server. Please make sure Spring Boot is running on port 8080.';
          } else {
            try {
              const errText = await res.text();
              // Strip any HTML that the proxy might return
              const clean = errText.replace(/<[^>]*>/g, '').trim();
              if (isRegistering) {
                errorMsg = clean.toLowerCase().includes('exists')
                  ? 'Username already taken. Please choose a different name.'
                  : clean
                    ? `Registration failed: ${clean}`
                    : 'Registration failed. Username may already be taken.';
              } else {
                errorMsg = 'Incorrect username or password. Please try again.';
              }
            } catch {
              errorMsg = isRegistering
                ? 'Registration failed. Username may already be taken.'
                : 'Login failed. Please check your credentials.';
            }
          }
          alert(errorMsg);
        }
      } catch (err) {
        console.error("Auth error:", err);
        alert("Failed to connect to backend. Is Spring Boot running?");
      }
    }
  };

  const handleSendOtp = async () => {
    if (!authForm.email.trim()) {
      alert("Please enter your email first.");
      return;
    }
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email })
      });
      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to your email! Please check your inbox (and spam folder).");
      } else {
        const errText = await res.text();
        alert(`Failed to send OTP: ${errText}`);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to connect to backend. Is Spring Boot running?");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('smart_user_profile');
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Ticket className="logo-icon" />
          <span className="logo-text text-gradient">MovieHub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/" className="nav-link">Explore Events</Link>
          <Link to="/my-tickets" className="nav-link">My Tickets</Link>
          {isLoggedIn && userProfile?.isAdmin && (
            <Link to="/admin" className="nav-link text-gradient">Admin Dashboard</Link>
          )}
          {isLoggedIn ? (
            <div className="user-profile-badge">
              <User size={18} />
              <span>{userProfile.username}</span>
              <button className="nav-link sign-out-text" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button className="primary-btn" onClick={() => setShowSignInModal(true)}>Sign In</button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Explore Events</Link>
          <Link to="/my-tickets" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>My Tickets</Link>
          {isLoggedIn && userProfile?.isAdmin && (
            <Link to="/admin" className="mobile-nav-link text-gradient" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {isLoggedIn ? (
            <>
              <div className="mobile-nav-link text-gradient flex-gap"><User size={16}/> {userProfile.username}</div>
              <button className="mobile-nav-link sign-out-text" onClick={handleSignOut} style={{textAlign: 'left'}}>Sign Out</button>
            </>
          ) : (
            <button className="primary-btn mobile-sign-in" onClick={() => { setIsMenuOpen(false); setShowSignInModal(true); }}>Sign In</button>
          )}
        </div>
      )}

      {/* Sign In/Register Modal */}
      {showSignInModal && (
        <div className="modal-overlay" onClick={() => setShowSignInModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isRegistering ? 'Register for MovieHub' : 'Sign In to MovieHub'}</h3>
              <button className="close-btn" onClick={() => setShowSignInModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSignIn} className="sign-in-form">
              <div className="form-group" style={{marginBottom: '1rem', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', fontSize: '0.85rem'}}>
                <strong>Admin Access:</strong> <Link to="/admin-login" onClick={() => setShowSignInModal(false)}>Login Here</Link>
              </div>
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={authForm.username} 
                  onChange={(e) => setAuthForm(prev => ({...prev, username: e.target.value}))}
                  className="form-input"
                  placeholder="Enter your name"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label>Password</label>
                <input 
                  type="password" 
                  value={authForm.password} 
                  onChange={(e) => setAuthForm(prev => ({...prev, password: e.target.value}))}
                  className="form-input"
                  placeholder="Enter password"
                  required
                />
              </div>
              {isRegistering && (
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                  <label>Email Address</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="email" 
                      value={authForm.email} 
                      onChange={(e) => setAuthForm(prev => ({...prev, email: e.target.value}))}
                      className="form-input"
                      placeholder="Enter email"
                      required={isRegistering}
                      disabled={otpSent}
                    />
                    <button type="button" className="primary-btn" onClick={handleSendOtp} disabled={otpSent || !authForm.email} style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </button>
                  </div>
                </div>
              )}
              {isRegistering && otpSent && (
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                  <label>Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    value={authForm.otp} 
                    onChange={(e) => setAuthForm(prev => ({...prev, otp: e.target.value}))}
                    className="form-input"
                    placeholder="123456"
                    maxLength="6"
                    required={isRegistering}
                  />
                </div>
              )}
              <button type="submit" className="primary-btn full-width" disabled={isRegistering && !otpSent}>
                {isRegistering ? 'Register' : 'Sign In'}
              </button>
              <div style={{marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem'}}>
                {isRegistering ? 'Already have an account? ' : 'New user? '}
                <button type="button" onClick={() => { setIsRegistering(!isRegistering); setOtpSent(false); setAuthForm({ username: '', email: '', phone: '', password: '', otp: '' }); }} style={{background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', textDecoration: 'underline'}}>
                  {isRegistering ? 'Sign In' : 'Register Here'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
