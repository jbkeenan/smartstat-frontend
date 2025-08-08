import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './TestModeToggle.css';

const TestModeToggle: React.FC = () => {
  const { isTestMode, toggleTestMode } = useAuth();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Test mode toggle clicked');
    toggleTestMode();
  };

  return (
    <div className="test-mode-toggle">
      <button 
        onClick={handleToggle}
        className={`toggle-button ${isTestMode ? 'active' : ''}`}
        title={isTestMode ? "Exit Test Mode" : "Enter Test Mode"}
      >
        <span className="toggle-label">Test Mode</span>
        <span className={`toggle-switch ${isTestMode ? 'active' : ''}`}>
          <span className="toggle-slider"></span>
        </span>
      </button>
      {isTestMode && (
        <div className="test-mode-info">
          <p>You are in test mode. All data is simulated.</p>
        </div>
      )}
    </div>
  );
};

export default TestModeToggle;
