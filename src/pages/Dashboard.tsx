import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-header">
            <h1>Welcome, {user?.firstName || 'User'}!</h1>
            <p>Here's a quick overview of your smart thermostat system.</p>
          </div>

          <div className="dashboard-widgets">
            <div className="widget-row">
              <div className="widget widget-large">
                <h2>Overall System Status</h2>
                {/* Placeholder for system status summary */}
                <p>All systems operational. 3 properties online, 12 thermostats connected.</p>
              </div>
            </div>
            <div className="widget-row">
              <div className="widget">
                <h3>Active Properties</h3>
                {/* Placeholder for active properties summary */}
                <p>3 properties currently active.</p>
                {/* Link to properties page */}
              </div>
              <div className="widget">
                <h3>Energy Savings</h3>
                {/* Placeholder for energy savings summary */}
                <p>$125 saved this month.</p>
                {/* Link to statistics page */}
              </div>
              <div className="widget">
                <h3>Upcoming Bookings</h3>
                {/* Placeholder for upcoming bookings summary */}
                <p>2 bookings in the next 7 days.</p>
                {/* Link to calendars page */}
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="btn btn-primary">Add New Property</button>
              <button className="btn btn-secondary">View All Thermostats</button>
              <button className="btn btn-info">Generate Report</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
