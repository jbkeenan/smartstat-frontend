import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

interface PropertyProps {
  property: {
    id: string;
    name: string;
    type: string;
    city: string;
    state: string;
    thermostats: {
      id: string;
      name: string;
      current_temperature: number;
      is_online: boolean;
    }[];
  };
  onDelete: () => void;
}

const PropertyCard: React.FC<PropertyProps> = ({ property, onDelete }) => {
  return (
    <div className="property-card">
      <div className="property-header">
        <h3>{property.name}</h3>
        <span className={`property-type ${property.type.toLowerCase()}`}>
          {property.type}
        </span>
      </div>
      
      <div className="property-location">
        <i className="fas fa-map-marker-alt"></i>
        <span>{property.city}, {property.state}</span>
      </div>
      
      <div className="property-stats">
        <div className="stat">
          <i className="fas fa-thermometer-half"></i>
          <span>{property.thermostats?.length || 0} Thermostats</span>
        </div>
        <div className="stat">
          <i className="fas fa-calendar"></i>
          <span>View Calendar</span>
        </div>
      </div>
      
      {property.thermostats && property.thermostats.length > 0 && (
        <div className="property-thermostats">
          <h4>Thermostats</h4>
          <ul>
            {property.thermostats.slice(0, 2).map(thermostat => (
              <li key={thermostat.id} className={!thermostat.is_online ? 'offline' : ''}>
                <span className="thermostat-name">{thermostat.name}</span>
                <span className="thermostat-temp">{thermostat.current_temperature}°</span>
                <span className="thermostat-status">
                  {thermostat.is_online ? 'Online' : 'Offline'}
                </span>
              </li>
            ))}
            {property.thermostats.length > 2 && (
              <li className="more-thermostats">
                +{property.thermostats.length - 2} more
              </li>
            )}
          </ul>
        </div>
      )}
      
      <div className="property-actions">
        <Link to={`/properties/${property.id}`} className="btn btn-primary">
          View Details
        </Link>
        <button onClick={onDelete} className="btn btn-danger">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
