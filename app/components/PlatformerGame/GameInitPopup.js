import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Système d'internationalisation
const translations = {
  fr: {
    title: "Initialisation",
    objective: "Objectif :",
    objectiveText: "Explorez ce monde de plateformes et découvrez les projets de mon portfolio ! Sautez, évitez les ennemis rouges et appuyez sur E pour collecter chaque projet.",
    credits: "Crédits :",
    creditsText: "Jeu de plateforme original par ",
    creditsText2: ". Adaptation, design et gamification par ",
    loading: "Chargement en cours...",
    seconds: "secondes",
    selectLanguage: "Choisissez votre langue :",
    startGame: "Lancer le jeu",
    ready: "Prêt à jouer !",
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
    // Contrôles de jeu
    movement: "Déplacement :",
    basicActions: "Actions de base :",
    combat: "Combat :",
    debugTools: "Outils de debug :",
    mobileControls: "Sur mobile :",
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
    controlsTooltip: "Cliquez pour voir tous les contrôles"
  },
  en: {
    title: "Initialization",
    objective: "Objective:",
    objectiveText: "Explore this platform world and collect the projects from my portfolio! Jump, avoid red enemies and press E to collect each project.",
    credits: "Credits:",
    creditsText: "Original platform game by ",
    creditsText2: ". Adaptation, design and gamification by ",
    loading: "Loading...",
    seconds: "seconds",
    selectLanguage: "Choose your language:",
    startGame: "Start Game",
    ready: "Ready to play!",
    // Textes pour le jeu
    projectCollected: "Project discovered!",
    discoverProject: "Discover project",
    continueAdventure: "Continue adventure",
    gameControls: "Game Controls",
    company: "Company",
    year: "Year",
    close: "Close",
    // Contrôles de jeu
    movement: "Movement:",
    basicActions: "Basic actions:",
    combat: "Combat:",
    debugTools: "Debug tools:",
    mobileControls: "On mobile:",
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
    controlsTooltip: "Click to see all controls"
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

const GameInitPopup = ({ isVisible, onGameStart }) => {
  const [countdown, setCountdown] = useState(13);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLoaded(true); // Au lieu de lancer automatiquement
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleStartGame = () => {
    if (onGameStart) {
      onGameStart();
    }
  };

  if (!isVisible) return null;

  const showCountdown = countdown > 0;
  const showLanguageSelection = isLoaded;
  const showSpinner = countdown > 5; // Spinner visible seulement pendant les 5 premières secondes
  const showCountdownOnly = countdown <= 5 && countdown > 0; // Countdown seul pendant les 5 dernières secondes

  // Spinner hexagonal personnalisé pour la modale
  const GameSpinner = () => {
    const size = 50; // Taille réduite
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

  return (
    <div className="game-init-overlay">
      <div className="game-init-popup">
        <div className="game-init-content">
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
          
          <div className="game-init-section">
            <h3>{t('objective')}</h3>
            <p>{t('objectiveText')}</p>
          </div>

          <div className="game-init-section">
            <h3>{t('credits')}</h3>
            <p>
              {t('creditsText')}
              <a 
                href="https://github.com/MichaelXF/react-platformer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="game-init-link"
              >
                Michael Brasington (MichaelXF)
              </a>
              {t('creditsText2')}
              <a 
                href="https://www.linkedin.com/in/nicolas-gruwe-b4805587/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="game-init-link"
              >
                Nicolas Gruwe
              </a>
              .
            </p>
          </div>

          <div className="game-init-loading">

            {showSpinner && (
              <h2 className="game-init-title">{t('title')}</h2>
            )}

            <AnimatePresence mode="wait">
              {showSpinner && (
                <motion.div 
                  key="spinner"
                  className="game-init-spinner-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <GameSpinner />
                </motion.div>
              )}
              
              {showCountdownOnly && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <p>{t('loading')}</p>
              <div className="game-init-countdown">
                <span className="countdown-number">{countdown}</span>
                    <span className="countdown-text">{t('seconds')}</span>
              </div>
                </motion.div>
              )}
              
              {showLanguageSelection && (
                <motion.div 
                  key="language-selection"
                  className="game-language-selection"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h3 className="language-title">{t('ready')}</h3>
                  
                  <button 
                    className="start-game-btn"
                    onClick={handleStartGame}
                  >
                    {t('startGame')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInitPopup; 