import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { addThermostat } from '../../services/api';
import './AddThermostatModal.scss';

interface AddThermostatModalProps {
  onAdd: (thermostat: any) => void;
  onClose: () => void;
}

const AddThermostatModal: React.FC<AddThermostatModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('nest');
  const [model, setModel] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isTestMode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !brand || !model || !deviceId || !propertyId) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const thermostatData = {
        name,
        brand,
        model,
        device_id: deviceId,
        api_key: apiKey,
        api_token: apiToken,
        property: propertyId
      };
      
      const newThermostat = isTestMode 
        ? { 
            id: `test-${Date.now()}`,
            name,
            brand,
            model,
            propertyId,
            propertyName: 'Test Property',
            currentTemperature: 72,
            targetTemperature: 70,
            mode: 'heat',
            isOnline: true
          }
        : await addThermostat(thermostatData);
      
      onAdd(newThermostat);
    } catch (err) {
      setError('Failed to add thermostat. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-thermostat-modal">
        <div className="modal-header">
          <h2>Add New Thermostat</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Thermostat Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Living Room Thermostat"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="brand">Brand *</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            >
              <option value="nest">Google Nest</option>
              <option value="cielo">Cielo</option>
              <option value="pioneer">Pioneer</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model *</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Thermostat E"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deviceId">Device ID *</label>
            <input
              type="text"
              id="deviceId"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Device identifier"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="propertyId">Property *</label>
            <select
              id="propertyId"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              required
            >
              <option value="">Select a property</option>
              <option value="prop1">Beach House</option>
              <option value="prop2">Mountain Cabin</option>
              <option value="prop3">Downtown Apartment</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="apiKey">API Key (Optional)</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="For direct API access"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="apiToken">API Token (Optional)</label>
            <input
              type="password"
              id="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="For direct API access"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Thermostat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddThermostatModal;
