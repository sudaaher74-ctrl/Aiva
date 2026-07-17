import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LAUNCH_AT = new Date().getTime() + 60 * 1000;

export default function LaunchCountdown({ onEnter }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLaunched, setIsLaunched] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_AT - now;

      if (distance <= 0) {
        clearInterval(timer);
        setIsLaunched(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // GSAP for floating images
  useGSAP(() => {
    if (isLaunched) return;
    
    gsap.utils.toArray('.countdown-float').forEach((item) => {
      gsap.to(item, {
        y: '+=20',
        rotation: '+=5',
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, { scope: containerRef, dependencies: [isLaunched] });

  // Confetti logic
  useEffect(() => {
    if (!isLaunched) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const pieces = [];
    const colors = ['#F4A300', '#FF7F50', '#32CD32', '#FFFFFF'];
    
    // Initial burst
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      // Light trickle
      if (Math.random() < 0.1) {
         pieces.push({
            x: Math.random() * width,
            y: -20,
            vx: (Math.random() - 0.5) * 5,
            vy: Math.random() * 5 + 2,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
         });
      }

      for (let i = 0; i < pieces.length; i++) {
        let p = pieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      
      requestRef.current = requestAnimationFrame(render);
    };
    
    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const redirectTimer = setTimeout(() => {
      handleEnter();
    }, 10000);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(redirectTimer);
    };
  }, [isLaunched]);

  const handleEnter = () => {
    localStorage.setItem('aiva_launched_v2', 'true');
    if (onEnter) onEnter();
  };

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(244,163,0,0.15) 0%, rgba(5,5,5,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <img 
        src="/assets/images/products/newlogo.webp" 
        alt="AIVA Enterprises" 
        style={{ width: '120px', zIndex: 10, position: 'absolute', top: '40px' }} 
      />

      {!isLaunched && (
        <button
          onClick={handleEnter}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'transparent',
            color: '#888',
            border: '1px solid #333',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#666';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#888';
            e.currentTarget.style.borderColor = '#333';
          }}
        >
          Skip &rarr;
        </button>
      )}

      {isLaunched ? (
        <div style={{ zIndex: 10, textAlign: 'center', padding: '2rem' }}>
          <canvas 
            ref={canvasRef} 
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}
          />
          <h1 style={{ 
            fontSize: 'clamp(40px, 8vw, 80px)', 
            fontWeight: 800, 
            letterSpacing: '-2px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F4A300 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            We're live.
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#a0a0a0', marginBottom: '3rem' }}>
            Welcome to the new AIVA Enterprises.
          </p>
          <button 
            onClick={handleEnter}
            style={{
              backgroundColor: '#F4A300',
              color: '#050505',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '9999px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Enter the website &rarr;
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Auto-redirecting in ~10 seconds...
          </p>
        </div>
      ) : (
        <div style={{ zIndex: 10, textAlign: 'center', padding: '2rem', maxWidth: '800px', width: '100%' }}>
          
          <img 
            src="/assets/images/products/pulp/Alphansomangopulp.webp" 
            className="countdown-float"
            alt=""
            style={{
              position: 'absolute',
              top: '15%',
              left: '5%',
              width: 'clamp(150px, 20vw, 300px)',
              opacity: 0.2,
              filter: 'blur(4px)',
              pointerEvents: 'none'
            }}
          />
          
          <img 
            src="/assets/images/products/pulp/pinkguavapulp.webp" 
            className="countdown-float"
            alt=""
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '5%',
              width: 'clamp(150px, 20vw, 300px)',
              opacity: 0.2,
              filter: 'blur(4px)',
              pointerEvents: 'none'
            }}
          />

          <p style={{ 
            color: '#F4A300', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontWeight: 600, 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            Launching Monday, July 20
          </p>
          <h1 style={{ 
            fontSize: 'clamp(32px, 5vw, 62px)', 
            fontWeight: 800, 
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '1.5rem'
          }}>
            Something premium is almost ripe.
          </h1>
          <p style={{ 
            color: '#a0a0a0', 
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem auto'
          }}>
            The new home of AIVA Enterprises &mdash; premium fruit pulp &amp; IQF exports &mdash; goes live in
          </p>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'clamp(10px, 4vw, 30px)', 
            alignItems: 'baseline' 
          }}>
            <CountdownBlock value={formatNumber(timeLeft.days)} label="Days" />
            <span style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: '#F4A300', textShadow: '0 0 20px rgba(244,163,0,0.5)', fontWeight: 300 }}>:</span>
            <CountdownBlock value={formatNumber(timeLeft.hours)} label="Hours" />
            <span style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: '#F4A300', textShadow: '0 0 20px rgba(244,163,0,0.5)', fontWeight: 300 }}>:</span>
            <CountdownBlock value={formatNumber(timeLeft.minutes)} label="Minutes" />
            <span style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: '#F4A300', textShadow: '0 0 20px rgba(244,163,0,0.5)', fontWeight: 300 }}>:</span>
            <CountdownBlock value={formatNumber(timeLeft.seconds)} label="Seconds" />
          </div>

          <p style={{ 
            position: 'absolute',
            bottom: '40px',
            left: '0',
            right: '0',
            color: '#666',
            fontSize: '0.85rem'
          }}>
            Going live at 12:00 &middot; Monday, July 20, 2026
          </p>
        </div>
      )}
    </div>
  );
}

function CountdownBlock({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ 
        fontSize: 'clamp(48px, 8vw, 92px)', 
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4A300 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        {value}
      </div>
      <div style={{ 
        textTransform: 'uppercase', 
        fontSize: '0.75rem', 
        letterSpacing: '2px', 
        color: '#888',
        marginTop: '0.5rem'
      }}>
        {label}
      </div>
    </div>
  );
}
