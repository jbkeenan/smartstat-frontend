import React from 'react';
import './TestimonialSection.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  image: string;
  quote: string;
}

const TestimonialSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Property Manager",
      company: "Urban Rentals LLC",
      image: "/images/testimonials/sarah.jpg",
      quote: "Smart Thermostat has revolutionized how we manage climate control across our 15 properties. The energy savings alone paid for the system within the first year!"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Vacation Rental Owner",
      image: "/images/testimonials/michael.jpg",
      quote: "Being able to integrate with my existing Nest thermostats was seamless. I love how I can set schedules based on my Airbnb bookings calendar."
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Facilities Director",
      company: "Westside Commercial Properties",
      image: "/images/testimonials/priya.jpg",
      quote: "The analytics and reporting features have helped us identify and fix inefficiencies in our HVAC systems. Our tenants are happier and our energy bills are lower."
    }
  ];

  return (
    <section className="testimonial-section">
      <h2>What Our Customers Say</h2>
      <div className="testimonial-container">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-image">
              <img src={testimonial.image} alt={testimonial.name} />
            </div>
            <div className="testimonial-content">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
