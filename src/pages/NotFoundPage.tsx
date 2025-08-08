import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
