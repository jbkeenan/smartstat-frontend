import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import CalendarView from '../../components/calendar/CalendarView';
import CalendarSyncModal from '../../components/calendar/CalendarSyncModal';

const CalendarsPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [calendar, setCalendar] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchCalendar(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propertyService.getProperties();
      setProperties(response.data);
      
      // Select the first property by default if available
      if (response.data.length > 0 && !selectedProperty) {
        setSelectedProperty(response.data[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendar = async (propertyId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propertyService.getCalendar(propertyId);
      setCalendar(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProperty(e.target.value);
  };

  const handleEventAdd = async (eventData: any) => {
    if (!selectedProperty) return;
    
    try {
      await propertyService.addCalendarEvent(selectedProperty, eventData);
      fetchCalendar(selectedProperty); // Refresh calendar
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add event');
    }
  };

  const handleEventUpdate = async (eventId: string, eventData: any) => {
    if (!selectedProperty) return;
    
    try {
      await propertyService.updateCalendarEvent(selectedProperty, eventId, eventData);
      fetchCalendar(selectedProperty); // Refresh calendar
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update event');
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (!selectedProperty) return;
    
    try {
      await propertyService.deleteCalendarEvent(selectedProperty, eventId);
      fetchCalendar(selectedProperty); // Refresh calendar
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete event');
    }
  };

  const handleCalendarSync = async (syncData: any) => {
    if (!selectedProperty) return;
    
    try {
      await propertyService.syncCalendar(selectedProperty, syncData);
      setShowSyncModal(false);
      fetchCalendar(selectedProperty); // Refresh calendar
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sync calendar');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1>Calendars</h1>
            <div className="header-actions">
              <select 
                value={selectedProperty || ''} 
                onChange={handlePropertyChange}
                disabled={loading || properties.length === 0}
              >
                {properties.length === 0 ? (
                  <option value="">No properties available</option>
                ) : (
                  properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))
                )}
              </select>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowSyncModal(true)}
                disabled={!selectedProperty}
              >
                Sync Calendar
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading calendar...</p>
            </div>
          ) : !selectedProperty ? (
            <div className="empty-state">
              <h3>No property selected</h3>
              <p>Please select a property to view its calendar</p>
            </div>
          ) : (
            <CalendarView
              calendar={calendar}
              onEventAdd={handleEventAdd}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
            />
          )}
        </main>
      </div>

      {showSyncModal && selectedProperty && (
        <CalendarSyncModal
          propertyId={selectedProperty}
          onSync={handleCalendarSync}
          onClose={() => setShowSyncModal(false)}
        />
      )}
    </div>
  );
};

export default CalendarsPage;
