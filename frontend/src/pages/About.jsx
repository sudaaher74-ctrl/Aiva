import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
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
            <span className="eyebrow">About AIVA Enterprises</span>
            <h1>Sourcing the world's finest, with <span className="italic-gold">integrity.</span></h1>
            <p>
              AIVA Enterprises is a global sourcing and supply company delivering premium aseptic fruit pulps, concentrates, IQF fruits & vegetables, and frozen foods — built on quality, reliability, and transparency.
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
            <div className="premium-stamp">
              <span>Premium Sourcing • Global Export •</span>
            </div>
            <img src="/assets/images/products/coverimgaboutus.png" alt="Premium Mango Pulp" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">25+</div>
            <div className="stat-label">Countries Served</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Premium Commodities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Tons Shipped Annually</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Quality Guarantee</div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="story-section" id="story">
        <div className="story-heading">
          <span className="eyebrow">Our Story</span>
          <h2>From a food technologist's vision to a global partner.</h2>
          <div className="founder-badge">
            <div className="founder-initials">AI</div>
            <div className="founder-info">
              <h4>Aishwarya Ingale</h4>
              <p>Founder, AIVA Enterprises</p>
            </div>
          </div>
        </div>
        <div className="story-content">
          <p>
            AIVA Enterprises was founded by Aishwarya Ingale, whose journey began with a Bachelor's degree in Food Technology in India and later took her to the United States to pursue a Master's in Entrepreneurial Leadership at Babson College. During her time abroad, she gained a global perspective on food quality, sourcing, and consumer expectations — inspiring her to build a company that bridges the best of global agriculture with international markets.
          </p>
          <p>
            With a food technologist's eye for quality, Aishwarya carefully partners with manufacturers who uphold the highest standards of processing, hygiene, and consistency.
          </p>
          <blockquote className="pull-quote">
            "Bring the finest products each region has to offer to the world — while proudly showcasing India's exceptional agricultural capabilities."
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
            To build a transparent and responsible food supply chain by connecting trusted manufacturers with businesses through fair sourcing, uncompromising quality, and honest partnerships. We minimize unnecessary intermediaries, support ethical sourcing, and deliver products that create lasting value for everyone — from the people who grow them to the businesses that rely on them.
          </p>
        </div>
        <div className="mv-card">
          <div className="mv-number">02</div>
          <div className="mv-icon"><i className="ph ph-eye"></i></div>
          <h3>Vision</h3>
          <p>
            To redefine food sourcing by creating a future where quality is never compromised, transparency is the standard, and every stakeholder across the supply chain is treated with fairness and respect. We envision a world where exceptional food ingredients move across borders with integrity — benefiting farmers, manufacturers, businesses, and consumers alike.
          </p>
        </div>
      </section>

      {/* Our Promise */}
      <section className="promise-section">
        <div className="promise-container">
          <div className="promise-content">
            <span className="eyebrow">Our Promise</span>
            <h2>Why choose AIVA</h2>
            <p>
              AIVA Enterprises was founded on one simple belief  quality should never be compromised. As a Food Technologist with international exposure, founder Aishwarya Ingale understands the importance of safe, consistent, high-quality food ingredients. That is why we partner only with trusted manufacturers who share our commitment to excellence, ethical sourcing, and uncompromising quality.
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
              <p>We work only with vetted, certified manufacturers.</p>
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
      <section className="quality-section">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>Quality Commitment</span>
        <h2>Certified at every standard that matters</h2>
        <p>
          Our product range is supported by globally recognized certifications and compliance standards — giving our customers the confidence to choose AIVA with trust.
        </p>

        <div className="cert-grid">
          {[
            { name: 'FSSAI', img: 'FSSAI.png' },
            { name: 'APEDA', img: 'APEDA' },
            { name: 'BRCGS', img: 'BRCGS' },
            { name: 'FSSC 22000', img: 'FSSC 22000' },
            { name: 'ISO 22000', img: 'ISO_22000.png' },
            { name: 'ISO 14001', img: 'ISO_14001.png' },
            { name: 'GLOBALG.A.P.', img: 'GLOBAL G.A.P.' },
            { name: 'Halal', img: 'Halal.png' },
            { name: 'Kosher', img: 'Kosher.png' },
            { name: 'SGF', img: 'SGF' },
            { name: 'AQA', img: 'AQA.png' }
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
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Our Reach</span>
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
