"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';
import { RotateCcw, Settings, Pause } from 'lucide-react';

const PauseMenuPopup = ({ isVisible, onQuickRestart, onBackToModeSelection, onResume, currentDifficulty }) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="pause-menu-overlay">
      <motion.div 
        className="pause-menu-popup"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="pause-menu-header">
          <motion.div 
            className="pause-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          >
            <Pause size={32} />
          </motion.div>
          
          <motion.h2 
            className="pause-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {t('gamePaused')}
          </motion.h2>
        </div>

        {/* Mode actuel */}
        {currentDifficulty && (
          <motion.div 
            className="current-mode-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3>{t('currentMode')}</h3>
            <div className="mode-info">
              <span className="mode-icon">{currentDifficulty.icon}</span>
              <div className="mode-details">
                <div className="mode-name">{currentDifficulty.name}</div>
                <div className="mode-desc">{currentDifficulty.description}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div 
          className="pause-menu-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <button 
            className="btn-primary resume-btn" 
            onClick={onResume}
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
            <span style={{ position: 'relative', zIndex: 10, color: '#ffffff' }}>
              {t('resumeGame')}
            </span>
          </button>
          
          <button 
            className="btn-secondary quick-restart-btn" 
            onClick={onQuickRestart}
          >
            <RotateCcw size={18} />
            <span>{t('quickRestart')}</span>
          </button>
          
          <button 
            className="btn-secondary mode-selection-btn" 
            onClick={onBackToModeSelection}
          >
            <Settings size={18} />
            <span>{t('changeDifficulty')}</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PauseMenuPopup; 