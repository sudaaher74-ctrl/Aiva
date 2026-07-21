import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ProcessSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Timeline Animation
    gsap.fromTo(
      '.timeline-item',
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-timeline',
          start: 'top 70%',
        },
      }
    );

    gsap.to('.glass-panel', {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.process',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, { scope: sectionRef });

  return (
    <section className="process section-padding dark-section" id="process" ref={sectionRef}>
      <div className="container">
        <div className="process-wrapper">
          <div className="process-content">
            <h4 className="section-subtitle">Our Process</h4>
            <h2 className="section-title text-light">From Orchard to Ocean</h2>
            <div className="process-timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3>1. Harvesting & Selection</h3>
                <p>Hand-picked at peak ripeness for optimum brix levels.</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3>2. Sorting & Washing</h3>
                <p>Multi-stage purification using advanced sorting  machinery.</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3>3. Extraction & Processing</h3>
                <p>State-of the-art aseptic , IQF & blast freezing , technologies .</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <h3>4. Packaging & Storage</h3>
                <p>Aseptic drum packaging , frozen pouch packaging. thousand MT storage capacity  respectively.</p>
              </div>
            </div>
          </div>
          <div className="process-image">
            <div className="glass-panel">
              <div className="glass-inner">
                <img
                  src="/assets/images/strawebbryhome.png"
                  alt="Quality Process"
                  className="floating-slow"
                  loading="lazy"
                  style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
