import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

function HomeHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tlHero = gsap.timeline();

      // Text Reveal
      tlHero
        .fromTo(
          '.hero-title .reveal-text',
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out' }
        )
        .fromTo(
          '.hero-buttons',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        );

      // Floating Parallax Setup
      gsap.utils.toArray('.float-item').forEach((item) => {
        const speed = item.getAttribute('data-speed');
        gsap.to(item, {
          y: () => window.innerHeight * speed * -0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Continuous subtle float
        gsap.to(item, {
          y: '+=20',
          rotation: '+=5',
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        {/* Abstract Background Elements */}
        <div
          className="glow-orb"
          style={{ top: '20%', left: '10%', background: 'var(--c-mango)', filter: 'blur(120px)' }}
        ></div>
        <div
          className="glow-orb"
          style={{ bottom: '10%', right: '5%', background: 'var(--c-guava)', filter: 'blur(150px)' }}
        ></div>
      </div>

      <div className="container hero-content">
        <div
          className="premium-badge reveal-text"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255, 184, 0, 0.3)',
            borderRadius: '50px',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            color: '#ffb800',
            marginBottom: '1.5rem',
            background: 'rgba(255, 184, 0, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          GLOBAL EXPORT QUALITY
        </div>
        <h1 className="hero-title">
          <span className="reveal-text">The Standard Behind</span>
          <br />
          <span className="reveal-text highlight">The Standard.</span>
        </h1>
        <div className="hero-buttons reveal-text delay-2">
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
          <a
            href="#contact"
            className="btn btn-text"
            style={{ fontWeight: 600, fontSize: '1.1rem', padding: '0.5rem 0' }}
          >
            Request Bulk Quote <i className="ph ph-arrow-right"></i>
          </a>
        </div>
      </div>

      {/* Floating Parallax Elements */}
      <div className="floating-elements">
        <img
          src="/assets/mobilehomepage.png"
          className="float-item f-mango"
          alt="Aiva Products"
          data-speed="1.5"
        />
        <img
          src="/assets/images/products/pulp/pinkguavapulp.webp"
          className="float-item f-guava"
          alt="Guava"
          data-speed="-1.2"
        />
        <img
          src="/assets/images/products/pulp/papayapulp.webp"
          className="float-item f-papaya"
          alt="Papaya Pulp Bottle"
          data-speed="1.8"
        />
      </div>
    </section>
  );
}

export default HomeHero;
