import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import TestModeToggle from '../TestModeToggle';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isTestMode } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/dashboard">Smart Thermostat</Link>
          </div>
          <nav className="main-nav">
            <ul>
              <li className={isActive('/dashboard')}>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className={isActive('/properties')}>
                <Link to="/properties">Properties</Link>
              </li>
              <li className={isActive('/business-analysis')}>
                <Link to="/business-analysis">Analytics</Link>
              </li>
            </ul>
          </nav>
          <div className="user-menu">
            {isTestMode && (
              <div className="test-mode-indicator">
                Test Mode
              </div>
            )}
            <div className="user-info">
              <span>{isTestMode ? 'Test User' : user?.username}</span>
              <div className="dropdown-menu">
                <ul>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><button onClick={logout}>Logout</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-content">
        {isTestMode && (
          <div className="test-mode-banner">
            <div className="container">
              <p>
                <strong>Test Mode Active:</strong> You are currently using the application in test mode. 
                All functionality is available without authentication.
              </p>
              <TestModeToggle />
            </div>
          </div>
        )}
        
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Smart Thermostat Automation System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
