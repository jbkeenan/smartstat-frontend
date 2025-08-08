import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { calendarsApi, propertiesApi, Property, Calendar } from '../lib/api';
import AppLayout from './AppLayout';

export default function CalendarFormPage({ calendarId }: { calendarId?: number }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [calendarType, setCalendarType] = useState<'GOOGLE' | 'ICAL' | 'BOOKING' | 'MANUAL'>('GOOGLE');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [syncFrequency, setSyncFrequency] = useState<'HOURLY' | 'DAILY' | 'MANUAL'>('HOURLY');
  const [credentials, setCredentials] = useState('');

  const isEditMode = !!calendarId;
  const pageTitle = isEditMode ? 'Edit Calendar' : 'Add Calendar';

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
      
      const calendarData: Omit<Calendar, 'id'> = {
        name,
        type: calendarType,
        url: calendarUrl,
        property_id: selectedPropertyId,
        sync_frequency: syncFrequency,
        credentials: credentials || undefined
      };
      
      if (isEditMode && calendarId) {
        await calendarsApi.update(token, calendarId, calendarData);
      } else {
        await calendarsApi.create(token, calendarData);
      }
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect after successful submission
      setTimeout(() => {
        window.location.href = selectedPropertyId 
          ? `/properties/${selectedPropertyId}` 
          : '/calendars';
      }, 2000);
    } catch (err: any) {
      console.error('Failed to save calendar:', err);
      setError(err.message || 'Failed to save calendar');
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
            href={selectedPropertyId ? `/properties/${selectedPropertyId}` : '/calendars'}
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
                Calendar saved successfully! Redirecting...
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
                  Calendar Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Airbnb Bookings"
                  className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Calendar Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={calendarType}
                  onChange={(e) => setCalendarType(e.target.value as 'GOOGLE' | 'ICAL' | 'BOOKING' | 'MANUAL')}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="GOOGLE">Google Calendar</option>
                  <option value="ICAL">iCal URL</option>
                  <option value="BOOKING">Booking.com</option>
                  <option value="MANUAL">Manual Entry</option>
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Calendar URL
                </label>
                <input
                  type="text"
                  name="url"
                  id="url"
                  value={calendarUrl}
                  onChange={(e) => setCalendarUrl(e.target.value)}
                  required={calendarType === 'ICAL'}
                  placeholder={calendarType === 'ICAL' ? 'https://www.airbnb.com/calendar/ical/12345.ics' : 'Optional'}
                  className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="sync-frequency" className="block text-sm font-medium text-gray-700">
                  Sync Frequency
                </label>
                <select
                  id="sync-frequency"
                  name="sync-frequency"
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value as 'HOURLY' | 'DAILY' | 'MANUAL')}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="MANUAL">Manual Only</option>
                </select>
              </div>

              {calendarType === 'GOOGLE' && (
                <div className="col-span-6">
                  <label htmlFor="credentials" className="block text-sm font-medium text-gray-700">
                    Google Calendar Credentials (JSON)
                  </label>
                  <textarea
                    id="credentials"
                    name="credentials"
                    rows={4}
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    required={calendarType === 'GOOGLE'}
                    placeholder="Paste your Google Calendar API credentials JSON here"
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
                {isLoading ? 'Saving...' : 'Save Calendar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
