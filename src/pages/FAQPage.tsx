import React from 'react';
import './FAQPage.css';

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What is Smart Thermostat?",
      answer: "Smart Thermostat is a comprehensive property management system that allows you to control and monitor thermostats across multiple properties. It provides features like temperature control, scheduling, usage statistics, and integration with popular thermostat brands including Google/Nest, Cielo, and Pioneer."
    },
    {
      question: "Which thermostat brands are supported?",
      answer: "We currently support Google/Nest, Cielo, and Pioneer thermostats. Our modular architecture allows us to easily add support for additional brands in the future."
    },
    {
      question: "How do I connect my Cielo thermostat?",
      answer: "Cielo thermostats can be connected using IFTTT (If This Then That) integration. Our system will guide you through creating the necessary IFTTT applets to connect your Cielo account. Alternatively, if you have API credentials, you can use direct API integration."
    },
    {
      question: "How do I connect my Google/Nest thermostat?",
      answer: "Google/Nest thermostats are connected using Google's Smart Device Management API. You'll need to authorize our application to access your Nest devices through your Google account."
    },
    {
      question: "Can I control multiple properties with different thermostats?",
      answer: "Yes! Smart Thermostat is designed to manage multiple properties, each with its own set of thermostats. You can organize thermostats by property and control them individually or as groups."
    },
    {
      question: "How does the calendar feature work?",
      answer: "Each property has its own calendar where you can schedule events like bookings, maintenance, and cleaning. You can also sync with external calendars like Google Calendar, iCalendar, or vacation rental platforms like Airbnb and VRBO."
    },
    {
      question: "What kind of statistics are available?",
      answer: "We provide detailed statistics on energy usage, costs, savings, and temperature patterns. You can view this data in various chart formats and time periods (daily, weekly, monthly, yearly)."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Our web application is fully responsive and works on all devices including smartphones and tablets. A dedicated mobile app is currently in development."
    },
    {
      question: "How secure is my thermostat data?",
      answer: "We take security seriously. All communications with thermostat APIs are encrypted, and we never store your thermostat credentials directly. For integrations like IFTTT, we only store the necessary webhook keys, not your account passwords."
    },
    {
      question: "What happens if my internet connection goes down?",
      answer: "Your thermostats will continue to operate based on their last settings. Once your connection is restored, our system will automatically reconnect and synchronize with your devices."
    }
  ];

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about the Smart Thermostat system</p>
      </div>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="faq-contact">
        <h2>Still have questions?</h2>
        <p>Contact our support team for assistance with any other questions you may have.</p>
        <button className="btn btn-primary">Contact Support</button>
      </div>
    </div>
  );
};

export default FAQPage;
