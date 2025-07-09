"use client";

import React, { useState, useEffect } from 'react';

const ActiveEffectsUI = () => {
  const [effects, setEffects] = useState([]);

  useEffect(() => {
    const handleEffectAdded = (event) => {
      const effect = event.detail;
      setEffects(prev => {
        const filtered = prev.filter(e => e.type !== effect.type);
        return [...filtered, {
          ...effect,
          id: `${effect.type}-${Date.now()}`,
          removing: false
        }];
      });
    };

    const handleEffectRemoved = (event) => {
      const effect = event.detail;
      setEffects(prev => 
        prev.map(e => 
          e.type === effect.type 
            ? { ...e, removing: true }
            : e
        )
      );

      setTimeout(() => {
        setEffects(prev => prev.filter(e => e.type !== effect.type));
      }, 300);
    };

    window.addEventListener('effectAdded', handleEffectAdded);
    window.addEventListener('effectRemoved', handleEffectRemoved);

    return () => {
      window.removeEventListener('effectAdded', handleEffectAdded);
      window.removeEventListener('effectRemoved', handleEffectRemoved);
    };
  }, []);

  const formatTime = (milliseconds) => {
    const seconds = Math.ceil(milliseconds / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (effects.length === 0) {
    return null;
  }

  return (
    <div className="active-effects">
      {effects.map((effect) => (
        <EffectItem key={effect.id} effect={effect} formatTime={formatTime} />
      ))}
    </div>
  );
};

const EffectItem = ({ effect, formatTime }) => {
  const [progress, setProgress] = useState(100);
  const [remainingTime, setRemainingTime] = useState(effect.duration);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!effect.startTime || !effect.duration) return;
      
      const elapsed = Date.now() - effect.startTime;
      const newRemainingTime = Math.max(0, effect.duration - elapsed);
      const newProgress = Math.max(0, Math.min(100, (newRemainingTime / effect.duration) * 100));
      
      setProgress(newProgress);
      setRemainingTime(newRemainingTime);
    }, 100);

    return () => clearInterval(interval);
  }, [effect]);

  return (
    <div className={`effect-item ${effect.removing ? 'removing' : ''}`}>
      <div className="effect-icon">
        {effect.icon}
      </div>
      <div className="effect-info">
        <div className="effect-name">
          {effect.name}
        </div>
        <div className="effect-timer">
          {formatTime(remainingTime)}
        </div>
        <div className="effect-progress">
          <div 
            className="effect-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveEffectsUI; 