import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { thermostatsApi, Thermostat } from '../lib/api';
import AppLayout from './AppLayout';

export default function SchedulesPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thermostats, setThermostats] = useState<Thermostat[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchThermostats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await thermostatsApi.getAll(token);
        setThermostats(response.thermostats);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch thermostats:', err);
        setError(err.message || 'Failed to load thermostats');
        setIsLoading(false);
      }
    };

    fetchThermostats();
  }, [token]);

  return (
    <AppLayout>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Automation Schedules
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <a
            href="/schedules/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Create Schedule
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

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {thermostats.length > 0 ? (
              <div className="space-y-6">
                {thermostats.map((thermostat) => (
                  <div key={thermostat.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-medium text-gray-900">{thermostat.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {thermostat.type} - {thermostat.is_online ? 'Online' : 'Offline'}
                    </p>
                    
                    <div className="mt-4">
                      <a
                        href={`/schedules/new?thermostat_id=${thermostat.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                        Add Schedule
                      </a>
                    </div>
                    
                    <div className="mt-4 text-center py-8">
                      <p className="text-sm text-gray-500">No schedules configured for this thermostat.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No thermostats found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add thermostats to your properties before creating automation schedules.
                </p>
                <div className="mt-6">
                  <a
                    href="/thermostats/new"
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
                    Add Thermostat
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">How Automation Works</h3>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-base font-medium text-gray-900">Schedule Types</h4>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Booking-based (adjusts based on check-in/check-out)</li>
                  <li>Time-based (follows specific time patterns)</li>
                  <li>Occupancy-based (uses sensors if available)</li>
                  <li>Manual override options</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900">Energy Saving Features</h4>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Eco mode during vacant periods</li>
                  <li>Pre-heating/cooling before guest arrival</li>
                  <li>Temperature limits to prevent extreme settings</li>
                  <li>Usage reports and optimization suggestions</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-900">Setup Process</h4>
              <ol className="mt-2 text-sm text-gray-500 list-decimal pl-5 space-y-2">
                <li>Select a thermostat to automate</li>
                <li>Choose schedule type (booking-based or time-based)</li>
                <li>Configure temperature settings for different states</li>
                <li>Set any additional rules or conditions</li>
                <li>Save and activate the schedule</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
