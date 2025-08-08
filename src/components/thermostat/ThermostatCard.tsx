import React from 'react';
import { Link } from 'react-router-dom';
import ThermostatCard from '../../components/thermostat/ThermostatCard';
import { useAuth } from '../../contexts/AuthContext';
import './ThermostatCard.scss';

interface ThermostatCardProps {
  thermostat: {
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
  };
}

const ThermostatCard: React.FC<ThermostatCardProps> = ({ thermostat }) => {
  const { isTestMode } = useAuth();
  const [temperature, setTemperature] = React.useState(thermostat.targetTemperature);
  const [mode, setMode] = React.useState(thermostat.mode);
  const [updating, setUpdating] = React.useState(false);

  const handleTemperatureChange = (newTemp: number) => {
    setTemperature(newTemp);
    updateThermostat(newTemp, mode);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    updateThermostat(temperature, newMode);
  };

  const updateThermostat = async (temp: number, thermostatMode: string) => {
    if (isTestMode) {
      // Simulate API delay in test mode
      setUpdating(true);
      setTimeout(() => {
        setUpdating(false);
      }, 1000);
      return;
    }

    try {
      setUpdating(true);
      // API call would go here in real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUpdating(false);
    } catch (error) {
      console.error('Failed to update thermostat', error);
      setUpdating(false);
    }
  };

  return (
    <div className={`thermostat-card ${!thermostat.isOnline ? 'offline' : ''}`}>
      <div className="card-header">
        <h3>{thermostat.name}</h3>
        <span className={`status-indicator ${thermostat.isOnline ? 'online' : 'offline'}`}>
          {thermostat.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="property-info">
        <i className="fas fa-home"></i>
        <Link to={`/properties/${thermostat.propertyId}`}>
          {thermostat.propertyName}
        </Link>
      </div>
      
      <div className="temperature-display">
        <div className="current-temperature">
          <span className="value">{thermostat.currentTemperature}</span>
          <span className="unit">°F</span>
        </div>
        <div className="target-temperature">
          <span className="label">Set to:</span>
          <span className="value">{temperature}</span>
          <span className="unit">°F</span>
        </div>
      </div>
      
      <div className="temperature-controls">
        <button 
          className="temp-button decrease" 
          onClick={() => handleTemperatureChange(temperature - 1)}
          disabled={updating || !thermostat.isOnline}
        >
          <i className="fas fa-minus"></i>
        </button>
        <div className="temperature-slider">
          <input 
            type="range" 
            min="60" 
            max="90" 
            value={temperature} 
            onChange={(e) => handleTemperatureChange(parseInt(e.target.value))}
            disabled={updating || !thermostat.isOnline}
          />
        </div>
        <button 
          className="temp-button increase" 
          onClick={() => handleTemperatureChange(temperature + 1)}
          disabled={updating || !thermostat.isOnline}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="mode-controls">
        <button 
          className={`mode-button ${mode === 'heat' ? 'active' : ''}`}
          onClick={() => handleModeChange('heat')}
          disabled={updating || !thermostat.isOnline}
        >
          <i className="fas fa-fire"></i>
          <span>Heat</span>
        </button>
        <button 
          className={`mode-button ${mode === 'cool' ? 'active' : ''}`}
          onClick={() => handleModeChange('cool')}
          disabled={updating || !thermostat.isOnline}
        >
          <i className="fas fa-snowflake"></i>
          <span>Cool</span>
        </button>
        <button 
          className={`mode-button ${mode === 'fan' ? 'active' : ''}`}
          onClick={() => handleModeChange('fan')}
          disabled={updating || !thermostat.isOnline}
        >
          <i className="fas fa-fan"></i>
          <span>Fan</span>
        </button>
        <button 
          className={`mode-button ${mode === 'off' ? 'active' : ''}`}
          onClick={() => handleModeChange('off')}
          disabled={updating || !thermostat.isOnline}
        >
          <i className="fas fa-power-off"></i>
          <span>Off</span>
        </button>
      </div>
      
      <div className="card-footer">
        <div className="device-info">
          <span className="brand">{thermostat.brand}</span>
          <span className="model">{thermostat.model}</span>
        </div>
        <button className="settings-button">
          <i className="fas fa-cog"></i>
        </button>
      </div>
      
      {updating && (
        <div className="updating-overlay">
          <div className="spinner"></div>
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
};

export default ThermostatCard;
