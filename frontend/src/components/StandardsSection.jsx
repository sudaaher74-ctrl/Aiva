import React from 'react';

function StandardsSection() {
  return (
    <section className="standards-section section-padding">
      <div className="container">
        <div className="standards-header text-center">
          <span className="standards-subtitle">THE AIVA STANDARD</span>
          <h2 className="standards-title">Export Quality, Certified</h2>
        </div>

        <div className="standards-grid">
          <div className="standard-card">
            <div className="standard-icon">
              <i className="ph ph-plant"></i>
            </div>
            <h3>Farm Fresh Sourcing</h3>
            <p>Direct partnerships with certified farmers ensuring the highest quality raw materials.</p>
          </div>

          <div className="standard-card">
            <div className="standard-icon">
              <i className="ph ph-shield-check"></i>
            </div>
            <h3>Aseptic Processing</h3>
            <p>State-of-the-art sterilization techniques that lock in freshness without preservatives.</p>
          </div>

          <div className="standard-card">
            <div className="standard-icon">
              <i className="ph ph-globe"></i>
            </div>
            <h3>Global Compliance</h3>
            <p>Strict adherence to FDA, ISO, HACCP, and international food safety regulations.</p>
          </div>

          <div className="standard-card">
            <div className="standard-icon">
              <i className="ph ph-package"></i>
            </div>
            <h3>Bulk International Shipping</h3>
            <p>Secure logistics and custom packaging sizes from drums to bag-in-box.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StandardsSection;
