import React from 'react';
import './HeroSection.css';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Smart Property Management Starts with Smart Thermostats</h1>
        <p>
          Manage all your properties and thermostats in one place. Save energy, reduce costs, 
          and provide better comfort for your tenants with our comprehensive smart thermostat solution.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
            Get Started
          </button>
          <button className="btn btn-outline btn-lg">
            Learn More
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">30%</span>
            <span className="stat-label">Average Energy Savings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Properties Managed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Remote Access</span>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-thermostat.png" alt="Smart Thermostat Dashboard" />
      </div>
    </section>
  );
};

export default HeroSection;
