import React from 'react';
import './StatisticsWidget.scss';

interface StatisticsWidgetProps {
  title: string;
  value: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  trendLabel: string;
}

const StatisticsWidget: React.FC<StatisticsWidgetProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendLabel
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'efficiency':
        return <i className="fas fa-bolt"></i>;
      case 'savings':
        return <i className="fas fa-dollar-sign"></i>;
      default:
        return <i className="fas fa-chart-line"></i>;
    }
  };

  const renderTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <i className="fas fa-arrow-up trend-up"></i>;
      case 'down':
        return <i className="fas fa-arrow-down trend-down"></i>;
      case 'stable':
        return <i className="fas fa-equals trend-stable"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="statistics-widget">
      <div className="widget-icon">{renderIcon()}</div>
      <div className="widget-content">
        <h3>{title}</h3>
        <div className="widget-value">{value}</div>
        <div className={`widget-trend trend-${trend}`}>
          {renderTrendIcon()}
          <span className="trend-value">{trendValue}</span>
          <span className="trend-label">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsWidget;
