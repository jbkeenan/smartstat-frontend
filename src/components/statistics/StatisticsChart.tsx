import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import './StatisticsChart.scss';

interface StatisticsChartProps {
  title: string;
  data: number[];
  timeRange: 'week' | 'month' | 'year';
  type: 'line' | 'bar';
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ title, data, timeRange, type }) => {
  const getLabels = () => {
    switch (timeRange) {
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month':
        return Array.from({ length: 30 }, (_, i) => (i + 1).toString());
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return [];
    }
  };

  const chartData = {
    labels: getLabels(),
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: 'rgba(30, 136, 229, 0.2)',
        borderColor: 'rgba(30, 136, 229, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(30, 136, 229, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(30, 136, 229, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="statistics-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default StatisticsChart;
