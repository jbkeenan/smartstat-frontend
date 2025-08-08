import React from 'react';
import './CTASection.css';

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Ready to Transform Your Property Management?</h2>
        <p>
          Join thousands of property managers who are saving time, energy, and money with 
          Smart Thermostat. Get started today and see the difference in your first month.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
          Start Your Free Trial
        </button>
        <p className="cta-note">No credit card required. 30-day free trial.</p>
      </div>
    </section>
  );
};

export default CTASection;
