import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { thermostatsApi, propertiesApi, Property, Thermostat } from '../lib/api';
import AppLayout from './AppLayout';

export default function ThermostatFormPage({ thermostatId }: { thermostatId?: number }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [thermostatType, setThermostatType] = useState<'NEST' | 'CIELO' | 'PIONEER'>('NEST');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const isEditMode = !!thermostatId;
  const pageTitle = isEditMode ? 'Edit Thermostat' : 'Add Thermostat';

  useEffect(() => {
    if (!token) return;

    const fetchProperties = async () => {
      try {
        const response = await propertiesApi.getAll(token);
        setProperties(response.properties);
        
        if (response.properties.length > 0 && !selectedPropertyId) {
          setSelectedPropertyId(response.properties[0].id);
        }
      } catch (err: any) {
        console.error('Failed to fetch properties:', err);
        setError(err.message || 'Failed to load properties');
      }
    };

    fetchProperties();
  }, [token, selectedPropertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !selectedPropertyId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const thermostatData: Omit<Thermostat, 'id' | 'is_online' | 'last_temperature' | 'last_updated'> = {
        name,
        device_id: deviceId,
        type: thermostatType,
        property_id: selectedPropertyId,
        api_key: apiKey || undefined,
        ip_address: ipAddress || undefined
      };
      
      if (isEditMode && thermostatId) {
        await thermostatsApi.update(token, thermostatId, thermostatData);
      } else {
        await thermostatsApi.create(token, thermostatData);
      }
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect after successful submission
      setTimeout(() => {
        window.location.href = selectedPropertyId 
          ? `/properties/${selectedPropertyId}` 
          : '/thermostats';
      }, 2000);
    } catch (err: any) {
      console.error('Failed to save thermostat:', err);
      setError(err.message || 'Failed to save thermostat');
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
            href={selectedPropertyId ? `/properties/${selectedPropertyId}` : '/thermostats'}
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
                Thermostat saved successfully! Redirecting...
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
                <label htmlFor="property" className="block text-sm font-medium text-gray-700">
                  Property
                </label>
                <select
                  id="property"
                  name="property"
                  value={selectedPropertyId || ''}
                  onChange={(e) => setSelectedPropertyId(parseInt(e.target.value))}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Thermostat Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Living Room Thermostat"
                  className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="device-id" className="block text-sm font-medium text-gray-700">
                  Device ID
                </label>
                <input
                  type="text"
                  name="device-id"
                  id="device-id"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  required
                  placeholder="e.g. NEST123456 or MAC address"
                  className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Thermostat Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={thermostatType}
                  onChange={(e) => setThermostatType(e.target.value as 'NEST' | 'CIELO' | 'PIONEER')}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="NEST">Nest</option>
                  <option value="CIELO">Cielo</option>
                  <option value="PIONEER">Pioneer</option>
                </select>
              </div>

              {thermostatType === 'NEST' && (
                <div className="col-span-6">
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="text"
                    name="api-key"
                    id="api-key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required={thermostatType === 'NEST'}
                    placeholder="Your Nest API key"
                    className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}

              {(thermostatType === 'CIELO' || thermostatType === 'PIONEER') && (
                <div className="col-span-6">
                  <label htmlFor="ip-address" className="block text-sm font-medium text-gray-700">
                    IP Address
                  </label>
                  <input
                    type="text"
                    name="ip-address"
                    id="ip-address"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    required={thermostatType === 'CIELO' || thermostatType === 'PIONEER'}
                    placeholder="e.g. 192.168.1.100"
                    className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Thermostat'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
