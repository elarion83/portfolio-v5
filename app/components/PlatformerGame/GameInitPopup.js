"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Système d'internationalisation
const translations = {
  fr: {
    title: "Initialisation",
    objective: "Objectif :",
    objectiveText: "Découvrir les 20 projets cachés le plus rapidement possible ! Optimisez vos déplacements, maîtrisez les combos de combat et exploitez chaque raccourci. Votre temps sera enregistré - visez le speedrun parfait !",
    credits: "Crédits :",
    creditsText: "Jeu de plateforme original par ",
    creditsText2: "Adaptation, design et gamification par ",
    loading: "Chargement en cours...",
    seconds: "secondes",
    selectLanguage: "Choisissez votre langue :",
    startGame: "Lancer le jeu",
    ready: "Prêt à jouer ?",
    // Textes pour le jeu
    projectCollected: "Projet découvert !",
    discoverProject: "Découvrir le projet",
    continueAdventure: "Continuer l'aventure",
    gameControls: "Contrôles du jeu",
    movement: "Mouvement",
    actions: "Actions", 
    command: "Commande",
    company: "Entreprise",
    year: "Année",
    close: "Fermer",
    pressEscapeToClose: "Échap pour fermer",
    // Contrôles de jeu
    movement: "Déplacement :",
    basicActions: "Actions de base :",
    combat: "Combat :",
    debugTools: "Outils de debug :",
    mobileControls: "Sur mobile :",
    moveAnd : "et",
    moveLeftRight: "pour courir à gauche et à droite",
    jump: "pour sauter (2x pour DoubleJump)",
    crouch: "pour s'accroupir",
    slide: "en courant pour glisser",
    attack: "pour attaquer",
    aerialAttack: "en l'air pour attaque aérienne",
    toggleHitboxes: "pour afficher/masquer les hitboxes",
    zoomCamera: "pour changer le zoom de la caméra",
    mobileControlsText: "Utilisez les boutons tactiles affichés à l'écran pour contrôler votre personnage.",
    // Contrôles desktop en bas à gauche
    movementShort: "Mouvement",
    actionsShort: "Actions",
    commandShort: "Commande",
    controlsTooltip: "Cliquez pour voir tous les contrôles",
    // Bouton retour au site
    backToSite: "← Retour au site",
    // Speedrun et fin de jeu
    gameCompleted: "Jeu terminé !",
    allProjectsCollected: "Tous les projets ont été découverts !",
    finalTime: "Temps final",
    projectsCollected: "Projets collectés",
    rank: "Rang",
    legendary: "Légendaire",
    master: "Maître",
    expert: "Expert",
    skilled: "Talentueux",
    apprentice: "Apprenti",
    newBestTime: "🎉 Nouveau record !",
    newTopTime: "🎉 Nouveau top 5 !",
    bestTimes: "Meilleurs temps",
    playAgain: "Rejouer",
    backToPortfolio: "Retour au portfolio",
    shareScore: "Partager mon score",
    sharing: "Partage...",
    shareTitle: "J'ai terminé le jeu portfolio",
    shareFooter: "Jouez vous aussi et battez mon record !",
    shareSuccess: "Score copié dans le presse-papier !",
    shareImageSuccess: "Image téléchargée avec succès !",
    shareError: "Impossible de partager automatiquement. Voici votre score :",
    locale: "fr-FR",
    // Niveaux de difficulté
    difficulty: "Difficulté :",
    difficultyDiscovery: "Découverte",
    difficultyBattlefield: "Champs de bataille",
    difficultyDarkLord: "Seigneur des ténèbres",
    difficultyDescDiscovery: "Tous les projets - Peu d'ennemis",
    difficultyDescBattlefield: "15 projets - Beaucoup d'ennemis",
    difficultyDescDarkLord: "Tous les projets - Énormément d'ennemis - Un dégât = mort",
    // Popup de défaite
    gameOver: "Défaite !",
    deathMessage: "Vous avez succombé aux ténèbres...",
    darkLordDeathMessage: "En mode Seigneur des ténèbres, un seul contact avec l'ennemi est fatal. Relevez-vous et tentez à nouveau votre chance !",
    tryAgain: "Réessayer",
    // Étapes de la popup d'init
    step1LoadingTitle: "Initialisation",
    step1SelectionTitle: "Configuration",
    step2Title: "Règles de victoire",
    winCondition: "Condition de victoire :",
    winConditionText: "Collectez tous les projets portfolio le plus rapidement possible !",
    selectedMode: "Mode sélectionné :",
    backToChoices: "← Retour aux choix",
    startTheGame: "Commencer le jeu",
    getReady: "Préparez-vous...",
    // Blocs gameplay
    gameplayExplore: "Explorez",
    gameplayFight: "Combattez",
    gameplaySpeedrun: "Chronométrez"
  },
  en: {
    title: "Initialization",
    objective: "Objective:",
    objectiveText: "Discover all 20 hidden projects as fast as possible! Optimize your movement, master combat combos and exploit every shortcut. Your time will be recorded - aim for the perfect speedrun!",
    credits: "Credits:",
    creditsText: "Original platform game by ",
    creditsText2: "Adaptation, design and gamification by ",
    loading: "Loading...",
    seconds: "seconds",
    selectLanguage: "Choose your language:",
    startGame: "Start Game",
    ready: "Ready to play ?",
    // Textes pour le jeu
    projectCollected: "Project discovered!",
    discoverProject: "Discover project",
    continueAdventure: "Continue adventure",
    gameControls: "Game Controls",
    company: "Company",
    year: "Year",
    close: "Close",
    pressEscapeToClose: "Esc to close",
    // Contrôles de jeu
    movement: "Movement:",
    basicActions: "Basic actions:",
    combat: "Combat:",
    debugTools: "Debug tools:",
    mobileControls: "On mobile:",
    moveAnd : "and",
    moveLeftRight: "to run left and right",
    jump: "to jump (2x for DoubleJump)",
    crouch: "to crouch",
    slide: "while running to slide",
    attack: "to attack",
    aerialAttack: "in air for aerial attack",
    toggleHitboxes: "to show/hide hitboxes",
    zoomCamera: "to change camera zoom",
    mobileControlsText: "Use the touch buttons displayed on screen to control your character.",
    // Contrôles desktop en bas à gauche
    movementShort: "Movement",
    actionsShort: "Actions",
    commandShort: "Command",
    controlsTooltip: "Click to see all controls",
    // Bouton retour au site
    backToSite: "← Back to site",
    // Speedrun et fin de jeu
    gameCompleted: "Game Completed!",
    allProjectsCollected: "All projects have been discovered!",
    finalTime: "Final Time",
    projectsCollected: "Projects Collected",
    rank: "Rank",
    legendary: "Legendary",
    master: "Master",
    expert: "Expert",
    skilled: "Skilled",
    apprentice: "Apprentice",
    newBestTime: "🎉 New Best Time!",
    newTopTime: "🎉 New Top 5!",
    bestTimes: "Best Times",
    playAgain: "Play Again",
    backToPortfolio: "Back to Portfolio",
    shareScore: "Share my score",
    sharing: "Sharing...",
    shareTitle: "I completed the portfolio game",
    shareFooter: "Play and beat my record!",
    shareSuccess: "Score copied to clipboard!",
    shareImageSuccess: "Image downloaded successfully!",
    shareError: "Unable to share automatically. Here's your score:",
    locale: "en-US",
    // Niveaux de difficulté
    difficulty: "Difficulty:",
    difficultyDiscovery: "Discovery",
    difficultyBattlefield: "Battlefield",
    difficultyDarkLord: "Dark Lord",
    difficultyDescDiscovery: "All projects - Few enemies",
    difficultyDescBattlefield: "15 projects - Many enemies",
    difficultyDescDarkLord: "All projects - Tons of enemies - One hit = death",
    // Popup de défaite
    gameOver: "Game Over!",
    deathMessage: "You have succumbed to darkness...",
    darkLordDeathMessage: "In Dark Lord mode, a single contact with the enemy is fatal. Rise up and try again!",
    tryAgain: "Try Again",
    // Étapes de la popup d'init
    step1LoadingTitle: "Initialization",
    step1SelectionTitle: "Configuration",
    step2Title: "Victory Rules",
    winCondition: "Victory condition:",
    winConditionText: "Collect all portfolio projects as fast as possible!",
    selectedMode: "Selected mode:",
    backToChoices: "← Back to choices",
    startTheGame: "Start the game",
    getReady: "Get ready...",
    // Blocs gameplay
    gameplayExplore: "Explore",
    gameplayFight: "Fight",
    gameplaySpeedrun: "Speedrun"
  }
};

