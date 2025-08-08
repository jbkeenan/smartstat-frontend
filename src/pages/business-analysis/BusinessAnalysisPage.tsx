import React, { useState, useEffect } from 'react';
import { businessAnalysisApi } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

// Define more specific types for the data
type DailyUsageData = { date: string; usage: number };
type WeeklyUsageData = { week: string; usage: number };
type MonthlyUsageData = { month: string; usage: number };

type DailySavingsData = { date: string; savings: number };
type WeeklySavingsData = { week: string; savings: number };
type MonthlySavingsData = { month: string; savings: number };

interface AnalyticsData {
  energy_usage: {
    daily: DailyUsageData[];
    weekly: WeeklyUsageData[];
    monthly: MonthlyUsageData[];
  };
  cost_savings: {
    daily: DailySavingsData[];
    weekly: WeeklySavingsData[];
    monthly: MonthlySavingsData[];
  };
  occupancy_patterns: {
    weekday_avg: Array<{ hour: number; occupancy_rate: number }>;
    weekend_avg: Array<{ hour: number; occupancy_rate: number }>;
  };
  temperature_efficiency: {
    property_comparison: Array<{ property_name: string; efficiency_score: number }>;
  };
}

const BusinessAnalysisPage: React.FC = () => {
  const { isTestMode } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [analysisType, setAnalysisType] = useState<'energy' | 'savings' | 'occupancy' | 'efficiency'>('energy');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await businessAnalysisApi.getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const renderEnergyUsageChart = () => {
    if (!analyticsData) return null;
    
    let data: DailyUsageData[] | WeeklyUsageData[] | MonthlyUsageData[];
    
    if (timeRange === 'daily') {
      data = analyticsData.energy_usage.daily;
    } else if (timeRange === 'weekly') {
      data = analyticsData.energy_usage.weekly;
    } else {
      data = analyticsData.energy_usage.monthly;
    }
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Energy Usage</h3>
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeRange === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeRange === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
          {data.map((item, index) => {
            // Type-safe way to get the label based on timeRange
            const label = timeRange === 'daily' 
              ? (item as DailyUsageData).date 
              : timeRange === 'weekly' 
                ? (item as WeeklyUsageData).week 
                : (item as MonthlyUsageData).month;
                
            const height = `${(item.usage / Math.max(...data.map(d => d.usage))) * 100}%`;
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ height: '100%' }}>
                <div className="flex-grow w-full flex items-end">
                  <div 
                    className="w-12 bg-blue-500 rounded-t"
                    style={{ height }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>This chart shows energy usage over time. Lower values indicate better energy efficiency.</p>
        </div>
      </div>
    );
  };

  const renderCostSavingsChart = () => {
    if (!analyticsData) return null;
    
    let data: DailySavingsData[] | WeeklySavingsData[] | MonthlySavingsData[];
    
    if (timeRange === 'daily') {
      data = analyticsData.cost_savings.daily;
    } else if (timeRange === 'weekly') {
      data = analyticsData.cost_savings.weekly;
    } else {
      data = analyticsData.cost_savings.monthly;
    }
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Cost Savings</h3>
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeRange === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeRange === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
          {data.map((item, index) => {
            // Type-safe way to get the label based on timeRange
            const label = timeRange === 'daily' 
              ? (item as DailySavingsData).date 
              : timeRange === 'weekly' 
                ? (item as WeeklySavingsData).week 
                : (item as MonthlySavingsData).month;
                
            const height = `${(item.savings / Math.max(...data.map(d => d.savings))) * 100}%`;
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ height: '100%' }}>
                <div className="flex-grow w-full flex items-end">
                  <div 
                    className="w-12 bg-green-500 rounded-t"
                    style={{ height }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>This chart shows cost savings over time. Higher values indicate more money saved.</p>
        </div>
      </div>
    );
  };

  const renderOccupancyPatterns = () => {
    if (!analyticsData) return null;
    
    const weekdayData = analyticsData.occupancy_patterns.weekday_avg;
    const weekendData = analyticsData.occupancy_patterns.weekend_avg;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Occupancy Patterns</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Weekday Average</h4>
            <div className="h-48 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
              {weekdayData.filter((_, i) => i % 2 === 0).map((item, index) => {
                const height = `${item.occupancy_rate * 100}%`;
                
                return (
                  <div key={index} className="flex flex-col items-center" style={{ height: '100%' }}>
                    <div className="flex-grow w-full flex items-end">
                      <div 
                        className="w-6 bg-blue-400 rounded-t"
                        style={{ height }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {item.hour}:00
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Weekend Average</h4>
            <div className="h-48 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
              {weekendData.filter((_, i) => i % 2 === 0).map((item, index) => {
                const height = `${item.occupancy_rate * 100}%`;
                
                return (
                  <div key={index} className="flex flex-col items-center" style={{ height: '100%' }}>
                    <div className="flex-grow w-full flex items-end">
                      <div 
                        className="w-6 bg-purple-400 rounded-t"
                        style={{ height }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {item.hour}:00
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>These charts show average occupancy patterns throughout the day. Higher values indicate more occupancy.</p>
        </div>
      </div>
    );
  };

  const renderTemperatureEfficiency = () => {
    if (!analyticsData) return null;
    
    const data = analyticsData.temperature_efficiency.property_comparison;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Temperature Efficiency by Property</h3>
        
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-1/3 text-sm font-medium text-gray-700 truncate">
                {item.property_name}
              </div>
              <div className="w-2/3 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${item.efficiency_score * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">
                  {Math.round(item.efficiency_score * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>This chart shows temperature efficiency scores by property. Higher percentages indicate better efficiency.</p>
        </div>
      </div>
    );
  };

  if (isLoading && !analyticsData) {
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
          <p>You are viewing simulated data. No actual analytics data is being retrieved.</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Analysis</h2>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap">
            <button
              onClick={() => setAnalysisType('energy')}
              className={`px-4 py-2 m-1 rounded-md ${
                analysisType === 'energy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Energy Usage
            </button>
            <button
              onClick={() => setAnalysisType('savings')}
              className={`px-4 py-2 m-1 rounded-md ${
                analysisType === 'savings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cost Savings
            </button>
            <button
              onClick={() => setAnalysisType('occupancy')}
              className={`px-4 py-2 m-1 rounded-md ${
                analysisType === 'occupancy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Occupancy Patterns
            </button>
            <button
              onClick={() => setAnalysisType('efficiency')}
              className={`px-4 py-2 m-1 rounded-md ${
                analysisType === 'efficiency'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Temperature Efficiency
            </button>
          </div>
        </div>
      </div>
      
      <div>
        {analysisType === 'energy' && renderEnergyUsageChart()}
        {analysisType === 'savings' && renderCostSavingsChart()}
        {analysisType === 'occupancy' && renderOccupancyPatterns()}
        {analysisType === 'efficiency' && renderTemperatureEfficiency()}
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Summary Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-700 font-medium">Energy Efficiency</p>
            <p className="text-gray-600">Your properties are operating at 82% energy efficiency, which is 15% better than the industry average.</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-gray-700 font-medium">Cost Savings</p>
            <p className="text-gray-600">Smart scheduling has saved approximately {formatCurrency(1250)} in the last quarter.</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="text-gray-700 font-medium">Occupancy Optimization</p>
            <p className="text-gray-600">Thermostats are adjusting to occupancy patterns with 94% accuracy.</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <p className="text-gray-700 font-medium">Improvement Opportunities</p>
            <p className="text-gray-600">Adjusting weekend schedules could improve efficiency by an additional 7%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalysisPage;
