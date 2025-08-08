import React, { useState, useEffect } from 'react';
import { schedulesApi } from '../../lib/api';
import type { Schedule } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import ErrorHandler from '../../components/shared/ErrorHandler';

const SchedulesPage: React.FC = () => {
  const { isTestMode } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedThermostatId, setSelectedThermostatId] = useState<string | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    thermostat_id: '',
    start_time: '08:00',
    end_time: '17:00',
    target_temperature: 72,
    days_active: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    is_active: true
  });
  
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a thermostat filter in the URL
    const params = new URLSearchParams(location.search);
    const thermostatId = params.get('thermostat');
    if (thermostatId) {
      setSelectedThermostatId(thermostatId);
      fetchSchedules(thermostatId);
    } else {
      fetchSchedules();
    }
  }, [location.search]);

  const fetchSchedules = async (thermostatId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = thermostatId 
        ? await schedulesApi.getByThermostat(thermostatId)
        : await schedulesApi.getAll();
      setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err : new Error('Failed to load schedules'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setNewSchedule(prev => {
      const currentDays = [...prev.days_active];
      if (currentDays.includes(day)) {
        return { ...prev, days_active: currentDays.filter(d => d !== day) };
      } else {
        return { ...prev, days_active: [...currentDays, day] };
      }
    });
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // If we have a selected thermostat, use that
      const scheduleData = {
        ...newSchedule,
        thermostat_id: selectedThermostatId || newSchedule.thermostat_id,
        target_temperature: Number(newSchedule.target_temperature)
      };
      
      const addedSchedule = await schedulesApi.create(scheduleData);
      setSchedules(prev => [...prev, addedSchedule]);
      setNewSchedule({
        name: '',
        thermostat_id: '',
        start_time: '08:00',
        end_time: '17:00',
        target_temperature: 72,
        days_active: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        is_active: true
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to add schedule'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await schedulesApi.delete(id);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete schedule'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSchedule = await schedulesApi.toggleActive(id, isActive);
      setSchedules(prev => 
        prev.map(schedule => 
          schedule.id === id ? updatedSchedule : schedule
        )
      );
    } catch (err) {
      console.error('Error updating schedule:', err);
      setError(err instanceof Error ? err : new Error('Failed to update schedule'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 0) return 'No days selected';
    
    const dayMap: {[key: string]: string} = {
      'monday': 'Mon',
      'tuesday': 'Tue',
      'wednesday': 'Wed',
      'thursday': 'Thu',
      'friday': 'Fri',
      'saturday': 'Sat',
      'sunday': 'Sun'
    };
    
    return days.map(day => dayMap[day]).join(', ');
  };

  if (isLoading && schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {isTestMode && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Test Mode Active</p>
          <p>You are viewing simulated data. No actual schedule data is being modified.</p>
        </div>
      )}
      
      <ErrorHandler error={error} onRetry={() => fetchSchedules(selectedThermostatId || undefined)} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedThermostatId ? 'Thermostat Schedules' : 'All Schedules'}
        </h2>
        <div className="flex space-x-2">
          {selectedThermostatId && (
            <button
              onClick={() => {
                setSelectedThermostatId(null);
                fetchSchedules();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View All Schedules
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showAddForm ? 'Cancel' : 'Add Schedule'}
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Schedule</h3>
          <form onSubmit={handleAddSchedule}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newSchedule.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Workday, Weekend, Night"
                />
              </div>
              
              {!selectedThermostatId && (
                <div>
                  <label htmlFor="thermostat_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Thermostat ID
                  </label>
                  <input
                    type="text"
                    id="thermostat_id"
                    name="thermostat_id"
                    value={newSchedule.thermostat_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={newSchedule.start_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={newSchedule.end_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="target_temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Temperature (°F)
                </label>
                <input
                  type="number"
                  id="target_temperature"
                  name="target_temperature"
                  value={newSchedule.target_temperature}
                  onChange={handleInputChange}
                  required
                  min="50"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Days
              </label>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newSchedule.days_active.includes(day)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? 'Adding...' : 'Add Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No schedules found. Add your first schedule to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map(schedule => (
            <div key={schedule.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{schedule.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                    </p>
                    <p className="text-gray-500 text-xs">{formatDays(schedule.days_active)}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${schedule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {schedule.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Target Temperature</p>
                    <p className="text-2xl font-semibold text-gray-700">{schedule.target_temperature}°F</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handleToggleActive(schedule.id, !schedule.is_active)}
                    className={`px-3 py-1 rounded ${
                      schedule.is_active
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {schedule.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;
