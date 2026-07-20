import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

function HomeHero() {
  const heroRef = useRef(null);

  useGSAP(() => {
      const tlHero = gsap.timeline();

      // Text Reveal
      tlHero
        .fromTo(
          '.hero-title .reveal-text',
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out' }
        )
        .fromTo(
          '.hero-subtitle',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
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
  }, { scope: heroRef });

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-bg">
        <div className="hero-gradient"></div>
      </div>

      <div className="container hero-content">
        <h1 className="hero-title" style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Premium Fruit Pulp Exporter India</span>
          <span className="reveal-text" aria-hidden="true">The Standard Behind</span>
          <br aria-hidden="true" />
          <span className="reveal-text highlight" aria-hidden="true">The Standard.</span>
        </h1>
        <p className="hero-subtitle reveal-text delay-1">
          We believe great ingredients create great products. That's why every decision we make is guided by quality, transparency, and a commitment to building long term partnerships.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      </div>

      {/* Floating Parallax Elements */}
      <div className="floating-elements">
        <div className="hero-bottles-cluster float-item" data-speed="1.2">
          <img
            src="/assets/images/bottel1.png"
            className="bottle-left"
            alt="Totapuri Mango Pulp Bottle"
            width="400"
            height="600"
          />
          <img
            src="/assets/images/bootel2.png"
            className="bottle-right"
            alt="Premium Guava Pulp Bottle"
            width="400"
            height="600"
          />
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
