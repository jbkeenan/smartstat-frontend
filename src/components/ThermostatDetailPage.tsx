import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { thermostatsApi, Thermostat } from '../lib/api';
import AppLayout from './AppLayout';

export default function ThermostatDetailPage({ thermostatId }: { thermostatId: number }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thermostat, setThermostat] = useState<Thermostat | null>(null);
  const [targetTemperature, setTargetTemperature] = useState<number | null>(null);
  const [isCooling, setIsCooling] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchThermostatDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch thermostat details
        const response = await thermostatsApi.getById(token, thermostatId);
        setThermostat(response.thermostat);
        
        // Initialize target temperature from current temperature if available
        if (response.thermostat.last_temperature) {
          setTargetTemperature(response.thermostat.last_temperature);
        }
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch thermostat details:', err);
        setError(err.message || 'Failed to load thermostat details');
        setIsLoading(false);
      }
    };

    fetchThermostatDetails();
  }, [token, thermostatId]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTargetTemperature(value);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCooling(e.target.value === 'cooling');
  };

  const handleSetTemperature = async () => {
    if (!token || !thermostat || targetTemperature === null) return;
    
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      setError(null);
      
      await thermostatsApi.setTemperature(token, thermostat.id, targetTemperature, isCooling);
      
      // Refresh thermostat data
      const response = await thermostatsApi.getById(token, thermostatId);
      setThermostat(response.thermostat);
      
      setUpdateSuccess(true);
      setIsUpdating(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to set temperature:', err);
      setError(err.message || 'Failed to set temperature');
      setIsUpdating(false);
    }
  };

  const handlePowerToggle = async (power: 'on' | 'off') => {
    if (!token || !thermostat) return;
    
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      setError(null);
      
      await thermostatsApi.setPower(token, thermostat.id, power);
      
      // Refresh thermostat data
      const response = await thermostatsApi.getById(token, thermostatId);
      setThermostat(response.thermostat);
      
      setUpdateSuccess(true);
      setIsUpdating(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error(`Failed to turn ${power} thermostat:`, err);
      setError(err.message || `Failed to turn ${power} thermostat`);
      setIsUpdating(false);
    }
  };

  const handleDeleteThermostat = async () => {
    if (!token || !thermostat) return;
    
    if (window.confirm(`Are you sure you want to delete ${thermostat.name}? This action cannot be undone.`)) {
      try {
        await thermostatsApi.delete(token, thermostat.id);
        window.location.href = '/thermostats';
      } catch (err: any) {
        console.error('Failed to delete thermostat:', err);
        setError(err.message || 'Failed to delete thermostat');
      }
    }
  };

  return (
    <AppLayout>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <a
                  href="/thermostats"
                  className="text-sm font-medium text-red-800 hover:text-red-700"
                >
                  Back to Thermostats
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : thermostat ? (
        <>
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {thermostat.name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Type: {thermostat.type}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    thermostat.is_online 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {thermostat.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <a
                href={`/thermostats/${thermostat.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Edit
              </a>
              <button
                type="button"
                onClick={handleDeleteThermostat}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>

          {updateSuccess && (
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
                    Thermostat updated successfully
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Thermostat Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about this thermostat.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{thermostat.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{thermostat.type}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Device ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{thermostat.device_id}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Current Temperature</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {thermostat.last_temperature ? `${thermostat.last_temperature}°F` : 'Not available'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {thermostat.last_updated 
                      ? new Date(thermostat.last_updated).toLocaleString() 
                      : 'Never'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      thermostat.is_online 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {thermostat.is_online ? 'Online' : 'Offline'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Thermostat Control</h3>
              <div className="mt-5">
                <div className="rounded-md bg-gray-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">Power</span>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => handlePowerToggle('on')}
                            disabled={isUpdating}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              thermostat.is_online
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50`}
                          >
                            On
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePowerToggle('off')}
                            disabled={isUpdating}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              !thermostat.is_online
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50`}
                          >
                            Off
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                    Mode
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          id="cooling"
                          name="mode"
                          type="radio"
                          value="cooling"
                          checked={isCooling}
                          onChange={handleModeChange}
                          disabled={isUpdating || !thermostat.is_online}
                          className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300"
                        />
                        <label htmlFor="cooling" className="ml-2 block text-sm text-gray-700">
                          Cooling
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="heating"
                          name="mode"
                          type="radio"
                          value="heating"
                          checked={!isCooling}
                          onChange={handleModeChange}
                          disabled={isUpdating || !thermostat.is_online}
                          className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                        />
                        <label htmlFor="heating" className="ml-2 block text-sm text-gray-700">
                          Heating
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                    Temperature (°F)
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      type="range"
                      id="temperature"
                      name="temperature"
                      min="60"
                      max="90"
                      step="1"
                      value={targetTemperature || 72}
                      onChange={handleTemperatureChange}
                      disabled={isUpdating || !thermostat.is_online}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-4 text-lg font-medium text-gray-900 w-12">
                      {targetTemperature !== null ? targetTemperature : '--'}°F
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSetTemperature}
                    disabled={isUpdating || !thermostat.is_online || targetTemperature === null}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                  >
                    {isUpdating ? 'Setting Temperature...' : 'Set Temperature'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Automation Schedules</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Configure automated temperature adjustments based on bookings.</p>
              </div>
              <div className="mt-5">
                <a
                  href={`/schedules/new?thermostat_id=${thermostat.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Schedule
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Thermostat not found</p>
          <div className="mt-6">
            <a
              href="/thermostats"
              className="text-sm font-medium text-sky-600 hover:text-sky-500"
            >
              Back to Thermostats
            </a>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
