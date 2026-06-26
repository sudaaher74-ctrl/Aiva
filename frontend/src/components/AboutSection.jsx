import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
            {/* Background Drum 1 (Tomato Paste) */}
            <img
              src="/assets/images/products/pulp/tomatopastedrum.webp"
              alt="Industrial Tomato Paste Drum"
              loading="lazy"
              style={{
                position: 'absolute',
                width: '50%',
                left: '0%',
                top: '5%',
                zIndex: 1,
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3)) blur(3px)',
                opacity: 0.9
              }}
            />

            {/* Background Drum 2 (Mango Pulp) */}
            <img
              src="/assets/images/products/pulp/kesarmangopulpdrum.webp"
              alt="Industrial Mango Pulp Drum"
              loading="lazy"
              style={{
                position: 'absolute',
                width: '50%',
                right: '0%',
                top: '15%',
                zIndex: 1,
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3)) blur(4px)',
                opacity: 0.8
              }}
            />

            {/* Foreground Bottle 1 (Tomato Paste) */}
            <img
              src="/assets/images/products/pulp/tomatopaste.webp"
              alt="Premium Tomato Paste Manufacturer"
              loading="lazy"
              style={{
                position: 'absolute',
                width: '45%',
                left: '10%',
                bottom: '10%',
                zIndex: 2,
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
              }}
            />

            {/* Foreground Bottle 2 (Mango Pulp) */}
            <img
              src="/assets/images/products/pulp/Alphansomangopulp.webp"
              alt="Alphonso Mango Exporter India"
              loading="lazy"
              style={{
                position: 'absolute',
                width: '40%',
                right: '10%',
                bottom: '5%',
                zIndex: 3,
                filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.4)) blur(1px)'
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
