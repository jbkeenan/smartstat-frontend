import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
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
          </div>
          <div className="hero-image">
            <img src="/assets/hero-dashboard.png" alt="Smart Thermostat Dashboard" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
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

      {/* ROI Calculator Section */}
      <section className="roi-calculator">
        <div className="container">
          <div className="roi-content">
            <h2 className="section-title">See Your Savings</h2>
            <p>Our system typically pays for itself within the first month for properties with 2-3 listings.</p>
            
            <div className="calculator">
              <div className="calculator-form">
                <div className="form-group">
                  <label>Number of Properties</label>
                  <input type="number" min="1" defaultValue="3" />
                </div>
                <div className="form-group">
                  <label>Average Monthly HVAC Cost ($)</label>
                  <input type="number" min="0" defaultValue="120" />
                </div>
                <div className="form-group">
                  <label>Average Vacancy Days/Month</label>
                  <input type="number" min="0" defaultValue="10" />
                </div>
                <button className="btn btn-primary">Calculate Savings</button>
              </div>
              
              <div className="calculator-results">
                <div className="result-item">
                  <span className="result-label">Monthly Savings:</span>
                  <span className="result-value">$108</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Annual Savings:</span>
                  <span className="result-value">$1,296</span>
                </div>
                <div className="result-item">
                  <span className="result-label">ROI:</span>
                  <span className="result-value">430%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
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

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          
          <div className="testimonial-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"I manage 12 properties and was spending hours each week adjusting thermostats. This system has saved me countless hours and reduced my utility bills by over 30%."</p>
              </div>
              <div className="testimonial-author">
                <img src="/assets/testimonial-1.jpg" alt="Sarah K." />
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
                <img src="/assets/testimonial-2.jpg" alt="Michael T." />
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
                <img src="/assets/testimonial-3.jpg" alt="Jennifer L." />
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
            <a href="#features" className="btn btn-secondary">Learn More</a>
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
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#blog">Blog</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#security">Security</a></li>
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

export default LandingPage;
