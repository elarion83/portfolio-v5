"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';
import { Clock, Target, FolderOpen, Settings, RotateCcw, X } from 'lucide-react';

const GameInGameMenuPopup = ({ 
  isVisible, 
  onClose, 
  onBackToModeSelection, 
  gameTime, 
  collectedProjects, 
  totalProjects, 
  formatTime, 
  difficultyConfig 
}) => {
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
    <div className="speedrun-overlay" onClick={handleOverlayClick}>
      <motion.div 
        className="speedrun-popup"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Bouton de fermeture */}
        <button 
          className="speedrun-close-btn" 
          onClick={handleCloseClick}
          aria-label={t('close')}
        >
          <X size={20} />
        </button>

        {/* Header sans icône */}
        <div className="speedrun-header">
          <motion.h2 
            className="pause-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {t('gameMenu')}
          </motion.h2>
          
          <motion.p 
            className="pause-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {t('gameInProgress')}
          </motion.p>
        </div>

        {/* Stats en cours de jeu */}
        <motion.div 
          className="speedrun-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Temps actuel */}
          <div className="stat-card main-time">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('currentTime')}</div>
              <div className="stat-value main-time-value">{formatTime(gameTime)}</div>
            </div>
          </div>

          {/* Projets collectés */}
          <div className="stat-card">
            <div className="stat-icon">
              <FolderOpen size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('projectsCollected')}</div>
              <div className="stat-value">
                <span className="collected-count">{collectedProjects}</span>
                <span className="total-separator"> / </span>
                <span className="total-count">{totalProjects}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${totalProjects > 0 ? (collectedProjects / totalProjects) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Mode de jeu */}
          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('gameMode')}</div>
              <div className="stat-value">{difficultyConfig?.name || t('unknown')}</div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="speedrun-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
        >
          <button 
            className="btn-secondary resume-btn" 
            onClick={handleCloseClick}
          >
            <span>{t('resumeGame')}</span>
          </button>
          
          <button 
            className="btn-primary change-difficulty-btn"
            onClick={handleBackToModeSelection}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Effet de lueur animée qui traverse le bouton */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1
              }}
              style={{
                transform: 'skewX(-20deg)',
                filter: 'blur(1px)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
              <RotateCcw size={18} />
              <span>{t('changeDifficulty')}</span>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameInGameMenuPopup; 