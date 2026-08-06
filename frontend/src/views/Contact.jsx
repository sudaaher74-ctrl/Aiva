"use client";

import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 5000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-container">
          <div className="hero-content">
            <span className="eyebrow">Get in touch</span>
            <h1>Let's build a <span className="text-gold">partnership</span></h1>
            <p className="hero-subtitle">
              Whether you need product specifications, bulk pricing, or a reliable supply chain partner, our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        <div className="contact-container">
          {/* Form Side */}
          <div className="contact-form-wrapper">
            {isSubmitted ? (
              <div className="success-message">
                <i className="ph ph-check-circle text-gold"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. One of our representatives will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="luxury-form" onSubmit={handleSubmit}>
                <h2 className="form-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Send us a message</h2>
                
                <div className="form-group">
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder=" "
                  />
                  <label htmlFor="name">Full Name</label>
                </div>

                <div className="form-group">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    placeholder=" "
                  />
                  <label htmlFor="email">Email Address</label>
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={formData.company}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="company">Company Name</label>
                </div>

                <div className="form-group">
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  ></textarea>
                  <label htmlFor="message">Message</label>
                </div>

                <button type="submit" className="submit-btn">
                  Submit Inquiry <i className="ph ph-paper-plane-right"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
