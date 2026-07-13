import React, { useState } from 'react';
import SEO from '../components/SEO';
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
      <SEO 
        title="Contact Us | AIVA Enterprises"
        description="Get in touch with the AIVA Enterprises sales and support team. We supply premium fruit pulps and IQF fruits to global markets."
        canonicalUrl="/contact"
      />
      
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
          {/* Info Side */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>We operate globally with a strong presence in premium food markets. Reach out to us directly or fill out the form.</p>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="icon-wrapper">
                  <i className="ph ph-envelope-simple"></i>
                </div>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:sales@aivaenterprises.com">sales@aivaenterprises.com</a>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper">
                  <i className="ph ph-phone"></i>
                </div>
                <div>
                  <h3>Phone</h3>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper">
                  <i className="ph ph-map-pin"></i>
                </div>
                <div>
                  <h3>Headquarters</h3>
                  <p>AIVA Enterprises<br/>Industrial Area, Phase 1<br/>Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
            
            <div className="business-hours">
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)<br/>Saturday - Sunday: Closed</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="contact-form-wrapper">
            {isSubmitted ? (
              <div className="success-message">
                <i className="ph ph-check-circle text-gold"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. One of our representatives will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send us a message</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    placeholder="john@company.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company Name</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Ltd."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  ></textarea>
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
