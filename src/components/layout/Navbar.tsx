import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isTestMode, toggleTestMode } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src="/logo.svg" alt="Smart Thermostat" className="logo" />
          <span>Smart Thermostat</span>
        </Link>
      </div>
      
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/properties" className="nav-link">Properties</Link>
            <div className="dropdown">
              <button className="dropdown-toggle">
                {user.firstName || 'User'} <i className="fas fa-caret-down"></i>
              </button>
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/settings" className="dropdown-item">Settings</Link>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item">Logout</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn btn-primary">Sign Up</Link>
          </>
        )}
        
        {/* Test Mode Toggle */}
        <div className="test-mode-toggle">
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isTestMode} 
              onChange={toggleTestMode}
            />
            <span className="slider round"></span>
          </label>
          <span className="test-mode-label">Test Mode</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
