import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import TestimonialSection from '../components/landing/TestimonialSection';
import CTASection from '../components/landing/CTASection';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/login');
  };
  
  return (
    <div className="landing-page">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeatureSection />
      <TestimonialSection />
      <CTASection onGetStarted={handleGetStarted} />
    </div>
  );
};

export default LandingPage;
