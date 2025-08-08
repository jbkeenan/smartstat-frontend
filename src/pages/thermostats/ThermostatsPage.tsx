import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import ThermostatCard from '../../components/thermostat/ThermostatCard';
import AddThermostatModal from '../../components/thermostat/AddThermostatModal';
import { useAuth } from '../../contexts/AuthContext';
import { getThermostatsByUser } from '../../services/api';
import '../../styles/ThermostatsPage.scss';

interface Thermostat {
  id: string;
  name: string;
  brand: string;
  model: string;
  propertyId: string;
  propertyName: string;
  currentTemperature: number;
  targetTemperature: number;
  mode: string;
  isOnline: boolean;
}

const ThermostatsPage: React.FC = () => {
  const [thermostats, setThermostats] = useState<Thermostat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const { isAuthenticated, isTestMode } = useAuth();

  useEffect(() => {
    const fetchThermostats = async () => {
      try {
        setLoading(true);
        const data = await getThermostatsByUser();
        setThermostats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load thermostats. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated || isTestMode) {
      fetchThermostats();
    }
  }, [isAuthenticated, isTestMode]);

  const handleAddThermostat = (newThermostat: Thermostat) => {
    setThermostats([...thermostats, newThermostat]);
    setShowAddModal(false);
  };

  return (
    <div className="thermostats-page">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Thermostats</h1>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              Add Thermostat
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading thermostats...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : thermostats.length === 0 ? (
            <div className="empty-state">
              <h2>No thermostats found</h2>
              <p>Add your first thermostat to get started.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowAddModal(true)}
              >
                Add Thermostat
              </button>
            </div>
          ) : (
            <div className="thermostats-grid">
              {thermostats.map(thermostat => (
                <ThermostatCard 
                  key={thermostat.id} 
                  thermostat={thermostat} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddThermostatModal 
          onAdd={handleAddThermostat}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default ThermostatsPage;
