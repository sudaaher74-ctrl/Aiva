import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AboutSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Number Counter
    const statItems = document.querySelectorAll('.stat-num');
    statItems.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'));
      ScrollTrigger.create({
        trigger: '.stats-grid',
        start: 'top 80%',
        onEnter: () => {
          gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out',
          });
        },
        once: true,
      });
    });

    // Scroll Reveals
    const revealSections = document.querySelectorAll('.section-title, .section-subtitle, .section-desc');
    revealSections.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section className="about" id="about" ref={sectionRef} style={{ padding: '20px 0' }}>
      <div className="container split-layout" style={{ alignItems: 'center' }}>
        <div className="split-left">
          <div
            className="image-composition"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* About Us Cover Image */}
            <img
              src="/assets/images/products/coverimgaboutus.png"
              alt="About AIVA Enterprises"
              loading="lazy"
              style={{
                width: '140%',
                height: 'auto',
                borderRadius: '16px',
                objectFit: 'cover',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                transform: 'scale(1.15) translateX(-8%)'
              }}
            />
          </div>
        </div>
        <div className="split-right content-block">
          <h3 className="section-subtitle" style={{ marginBottom: '0.5rem' }}>Premium Agro Ingredients</h3>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Cultivating Global <br />
            Quality Standards
          </h2>
          <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
            AIVA Enterprises specializes in aseptic fruit pulps, purees, and concentrates, along with IQF and blast-frozen fruits and vegetables, delivering reliable ingredient solutions that preserve quality, freshness, and consistency from source to supply.
          </p>

          <div className="stats-grid">
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                70 MT/Day  Aseptic Processing Capacity
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                IQF & Blast freezing Technology Driven Solutions
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                Bulk Supply & Industrial Packaging
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                Custom Products specification
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
