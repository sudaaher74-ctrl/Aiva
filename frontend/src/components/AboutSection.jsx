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
      <div className="container">
        <div className="content-block" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h3 className="section-subtitle">Premium Fruit Pulp Manufacturer</h3>
          <h2 className="section-title">
            Cultivating Global <br />
            Quality Standards
          </h2>
          <p className="section-desc">
            AIVA Enterprises specializes in aseptic fruit products, concentrates, purees, frozen products, and IQF fruits and vegetables, delivering reliable ingredient solutions that preserve quality, freshness, and consistency from source to supply.
          </p>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px', textAlign: 'left' }}>
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
