import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function BulkInquiry() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    interest: '',
    qty: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.massive-render').forEach((img) => {
        gsap.to(img, {
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: 50,
          ease: 'none',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
      const payload = {
        name: formData.name || 'N/A',
        company: formData.company || formData.name || 'N/A',
        country: formData.country || 'N/A',
        phone: 'N/A',
        email: formData.email,
        product: formData.interest || 'General Inquiry',
        quantity: formData.qty || 'N/A',
        message: formData.message,
      };

      const API_BASE = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === ''
      )
          ? 'http://localhost:5001/api'
          : '/api';

      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        btn.innerHTML = 'Quote Requested!';
        btn.style.background = '#10b981';
        setFormData({
          name: '',
          company: '',
          country: '',
          email: '',
          interest: '',
          qty: '',
          message: '',
        });
      } else {
        btn.innerHTML = 'Error - Try Again';
        btn.style.background = '#EF4444';
      }
    } catch (error) {
      btn.innerHTML = 'Error - Try Again';
      btn.style.background = '#EF4444';
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  };

  return (
    <section className="inquiry-section section-padding" id="contact" ref={sectionRef}>
      <div className="container split-layout align-center">
        <div className="split-left inquiry-img">
          <img
            src="/assets/images/products/pulp/kesarmangopulpdrum.webp"
            alt="Export Drum"
            className="float-y massive-render"
          />
          <div className="glow-orb"></div>
        </div>
        <div className="split-right">
          <div className="glass-form-container">
            <h2 className="form-title">Bulk Export Inquiry</h2>
            <form className="luxury-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group w-50">
                  <input type="text" id="name" placeholder=" " required value={formData.name} onChange={handleChange} />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className="form-group w-50">
                  <input
                    type="text"
                    id="company"
                    placeholder=" "
                    required
                    value={formData.company}
                    onChange={handleChange}
                  />
                  <label htmlFor="company">Company</label>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group w-50">
                  <input
                    type="text"
                    id="country"
                    placeholder=" "
                    required
                    value={formData.country}
                    onChange={handleChange}
                  />
                  <label htmlFor="country">Country</label>
                </div>
                <div className="form-group w-50">
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
              </div>
              <div className="form-group">
                <select id="interest" required value={formData.interest} onChange={handleChange}>
                  <option value="" disabled>
                    Product Interest
                  </option>
                  <option value="aseptic">Aseptic pulp/paste</option>
                  <option value="iqf-fruits">IQF fruits</option>
                  <option value="iqf-frozen">Frozen</option>
                  <option value="vegetables">IQF Vegetables</option>
                  <option value="tomato">Tomato Paste</option>
                </select>
              </div>
              <div className="form-group">
                <input type="text" id="qty" placeholder=" " required value={formData.qty} onChange={handleChange} />
                <label htmlFor="qty">Quantity Requirement (e.g., 20 MT)</label>
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  placeholder=" "
                  rows="3"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="message">Additional Message</label>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Request Export Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BulkInquiry;
