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
    <section className="about section-padding" id="about" ref={sectionRef}>
      <div className="container split-layout">
        <div className="split-left">
          <div 
            className="image-composition"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '550px',
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
                width: '100%',
                height: 'auto',
                borderRadius: '16px',
                objectFit: 'cover',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))'
              }}
            />
          </div>
        </div>
        <div className="split-right content-block">
          <h3 className="section-subtitle">Premium Fruit Pulp Manufacturer</h3>
          <h2 className="section-title">
            Cultivating Global <br />
            Quality Standards
          </h2>
          <p className="section-desc">
            AIVA Enterprises specializes in aseptic fruit products, concentrates, purees, frozen products, and IQF fruits and vegetables, delivering reliable ingredient solutions that preserve quality, freshness, and consistency from source to supply.
          </p>

          <div className="stats-grid">
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                70 MT/Day Processing Capacity
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                IQF & Aseptic Technology-Driven Solutions
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                Bulk Supply Industrial Packaging
              </p>
            </div>
            <div className="stat-item" style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                Made to Spec Customized Requirements
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