// Contexte pour la langue
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');
  
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Spinner hexagonal personnalisé (défini en dehors pour éviter les resets)
const GameSpinner = () => {
  const size = 50;
  const center = size / 2;
  const radius = size * 0.4;
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  });
  const hexagonPath = `M ${points.join(' L ')} Z`;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      <motion.path
        d={hexagonPath}
        stroke="#e28d1d"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: [0, 1, 0],
          stroke: [
            "#e28d1d",
            "#ff3d00", 
            "#ff00d4",
            "#00ff00",
            "#e28d1d"
          ]
        }}
        transition={{
          pathLength: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          stroke: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />
    </motion.svg>
  );
};

const GameInitPopup = ({ isVisible, onGameStart, resetKey }) => {
  const [step, setStep] = useState(1); // 1 ou 2
  const [loadingCountdown, setLoadingCountdown] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [finalCountdown, setFinalCountdown] = useState(5);
  const [showFinalCountdown, setShowFinalCountdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedDifficulty, setSelectedDifficulty] = useState('discovery');
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);
  const [victoryConditionsExiting, setVictoryConditionsExiting] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Réinitialiser tous les états quand resetKey change
  useEffect(() => {
    if (resetKey) {
      setStep(1);
      setLoadingCountdown(5);
      setIsLoaded(true); // Directement chargé, pas de spinner
      // hasLoadedOnce reste true pour éviter le spinner
      setFinalCountdown(5);
      setShowFinalCountdown(false);
      setSelectedDifficulty('discovery');
      setIsDifficultyDropdownOpen(false);
      setVictoryConditionsExiting(false);
    }
  }, [resetKey]);

  // Configuration des difficultés
  const difficulties = {
    discovery: {
      name: t('difficultyDiscovery'),
      description: t('difficultyDescDiscovery'),
      icon: '🌟',
      projectsRequired: process.env.NODE_ENV === 'development' ? 5 : 20,
      enemyMultiplier: 0.5,
      oneHitKill: false
    },
    battlefield: {
      name: t('difficultyBattlefield'),
      description: t('difficultyDescBattlefield'),
      icon: '⚔️',
      projectsRequired: process.env.NODE_ENV === 'development' ? 3 : 15,
      enemyMultiplier: 2.0,
      oneHitKill: false
    },
    darklord: {
      name: t('difficultyDarkLord'),
      description: t('difficultyDescDarkLord'),
      icon: '💀',
      projectsRequired: process.env.NODE_ENV === 'development' ? 5 : 20,
      enemyMultiplier: 3.0,
      oneHitKill: true
    }
  };

  // Étape 1: Chargement initial
  useEffect(() => {
    if (!isVisible || step !== 1) return;

    // Si on a déjà chargé une fois, on affiche directement la sélection
    if (hasLoadedOnce) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    setLoadingCountdown(5);

    const timer = setInterval(() => {
      setLoadingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLoaded(true);
          setHasLoadedOnce(true); // Marquer comme chargé
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, step, hasLoadedOnce]);

  // Étape 2: Compteur final
  useEffect(() => {
    if (!showFinalCountdown) return;

    const timer = setInterval(() => {
      setFinalCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Lancer le jeu
          if (onGameStart) {
            onGameStart(difficulties[selectedDifficulty]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showFinalCountdown]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDifficultyDropdownOpen && !event.target.closest('.difficulty-dropdown')) {
        setIsDifficultyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDifficultyDropdownOpen]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleProceedToStep2 = () => {
    setStep(2);
    setFinalCountdown(5);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setShowFinalCountdown(false);
    setFinalCountdown(5);
    setVictoryConditionsExiting(false);
  };

  const handleStartFinalCountdown = () => {
    // Déclencher l'animation de sortie des conditions de victoire
    setVictoryConditionsExiting(true);
    
    // Attendre la fin de l'animation avant de démarrer le countdown
    setTimeout(() => {
      setShowFinalCountdown(true);
    }, 600); // 600ms pour laisser le temps aux animations de remontée
  };

  const handleDirectStart = () => {
    if (onGameStart) {
      onGameStart(difficulties[selectedDifficulty]);
    }
  };

  const handleDifficultySelect = (difficultyKey) => {
    setSelectedDifficulty(difficultyKey);
    setIsDifficultyDropdownOpen(false);
  };

  if (!isVisible) return null;

  return (
          <div className={`game-init-overlay ${selectedDifficulty === 'darklord' ? 'dark-lord-mode' : ''}`}>
        <div className={`game-init-popup ${selectedDifficulty === 'darklord' ? 'dark-lord-mode' : ''}`}>
        <div className="game-init-content">
          {/* Bouton retour au site discret en haut */}
          <a 
            href="/" 
            className="back-to-site-btn"
            title={t('backToSite')}
          >
            {t('backToSite')}
          </a>
          
          {/* Language switcher compact en haut */}
          <div className="language-switcher-compact">
            <button 
              className={`lang-btn-compact ${selectedLanguage === 'fr' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('fr')}
            >
              🇫🇷 FR
            </button>
            <button 
              className={`lang-btn-compact ${selectedLanguage === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              🇬🇧 EN
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {/* ÉTAPE 1: Initialisation + Sélection du mode */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
            <AnimatePresence mode="wait">
                  {!isLoaded && (
                <motion.div 
                      key="loading"
                      className="step1-loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                      <h2 className="game-init-title">{t('step1LoadingTitle')}</h2>
                      <div className="game-init-spinner-container">
                  <GameSpinner />
              </div>
                </motion.div>
              )}
              
                  {isLoaded && (
                <motion.div 
                      key="selection"
                      className="step1-selection"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                      <h2 className="game-init-title">{t('step1SelectionTitle')}</h2>
                      
                      {/* Blocs de gameplay */}
                      <div className="gameplay-blocks">
                        <div className="gameplay-block">
                          <div className="gameplay-icon">🗺️</div>
                          <h4>{t('gameplayExplore')}</h4>
                        </div>
                        <div className="gameplay-block">
                          <div className="gameplay-icon">⚔️</div>
                          <h4>{t('gameplayFight')}</h4>
                        </div>
                        <div className="gameplay-block">
                          <div className="gameplay-icon">⏱️</div>
                          <h4>{t('gameplaySpeedrun')}</h4>
                        </div>
                      </div>
                  
                  {/* Sélecteur de difficulté */}
                      <div className="difficulty-section compact">
                    <div className="difficulty-label">{t('difficulty')}</div>
                    <div className="difficulty-dropdown">
                      <button 
                        className="difficulty-selector"
                        onClick={() => setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                      >
                        <span className="difficulty-icon">{difficulties[selectedDifficulty].icon}</span>
                        <span className="difficulty-name">{difficulties[selectedDifficulty].name}</span>
                        <span className={`difficulty-arrow ${isDifficultyDropdownOpen ? 'open' : ''}`}>▼</span>
                      </button>
                      
                      {isDifficultyDropdownOpen && (
                        <motion.div 
                          className="difficulty-options"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {Object.entries(difficulties).map(([key, difficulty]) => (
                            <button
                              key={key}
                              className={`difficulty-option ${selectedDifficulty === key ? 'selected' : ''}`}
                              onClick={() => handleDifficultySelect(key)}
                            >
                              <div className="difficulty-option-header">
                                <span className="difficulty-option-icon">{difficulty.icon}</span>
                                <span className="difficulty-option-name">{difficulty.name}</span>
                              </div>
                              <div className="difficulty-option-desc">{difficulty.description}</div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                        className="start-game-btn compact"
                        onClick={handleProceedToStep2}
                  >
                    {t('startGame')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
              </motion.div>
            )}

            {/* ÉTAPE 2: Règles + Confirmation */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >

                <div className="step2-content">
                  {/* Règles de victoire */}
                  <motion.div 
                    className="game-init-section"
                    animate={victoryConditionsExiting ? { 
                      opacity: 0, 
                      y: -30,
                      scale: 0.95 
                    } : { 
                      opacity: 1, 
                      y: 0,
                      scale: 1 
                    }}
                    transition={{ 
                      duration: 0.5, 
                      ease: "easeInOut" 
                    }}
                  >
                    <h3>{t('winCondition')}</h3>
                    <p>{t('winConditionText')}</p>
                  </motion.div>

                  {/* Détails du mode sélectionné */}
                  <motion.div 
                    className="game-init-section"
                    animate={victoryConditionsExiting ? { 
                      y: -80,
                      transition: { duration: 0.6, ease: "easeInOut", delay: 0.1 }
                    } : { 
                      y: 0,
                      transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                  >
                    <h3>{t('selectedMode')}</h3>
                    <div className="selected-difficulty-display">
                      <span className="difficulty-icon-large">{difficulties[selectedDifficulty].icon}</span>
                      <div className="difficulty-details">
                        <div className="difficulty-name-large">{difficulties[selectedDifficulty].name}</div>
                        <div className="difficulty-desc-large">{difficulties[selectedDifficulty].description}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Compteur ou bouton de démarrage */}
                  <motion.div 
                    className="step2-actions"
                    animate={victoryConditionsExiting ? { 
                      y: -80,
                      transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 }
                    } : { 
                      y: 0,
                      transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                  >
                    {!showFinalCountdown ? (
                      <>
                        <button 
                          className="btn-secondary back-btn"
                          onClick={handleBackToStep1}
                        >
                          {t('backToChoices')}
                        </button>
                        <button 
                          className="start-game-btn primary"
                          onClick={handleStartFinalCountdown}
                        >
                          {t('getReady')}
                        </button>
                      </>
                    ) : (
                      <div className="final-countdown-section">
                        <AnimatePresence mode="wait">
                          {finalCountdown > 0 ? (
                            <motion.div
                              key="countdown"
                              className="final-countdown"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 1.2, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="final-countdown-number">{finalCountdown}</span>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="start-button"
                              className="start-game-btn final"
                              onClick={handleDirectStart}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {t('startTheGame')}
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
          </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Footer avec crédits */}
          {step === 1 && <div className="game-init-footer" style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div className="credits-text" style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '0',
              lineHeight: '1.5'
            }}>
              <div style={{ marginBottom: '4px' }}>
                {t('creditsText')}
                <a 
                  href="https://github.com/MichaelXF/react-platformer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="game-init-link"
                  style={{
                    fontSize: '11px',
                    color: 'rgba(226, 141, 29, 0.8)',
                    textDecoration: 'none'
                  }}
                >
                  Michael Brasington (MichaelXF)
                </a>.
              </div>
              <div>
                {t('creditsText2')}
                <a 
                  href="https://www.linkedin.com/in/nicolas-gruwe-b4805587/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="game-init-link"
                  style={{
                    fontSize: '11px',
                    color: 'rgba(226, 141, 29, 0.8)',
                    textDecoration: 'none'
                  }}
                >
                  Nicolas Gruwe
                </a>
                .
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default GameInitPopup; 