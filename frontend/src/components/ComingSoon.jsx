import React, { useState, useEffect } from 'react';
import './ComingSoon.css';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLaunched, setIsLaunched] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authInput.toLowerCase().trim() === 'aishwarya') {
      setIsLaunched(true);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  useEffect(() => {
    // Target Date: Thursday, July 23, 2026 at 12:00 PM IST
    const targetDate = new Date('2026-07-23T12:00:00+05:30').getTime();

    // Check immediately to prevent flash
    const initialNow = new Date().getTime();
    if (targetDate - initialNow <= 0) {
      setIsLaunched(true);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setIsLaunched(true);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLaunched) return null;

  return (
    <div className="coming-soon-overlay">
      <div className="cs-background-glow"></div>
      <div className="coming-soon-content">
        <h1 className="cs-title">WE ARE LAUNCHING</h1>
        <p className="cs-subtitle">Premium Agro Ingredients. Cultivating Global Quality Standards.</p>
        
        <div className="cs-timer">
          <div className="cs-time-block">
            <span className="cs-val">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="cs-label">Days</span>
          </div>
          <span className="cs-sep">:</span>
          <div className="cs-time-block">
            <span className="cs-val">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="cs-label">Hours</span>
          </div>
          <span className="cs-sep">:</span>
          <div className="cs-time-block">
            <span className="cs-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="cs-label">Minutes</span>
          </div>
          <span className="cs-sep">:</span>
          <div className="cs-time-block">
            <span className="cs-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="cs-label">Seconds</span>
          </div>
        </div>

        {!showAuth ? (
          <button className="cs-btn" onClick={() => setShowAuth(true)}>
            Bypass (Dev Only)
          </button>
        ) : (
          <form className="cs-auth-form" onSubmit={handleAuthSubmit}>
            <p className="cs-auth-label">Who is the owner of this website?</p>
            <div className="cs-auth-input-group">
              <input 
                type="text" 
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="Enter name..."
                className={`cs-auth-input ${authError ? 'error' : ''}`}
                autoFocus
              />
              <button type="submit" className="cs-auth-submit">Enter</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;
