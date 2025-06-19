"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';

const ProjectPopup = ({ isVisible, projectData, onClose }) => {
  const [showContent, setShowContent] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible && !isClosing) {
        startCloseAnimation();
        setTimeout(() => onClose(), 300);
      }
    };

    if (isVisible) {
      setShouldRender(true);
      setIsClosing(false);
      window.addEventListener('keydown', handleEscape);
      // Réinitialiser l'état du contenu
      setShowContent(false);
      setShowParticles(false);
      
      // Déclencher les particules dès l'ouverture
      const particleTimer = setTimeout(() => {
        setShowParticles(true);
      }, 100); // Particules immédiatement visibles
      
      // Délai avant d'afficher le contenu avec animation
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 2000); // 2000ms = 2 secondes de délai pour n'afficher que le header

      return () => {
        clearTimeout(particleTimer);
        clearTimeout(contentTimer);
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isVisible, shouldRender, isClosing]);

  const startCloseAnimation = () => {
    if (!isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // 300ms pour l'animation de fermeture
    }
  };

  // Gérer la fermeture externe (quand isVisible devient false depuis le parent)
  useEffect(() => {
    if (!isVisible && shouldRender && !isClosing) {
      startCloseAnimation();
    }
  }, [isVisible, shouldRender, isClosing]);

  // Ne pas afficher si pas de données ou si la popup n'a jamais été visible
  if (!projectData || (!isVisible && !shouldRender)) return null;

  const handleOverlayClick = (e) => {
    // Empêcher la fermeture sur mobile pendant la phase 1 (premières 2 secondes)
    if (e.target === e.currentTarget && showContent) {
      startCloseAnimation();
      setTimeout(() => onClose(), 300);
    }
  };

  const handleCloseClick = () => {
    startCloseAnimation();
    setTimeout(() => onClose(), 300);
  };

  const handleVisitProject = () => {
    if (projectData.title) {
      // Nettoyer le titre et générer le slug de la même manière que dans le portfolio
      const cleanTitle = projectData.title.replace(/\s*\(\d{4}\)$/, '');
      const slug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const portfolioUrl = `/portfolio/${slug}`;
      window.open(portfolioUrl, '_blank');
    }
  };

  return (
    <div className={`game-init-overlay ${isClosing ? 'closing' : ''}`} onClick={handleOverlayClick}>
      <div 
        className={`project-popup ${!showContent ? 'phase-1' : 'phase-2'} ${isClosing ? 'closing' : ''}`}
        style={{ 
          minHeight: !showContent ? '90px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          // Bordure verte moderne pendant la première phase (réussite)
          border: !showContent ? '3px solid #10b981' : '1px solid rgba(226, 141, 29, 0.2)',
          boxShadow: !showContent 
            ? '0 0 25px rgba(16, 185, 129, 0.4), 0 0 50px rgba(52, 211, 153, 0.2), inset 0 0 15px rgba(110, 231, 183, 0.1)' 
            : '0 10px 30px rgba(0, 0, 0, 0.3)',
          // Transition fluide pour les changements de style
          transition: 'border 0.5s ease, box-shadow 0.5s ease',
          position: 'relative'
        }}
      >
        {/* Particules d'ouverture */}
        {showParticles && !showContent && (
          <div className="popup-particles">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={`popup-particle popup-particle-${i}`}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </div>
        )}
        <div className="game-init-content" style={{ flex: 1 }}>
          {/* Bouton de fermeture moderne - masqué pendant la phase 1 */}
          <button 
            className="project-popup-close-btn modern-close" 
            onClick={handleCloseClick}
            aria-label={t('close')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              zIndex: 20,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: showContent ? 'flex' : 'none', // Masquer pendant la phase 1
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))';
              e.target.style.transform = 'scale(1.1) rotate(90deg)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))';
              e.target.style.transform = 'scale(1) rotate(0deg)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
              }}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <motion.div 
            className="project-popup-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={!showContent ? { background: 'none', padding: 0 } : { display: 'none' }}
          >
            {!showContent && (
              <h2 
                className="game-init-title"
                style={{
                  padding: '20px 24px',
                  paddingBottom: '0px',
                  backgroundColor: 'rgba(38, 25, 57, 0.95)',
                  borderRadius: '20px 20px 0 0',
                  margin: '0',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  // Couleur verte moderne et vibrante pour la réussite
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(52, 211, 153, 0.3)',
                  filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
                }}
              >
                <b>{t('projectCollected')}</b>
              </h2>
            )}
          </motion.div>
          
          <motion.div 
            className="project-popup-content"
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ 
              opacity: showContent ? 1 : 0,
              maxHeight: showContent ? '1000px' : 0
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { delay: showContent ? 0.2 : 0 }
            }}
            style={{ overflow: 'hidden' }}
          >
            {/* Hero section avec image et overlay */}
            <div className="project-hero-section">
              <div className="project-image-container">
                {projectData.imageUrl ? (
                  <img 
                    src={projectData.imageUrl} 
                    alt={projectData.title}
                    className="project-image"
                  />
                ) : (
                  <div className="project-image-placeholder">
                    <div className="placeholder-icon"></div>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="project-image-overlay"></div>
                
                {/* Contenu superposé */}
                <div className="project-overlay-content">
                  <h3 className="project-title">
                    {projectData.title ? projectData.title.replace(/\s*\(\d{4}\)$/, '') : ''}
                  </h3>
                  
                  {/* Badge technologie */}
                  {projectData.description && (
                    <div className="project-tech-badge">
                      <div className="tech-badge-icon"></div>
                      <span>{projectData.description}</span>
                    </div>
                  )}
                </div>
                
                {/* Logo projet */}
                {projectData.logoUrl && (
                  <div 
                    className="project-logo-corner"
                    style={{
                      // Repositionner en haut à gauche quand la popup est ouverte
                      left: showContent ? '24px' : 'auto',
                      right: showContent ? 'auto' : '24px',
                      top: '20px',
                      transition: 'all 0.5s ease',
                      // Supprimer l'encadré blanc et agrandir
                      background: 'none',
                      padding: '0',
                      border: 'none',
                      backdropFilter: 'none',
                      width: showContent ? '80px' : '48px',
                      height: showContent ? '80px' : '48px'
                    }}
                  >
                    <img 
                      src={projectData.logoUrl} 
                      alt={`Logo ${projectData.title}`}
                      className="project-logo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        // Filtres pour faire ressortir le logo
                        filter: showContent 
                          ? 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) brightness(1.1) contrast(1.2)'
                          : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4)) brightness(1.05)',
                        transition: 'all 0.5s ease'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section métadonnées et actions */}
            <div className="project-bottom-section">
              {/* Métadonnées */}
              <div className="project-metadata">
                {projectData.department && (
                  <div className="metadata-item">
                    <div className="metadata-label">{t('company')}</div>
                    <div className="metadata-value">{projectData.department}</div>
                  </div>
                )}
                {projectData.year && (
                  <div className="metadata-item">
                    <div className="metadata-label">{t('year')}</div>
                    <div className="metadata-value">{projectData.year}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="project-actions">
                <button 
                  className="btn-primary"
                  onClick={handleVisitProject}
                >
                  <span className="btn-text">{t('discoverProject')}</span>
                  <div className="btn-arrow">→</div>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={handleCloseClick}
                >
                  {t('continueAdventure')}
                </button>
              </div>
              
              {/* Instruction de fermeture discrète */}
              <div className="project-close-hint">
                <span>{t('pressEscapeToClose')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPopup; 