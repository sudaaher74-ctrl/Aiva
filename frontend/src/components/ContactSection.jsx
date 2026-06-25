import React, { useState } from 'react';

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    try {
      const API_BASE =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === ''
          ? 'http://localhost:5001/api'
          : '/api';

      const payload = {
        name: formData.name,
        company: formData.name, // The form asks for Company Name
        email: formData.email,
        product: formData.interest, // Map interest to product
        message: formData.message
      };

      const response = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        btn.innerHTML = 'Request Sent Successfully';
        btn.style.background = '#10B981';
        setFormData({ name: '', email: '', interest: '', message: '' });
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      btn.innerHTML = 'Error. Try Again.';
      btn.style.background = '#EF4444';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  };

  return (
    <section className="contact section-padding dark-section" id="contact">
      <div className="container split-layout">
        <div className="split-left contact-info">
          <h2 className="section-title text-light">Let's Talk Business</h2>
          <p className="section-desc text-light-dim">
            Partner with AIVA Enterprises for premium products. Request a quote or sample today.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <i className="ph ph-envelope-simple"></i>
              <div>
                <p className="label">Email Us</p>
                <a href="mailto:Enquire@aivaenterprises.com">Enquire@aivaenterprises.com</a>
              </div>
            </div>
            <div className="contact-item">
              <i className="ph ph-phone"></i>
              <div>
                <p className="label">Call/WhatsApp</p>
                <a href="#"></a>
              </div>
            </div>
            <div className="contact-item">
              <i className="ph ph-map-pin"></i>
              <div>
                <p className="label">Headquarters</p>
                <p>Lakhani Centrium, 4th Floor, Sec 15, CBD Belapur, New Mumbai 400614</p>
              </div>
            </div>
          </div>
        </div>

        <div className="split-right">
          <form className="luxury-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder=" "
                required
                value={formData.name}
                onChange={handleChange}
              />
              <label htmlFor="name">Company Name</label>
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                required
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="email">Work Email</label>
            </div>
            <div className="form-group">
              <select id="interest" required value={formData.interest} onChange={handleChange}>
                <option value="" disabled>
                  Select Product of Interest
                </option>
                <option value="mango">Mango Pulp (Alphonso / Totapuri)</option>
                <option value="guava">Pink Guava Pulp</option>
                <option value="tomato">Tomato Paste</option>
                <option value="other">Other Products</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                id="message"
                placeholder=" "
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <label htmlFor="message">Your Requirements (Volume, Specs)</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
