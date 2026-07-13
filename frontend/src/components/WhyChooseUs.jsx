import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function WhyChooseUs() {
  const sectionRef = useRef(null);

  useGSAP(() => {
      gsap.fromTo(
        '.feature-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.feature-grid',
            start: 'top 85%',
          },
        }
      );
  }, { scope: sectionRef });

  return (
    <section className="quality section-padding" id="quality" ref={sectionRef}>
      <div className="container">
        <div className="section-header text-center">
          <h4 className="section-subtitle">The AIVA Standard</h4>
          <h2 className="section-title">Export Quality, Certified</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="ph ph-plant"></i>
            </div>
            <h3>Farm Fresh Sourcing</h3>
            <p>Direct partnerships with farmers ensuring the highest quality raw materials.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="ph ph-shield-check"></i>
            </div>
            <h3>Aseptic Processing</h3>
            <p>State-of-the-art sterilization techniques that lock in freshness without preservatives.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="ph ph-globe-hemisphere-west"></i>
            </div>
            <h3>Global Compliance</h3>
            <p>Strict adherence to FSSAI, APEDA, BRC, FSSC 22000, ISO 22000, ISO 14001, GLOBALG.A.P., Halal, Kosher, SGF, and AQA.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
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

export default WhyChooseUs;
