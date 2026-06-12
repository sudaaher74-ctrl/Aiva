import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Preloader() {
  const preloaderRef = useRef(null);

  useEffect(() => {
    // --- 2. Preloader Animation ---
    const tlLoader = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('loading');
      },
    });

    tlLoader
      .to('.progress-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power3.inOut',
      })
      .to(
        '.preloader-title',
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.5'
      )
      .to('.preloader-subtitle', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      })
      .to(preloaderRef.current, {
        y: '-100%',
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.5,
      });
  }, []);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader-content">
        <h1 className="preloader-title">AIVA</h1>
        <p className="preloader-subtitle">ENTERPRISES</p>
      </div>
      <div className="preloader-progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
}

export default Preloader;
