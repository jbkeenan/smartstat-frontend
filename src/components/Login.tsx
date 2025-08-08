import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onToggleTestMode?: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleTestMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, error, isTestMode, toggleTestMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  const handleToggleTestMode = () => {
    if (toggleTestMode) {
      toggleTestMode();
      if (isTestMode) {
        // If we're currently in test mode, toggling will exit test mode
        // Do nothing else, as the user will need to log in
      } else {
        // If we're not in test mode, toggling will enter test mode
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Smart Thermostat</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={handleToggleTestMode}
          >
            {isTestMode ? 'Exit Test Mode' : 'Enter Test Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
