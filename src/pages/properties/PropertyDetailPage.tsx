import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThermostatCard from '../../components/thermostat/ThermostatCard';
import AddThermostatModal from '../../components/thermostat/AddThermostatModal';
import CalendarView from '../../components/calendar/CalendarView';
import CalendarSyncModal from '../../components/calendar/CalendarSyncModal';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import StatisticsWidget from '../../components/statistics/StatisticsWidget';
import './PropertyDetailPage.css';

const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'thermostats' | 'calendar' | 'statistics'>('thermostats');
  const [property, setProperty] = useState<any>(null);
  const [thermostats, setThermostats] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showAddThermostatModal, setShowAddThermostatModal] = useState<boolean>(false);
  const [showCalendarSyncModal, setShowCalendarSyncModal] = useState<boolean>(false);
  
  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // For now, we'll simulate with mock data
        setTimeout(() => {
          setProperty({
            id: propertyId,
            name: "Mountain View Retreat",
            address: "123 Alpine Road, Boulder, CO 80302",
            type: "Vacation Rental",
            bedrooms: 3,
            bathrooms: 2,
            square_feet: 1800,
            image: "/images/properties/mountain-view.jpg"
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load property details");
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId]);
  
  // Fetch thermostats for this property
  useEffect(() => {
    const fetchThermostats = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate with mock data
        setTimeout(() => {
          setThermostats([
            {
              id: "therm-1",
              name: "Living Room",
              brand: "nest",
              model: "Nest Learning Thermostat",
              current_temperature: 72,
              target_temperature: 70,
              humidity: 45,
              mode: "cool",
              is_online: true,
              last_updated: "2025-06-06T12:30:00Z"
            },
            {
              id: "therm-2",
              name: "Master Bedroom",
              brand: "cielo",
              model: "Cielo Breez Plus",
              current_temperature: 74,
              target_temperature: 72,
              humidity: 48,
              mode: "cool",
              is_online: true,
              last_updated: "2025-06-06T12:35:00Z"
            }
          ]);
        }, 700);
      } catch (err) {
        setError("Failed to load thermostats");
      }
    };
    
    if (propertyId) {
      fetchThermostats();
    }
  }, [propertyId]);
  
  // Fetch calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate with mock data
        setTimeout(() => {
          setEvents([
            {
              id: "event-1",
              title: "Guest Booking",
              start_date: "2025-06-10T14:00:00",
              end_date: "2025-06-15T11:00:00",
              event_type: "booking"
            },
            {
              id: "event-2",
              title: "Cleaning Service",
              start_date: "2025-06-15T11:30:00",
              end_date: "2025-06-15T14:30:00",
              event_type: "cleaning"
            },
            {
              id: "event-3",
              title: "HVAC Maintenance",
              start_date: "2025-06-20T09:00:00",
              end_date: "2025-06-20T12:00:00",
              event_type: "maintenance"
            }
          ]);
        }, 600);
      } catch (err) {
        setError("Failed to load calendar events");
      }
    };
    
    if (propertyId) {
      fetchEvents();
    }
  }, [propertyId]);
  
  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate with mock data
        setTimeout(() => {
          const today = new Date();
          const stats = [];
          
          // Generate 30 days of mock data
          for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            stats.push({
              date: date.toISOString().split('T')[0],
              energy_usage: Math.floor(Math.random() * 10) + 15, // 15-25 kWh
              cost: Math.floor(Math.random() * 5) + 3, // $3-8
              savings: Math.floor(Math.random() * 3) + 1, // $1-4
              average_temperature: Math.floor(Math.random() * 5) + 70 // 70-75°F
            });
          }
          
          setStatistics(stats);
        }, 800);
      } catch (err) {
        setError("Failed to load statistics");
      }
    };
    
    if (propertyId) {
      fetchStatistics();
    }
  }, [propertyId]);
  
  const handleAddThermostat = (thermostatData: any) => {
    // In a real implementation, this would be an API call
    // For now, we'll just update the local state
    const newThermostat = {
      id: `therm-${thermostats.length + 1}`,
      ...thermostatData,
      current_temperature: 72,
      target_temperature: 72,
      humidity: 45,
      is_online: true,
      last_updated: new Date().toISOString()
    };
    
    setThermostats([...thermostats, newThermostat]);
    setShowAddThermostatModal(false);
  };
  
  const handleCalendarSync = (syncData: any) => {
    // In a real implementation, this would be an API call
    // For now, we'll just log the data
    console.log("Calendar sync data:", syncData);
    setShowCalendarSyncModal(false);
    
    // Show success message
    alert("Calendar synced successfully!");
  };
  
  const handleEventAdd = (eventData: any) => {
    // In a real implementation, this would be an API call
    // For now, we'll just update the local state
    const newEvent = {
      id: `event-${events.length + 1}`,
      ...eventData
    };
    
    setEvents([...events, newEvent]);
  };
  
  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!property) {
    return <div className="not-found">Property not found</div>;
  }
  
  return (
    <div className="property-detail-page">
      <div className="property-header">
        <div className="property-info">
          <h1>{property.name}</h1>
          <p className="property-address">{property.address}</p>
          <div className="property-meta">
            <span>{property.type}</span>
            <span>{property.bedrooms} Bedrooms</span>
            <span>{property.bathrooms} Bathrooms</span>
            <span>{property.square_feet} sq ft</span>
          </div>
        </div>
        <div className="property-actions">
          <button className="btn btn-outline">Edit Property</button>
          <button className="btn btn-primary">Settings</button>
        </div>
      </div>
      
      <div className="property-tabs">
        <button 
          className={`tab-button ${activeTab === 'thermostats' ? 'active' : ''}`}
          onClick={() => setActiveTab('thermostats')}
        >
          Thermostats
        </button>
        <button 
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button 
          className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>
      
      <div className="property-content">
        {activeTab === 'thermostats' && (
          <div className="thermostats-tab">
            <div className="tab-header">
              <h2>Thermostats</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddThermostatModal(true)}
              >
                Add Thermostat
              </button>
            </div>
            
            {thermostats.length === 0 ? (
              <div className="no-data">
                <p>No thermostats found for this property.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddThermostatModal(true)}
                >
                  Add Your First Thermostat
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
        )}
        
        {activeTab === 'calendar' && (
          <div className="calendar-tab">
            <div className="tab-header">
              <h2>Calendar</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCalendarSyncModal(true)}
              >
                Sync Calendar
              </button>
            </div>
            
            <CalendarView 
              events={events}
              onEventAdd={handleEventAdd}
            />
          </div>
        )}
        
        {activeTab === 'statistics' && (
          <div className="statistics-tab">
            <div className="tab-header">
              <h2>Statistics</h2>
              <div className="date-range-selector">
                <select defaultValue="30">
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
              </div>
            </div>
            
            <div className="statistics-widgets">
              <StatisticsWidget 
                title="Energy Usage"
                value="540"
                unit="kWh"
                icon="fas fa-bolt"
                change={{ value: 12, isPositive: false }}
                color="primary"
              />
              <StatisticsWidget 
                title="Total Cost"
                value="$124.50"
                icon="fas fa-dollar-sign"
                change={{ value: 8, isPositive: false }}
                color="danger"
              />
              <StatisticsWidget 
                title="Savings"
                value="$45.20"
                icon="fas fa-piggy-bank"
                change={{ value: 15, isPositive: true }}
                color="success"
              />
              <StatisticsWidget 
                title="Avg. Temperature"
                value="72.5"
                unit="°F"
                icon="fas fa-thermometer-half"
                color="warning"
              />
            </div>
            
            <div className="statistics-charts">
              <StatisticsChart 
                statistics={statistics}
                chartType="line"
                dataType="energy"
              />
            </div>
          </div>
        )}
      </div>
      
      {showAddThermostatModal && (
        <AddThermostatModal 
          propertyId={propertyId || ''}
          onAdd={handleAddThermostat}
          onClose={() => setShowAddThermostatModal(false)}
        />
      )}
      
      {showCalendarSyncModal && (
        <CalendarSyncModal 
          propertyId={propertyId || ''}
          onSync={handleCalendarSync}
          onClose={() => setShowCalendarSyncModal(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;
