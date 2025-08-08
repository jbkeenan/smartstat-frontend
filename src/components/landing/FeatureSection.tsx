import React from 'react';
import './FeatureSection.css';

const FeatureSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Multi-Property Management",
      description: "Manage all your properties and thermostats in one centralized dashboard, whether you have one property or hundreds.",
      icon: "fas fa-building"
    },
    {
      id: 2,
      title: "Smart Scheduling",
      description: "Create intelligent heating and cooling schedules based on occupancy, bookings, and seasonal patterns.",
      icon: "fas fa-calendar-alt"
    },
    {
      id: 3,
      title: "Brand Integration",
      description: "Seamlessly connect with Google/Nest, Cielo, Pioneer and other popular thermostat brands.",
      icon: "fas fa-plug"
    },
    {
      id: 4,
      title: "Energy Analytics",
      description: "Track energy usage, identify savings opportunities, and reduce your environmental footprint.",
      icon: "fas fa-chart-line"
    },
    {
      id: 5,
      title: "Calendar Sync",
      description: "Integrate with booking calendars from Airbnb, VRBO, Google Calendar, and more.",
      icon: "fas fa-sync"
    },
    {
      id: 6,
      title: "Remote Access",
      description: "Control your thermostats from anywhere, anytime, using any device with internet access.",
      icon: "fas fa-mobile-alt"
    }
  ];

  return (
    <section className="feature-section">
      <h2>Powerful Features for Property Managers</h2>
      <p className="feature-subtitle">Everything you need to manage climate control across all your properties</p>
      
      <div className="feature-grid">
        {features.map(feature => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">
              <i className={feature.icon}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
