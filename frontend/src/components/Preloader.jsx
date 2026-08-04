import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function Preloader() {
  const preloaderRef = useRef(null);
  const [done, setDone] = useState(false);

  // Safety net: if the timeline below never reaches its end (stalled rAF, a
  // throttled background tab, a GSAP failure), tear the overlay down anyway so
  // it can't sit on top of the page.
  useEffect(() => {
    const t = setTimeout(() => {
      document.body.classList.remove('loading');
      setDone(true);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useGSAP(() => {
    // --- 2. Preloader Animation ---
    const tlLoader = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('loading');
        setDone(true);
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
  }, { scope: preloaderRef });

  if (done) return null;

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
