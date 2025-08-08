import React, { useState } from 'react';
import './CalendarSyncModal.css';

interface CalendarSyncModalProps {
  propertyId: string;
  onSync: (syncData: any) => void;
  onClose: () => void;
}

const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({ propertyId, onSync, onClose }) => {
  const [formData, setFormData] = useState({
    calendar_type: 'google',
    calendar_id: '',
    sync_direction: 'both',
    include_bookings: true,
    include_maintenance: true,
    include_cleaning: true
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.calendar_id.trim()) {
      newErrors.calendar_id = 'Calendar ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSync({
        property_id: propertyId,
        ...formData
      });
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Sync Calendar</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="calendar_type">Calendar Type</label>
            <select
              id="calendar_type"
              name="calendar_type"
              value={formData.calendar_type}
              onChange={handleChange}
            >
              <option value="google">Google Calendar</option>
              <option value="ical">iCalendar</option>
              <option value="outlook">Outlook</option>
              <option value="airbnb">Airbnb</option>
              <option value="vrbo">VRBO</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="calendar_id">Calendar ID / URL</label>
            <input
              type="text"
              id="calendar_id"
              name="calendar_id"
              value={formData.calendar_id}
              onChange={handleChange}
              className={errors.calendar_id ? 'error' : ''}
              placeholder={formData.calendar_type === 'google' ? 
                'example@gmail.com' : 
                'https://calendar.example.com/ical/12345.ics'}
            />
            {errors.calendar_id && <div className="error-message">{errors.calendar_id}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="sync_direction">Sync Direction</label>
            <select
              id="sync_direction"
              name="sync_direction"
              value={formData.sync_direction}
              onChange={handleChange}
            >
              <option value="both">Two-way (Import and Export)</option>
              <option value="import">Import Only</option>
              <option value="export">Export Only</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Event Types to Sync</label>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="include_bookings"
                  name="include_bookings"
                  checked={formData.include_bookings}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="include_bookings">Bookings</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="include_maintenance"
                  name="include_maintenance"
                  checked={formData.include_maintenance}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="include_maintenance">Maintenance</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="include_cleaning"
                  name="include_cleaning"
                  checked={formData.include_cleaning}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="include_cleaning">Cleaning</label>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Sync Calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarSyncModal;
