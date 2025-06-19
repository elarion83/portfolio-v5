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
      }, 1000); // 1000ms = 1 seconde de délai pour n'afficher que le header

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
    if (e.target === e.currentTarget) {
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
          {/* Bouton de fermeture toujours visible */}
          <button 
            className="project-popup-close-btn" 
            onClick={handleCloseClick}
            aria-label={t('close')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 20
            }}
          >
            ×
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
                  // Couleur verte moderne et vibrante pour la réussite
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(52, 211, 153, 0.3)',
                  filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
                }}
              >
              <b>   {t('projectCollected')} </b>
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
                  <div className="project-logo-corner">
                    <img 
                      src={projectData.logoUrl} 
                      alt={`Logo ${projectData.title}`}
                      className="project-logo"
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