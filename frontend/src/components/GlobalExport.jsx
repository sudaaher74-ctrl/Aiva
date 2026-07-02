import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function GlobalExport() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.global-map-container',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.global-map-container',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="export section-padding" id="export" ref={sectionRef}>
      <div className="container text-center">
        <h3 className="section-subtitle">Based in Navi Mumbai, Maharashtra</h3>
        <h2 className="section-title">Global Exporter from India</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
          Operating from our strategic base in Navi Mumbai, Maharashtra, AIVA Enterprises connects the rich agricultural heritage of India with global markets. Our world-class supply chain ensures premium fruit pulps and IQF produce reach destinations worldwide with uncompromised quality.
        </p>

        <div className="global-map-container reveal-scale" style={{ maxWidth: '1000px', margin: '1rem auto 0' }}>
          <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" id="world-map">
            <g fill="none" stroke="#c1c8c1" strokeWidth="0.5" opacity="0.4">
              <path d="M150,120 Q180,80 220,90 Q260,70 280,100 Q300,80 290,120 Q310,140 280,160 Q260,180 240,170 Q220,190 200,180 Q180,170 160,180 Q140,160 150,140 Z" />
              <path d="M230,240 Q250,220 270,230 Q280,260 290,280 Q280,320 270,350 Q260,380 240,390 Q220,370 220,340 Q210,310 220,280 Q215,260 230,240 Z" />
              <path d="M440,100 Q460,80 490,85 Q510,90 520,110 Q510,130 490,135 Q470,140 450,130 Q435,120 440,100 Z" />
              <path d="M450,170 Q470,150 500,160 Q520,180 530,210 Q530,250 520,280 Q500,310 480,300 Q460,280 450,250 Q440,220 445,190 Z" />
              <path d="M550,80 Q600,60 660,70 Q720,65 760,90 Q780,110 770,140 Q750,160 720,170 Q680,180 640,170 Q600,175 570,160 Q540,140 540,110 Z" />
              <path
                d="M620,150 Q640,135 660,145 Q670,165 665,190 Q650,210 635,200 Q620,185 615,170 Z"
                fill="var(--map-india-fill)"
                stroke="var(--c-mango)"
                strokeWidth="1.5"
              />
              <path d="M750,300 Q790,280 830,290 Q850,310 840,340 Q820,360 790,355 Q760,340 750,320 Z" />
              <path d="M540,150 Q560,140 580,150 Q575,170 560,175 Q545,170 540,155 Z" />
            </g>

            <g className="trade-routes">
              <line x1="640" y1="175" x2="280" y2="150" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
              <line x1="640" y1="175" x2="480" y2="110" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
              <line x1="640" y1="175" x2="490" y2="230" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
              <line x1="640" y1="175" x2="560" y2="155" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
              <line x1="640" y1="175" x2="800" y2="310" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
              <line x1="640" y1="175" x2="740" y2="110" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
              <line x1="640" y1="175" x2="250" y2="280" stroke="var(--c-mango)" strokeWidth="1" strokeDasharray="4,4" className="map-line" opacity="0.5" />
            </g>

            <g className="map-dots">
              <circle cx="640" cy="175" r="8" fill="var(--c-mango)" opacity="0.9">
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="640" cy="175" r="16" fill="none" stroke="var(--c-mango)" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>

              <circle cx="200" cy="130" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="220" cy="100" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="270" cy="310" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="450" cy="95" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="480" cy="100" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="465" cy="92" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="560" cy="160" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="545" cy="170" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="780" cy="120" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="760" cy="115" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="800" cy="330" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="490" cy="310" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="460" cy="220" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="710" cy="200" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
              <circle cx="600" cy="75" r="4" fill="var(--map-dot-fill)" stroke="var(--c-mango)" strokeWidth="2" className="map-dot" />
            </g>

            <text x="640" y="215" textAnchor="middle" fill="var(--c-mango)" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.1em">
              INDIA
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default GlobalExport;
