import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { schedulesApi, thermostatsApi, Thermostat, Schedule } from '../lib/api';
import AppLayout from './AppLayout';

export default function ScheduleFormPage({ scheduleId, thermostatId }: { scheduleId?: number, thermostatId?: number }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [thermostats, setThermostats] = useState<Thermostat[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [scheduleType, setScheduleType] = useState<'BOOKING' | 'TIME' | 'OCCUPANCY'>('BOOKING');
  const [selectedThermostatId, setSelectedThermostatId] = useState<number | null>(thermostatId || null);
  const [occupiedTemp, setOccupiedTemp] = useState(72);
  const [unoccupiedTemp, setUnoccupiedTemp] = useState(65);
  const [preArrivalHours, setPreArrivalHours] = useState(2);
  const [isActive, setIsActive] = useState(true);

  const isEditMode = !!scheduleId;
  const pageTitle = isEditMode ? 'Edit Schedule' : 'Create Schedule';

  useEffect(() => {
    if (!token) return;

    const fetchThermostats = async () => {
      try {
        const response = await thermostatsApi.getAll(token);
        setThermostats(response.thermostats);
        
        if (response.thermostats.length > 0 && !selectedThermostatId) {
          setSelectedThermostatId(response.thermostats[0].id);
        }
      } catch (err: any) {
        console.error('Failed to fetch thermostats:', err);
        setError(err.message || 'Failed to load thermostats');
      }
    };

    fetchThermostats();
  }, [token, selectedThermostatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !selectedThermostatId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const scheduleData: Omit<Schedule, 'id'> = {
        name,
        type: scheduleType,
        thermostat_id: selectedThermostatId,
        occupied_temp: occupiedTemp,
        unoccupied_temp: unoccupiedTemp,
        pre_arrival_hours: preArrivalHours,
        is_active: isActive
      };
      
      if (isEditMode && scheduleId) {
        await schedulesApi.update(token, scheduleId, scheduleData);
      } else {
        await schedulesApi.create(token, scheduleData);
      }
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect after successful submission
      setTimeout(() => {
        window.location.href = '/schedules';
      }, 2000);
    } catch (err: any) {
      console.error('Failed to save schedule:', err);
      setError(err.message || 'Failed to save schedule');
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {pageTitle}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <a
            href="/schedules"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Cancel
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Schedule saved successfully! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="thermostat" className="block text-sm font-medium text-gray-700">
                  Thermostat
                </label>
                <select
                  id="thermostat"
                  name="thermostat"
                  value={selectedThermostatId || ''}
                  onChange={(e) => setSelectedThermostatId(parseInt(e.target.value))}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="">Select a thermostat</option>
                  {thermostats.map((thermostat) => (
                    <option key={thermostat.id} value={thermostat.id}>
                      {thermostat.name} ({thermostat.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Schedule Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Vacation Rental Schedule"
                  className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Schedule Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value as 'BOOKING' | 'TIME' | 'OCCUPANCY')}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="BOOKING">Booking-based</option>
                  <option value="TIME">Time-based</option>
                  <option value="OCCUPANCY">Occupancy-based</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="occupied-temp" className="block text-sm font-medium text-gray-700">
                  Occupied Temperature (°F)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="range"
                    id="occupied-temp"
                    name="occupied-temp"
                    min="60"
                    max="85"
                    step="1"
                    value={occupiedTemp}
                    onChange={(e) => setOccupiedTemp(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-900 w-12">
                    {occupiedTemp}°F
                  </span>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="unoccupied-temp" className="block text-sm font-medium text-gray-700">
                  Unoccupied Temperature (°F)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="range"
                    id="unoccupied-temp"
                    name="unoccupied-temp"
                    min="55"
                    max="80"
                    step="1"
                    value={unoccupiedTemp}
                    onChange={(e) => setUnoccupiedTemp(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-900 w-12">
                    {unoccupiedTemp}°F
                  </span>
                </div>
              </div>

              {scheduleType === 'BOOKING' && (
                <div className="col-span-6">
                  <label htmlFor="pre-arrival-hours" className="block text-sm font-medium text-gray-700">
                    Pre-arrival Hours (how many hours before check-in to start adjusting temperature)
                  </label>
                  <input
                    type="number"
                    name="pre-arrival-hours"
                    id="pre-arrival-hours"
                    min="0"
                    max="24"
                    value={preArrivalHours}
                    onChange={(e) => setPreArrivalHours(parseInt(e.target.value))}
                    required
                    className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}

              <div className="col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is-active"
                      name="is-active"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is-active" className="font-medium text-gray-700">
                      Active
                    </label>
                    <p className="text-gray-500">Enable this schedule to automatically control the thermostat.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
