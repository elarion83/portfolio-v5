"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';

const GameInGameMenuPopup = ({ isVisible, onClose, onBackToModeSelection }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleBackToModeSelection = () => {
    onClose(); // Fermer la modal d'abord
    onBackToModeSelection(); // Puis retourner à la sélection de mode
  };

  return (
    <div className="game-init-overlay" onClick={handleOverlayClick}>
      <div className="game-controls-popup">
        <div className="game-init-content">
          <div className="game-controls-header">
            <h2 className="game-init-title">Menu</h2>
            <button 
              className="game-controls-close-btn" 
              onClick={handleCloseClick}
              aria-label={t('close')}
            >
              ×
            </button>
          </div>
          
          <div className="game-controls-content">
            <div className="menu-actions">
              <button 
                className="btn-primary menu-btn"
                onClick={handleBackToModeSelection}
              >
                <span className="btn-text">{t('changeDifficulty')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInGameMenuPopup; 