import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <div className="about-page">
      <SEO
        title="About Us | Premium Fruit Pulp Manufacturer"
        description="Learn about AIVA Enterprises, our history, our state-of-the-art facilities, and our commitment to premium global exports of fruit pulps and IQF fruits."
        canonicalUrl="/about"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.aivaenterprises.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About Us",
                "item": "https://www.aivaenterprises.com/about"
              }
            ]
          }
        ]}
      />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-content">

            <h1>Sourcing the world's finest, with integrity.</h1>
            <p>
              AIVA Enterprises is a global sourcing and supply company delivering premium aseptic fruit pulps, concentrates, IQF  and  Blast frozen fruits & vegetables, built on quality, reliability, and transparency.
            </p>
            <div className="hero-buttons">
              <Link to="#story" className="btn-gold" onClick={(e) => {
                e.preventDefault();
                document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
              }}>Our Story <i className="ph ph-arrow-right"></i></Link>
              <Link to="/contact" className="btn-outline-dark">Partner With Us</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div
              className="image-composition"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src="/assets/images/totapuriabout.png"
                alt="Totapuri Drum"
                loading="lazy"
                className="hero-image floating-slow"
                style={{
                  width: '80%',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: 'rotate(-5deg) translateY(10px)',
                  zIndex: 2,
                }}
              />
              <img
                src="/assets/images/tomatoabout.png"
                alt="Tomato Drum"
                loading="lazy"
                className="hero-image floating-slow"
                style={{
                  width: '70%',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: 'rotate(8deg) translateY(-15px)',
                  zIndex: 1,
                  marginLeft: '-25%',
                  animationDelay: '1.5s',
                }}
              />
            </div>
          </div>
        </div>
      </section>


      {/* Our Story */}
      <section className="story-section" id="story">
        <div className="story-heading">
          <span className="eyebrow">Our Story</span>
          <h2>From a food technologist's vision to a global partner.</h2>
          <div className="founder-badge-wrapper">
            <div className="founder-badge-inner">
              <div className="founder-badge-front">
                <div className="founder-badge">
                  <div className="founder-initials">AI</div>
                  <div className="founder-info">
                    <h4>Aishwarya Ingale</h4>
                    <p>Founder, AIVA Enterprises</p>
                  </div>
                </div>
              </div>
              <div className="founder-badge-back">
                <a href="#" className="founder-social"><i className="ph ph-linkedin-logo"></i></a>
                <a href="#" className="founder-social"><i className="ph ph-whatsapp-logo"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="story-content">
          <p>
            AIVA Enterprises was founded by Aishwarya Ingale, whose journey began with a Bachelor's degree in Food Technology in India and later took her to the United States to pursue a Master's in Entrepreneurial Leadership at Babson College. During her time abroad, she gained a global perspective on food quality, sourcing, and consumer expectations which inspired her to build a company that bridges the best of global agriculture with international markets.
          </p>

          <blockquote className="pull-quote">
            "To bring the finest products each region has to offer to the world while proudly showcasing India's exceptional agricultural capabilities."
          </blockquote>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mv-card">
          <div className="mv-number">01</div>
          <div className="mv-icon"><i className="ph ph-target"></i></div>
          <h3>Mission</h3>
          <p>
            To build a transparent and responsible food supply chain by connecting trusted manufacturers with businesses through fair sourcing, uncompromising quality, and honest partnerships. We minimize unnecessary intermediaries, support ethical sourcing, and deliver products that create lasting value for everyone from the people who grow them to the businesses that rely on them.
          </p>
        </div>
        <div className="mv-card">
          <div className="mv-number">02</div>
          <div className="mv-icon"><i className="ph ph-eye"></i></div>
          <h3>Vision</h3>
          <p>
            To redefine food sourcing by creating a future where quality is never compromised, transparency is the standard, and every stakeholder across the supply chain is treated with fairness and respect. We envision a world where exceptional food ingredients move across borders with integrity  benefiting farmers, manufacturers, businesses, and consumers alike.
          </p>
        </div>
      </section>

      {/* Our Promise */}
      <section className="promise-section">
        <div className="promise-container">
          <div className="promise-content">

            <h2>Why choose AIVA</h2>
            <p>
              AIVA Enterprises was founded on one simple belief  quality should never be compromised. As a Food Technologist with international exposure, founder Aishwarya Ingale understands the importance of safe, consistent, high quality food ingredients. That is why we partner only with trusted people who share our commitment to excellence, ethical sourcing, and uncompromising quality.
            </p>
          </div>
          <div className="promise-features">
            <div className="feature-box">
              <i className="ph ph-shield-check f-icon"></i>
              <h4>Uncompromising Quality</h4>
              <p>Every product meets the highest safety standards.</p>
            </div>
            <div className="feature-box">
              <i className="ph ph-handshake f-icon"></i>
              <h4>Trusted Partners</h4>
              <p>We work only with vetted, certified partners.</p>
            </div>
            <div className="feature-box">
              <i className="ph ph-leaf f-icon"></i>
              <h4>Ethical Sourcing</h4>
              <p>Fair, responsible sourcing across the chain.</p>
            </div>
            <div className="feature-box">
              <i className="ph ph-magnifying-glass f-icon"></i>
              <h4>Full Transparency</h4>
              <p>Honest partnerships, clear communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="quality-section" id="certifications">

        <h2>Certified at every standard that matters</h2>
        <p>
          Our product range is supported by globally recognized certifications and compliance standards,giving our customers the confidence to choose AIVA with trust.
        </p>

        <div className="cert-grid">
          {[
            { name: 'FSSAI', img: 'FSSAI.png' },
            { name: 'APEDA', img: 'apeda.png' },
            { name: 'BRCGS', img: 'BRCGS.png' },
            { name: 'FSSC 22000', img: 'FSSC.png' },
            { name: 'ISO 22000', img: 'ISO22000.png' },
            { name: 'ISO 14001', img: 'iso14001.png' },
            { name: 'GLOBALG.A.P.', img: 'global gap.png' },
            { name: 'Halal', img: 'halal_cert.png' },
            { name: 'Kosher', img: 'kosher_cert.png' },
            { name: 'SGF', img: 'sgf.png' },
            { name: 'AQA', img: 'aqa_cert.png' }
          ].map((cert, index) => {
            const isLocal = cert.img.endsWith('.png') || cert.img.endsWith('.svg');
            const imgSrc = isLocal
              ? `/assets/images/certs/${cert.img}`
              : `https://ui-avatars.com/api/?name=${cert.name}&background=fff&color=d4af37&size=128&bold=true&font-size=0.33`;
            return (
              <div key={index} className="cert-item">
                <div className="cert-circle">
                  <img src={imgSrc} alt={`${cert.name} Certification`} className="cert-logo" />
                </div>
                <span>{cert.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="industries-section">
        <div className="industries-header">

          <h2>Industries we serve</h2>
          <p style={{ color: '#a0a0a0', marginTop: '16px' }}>AIVA proudly supplies premium processed food ingredients across a wide range of industries and applications.</p>
        </div>

        <div className="industries-grid">
          {[
            { name: "Food & Beverage Manufacturing", icon: "ph-factory" },
            { name: "Dairy & Ice Cream", icon: "ph-ice-cream" },
            { name: "Bakery & Confectionery", icon: "ph-cookie" },
            { name: "Sauces & Condiments", icon: "ph-drop" },
            { name: "Ready-to-Eat Foods", icon: "ph-cooking-pot" },
            { name: "Foodservice", icon: "ph-fork-knife" },
            { name: "Retail", icon: "ph-storefront" },
            { name: "Hospitality", icon: "ph-bed" }
          ].map((industry, index) => (
            <div key={index} className="industry-card">
              <i className={`ph ${industry.icon}`}></i>
              <span>{industry.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="partner-cta">
        <div className="partner-cta-card">
          <h2>Partner with us</h2>
          <p>Looking for a reliable supply chain partner for premium food ingredients? Let's discuss how AIVA can elevate your business.</p>
          <Link to="/contact" className="btn-gold">Contact Sales Team <i className="ph ph-arrow-right"></i></Link>
        </div>
      </section>
    </div>
  );
};

export default About;
