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
            <img
              src="/assets/images/pulp/totapurimangopulp.png"
              alt="Totapuri Drum"
              loading="lazy"
              className="floating-slow"
              style={{
                width: '75%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                transform: 'rotate(-5deg) translateY(10px)',
                zIndex: 2,
              }}
            />
            <img
              src="/assets/images/tomatoabout.png"
              alt="Tomato Drum"
              loading="lazy"
              className="floating-slow"
              style={{
                width: '65%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                transform: 'rotate(8deg) translateY(-15px)',
                zIndex: 1,
                marginLeft: '-25%',
                animationDelay: '1.5s',
              }}
            />
          </div>
        </div>
        <div className="split-right content-block">
          <h3 className="section-subtitle" style={{ marginBottom: '1rem', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>Premium Agro Ingredients</h3>
          <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1' }}>
            Cultivating Global <br />
            Quality Standards
          </h2>
          <p className="section-desc" style={{ marginBottom: '2rem', fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', lineHeight: '1.7', color: 'rgba(255,255,255,0.85)' }}>
            AIVA Enterprises specializes in aseptic fruit pulps, purees, and concentrates, along with IQF and blast-frozen fruits and vegetables, delivering reliable ingredient solutions that preserve quality, freshness, and consistency from source to supply.
          </p>

          <div className="stats-grid" style={{ gap: '1.2rem', marginTop: '1rem' }}>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem' }}>
              <p style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0, lineHeight: '1.5' }}>
                70 MT/Day  Aseptic Processing Capacity
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem' }}>
              <p style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0, lineHeight: '1.5' }}>
                IQF & Blast freezing Technology Driven Solutions
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0, lineHeight: '1.5' }}>
                Bulk Supply & Industrial Packaging
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0, lineHeight: '1.5' }}>
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
