import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.email === 'admin@admin.com' && credentials.password === 'admin123') {
      const adminProfile = { username: 'System Admin', email: credentials.email, isAdmin: true };
      localStorage.setItem('smart_user_profile', JSON.stringify(adminProfile));
      navigate('/admin');
    } else {
      setError('Authorization failed. Invalid credentials provided.');
    }
  };

  return (
    <div className="admin-login-wrapper animate-fade-in">
      <div className="admin-login-left">
        <div className="admin-left-content">
          <ShieldAlert size={64} className="hero-shield-icon" />
          <h1>Admin Control Center</h1>
          <p>Secure portal for designated system administrators. Access event configurations, manage user bookings, and monitor platform metrics centrally.</p>
        </div>
        <div className="admin-bg-texture"></div>
      </div>
      
      <div className="admin-login-right">
        <div className="admin-login-form-container glass-panel">
          <div className="admin-form-header">
            <Lock size={32} className="lock-icon" />
            <h2>System Authentication</h2>
            <p>Please enter your administrative credentials.</p>
          </div>
          
          {error && <div className="admin-error-box">{error}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>Administrator Email</label>
              <div className="input-with-icon">
                <input 
                  type="text" 
                  className="form-input custom-input" 
                  required
                  value={credentials.email}
                  onChange={e => setCredentials({...credentials, email: e.target.value})}
                  placeholder="name@domain.com"
                />
              </div>
            </div>
            
            <div className="form-group" style={{marginBottom: '2.5rem'}}>
              <label>Access Matrix Key</label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon-left" />
                <input 
                  type="password" 
                  className="form-input custom-input with-left-icon" 
                  required
                  value={credentials.password}
                  onChange={e => setCredentials({...credentials, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button type="submit" variant="primary" className="full-width admin-submit-btn">
              Authenticate <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
