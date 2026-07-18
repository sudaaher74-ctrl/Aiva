import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ProductHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveals
      gsap.to('.prod-hero .reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Product composition entrance
      gsap.from('.prod-hero-composition img', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'back.out(1.2)',
      });

      // Mouse Parallax for Hero Products
      const handleMouseMove = (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

        const mainProd = document.querySelector('.main-prod');
        const subProd1 = document.querySelector('.sub-prod-1');
        const subProd2 = document.querySelector('.sub-prod-2');

        if (mainProd) mainProd.style.transform = `translate(${xAxis * 1.2}px, ${yAxis * 1.2}px)`;
        if (subProd1) subProd1.style.transform = `translate(${xAxis * -1.5}px, ${yAxis * -1.5}px)`;
        if (subProd2) subProd2.style.transform = `translate(${xAxis * 1.8}px, ${yAxis * 1.8}px)`;
      };

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="prod-hero" id="home" ref={heroRef}>
      <div className="prod-hero-bg">
        <div className="prod-hero-gradient"></div>
      </div>

      <div className="container split-layout prod-hero-content">
        <div className="split-left">
          <div className="premium-badge reveal-text">GLOBAL EXPORT QUALITY</div>
          <h1 className="prod-hero-title">
            <span className="reveal-text">Premium Fruit</span>
            <br />
            <span className="reveal-text highlight">Processing Products</span>
          </h1>
          <p className="prod-hero-subtitle reveal-text delay-1">
            AIVA Enterprises delivers world-class aseptic fruit pulps, purees, and concentrates, along with IQF and blast-frozen fruits and vegetables to international markets.
          </p>
          <div className="hero-buttons">
            <a href="#products" className="btn btn-primary">
              Explore Products
            </a>
            <a href="#contact" className="btn btn-text">
              Request Bulk Quote <i className="ph ph-arrow-right"></i>
            </a>
          </div>
        </div>

        <div className="split-right prod-hero-composition">
          <img
            src="/assets/alphonsomangodrum.png"
            className="prod-float main-prod"
            alt="Alphonso Mango"
            data-speed="1.2"
          />
          <img
            src="/assets/images/products/pulp/tomatopastedrum.webp"
            className="prod-float sub-prod-1"
            alt="Tomato Paste"
            data-speed="-1.5"
          />

          <div className="glow-orb"></div>
        </div>
      </div>
    </section>
  );
}

export default ProductHero;
