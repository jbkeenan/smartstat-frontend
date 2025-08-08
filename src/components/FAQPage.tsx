import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: "How does the Smart Thermostat Automation System work?",
      answer: "Our system connects to your existing smart thermostats (regardless of brand) and integrates with your booking calendar. It automatically adjusts temperatures based on guest check-in and check-out times, ensuring comfort during stays and energy savings during vacant periods. The system requires no hardware installation—just connect your existing thermostats through our secure platform."
    },
    {
      question: "Which thermostat brands are supported?",
      answer: "We support all major smart thermostat brands including Nest, Ecobee, Honeywell, Emerson, Cielo, and many others. Our platform is designed with a modular architecture that allows us to easily add support for new brands as they become available."
    },
    {
      question: "How does the calendar integration work?",
      answer: "We integrate with all major booking platforms including Airbnb, VRBO, Booking.com, and any system that provides an iCal feed. The system automatically detects guest check-in and check-out times from your calendar and adjusts temperatures accordingly. You can also set buffer times before check-in to ensure the property is comfortable when guests arrive."
    },
    {
      question: "How much money can I expect to save?",
      answer: "Most property managers save between $20-50 per month per property, depending on local utility rates, property size, and climate. Properties in extreme climate zones typically see the highest savings. Our customers report an average ROI of 300-400% in the first year."
    },
    {
      question: "Is there a limit to how many properties I can manage?",
      answer: "No, our system is designed to scale with your business. Whether you manage 1 property or 1,000, our dashboard provides a centralized view of all your properties and thermostats. You can organize properties into groups for easier management."
    },
    {
      question: "What happens if my internet goes down?",
      answer: "Smart thermostats will continue to operate based on their last programmed settings even if internet connectivity is lost. Once connectivity is restored, our system will automatically sync and resume normal operations."
    },
    {
      question: "Can I override the automated settings?",
      answer: "Absolutely. While the system is designed to operate automatically, you have full control to manually override settings at any time through our dashboard. You can also set up custom rules and exceptions for specific properties or dates."
    },
    {
      question: "How secure is the system?",
      answer: "We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard authentication protocols and regular security audits to ensure your data and thermostat access remain secure."
    },
    {
      question: "Do I need to install any hardware?",
      answer: "No additional hardware is required. Our system works with your existing smart thermostats through their APIs. There's no need for additional hubs, controllers, or equipment."
    },
    {
      question: "How difficult is it to set up?",
      answer: "Setup is simple and typically takes less than 10 minutes per property. Just connect your thermostat accounts, link your booking calendar, and set your temperature preferences. Our step-by-step wizard guides you through the entire process."
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes, we offer mobile apps for both iOS and Android, allowing you to monitor and control your properties on the go. The mobile app provides the same functionality as our web dashboard."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 email support and live chat during business hours. Our knowledge base includes detailed guides and troubleshooting tips. Premium support plans with dedicated account managers are available for larger property management companies."
    }
  ];

  return (
    <div className="faq-page">
      <header className="faq-header">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about the Smart Thermostat Automation System</p>
        </div>
      </header>

      <section className="faq-content">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                </div>
                <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-cta">
        <div className="container">
          <h2>Still have questions?</h2>
          <p>Our team is here to help you get the most out of your Smart Thermostat Automation System.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Contact Support</Link>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
