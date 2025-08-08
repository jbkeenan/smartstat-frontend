import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import StatisticsWidget from '../../components/statistics/StatisticsWidget';
import { useAuth } from '../../contexts/AuthContext';
import { getStatistics } from '../../services/api';
import '../../styles/StatisticsPage.scss';

interface StatisticsData {
  energyUsage: number[];
  costSavings: number[];
  efficiency: number;
  comparison: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  forecast: {
    nextMonth: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const StatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const { isAuthenticated, isTestMode } = useAuth();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStatistics(timeRange);
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated || isTestMode) {
      fetchStatistics();
    }
  }, [isAuthenticated, isTestMode, timeRange]);

  return (
    <div className="statistics-page">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Energy Statistics</h1>
            <div className="time-range-selector">
              <button 
                className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button 
                className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
              <button 
                className={`btn ${timeRange === 'year' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeRange('year')}
              >
                Year
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading statistics...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : !statistics ? (
            <div className="empty-state">
              <h2>No statistics available</h2>
              <p>Start using your thermostats to generate usage statistics.</p>
            </div>
          ) : (
            <div className="statistics-content">
              <div className="statistics-widgets">
                <StatisticsWidget 
                  title="Energy Efficiency"
                  value={`${statistics.efficiency}%`}
                  icon="efficiency"
                  trend={statistics.comparison.change > 0 ? 'up' : 'down'}
                  trendValue={`${Math.abs(statistics.comparison.change)}%`}
                  trendLabel={statistics.comparison.change > 0 ? 'Increase' : 'Decrease'}
                />
                <StatisticsWidget 
                  title="Cost Savings"
                  value={`$${statistics.costSavings.reduce((a, b) => a + b, 0).toFixed(2)}`}
                  icon="savings"
                  trend={statistics.forecast.trend}
                  trendValue={`$${statistics.forecast.nextMonth.toFixed(2)}`}
                  trendLabel="Next Month"
                />
              </div>
              
              <div className="statistics-charts">
                <StatisticsChart 
                  title="Energy Usage"
                  data={statistics.energyUsage}
                  timeRange={timeRange}
                  type="line"
                />
                <StatisticsChart 
                  title="Cost Savings"
                  data={statistics.costSavings}
                  timeRange={timeRange}
                  type="bar"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
