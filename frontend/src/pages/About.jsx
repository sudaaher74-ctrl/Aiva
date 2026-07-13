import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

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

      {/* Hero Section / Our Story */}
      <section className="about-hero" style={{ 
        padding: '140px 20px 80px', 
        textAlign: 'center', 
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(17,17,17,0.9)), url("/assets/images/products/coverimgaboutus.png") center/cover no-repeat', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        <span className="eyebrow" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem', fontWeight: 'bold' }}>About Us</span>
        <h1 style={{ fontSize: '3.5rem', margin: '24px 0', color: 'var(--text-primary)', fontWeight: '300' }}>Our <strong style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>Story</strong>.</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.125rem' }}>
          AIVA Enterprises was founded by Aishwarya Ingale, whose journey began with a Bachelor's degree in Food Technology in India and later took her to the United States to pursue a Master's in Entrepreneurial Leadership at Babson College. During her time abroad, she gained a global perspective on food quality, sourcing, and consumer expectations. It inspired her to build a company that bridges the best of global agriculture with international markets.
        </p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '20px auto 0', lineHeight: '1.8', fontSize: '1.125rem' }}>
          With a food technologist's eye for quality, Aishwarya carefully partners with manufacturers who uphold the highest standards of processing, hygiene, and consistency. Her vision for AIVA is simple to bring the finest products that each region has to offer to the world, while proudly showcasing India's exceptional agricultural and food processing capabilities through trusted, high-quality sourcing solutions.
        </p>
      </section>

      {/* Who We Are */}
      <section style={{ padding: '100px 20px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 'bold' }}>Introduction</span>
          <h2 style={{ fontSize: '2.5rem', margin: '16px 0 32px', color: 'var(--text-primary)' }}>Who We Are</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
            AIVA Enterprises is a global sourcing and supply company specializing in premium processed food ingredients for both domestic and international markets. We partner with trusted manufacturers to deliver high-quality aseptic fruit pulps, purees, concentrates, IQF fruits, IQF vegetables, and frozen food products to food manufacturers, distributors, retailers, and foodservice businesses. Driven by quality, reliability, and transparency, we provide sourcing solutions that help our partners succeed, wherever they operate.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px' }}>
          <div style={{ background: 'var(--bg-dark)', padding: '50px', borderRadius: '16px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '120px', color: 'rgba(212,175,55,0.05)', fontWeight: 'bold', pointerEvents: 'none' }}>01</div>
            <h3 style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '24px' }}>Mission</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              To build a transparent and responsible food supply chain by connecting trusted manufacturers with businesses through fair sourcing, uncompromising quality, and honest partnerships. We are committed to minimizing unnecessary intermediaries, supporting ethical sourcing practices, and delivering products that create lasting value for everyone; from the people who grow them to the businesses that rely on them.
            </p>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '50px', borderRadius: '16px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '120px', color: 'rgba(212,175,55,0.05)', fontWeight: 'bold', pointerEvents: 'none' }}>02</div>
            <h3 style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '24px' }}>Vision</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              To redefine food sourcing by creating a future where quality is never compromised, transparency is the standard, and every stakeholder across the supply chain is treated with fairness and respect. We envision a world where exceptional food ingredients move across borders with integrity, benefiting farmers, manufacturers, businesses, and consumers alike.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose AIVA & Quality Commitment */}
      <section style={{ padding: '100px 20px', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 'bold' }}>Our Promise</span>
          <h2 style={{ fontSize: '2.5rem', margin: '16px 0 32px', color: 'var(--text-primary)' }}>Why Choose AIVA</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '40px' }}>
            AIVA Enterprises was founded on one simple belief— quality should never be compromised. As a Food Technologist with international exposure, founder Aishwarya Ingale understands the importance of safe, consistent, and high-quality food ingredients. That is why we carefully partner with trusted manufacturers who share our commitment to excellence, ethical sourcing, and uncompromising quality, ensuring every product meets the standards our customers deserve.
          </p>
          
          <h3 style={{ fontSize: '2rem', margin: '60px 0 32px', color: 'var(--text-primary)' }}>Quality Commitment</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '40px' }}>
            At AIVA Enterprises, quality is at the heart of every decision we make. From the products we offer to the partners we work with, we are committed to delivering ingredients that meet the highest standards of safety, consistency, and reliability. Our product range is supported by globally recognized certifications and compliance standards, including FSSAI, APEDA, BRC, FSSC 22000, ISO 22000, ISO 14001, GLOBALG.A.P., Halal, Kosher, SGF, and AQA, giving our customers the confidence to choose AIVA with trust.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {['FSSAI', 'APEDA', 'BRC', 'FSSC 22000', 'ISO 22000', 'ISO 14001', 'GLOBALG.A.P.', 'Halal', 'Kosher', 'SGF', 'AQA'].map((cert, index) => (
              <div key={index} style={{ padding: '12px 24px', borderRadius: '30px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold', transition: 'all 0.3s ease', cursor: 'default', fontSize: '0.9rem', letterSpacing: '0.05em' }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.color = 'var(--accent-gold)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 'bold' }}>Our Reach</span>
          <h2 style={{ fontSize: '2.5rem', margin: '16px 0 24px', color: 'var(--text-primary)' }}>Industries We Serve</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
            AIVA Enterprises proudly serves a wide range of industries, providing premium processed food ingredients for various applications.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            "Food & Beverage Manufacturing",
            "Dairy & Ice Cream",
            "Bakery & Confectionery",
            "Sauces & Condiments",
            "Ready-to-Eat Foods",
            "Foodservice",
            "Retail",
            "Hospitality"
          ].map((industry, index) => (
            <div key={index} style={{ 
              background: 'var(--bg-panel)', 
              border: '1px solid var(--border-subtle)', 
              padding: '30px 20px', 
              borderRadius: '12px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem' }}>{industry}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 24px', color: 'var(--text-primary)' }}>Partner With Us</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
          Looking for a reliable supply chain partner for premium food ingredients? Let's discuss how AIVA can elevate your business.
        </p>
        <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>Contact Sales Team</Link>
      </section>
    </div>
  );
};

export default About;
