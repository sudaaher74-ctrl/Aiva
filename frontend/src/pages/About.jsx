import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      <Helmet>
        <title>About AIVA | Premium Global Agricultural Exports</title>
        <meta name="description" content="Learn about AIVA Enterprises, our history, our farming facilities, and our commitment to premium global agricultural exports including spices, pulses, and grains." />
      </Helmet>

      {/* Hero Section */}
      <section className="about-hero" style={{ padding: '140px 20px 80px', textAlign: 'center', background: 'linear-gradient(to bottom, #0A0A0A, #111111)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(212,175,55,0.05) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        <span className="eyebrow" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem', fontWeight: 'bold' }}>Our Heritage</span>
        <h1 style={{ fontSize: '3.5rem', margin: '24px 0', color: 'var(--text-primary)', fontWeight: '300' }}>Cultivating <strong style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>Excellence</strong>.</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.125rem' }}>
          Since our inception, AIVA Enterprises has been bridging the gap between premium agricultural produce and the global market. We specialize in ethically sourced, high-quality spices, pulses, and commodities.
        </p>
      </section>

      {/* Global Reach Stats */}
      <section style={{ padding: '60px 20px', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '8px' }}>25+</div>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Countries Exported To</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '8px' }}>50+</div>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Premium Commodities</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '8px' }}>10k+</div>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Tons Shipped Annually</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '8px' }}>100%</div>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>Quality Guarantee</div>
          </div>
        </div>
      </section>

      {/* Facilities & Process */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 'bold' }}>Our Facilities</span>
            <h2 style={{ fontSize: '2.5rem', margin: '16px 0 24px', color: 'var(--text-primary)' }}>State-of-the-Art Processing</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '24px' }}>
              We operate advanced processing and sorting facilities strategically located near major agricultural hubs and ports. Our multi-stage cleaning, grading, and sorting process ensures that only the finest produce makes it into our shipments.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: 'var(--accent-gold)' }}>✓</span> Optical Sorting Technology</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: 'var(--accent-gold)' }}>✓</span> Temperature Controlled Warehousing</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: 'var(--accent-gold)' }}>✓</span> In-house Quality Assurance Labs</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-panel)', height: '400px', borderRadius: '16px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            {/* Placeholder for facility image */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(212,175,55,0.1), rgba(0,0,0,0))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>[ FACILITY IMAGE ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ padding: '100px 20px', background: 'var(--bg-panel)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 'bold' }}>Compliance</span>
          <h2 style={{ fontSize: '2.5rem', margin: '16px 0 24px', color: 'var(--text-primary)' }}>Global Certifications</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
            We adhere strictly to international food safety and quality standards, ensuring that our products meet the regulatory requirements of global markets.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>ISO 22000</div>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>HACCP</div>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>FSSAI</div>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>FDA</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0 0 24px', color: 'var(--text-primary)' }}>Partner With Us</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
          Looking for a reliable supply chain partner for premium commodities? Let's discuss how AIVA can elevate your business.
        </p>
        <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>Contact Sales Team</Link>
      </section>
    </div>
  );
};

export default About;
