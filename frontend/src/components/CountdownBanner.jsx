import React, { useState, useEffect } from 'react';
import './CountdownBanner.css';

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Check if a target date already exists in localStorage, otherwise create one for 2 days from now
    let targetDate = localStorage.getItem('launchTargetDate');
    if (!targetDate) {
      const future = new Date();
      future.setDate(future.getDate() + 2);
      targetDate = future.getTime();
      localStorage.setItem('launchTargetDate', targetDate);
    } else {
      targetDate = parseInt(targetDate, 10);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

  return (
    <div className="countdown-banner">
      <div className="countdown-content">
        <span className="countdown-text">🚀 Big Announcement Coming In:</span>
        <div className="countdown-timer">
          <div className="time-block">
            <span className="time-val">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="time-label">D</span>
          </div>
          <span className="separator">:</span>
          <div className="time-block">
            <span className="time-val">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="time-label">H</span>
          </div>
          <span className="separator">:</span>
          <div className="time-block">
            <span className="time-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="time-label">M</span>
          </div>
          <span className="separator">:</span>
          <div className="time-block">
            <span className="time-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="time-label">S</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
