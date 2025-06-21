"use client";

import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Système d'internationalisation
const translations = {
  fr: {
    title: "Initialisation",
    objective: "Objectif :",
    objectiveText: "Découvrir tous les projets cachés le plus rapidement possible ! Optimisez vos déplacements, maîtrisez les combos de combat et exploitez chaque raccourci. Votre temps sera enregistré - visez le speedrun parfait !",
    credits: "Crédits :",
    creditsText: "Jeu de plateforme original par ",
    creditsText2: "Adaptation, design et gamification par ",
    loading: "Chargement en cours...",
    seconds: "secondes",
    selectLanguage: "Choisissez votre langue :",
    startGame: "Continuer",
    ready: "Prêt à jouer ?",
    // Textes pour le jeu
    projectCollected: "Projet découvert !",
    discoverProject: "Découvrir en détail",
    continueAdventure: "Continuer l'aventure",
    gameControls: "Contrôles du jeu",
    movement: "Mouvement",
    actions: "Actions", 
    command: "Commande",
    technology: "Technologie",
    company: "Entreprise",
    year: "Année",
    close: "Fermer",
    // Métriques PageSpeed
    performance: "Performance",
    accessibility: "Accessibilité",
    bestPractices: "Bonnes pratiques",
    seo: "SEO",
    pressEscapeToClose: "Échap pour fermer",
    // Contrôles de jeu
    movement: "Déplacement :",
    basicActions: "Actions de base :",
    projectActions: "Actions projet :",
    combat: "Combat :",
    debugTools: "Outils de debug :",
    mobileControls: "Sur mobile :",
    moveAnd : "et",
    moveLeftRight: "pour courir à gauche et à droite",
    jump: "pour sauter (2x pour DoubleJump)",
    crouch: "pour s'accroupir",
    slide: "en courant pour glisser",
    collectProject: "pour collecter un projet",
    attack: "pour attaquer",
    aerialAttack: "en l'air pour attaque aérienne",
    toggleHitboxes: "pour afficher/masquer les hitboxes",
    zoomCamera: "pour changer le zoom de la caméra",
    mobileControlsText: "Utilisez les boutons tactiles affichés à l'écran pour contrôler votre personnage.",
    // Contrôles desktop en bas à gauche
    movementShort: "Mouvement",
    actionsShort: "Actions",
    zoomShort: "Zoom",
    commandShort: "Commande",
    controlsTooltip: "Cliquez pour voir tous les contrôles",
    pauseTooltip: "Ouvrir le menu de pause",
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
    // Concept du jeu
    gameConceptIntro: "Découvrez mon portfolio à travers un jeu-vidéo platformer interactif",
    // Menu de pause
    gamePaused: "Jeu en pause",
    gameMenu: "Menu du jeu",
    gameInProgress: "Partie en cours",
    currentTime: "Temps actuel",
    currentMode: "Mode actuel :",
    resumeGame: "[Échap] Reprendre",
    resumeGameMobile: "Reprendre",
    quickRestart: "Recommencer",
    changeDifficulty: "Changer de mode",
    time: "Temps",
    projectsCollected: "Projets collectés",
    // Niveaux de difficulté
    difficulty: "Mode",
    difficultyQuick: "Partie rapide",
    difficultyDiscovery: "Histoire",
    difficultyBattlefield: "Champs de bataille",
    difficultyDarkLord: "Seigneur des ténèbres",
    difficultyDescQuick: "10 projets - Peu d'ennemis - Idéal pour découvrir",
    difficultyDescDiscovery: "Retracer mon histoire sur le web - 35 projets chronologiques",
    difficultyDescBattlefield: "15 projets - Beaucoup d'ennemis",
    difficultyDescDarkLord: "35 projets - Énormément d'ennemis - Un dégât = mort",
    // Popup de défaite
    gameOver: "Défaite !",
    deathMessage: "Vous avez succombé aux ténèbres...",
    healthSystemSubtitle: "Votre énergie vitale est épuisée...",
    darkLordDeathMessage: "En mode Seigneur des ténèbres, un seul contact avec l'ennemi est fatal. Relevez-vous et tentez à nouveau votre chance !",
    healthSystemDeathMessage: "Vous avez perdu toute votre énergie vitale face aux ennemis. Récupérez vos forces et recommencez l'aventure !",
    tryAgain: "Réessayer",
    // Étapes de la popup d'init
    step1LoadingTitle: "Initialisation",
    step1SelectionTitle: "Configuration",
    step2Title: "Règles de victoire",
    winCondition: "Condition de victoire :",
    winConditionText: "Collectez tous les projets portfolio le plus rapidement possible !",
    selectedMode: "Mode sélectionné :",
    backToChoices: "← Choix du mode",
    startTheGame: "Commencer le jeu",
    getReady: "Préparez-vous...",
    // Blocs gameplay
    gameplayExplore: "Explorez",
    gameplayFight: "Combattez",
    gameplaySpeedrun: "Chronométrez",
    // Caractéristiques du mode
    modeFeatures: "Caractéristiques :",
    noTimer: "Ordre chronologique",
    withTimer: "Chrono activé",
    projectsToCollect: "Projets à collecter",
    healthPoints: "Points de vie",
    infiniteHealth: "Vie infinie",
    simultaneousProjects: "Projet(s) simultané(s)",
    // Astuces
    tips: "Astuces",
    tipDoubleJump: "Sautez 2x pour double jump",
    tipCollect: "[O] collecte les projets",
    tipItems: "Les items boostent vos stats !",
    tipCombat: "Enchaînez les attaques",
    tipWallJump: "Sautez sur les murs",
    tipPause: "Faites pause en jeu pour revenir ici",
    tipSpeed: "Soyez rapide et battez vos amis !"
  },
  en: {
    title: "Initialization",
    objective: "Objective:",
    objectiveText: "Discover all hidden projects as fast as possible! Optimize your movement, master combat combos and exploit every shortcut. Your time will be recorded - aim for the perfect speedrun!",
    credits: "Credits:",
    creditsText: "Original platform game by ",
    creditsText2: "Adaptation, design and gamification by ",
    loading: "Loading...",
    seconds: "seconds",
    selectLanguage: "Choose your language:",
    startGame: "Continue",
    ready: "Ready to play ?",
    // Textes pour le jeu
    projectCollected: "Project opened!",
    discoverProject: "Discover in detail",
    continueAdventure: "Continue adventure",
    gameControls: "Game Controls",
    technology: "Technology",
    company: "Company",
    year: "Year",
    close: "Close",
    // PageSpeed Metrics
    performance: "Performance",
    accessibility: "Accessibility",
    bestPractices: "Best Practices",
    seo: "SEO",
    pressEscapeToClose: "Esc to close",
    // Contrôles de jeu
    movement: "Movement:",
    basicActions: "Basic actions:",
    projectActions: "Project actions:",
    combat: "Combat:",
    debugTools: "Debug tools:",
    mobileControls: "On mobile:",
    moveAnd : "and",
    moveLeftRight: "to run left and right",
    jump: "to jump (2x for DoubleJump)",
    crouch: "to crouch",
    slide: "while running to slide",
    collectProject: "to collect a project",
    attack: "to attack",
    aerialAttack: "in air for aerial attack",
    toggleHitboxes: "to show/hide hitboxes",
    zoomCamera: "to change camera zoom",
    mobileControlsText: "Use the touch buttons displayed on screen to control your character.",
    // Contrôles desktop en bas à gauche
    movementShort: "Movement",
    actionsShort: "Actions",
    zoomShort: "Zoom",
    commandShort: "Command",
    controlsTooltip: "Click to see all controls",
    pauseTooltip: "Open pause menu",
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
    // Concept du jeu
    gameConceptIntro: "Discover my portfolio through an interactive platformer",
    // Menu de pause
    gamePaused: "Game Paused",
    gameMenu: "Game Menu",
    gameInProgress: "Game in Progress",
    currentTime: "Current Time",
    currentMode: "Current mode:",
    resumeGame: "[Esc] Resume",
    resumeGameMobile: "Resume",
    quickRestart: "Quick Restart",
    changeDifficulty: "Change Mode",
    time: "Time",
    projectsCollected: "Projects Collected",
    // Niveaux de difficulté
    difficulty: "Mode",
    difficultyQuick: "Quick Game",
    difficultyDiscovery: "Story",
    difficultyBattlefield: "Battlefield",
    difficultyDarkLord: "Dark Lord",
    difficultyDescQuick: "10 projects - Few enemies - Perfect to discover",
    difficultyDescDiscovery: "Trace my web history - 35 chronological projects",
    difficultyDescBattlefield: "15 projects - Many enemies",
    difficultyDescDarkLord: "35 projects - Tons of enemies - One hit = death",
    // Popup de défaite
    gameOver: "Game Over!",
    deathMessage: "You have succumbed to darkness...",
    healthSystemSubtitle: "Your vital energy is depleted...",
    darkLordDeathMessage: "In Dark Lord mode, a single contact with the enemy is fatal. Rise up and try again!",
    healthSystemDeathMessage: "You have lost all your vital energy against the enemies. Recover your strength and start the adventure again!",
    tryAgain: "Try Again",
    // Étapes de la popup d'init
    step1LoadingTitle: "Initialization",
    step1SelectionTitle: "Configuration",
    step2Title: "Victory Rules",
    winCondition: "Victory condition:",
    winConditionText: "Collect all portfolio projects as fast as possible!",
    selectedMode: "Selected mode:",
    backToChoices: "← Mode choice",
    startTheGame: "Start the game",
    getReady: "Get ready...",
    // Blocs gameplay
    gameplayExplore: "Explore",
    gameplayFight: "Fight",
    gameplaySpeedrun: "Speedrun",
    // Caractéristiques du mode
    modeFeatures: "Features:",
    noTimer: "Chronological order",
    withTimer: "Timer enabled",
    projectsToCollect: "Projects to collect",
    healthPoints: "Health points",
    infiniteHealth: "Infinite health",
    simultaneousProjects: "Simultaneous projects",
    // Astuces
    tips: "Tips",
    tipDoubleJump: "Jump 2x for double jump",
    tipCollect: "[O] collect projects",
    tipItems: "Items boost your stats!",
    tipCombat: "Chain your attacks",
    tipWallJump: "Jump on walls",
    tipPause: "Pause in-game to come back here",
    tipSpeed: "Be fast and beat your friends!"
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
  const [selectedDifficulty, setSelectedDifficulty] = useState('quick');
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [tipsCollapsing, setTipsCollapsing] = useState(false);
  
  // Nouvel état pour les données API
  const [portfolioData, setPortfolioData] = useState(null);
  const [apiError, setApiError] = useState(null);
  
  const { language, setLanguage, t } = useLanguage();

  // Liste des astuces mémorisée
  const tips = useMemo(() => [
    t('tipDoubleJump'),
    t('tipCollect'),
    t('tipItems'),
    t('tipCombat'),
    t('tipWallJump'),
    t('tipPause'),
    t('tipSpeed')
  ], [t]);

  // Réinitialiser tous les états quand resetKey change
  useEffect(() => {
    if (resetKey) {
      // Utiliser setTimeout pour éviter les mises à jour pendant le rendu
      setTimeout(() => {
        setStep(1);
        setLoadingCountdown(5);
        setIsLoaded(true); // Directement chargé, pas de spinner
        // hasLoadedOnce reste true pour éviter le spinner
        setFinalCountdown(5);
        setShowFinalCountdown(false);
        setTipsCollapsing(false);
        setSelectedDifficulty('quick');
        setIsDifficultyDropdownOpen(false);
      }, 0);
    }
  }, [resetKey]);

  // Configuration des difficultés mémorisée
  const difficulties = useMemo(() => ({
    quick: {
      name: t('difficultyQuick'),
      description: t('difficultyDescQuick'),
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
      projectsRequired: process.env.NODE_ENV === 'development' ? 2 : 10,
      enemyMultiplier: 0.3,
      oneHitKill: false
    },
    discovery: {
      name: t('difficultyDiscovery'),
      description: t('difficultyDescDiscovery'),
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      projectsRequired: process.env.NODE_ENV === 'development' ? 2 : 35,
      enemyMultiplier: 0.5,
      oneHitKill: false
    },
    battlefield: {
      name: t('difficultyBattlefield'),
      description: t('difficultyDescBattlefield'),
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>,
      projectsRequired: process.env.NODE_ENV === 'development' ? 2 : 15,
      enemyMultiplier: 2.0,
      oneHitKill: false
    },
    darklord: {
      name: t('difficultyDarkLord'),
      description: t('difficultyDescDarkLord'),
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"/><path d="M16 8a8 8 0 1 0-16 0c0 1.28.77 2.36 2.3 2.83A6 6 0 0 0 8 16h8a6 6 0 0 0 5.7-5.17C23.23 10.36 24 9.28 24 8z"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/></svg>,
      projectsRequired: process.env.NODE_ENV === 'development' ? 2 : 35,
      enemyMultiplier: 3.0,
      oneHitKill: true
    }
  }), [t]);

  // Étape 1: Chargement initial avec API
  useEffect(() => {
    if (!isVisible || step !== 1) return;

    // Si on a déjà chargé une fois, on affiche directement la sélection
    if (hasLoadedOnce && portfolioData) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    setLoadingCountdown(5);
    setApiError(null);

    // Lancer le chargement API en parallèle du countdown (seulement si pas déjà chargé)
    if (!portfolioData) {
      const loadPortfolioData = async () => {
        try {
          console.log('📡 Chargement des données portfolio depuis l\'API...');
          const res = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio?per_page=100');
          if (!res.ok) throw new Error('Erreur API');
          const data = await res.json();
          // Exclure le projet id 1602 et traiter les données
          const filtered = data.filter(item => item.id !== 1602);
          console.log(`📊 ${filtered.length} projets récupérés de l'API`);
          setPortfolioData(filtered);
        } catch (error) {
          console.error('Erreur chargement portfolio:', error);
          setApiError(error.message);
        }
      };

      // Démarrer le chargement API
      loadPortfolioData();
    }

    const timer = setInterval(() => {
      setLoadingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Vérifier que les données sont chargées
          if (portfolioData || apiError) {
            setIsLoaded(true);
            setHasLoadedOnce(true);
          } else {
            // Attendre encore un peu si les données ne sont pas prêtes
            setTimeout(() => {
              setIsLoaded(true);
              setHasLoadedOnce(true);
            }, 1000);
          }
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
          // Différer l'appel à onGameStart pour éviter les mises à jour pendant le rendu
          setTimeout(() => {
            if (onGameStart) {
              onGameStart(difficulties[selectedDifficulty], portfolioData);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showFinalCountdown, selectedDifficulty, onGameStart, difficulties]);

  // Faire défiler les astuces à l'étape 2 (plus lentement)
  useEffect(() => {
    if (step === 2 && !showFinalCountdown) {
      const tipTimer = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      }, 5000); // Changer d'astuce toutes les 5 secondes (plus lent)

      return () => clearInterval(tipTimer);
    }
  }, [step, showFinalCountdown, tips.length]);

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
    // Utiliser setTimeout pour éviter les mises à jour pendant le rendu
    setTimeout(() => {
    setLanguage(lang);
    }, 0);
  };

  const handleProceedToStep2 = () => {
    setStep(2);
    setFinalCountdown(5);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setShowFinalCountdown(false);
    setFinalCountdown(5);
    setTipsCollapsing(false);
  };

  const handleStartFinalCountdown = () => {
    // Déclencher l'animation d'accordéon des astuces vers le haut
    setTipsCollapsing(true);
    
    // Attendre la fin de l'animation avant de démarrer le countdown
    setTimeout(() => {
      setShowFinalCountdown(true);
    }, 600); // 600ms pour laisser le temps à l'animation d'accordéon
  };

  const handleDirectStart = () => {
    // Différer l'appel à onGameStart pour éviter les mises à jour pendant le rendu
    setTimeout(() => {
      if (onGameStart) {
        onGameStart(difficulties[selectedDifficulty], portfolioData);
      }
    }, 0);
  };

  const handleDifficultySelect = (difficultyKey) => {
    setSelectedDifficulty(difficultyKey);
    setIsDifficultyDropdownOpen(false);
  };

  // Obtenir les caractéristiques du mode sélectionné (mémorisé)
  const getModeFeatures = useMemo(() => (difficultyKey) => {
    const difficulty = difficulties[difficultyKey];
    const features = [];
    
    // Chrono
    features.push({
      icon: difficultyKey === 'discovery' ? 
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> : 
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
      text: difficultyKey === 'discovery' ? t('noTimer') : t('withTimer')
    });
    
    // Projets à collecter
    features.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
      text: `${difficulty.projectsRequired} ${t('projectsToCollect').toLowerCase()}`
    });
    
    // Points de vie
    if (difficultyKey === 'discovery') {
      features.push({
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>,
        text: t('infiniteHealth')
      });
    } else if (difficultyKey === 'darklord') {
      features.push({
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"/><path d="M16 8a8 8 0 1 0-16 0c0 1.28.77 2.36 2.3 2.83A6 6 0 0 0 8 16h8a6 6 0 0 0 5.7-5.17C23.23 10.36 24 9.28 24 8z"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/></svg>,
        text: '1 ' + t('healthPoints').toLowerCase()
      });
    } else {
      features.push({
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>,
        text: '5 ' + t('healthPoints').toLowerCase()
      });
    }
    
    // Projets simultanés
    const simultaneous = difficultyKey === 'discovery' ? 1 : 10;
    features.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
      text: `${simultaneous} ${t('simultaneousProjects').toLowerCase()}`
    });
    
    return features;
  }, [difficulties, t]);

  if (!isVisible) return null;

  return (
          <div className={`game-init-overlay ${selectedDifficulty === 'darklord' ? 'dark-lord-mode' : ''}`}>
        <div className={`game-init-popup ${selectedDifficulty === 'darklord' ? 'dark-lord-mode' : ''}`}>
        <div className="game-init-content">
          {/* Bouton retour au site discret en haut - seulement à l'étape 1 */}
          {step === 1 && (
            <a 
              href="/" 
              className="back-to-site-btn"
              title={t('backToSite')}
            >
              {t('backToSite')}
            </a>
          )}
          
          {/* Language switcher compact en haut - seulement à l'étape 1 */}
          {step === 1 && (
            <div className="language-switcher-compact">
              <button 
                className={`lang-btn-compact ${language === 'fr' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('fr')}
              >
                FR
              </button>
              <button 
                className={`lang-btn-compact ${language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                EN
              </button>
            </div>
          )}
          
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
                      {/* Phrase d'introduction du concept - avec le spinner */}
                      <p className="game-concept-intro">{t('gameConceptIntro')}</p>
                      
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
                      
                      <h2 className="game-init-title">{t('difficulty')}</h2>
                  
                  {/* Sélecteur de difficulté */}
                      <div className="difficulty-section compact">
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
                  
                  {/* Tableau des caractéristiques dynamique pour step 1 */}
                  <div className="step1-features-display">
                    <div className="step1-features-grid">
                      {getModeFeatures(selectedDifficulty).map((feature, index) => (
                        <div 
                          key={`${selectedDifficulty}-${index}`}
                          className="step1-feature"
                        >
                          <span className="step1-feature-icon">{feature.icon}</span>
                          <span className="step1-feature-text">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                        className="start-game-btn compact"
                        onClick={handleProceedToStep2}
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
                    <span style={{ position: 'relative', zIndex: 10, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                      {t('startGame')}
                    </span>
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
                  {/* Affichage bento ultra compact du mode et caractéristiques */}
                  <motion.div 
                    key={selectedDifficulty}
                    className="bento-mode-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Mode sélectionné */}
                    <div className="bento-mode-header">
                      <span className="bento-mode-icon">{difficulties[selectedDifficulty].icon}</span>
                      <div className="bento-mode-name">{difficulties[selectedDifficulty].name}</div>
                    </div>
                    
                    {/* Grille des caractéristiques */}
                    <div className="bento-features-grid">
                      {getModeFeatures(selectedDifficulty).map((feature, index) => (
                        <div key={`${selectedDifficulty}-${index}`} className="bento-feature">
                          <span className="bento-feature-icon">{feature.icon}</span>
                          <span className="bento-feature-text">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Astuces simplifiées avec effet d'accordéon */}
                  <motion.div 
                    className={`simple-tips ${tipsCollapsing ? 'collapsing' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: tipsCollapsing ? 0 : 1, 
                      y: 0,
                      height: tipsCollapsing ? 0 : 'auto',
                      marginTop: tipsCollapsing ? 0 : undefined,
                      marginBottom: tipsCollapsing ? 0 : undefined
                    }}
                    transition={{ 
                      duration: tipsCollapsing ? 0.6 : 0.5, 
                      delay: tipsCollapsing ? 0 : 0.2,
                      ease: tipsCollapsing ? "easeInOut" : "easeOut"
                    }}
                    style={{ 
                      overflow: 'hidden',
                      transformOrigin: 'top'
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTipIndex}
                        className="simple-tip"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {tips[currentTipIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* Compteur ou bouton de démarrage */}
                  <motion.div 
                    className="step2-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {!showFinalCountdown ? (
                      <>
                        <button 
                          className="start-game-btn primary"
                          onClick={handleStartFinalCountdown}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="6" x2="10" y1="11" y2="11"/>
                              <line x1="8" x2="8" y1="9" y2="13"/>
                              <line x1="15" x2="15.01" y1="12" y2="12"/>
                              <line x1="18" x2="18.01" y1="10" y2="10"/>
                              <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
                            </svg>
                            {t('ready')}
                          </span>
                        </button>
                        <button 
                          className="btn-secondary back-btn"
                          onClick={handleBackToStep1}
                        >
                          {t('backToChoices')}
                        </button>
                      </>
                    ) : (
                      <div className="final-countdown-section">
                        <AnimatePresence mode="wait">
                          {finalCountdown > 0 ? (
                            <motion.div
                              key={`countdown-${finalCountdown}`}
                              className="final-countdown"
                              initial={{ 
                                y: 40, 
                                opacity: 0
                              }}
                              animate={{ 
                                y: 0, 
                                opacity: 1
                              }}
                              exit={{ 
                                y: -25, 
                                opacity: 0
                              }}
                              transition={{ 
                                duration: 0.25,
                                ease: "easeInOut"
                              }}
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