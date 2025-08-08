import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-item">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/properties" className="sidebar-item">
          <i className="fas fa-building"></i>
          <span>Properties</span>
        </Link>
        <Link to="/statistics" className="sidebar-item">
          <i className="fas fa-chart-line"></i>
          <span>Statistics</span>
        </Link>
        <Link to="/settings" className="sidebar-item">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </Link>
        <Link to="/help" className="sidebar-item">
          <i className="fas fa-question-circle"></i>
          <span>Help</span>
        </Link>
      </div>
      
      <div className="sidebar-footer">
        <Link to="/faq" className="sidebar-item">
          <i className="fas fa-info-circle"></i>
          <span>FAQ</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
