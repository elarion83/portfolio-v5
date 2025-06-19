"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';

const GameControlsPopup = ({ isVisible, onClose }) => {
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

  return (
    <div className="game-init-overlay" onClick={handleOverlayClick}>
      <div className="game-controls-popup">
        <div className="game-init-content">
          <div className="game-controls-header">
            <h2 className="game-init-title">{t('gameControls')}</h2>
            <button 
              className="game-controls-close-btn" 
              onClick={handleCloseClick}
              aria-label={t('close')}
            >
              ×
            </button>
          </div>
          
          <div className="game-controls-content">
            <div className="game-init-section">
              <h3>{t('movement')}</h3>
              <ul className="controls-list">
                <li>
                  <span className="control-keys">
                    <kbd>←</kbd> et <kbd>→</kbd>
                  </span>
                  <span className="control-desc">{t('moveLeftRight')}</span>
                </li>
              </ul>
            </div>

            <div className="game-init-section">
              <h3>{t('basicActions')}</h3>
              <ul className="controls-list">
                <li>
                  <span className="control-keys">
                    <kbd>Espace</kbd>
                  </span>
                  <span className="control-desc">{t('jump')}</span>
                </li>
                <li>
                  <span className="control-keys">
                    <kbd>S</kbd>
                  </span>
                  <span className="control-desc">{t('crouch')}</span>
                </li>
                <li>
                  <span className="control-keys">
                    <kbd>S</kbd>
                  </span>
                  <span className="control-desc">{t('slide')}</span>
                </li>
              </ul>
            </div>

            <div className="game-init-section">
              <h3>{t('combat')}</h3>
              <ul className="controls-list">
                <li>
                  <span className="control-keys">
                    <kbd>Clic gauche</kbd>
                  </span>
                  <span className="control-desc">{t('attack')}</span>
                </li>
                <li>
                  <span className="control-keys">
                    <kbd>Clic gauche</kbd>
                  </span>
                  <span className="control-desc">{t('aerialAttack')}</span>
                </li>
              </ul>
            </div>

            <div className="game-init-section">
              <h3>{t('debugTools')}</h3>
              <ul className="controls-list">
                <li>
                  <span className="control-keys">
                    <kbd>G</kbd>
                  </span>
                  <span className="control-desc">{t('toggleHitboxes')}</span>
                </li>
                <li>
                  <span className="control-keys">
                    <kbd>-</kbd> et <kbd>=</kbd>
                  </span>
                  <span className="control-desc">{t('zoomCamera')}</span>
                </li>
              </ul>
            </div>

            <div className="game-init-section mobile-controls-info">
              <h3>{t('mobileControls')}</h3>
              <p>{t('mobileControlsText')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControlsPopup; 