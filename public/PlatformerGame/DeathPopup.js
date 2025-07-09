"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';

const DeathPopup = ({ isVisible, onRestart, onBackToSite, difficultyConfig }) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  // Déterminer si on est en mode Seigneur des ténèbres
  const isDarkLordMode = difficultyConfig && difficultyConfig.oneHitKill;

  // Déterminer le titre selon la difficulté
  const getDeathTitle = () => {
    return t('gameOver'); // Même titre pour tous les modes
  };

  // Déterminer le sous-titre selon la difficulté
  const getDeathSubtitle = () => {
    if (isDarkLordMode) {
      // Mode Seigneur des ténèbres - ton sombre
      return t('deathMessage');
    } else {
      // Autres modes avec système de vie - ton normal
      return t('healthSystemSubtitle');
    }
  };

  // Déterminer le message selon la difficulté
  const getDeathMessage = () => {
    if (isDarkLordMode) {
      // Mode Seigneur des ténèbres
      return t('darkLordDeathMessage');
    } else {
      // Autres modes avec système de vie
      return t('healthSystemDeathMessage');
    }
  };

  return (
    <div className="speedrun-overlay">
      <motion.div 
        className="speedrun-popup death-popup"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ overflowX: 'hidden' }}
      >
        {/* Header */}
        <div className="speedrun-header">
          <h2 className="death-title">{getDeathTitle()}</h2>
          <p className="death-subtitle">{getDeathSubtitle()}</p>
        </div>

        {/* Message de défaite */}
        <div className="death-message" style={{ overflowX: 'hidden' }}>
          <p>{getDeathMessage()}</p>
        </div>

        {/* Actions */}
        <div className="speedrun-actions">
          <button 
            className="restart-btn"
            onClick={onRestart}
          >
            {t('tryAgain')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeathPopup; 