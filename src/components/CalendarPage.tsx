import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AppLayout from './AppLayout';

// Calendar component for integrating with external calendar sources
export default function CalendarPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  
  useEffect(() => {
    // This would fetch calendar data from the backend
    setIsLoading(false);
  }, [token]);

  return (
    <AppLayout>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Calendar Integration
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <a
            href="/calendars/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Add Calendar
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No calendars</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a calendar source to enable automated temperature control based on bookings.
              </p>
              <div className="mt-6">
                <a
                  href="/calendars/new"
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
                  Add Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">How Calendar Integration Works</h3>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-base font-medium text-gray-900">Supported Calendar Sources</h4>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Google Calendar</li>
                  <li>iCal URL (Airbnb, VRBO, etc.)</li>
                  <li>Booking.com</li>
                  <li>Manual entry</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900">Automation Features</h4>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Automatic temperature adjustment before check-in</li>
                  <li>Energy-saving mode during vacant periods</li>
                  <li>Custom schedules for different booking types</li>
                  <li>Manual override options</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-900">Setup Process</h4>
              <ol className="mt-2 text-sm text-gray-500 list-decimal pl-5 space-y-2">
                <li>Add a calendar source for your property</li>
                <li>Configure synchronization settings</li>
                <li>Create automation schedules for your thermostats</li>
                <li>The system will automatically adjust temperatures based on bookings</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
