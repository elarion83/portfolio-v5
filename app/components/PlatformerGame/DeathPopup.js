"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';

const DeathPopup = ({ isVisible, onRestart, onBackToSite }) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="speedrun-overlay">
      <motion.div 
        className="speedrun-popup death-popup"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="speedrun-header">
          <div className="death-icon">💀</div>
          <h2 className="death-title">{t('gameOver')}</h2>
          <p className="death-subtitle">{t('deathMessage')}</p>
        </div>

        {/* Message de défaite */}
        <div className="death-message">
          <p>{t('darkLordDeathMessage')}</p>
        </div>

        {/* Actions */}
        <div className="speedrun-actions">
          <button 
            className="restart-btn"
            onClick={onRestart}
          >
            <span>🔄</span>
            {t('tryAgain')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeathPopup; 