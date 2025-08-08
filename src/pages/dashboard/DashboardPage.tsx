import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

interface DashboardSummary {
  total_properties: number;
  total_thermostats: number;
  active_thermostats: number;
  energy_savings: {
    today: number;
    this_week: number;
    this_month: number;
  };
}

interface EnergyUsageData {
  period: string;
  usage: Array<{
    timestamp: string;
    value: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const { isTestMode } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  // We'll keep the state but not use it directly in the component for now
  const [, setEnergyUsage] = useState<EnergyUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryData, energyData] = await Promise.all([
          api.dashboard.getSummary(),
          api.dashboard.getEnergyUsage('week')
        ]);
        setSummary(summaryData);
        setEnergyUsage(energyData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      {isTestMode && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Test Mode Active</p>
          <p>You are viewing simulated data. No actual thermostat data is being displayed.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Properties</p>
              <p className="text-2xl font-semibold text-gray-700">{summary?.total_properties || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Thermostats</p>
              <p className="text-2xl font-semibold text-gray-700">{summary?.total_thermostats || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Active Thermostats</p>
              <p className="text-2xl font-semibold text-gray-700">{summary?.active_thermostats || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Energy Savings (Month)</p>
              <p className="text-2xl font-semibold text-gray-700">${summary?.energy_savings.this_month.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Energy Savings</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Today</p>
              <p className="text-xl font-semibold text-gray-700">${summary?.energy_savings.today.toFixed(2) || '0.00'}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">This Week</p>
              <p className="text-xl font-semibold text-gray-700">${summary?.energy_savings.this_week.toFixed(2) || '0.00'}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">This Month</p>
              <p className="text-xl font-semibold text-gray-700">${summary?.energy_savings.this_month.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="mt-6 h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Energy usage chart would appear here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Today, 10:30 AM</p>
              <p className="text-gray-700">Living Room thermostat temperature changed to 72°F</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Today, 8:15 AM</p>
              <p className="text-gray-700">Bedroom thermostat schedule activated</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Yesterday, 7:45 PM</p>
              <p className="text-gray-700">Kitchen thermostat went offline</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Yesterday, 3:20 PM</p>
              <p className="text-gray-700">New schedule created for Basement thermostat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
