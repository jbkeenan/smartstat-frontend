import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import TestModeToggle from './TestModeToggle';

const EnhancedLandingPage: React.FC = () => {
  const [calculatorValues, setCalculatorValues] = useState({
    properties: 3,
    hvacCost: 120,
    vacancyDays: 10
  });
  
  const [calculatorResults, setCalculatorResults] = useState({
    monthlySavings: 108,
    annualSavings: 1296,
    roi: 430
  });
  
  const handleCalculatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCalculatorValues({
      ...calculatorValues,
      [name]: parseInt(value)
    });
  };
  
  const calculateSavings = () => {
    const { properties, hvacCost, vacancyDays } = calculatorValues;
    const dailyCost = hvacCost / 30;
    const savingsRate = 0.3; // 30% savings on average
    
    const monthlySavings = Math.round(properties * dailyCost * vacancyDays * savingsRate);
    const annualSavings = monthlySavings * 12;
    const annualCost = 299; // Annual subscription cost
    const roi = Math.round((annualSavings / annualCost) * 100);
    
    setCalculatorResults({
      monthlySavings,
      annualSavings,
      roi
    });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Smart Thermostat Automation System</h1>
            <h2 className="hero-subtitle">Save Money. Save Energy. Automate Everything.</h2>
            <p className="hero-description">
              The ultimate solution for property managers and Airbnb hosts to automate temperature control
              across all your properties, synchronized with your booking calendar.
            </p>
            <div className="hero-cta">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
              <Link to="/register" className="btn btn-secondary">Create Account</Link>
            </div>
            <div className="test-mode-container">
              <TestModeToggle />
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/images/hero-thermostat.png" alt="Smart Thermostat Dashboard" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">Why Property Managers Choose Us</h2>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-money-saving"></i>
              </div>
              <h3>Reduce Energy Costs</h3>
              <p>Save $20-50 per month per property by eliminating wasted heating and cooling between guest stays.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-calendar"></i>
              </div>
              <h3>Calendar Integration</h3>
              <p>Automatically adjust temperatures based on your booking calendar. No more manual adjustments.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-multi-brand"></i>
              </div>
              <h3>Works With All Brands</h3>
              <p>Control Nest, Ecobee, Honeywell, and more from a single dashboard. No more juggling multiple apps.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="icon-eco"></i>
              </div>
              <h3>Eco-Friendly</h3>
              <p>Reduce your carbon footprint while advertising your properties as energy-efficient and sustainable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Integration Section */}
      <section className="brand-integration">
        <div className="container">
          <h2 className="section-title">One System for All Your Thermostats</h2>
          <p className="section-subtitle">Our platform works with all major smart thermostat brands</p>
          
          <div className="brand-showcase">
            <img src="/assets/images/multi-brand-devices.png" alt="Multiple thermostat brands integration" className="brand-image" />
          </div>
          
          <p className="brand-note">New brands are continuously added through our modular backend system - no frontend changes required.</p>
        </div>
      </section>

      {/* Calendar Integration Section */}
      <section className="calendar-integration">
        <div className="container">
          <div className="split-content">
            <div className="content-text">
              <h2 className="section-title">Seamless Calendar Integration</h2>
              <p>Connect directly to your booking platforms and automatically adjust temperatures based on guest schedules.</p>
              <ul className="feature-list">
                <li>Sync with Airbnb, VRBO, Booking.com and more</li>
                <li>Automatically warm or cool properties before guests arrive</li>
                <li>Save energy immediately after checkout</li>
                <li>Set custom buffer times for optimal comfort and savings</li>
              </ul>
            </div>
            <div className="content-image">
              <img src="/assets/images/calendar-integration.png" alt="Calendar integration with smart thermostats" />
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="roi-calculator" id="calculator">
        <div className="container">
          <div className="roi-content">
            <h2 className="section-title">See Your Savings</h2>
            <p>Our system typically pays for itself within the first month for properties with 2-3 listings.</p>
            
            <div className="calculator">
              <div className="calculator-form">
                <div className="form-group">
                  <label>Number of Properties</label>
                  <input 
                    type="number" 
                    name="properties"
                    min="1" 
                    value={calculatorValues.properties}
                    onChange={handleCalculatorChange}
                  />
                </div>
                <div className="form-group">
                  <label>Average Monthly HVAC Cost ($)</label>
                  <input 
                    type="number" 
                    name="hvacCost"
                    min="0" 
                    value={calculatorValues.hvacCost}
                    onChange={handleCalculatorChange}
                  />
                </div>
                <div className="form-group">
                  <label>Average Vacancy Days/Month</label>
                  <input 
                    type="number" 
                    name="vacancyDays"
                    min="0" 
                    value={calculatorValues.vacancyDays}
                    onChange={handleCalculatorChange}
                  />
                </div>
                <button className="btn btn-primary" onClick={calculateSavings}>Calculate Savings</button>
              </div>
              
              <div className="calculator-results">
                <div className="result-item">
                  <span className="result-label">Monthly Savings:</span>
                  <span className="result-value">${calculatorResults.monthlySavings}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Annual Savings:</span>
                  <span className="result-value">${calculatorResults.annualSavings}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">ROI:</span>
                  <span className="result-value">{calculatorResults.roi}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Visualization Section */}
      <section className="savings-visualization">
        <div className="container">
          <h2 className="section-title">Real Energy Cost Savings</h2>
          <p className="section-subtitle">See how our customers are saving on their energy bills</p>
          
          <div className="savings-image">
            <img src="/assets/images/savings-graph.png" alt="Energy cost savings graph" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Connect Your Thermostats</h3>
              <p>Easily integrate your existing smart thermostats, regardless of brand.</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Link Your Booking Calendar</h3>
              <p>Sync with Google Calendar, Airbnb, VRBO, or any iCal feed.</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Set Your Preferences</h3>
              <p>Define comfort temperatures for guests and energy-saving temperatures for vacant periods.</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Sit Back & Save</h3>
              <p>Our system handles everything automatically, saving you time, energy, and money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="dashboard-preview">
        <div className="container">
          <h2 className="section-title">Powerful Management Dashboard</h2>
          <p className="section-subtitle">Monitor and control all your properties from one intuitive interface</p>
          
          <div className="dashboard-image">
            <img src="/assets/images/dashboard-mockup.png" alt="Smart Thermostat Dashboard" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          
          <div className="testimonial-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"I manage 12 properties and was spending hours each week adjusting thermostats. This system has saved me countless hours and reduced my utility bills by over 30%."</p>
              </div>
              <div className="testimonial-author">
                <img src="/assets/images/testimonial-1.jpg" alt="Sarah K." />
                <div>
                  <h4>Sarah K.</h4>
                  <p>Property Manager, Phoenix</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"The calendar integration is flawless. Temperatures adjust automatically before guests arrive and after they leave. My guests are comfortable and I'm saving money."</p>
              </div>
              <div className="testimonial-author">
                <img src="/assets/images/testimonial-2.jpg" alt="Michael T." />
                <div>
                  <h4>Michael T.</h4>
                  <p>Airbnb Host, Miami</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"I was skeptical at first, but the system paid for itself in the first month. Now I'm saving over $500 a month across my 15 properties."</p>
              </div>
              <div className="testimonial-author">
                <img src="/assets/images/testimonial-3.jpg" alt="Jennifer L." />
                <div>
                  <h4>Jennifer L.</h4>
                  <p>Vacation Rental Owner, Denver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Saving?</h2>
          <p>Join thousands of property managers who are saving time, money, and energy with our Smart Thermostat Automation System.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <Link to="/faq" className="btn btn-secondary">View FAQ</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>Smart Thermostat</h3>
              <p>Automation System</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><Link to="#features">Features</Link></li>
                  <li><Link to="#how-it-works">How It Works</Link></li>
                  <li><Link to="#calculator">Savings Calculator</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/security">Security</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Smart Thermostat Automation System. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="icon-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="icon-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="icon-linkedin"></i></a>
              <a href="#" aria-label="Instagram"><i className="icon-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;
