"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, FolderOpen } from "lucide-react";
import Game from "./Game";
import SpriteSheets from "./data/SpriteSheets";
import SpriteSheetManager from "./SpriteSheetManager";
import SpriteSheet from "./SpriteSheet";
import GameInitPopup, { LanguageProvider, useLanguage } from "./GameInitPopup";
import GameControlsPopup from "./GameControlsPopup";
import GameInGameMenuPopup from "./GameInGameMenuPopup";
import ProjectPopup from "./ProjectPopup";
import SpeedrunPopup from "./SpeedrunPopup";
import DeathPopup from "./DeathPopup";
import DesktopControls from "./DesktopControls";
import MobileControls from "./MobileControls";
import ActiveEffectsUI from "./ActiveEffectsUI";
import "./PlatformerGame.css";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [showInGameMenuModal, setShowInGameMenuModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSpeedrunModal, setShowSpeedrunModal] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [menu, setMenu] = useState(false);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [gameTime, setGameTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameMilliseconds, setGameMilliseconds] = useState(0);
  const [collectedProjects, setCollectedProjects] = useState(0);
  // Nombre de projets nécessaires : 5 en dev, 20 en production
  const [totalProjects, setTotalProjects] = useState(process.env.NODE_ENV === 'development' ? 5 : 20);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [nearProject, setNearProject] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);
  const [lastMinute, setLastMinute] = useState(0);
  const [restartKey, setRestartKey] = useState(0); // Clé pour forcer la réinitialisation
  const [difficultyConfig, setDifficultyConfig] = useState(null);
  const [extraInvincibilityTimer, setExtraInvincibilityTimer] = useState(null);

  /**
   * Show menu
   */

  // Gestion des contrôles mobiles
  const handleMobileKeyPress = (key) => {
    if (gameRef.current && gameRef.current.inputManager) {
      gameRef.current.inputManager.handleKeyEvent(key, true);
    }
  };

  const handleMobileKeyRelease = (key) => {
    if (gameRef.current && gameRef.current.inputManager) {
      gameRef.current.inputManager.handleKeyEvent(key, false);
    }
  };

  // Timer avec millisecondes
  useEffect(() => {
    let interval;
    if (!isInitializing && !menu && !gameCompleted && gameStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - gameStartTime;
        setGameTime(Math.floor(elapsed / 1000));
        setGameMilliseconds(elapsed);
      }, 10); // Mise à jour toutes les 10ms pour la précision
    }
    return () => clearInterval(interval);
  }, [isInitializing, menu, gameCompleted, gameStartTime]);

  // Assigner le gameTime à l'objet game pour l'animation du tooltip
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.gameTime = gameTime;
    }
  }, [gameTime]);

  // Gérer l'invincibilité globale selon les popups ouvertes
  useEffect(() => {
    if (gameRef.current) {
      const shouldBeInvincible = isInitializing || showProjectModal || showSpeedrunModal || showDeathModal || showControlsModal || showInGameMenuModal || extraInvincibilityTimer !== null;
      gameRef.current.setPlayerInvincible(shouldBeInvincible);
    }
  }, [isInitializing, showProjectModal, showSpeedrunModal, showDeathModal, showControlsModal, showInGameMenuModal, extraInvincibilityTimer]);

  // Détection des intervalles écoulés pour l'animation rouge du chrono
  useEffect(() => {
    if (!isInitializing && !menu && !gameCompleted && gameStartTime && gameMilliseconds > 0) {
      // 10 secondes en dev, 60 secondes (1 minute) en production
      const intervalMs = process.env.NODE_ENV === 'development' ? 10000 : 60000;
      const currentInterval = Math.floor(gameMilliseconds / intervalMs);
      
      // Si un nouvel intervalle vient de s'écouler (et ce n'est pas le premier intervalle)
      if (currentInterval > lastMinute && currentInterval > 0) {
        setTimerAlert(true);
        setLastMinute(currentInterval);
        
        // Retirer l'animation après 1.5s
        setTimeout(() => {
          setTimerAlert(false);
        }, 1500);
      }
    }
  }, [gameMilliseconds, lastMinute, isInitializing, menu, gameCompleted, gameStartTime]);

  // Event listener pour la collecte de projets avec détection de fin de jeu
  useEffect(() => {
    const handleProjectCollected = () => {
      setCollectedProjects(prev => {
        const newCount = prev + 1;
        // Vérifier si c'est le dernier projet
        if (newCount >= totalProjects) {
          const completionTime = Date.now() - gameStartTime;
          console.log('🏆 Jeu terminé !');
          console.log('📊 gameStartTime:', gameStartTime);
          console.log('📊 Date.now():', Date.now());
          console.log('📊 completionTime calculé:', completionTime);
          console.log('📊 Type de completionTime:', typeof completionTime);
          
          setFinalTime(completionTime);
          setGameCompleted(true);
          
          // Déclencher l'événement de fin de jeu
          setTimeout(() => {
            console.log('📊 finalTime passé à SpeedrunPopup:', completionTime);
            setFinalTime(completionTime); // Re-set juste avant l'ouverture
            setShowSpeedrunModal(true);
            window.dispatchEvent(new CustomEvent('gameCompleted', { 
              detail: { 
                time: completionTime, 
                projects: newCount 
              } 
            }));
          }, 1500); // Délai pour laisser l'animation de collecte se terminer
        }
        return newCount;
      });
    };

    // Event listener pour la proximité des projets
    const handleProjectProximity = (event) => {
      console.log('📱 Réception événement proximité:', event.detail.near);
      setNearProject(event.detail.near);
    };

    window.addEventListener("projectCollected", handleProjectCollected);
    window.addEventListener("projectProximity", handleProjectProximity);
    return () => {
      window.removeEventListener("projectCollected", handleProjectCollected);
      window.removeEventListener("projectProximity", handleProjectProximity);
    };
  }, [totalProjects, gameStartTime]);

  // Déclencher automatiquement le zoom reset sur mobile après la disparition de GameInitPopup
  useEffect(() => {
    if (!isInitializing && gameStartTime) { // Le jeu vient de commencer
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setTimeout(() => {
          // Déclencher directement la fonction de zoom reset au lieu du clic DOM
          if (window.game && window.game.camera) {
            window.game.camera.resetZoom();
          }
        }, 300); // Délai pour s'assurer que la popup a complètement disparu
      }
    }
  }, [isInitializing, gameStartTime]);

  // Formatage du temps avec millisecondes
  const formatTime = (milliseconds) => {
    // Gérer les valeurs nulles, undefined ou invalides
    if (milliseconds == null || isNaN(milliseconds) || milliseconds < 0) {
      return "00:00.000";
    }
    
    const totalMs = Math.floor(milliseconds);
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  // Formatage pour l'affichage en jeu (avec millisecondes)
  const formatTimeSimple = (milliseconds) => {
    // Gérer les valeurs nulles, undefined ou invalides
    if (milliseconds == null || isNaN(milliseconds) || milliseconds < 0) {
      return "00:00.000";
    }
    
    const totalMs = Math.floor(milliseconds);
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000; // Afficher les vraies millisecondes
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    // Ajouter classe au body pour masquer la navigation du site
    document.body.classList.add('game-active');
    
    // Nettoyer la classe au démontage du composant
    return () => {
      document.body.classList.remove('game-active');
    };
  }, []);

  useEffect(() => {
    var ssm = new SpriteSheetManager();

    Object.keys(SpriteSheets).forEach((spriteSheetName) => {
      var data = SpriteSheets[spriteSheetName];
      ssm.addSpriteSheet(spriteSheetName, data.imgPath, data);
    });

    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx = canvas.getContext("2d");

    var last = performance.now();

    var game = new Game(canvas, ctx, ssm);
    gameRef.current = game;

    window.game = game;

    // S'assurer que le joueur est invincible pendant l'initialisation
    game.setPlayerInvincible(isInitializing);

    var cb = () => {
      // Obtenir les dimensions réelles du viewport
      let width = window.innerWidth;
      let height = window.innerHeight;

      // Utiliser visualViewport si disponible pour une meilleure gestion du viewport
      if (window.visualViewport) {
        height = window.visualViewport.height;
      }

      canvas.width = width;
      canvas.height = height;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      game.camera.updateAspectRatio();
    };
    cb();
    var active = true;
    game.active = true;

    function update() {
      var now = performance.now();
      var delta = (now - last) / 1000;
      last = now;

      if (delta > 0.25) {
        delta = 0.25;
      }

      // Fond glassmorphism au lieu du noir
      drawGlassmorphismBackground(ctx, canvas.width, canvas.height, delta, gameRef.current?.difficulty || difficultyConfig);

      if (game.active) {
        game.updateGame(delta);
      }
      game.renderGame(delta);

      active && requestAnimationFrame(update);
    }

    // Fonction pour dessiner le fond glassmorphism
    function drawGlassmorphismBackground(ctx, width, height, delta, difficulty) {
      // Fond de base avec gradient - rouge en mode Seigneur des ténèbres
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      
      if (difficulty && difficulty.oneHitKill) {
        // Background rouge sombre pour le mode Seigneur des ténèbres
        gradient.addColorStop(0, '#2d0a0a'); // Rouge très sombre
        gradient.addColorStop(0.3, '#4a1515'); // Rouge sombre
        gradient.addColorStop(0.7, '#3d1212'); // Rouge moyen sombre
        gradient.addColorStop(1, '#2d0a0a'); // Rouge très sombre
      } else {
        // Background bleu normal
        gradient.addColorStop(0, '#0f0f23');
        gradient.addColorStop(0.3, '#1a1a2e');
        gradient.addColorStop(0.7, '#16213e');
        gradient.addColorStop(1, '#0f0f23');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Motifs géométriques subtils
      ctx.save();
      ctx.globalAlpha = 0.03;
      
      // Couleurs selon la difficulté
      const patternColor = (difficulty && difficulty.oneHitKill) ? '#ff6b6b' : '#ffffff';
      
      // Grille de points
      const gridSize = 40;
      ctx.fillStyle = patternColor;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Lignes diagonales subtiles
      ctx.strokeStyle = patternColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.02;
      
      for (let i = 0; i < width + height; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(0, i);
        ctx.stroke();
      }

      // Cercles concentriques animés
      ctx.globalAlpha = 0.01;
      const time = Date.now() * 0.001;
      const centerX = width / 2;
      const centerY = height / 2;
      
      for (let i = 0; i < 3; i++) {
        const radius = 100 + i * 150 + Math.sin(time * 0.5 + i) * 20;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // Effet de bruit subtil
      ctx.save();
      ctx.globalAlpha = 0.01;
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2;
        
        // Bruit rouge en mode Seigneur des ténèbres, blanc sinon
        if (difficulty && difficulty.oneHitKill) {
          ctx.fillStyle = `rgba(255, 107, 107, ${Math.random() * 0.5})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        }
        ctx.fillRect(x, y, size, size);
      }
      ctx.restore();
    }

    ssm.onLoaded = () => {
      Object.keys(ssm.spriteSheets).forEach((key) => {
        if (key.includes("player_")) {
          ssm.spriteSheets[key].getEffects(["flipHorizontally"]);
        }
      });

      update();

      // Timer de 10 secondes pour l'initialisation - mais ne lance plus automatiquement
      setTimeout(() => {
        // Le jeu ne se lance plus automatiquement ici
        // Il sera lancé via handleGameStart quand l'utilisateur clique sur le bouton
      }, 10000); // 10 secondes
    };

    window.addEventListener("resize", cb);
    
    // Écouter aussi les changements de visualViewport si disponible
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", cb);
    }

    // Event listener pour la touche C
    const handleControlsModal = () => {
      setShowControlsModal(true);
    };
    window.addEventListener("openControlsModal", handleControlsModal);

    // Event listener pour la touche T
    const handleInGameMenuModal = () => {
      setShowInGameMenuModal(true);
    };
    window.addEventListener("openInGameMenuModal", handleInGameMenuModal);

    // Event listener pour l'ouverture de la popup projet
    const handleProjectModal = (event) => {
      setCurrentProject(event.detail);
      setShowProjectModal(true);
    };
    window.addEventListener("openProjectModal", handleProjectModal);

    // Event listener pour la popup de défaite
    const handleDeathModal = () => {
      setShowDeathModal(true);
    };
    window.addEventListener("openDeathModal", handleDeathModal);

    // Event listener pour la touche Échap et P (pause)
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showProjectModal) {
          setShowProjectModal(false);
          setCurrentProject(null);
        } else if (showControlsModal) {
          setShowControlsModal(false);
        } else if (showInGameMenuModal) {
          setShowInGameMenuModal(false);
        }
      }
      
      // Touche I pour activer/désactiver les informations sur les plateformes
      if (event.key === 'i' || event.key === 'I') {
        if (gameRef.current) {
          gameRef.current.showInfo = !gameRef.current.showInfo;
          console.log(`🔧 Informations plateformes: ${gameRef.current.showInfo ? 'ACTIVÉES' : 'DÉSACTIVÉES'}`);
        }
      }
      
      // Raccourcis pour tester les effets de plateformes
      if (gameRef.current && gameRef.current.platformEffects) {
        // Touche 1: Appliquer effet highlight rouge à la plateforme 1
        if (event.key === '1') {
          gameRef.current.platformEffects.addEffect(1, 'highlight', { color: '#ff0000', intensity: 0.8 });
          console.log('🎨 Effet highlight rouge ajouté à la plateforme 1');
        }
        
        // Touche 2: Appliquer effet pulse bleu aux plateformes 2-5
        if (event.key === '2') {
          gameRef.current.platformEffects.addEffect([2, 3, 4, 5], 'pulse', { color: '#0080ff', speed: 2 });
          console.log('🎨 Effet pulse bleu ajouté aux plateformes 2-5');
        }
        
        // Touche 3: Appliquer effet glow vert à la plateforme 10
        if (event.key === '3') {
          gameRef.current.platformEffects.addEffect(10, 'glow', { color: '#00ff00', intensity: 1.5 });
          console.log('🎨 Effet glow vert ajouté à la plateforme 10');
        }
        
        // Touche 4: Appliquer effet rainbow aux plateformes 15-20
        if (event.key === '4') {
          gameRef.current.platformEffects.addEffect([15, 16, 17, 18, 19, 20], 'rainbow', { speed: 1.5 });
          console.log('🎨 Effet rainbow ajouté aux plateformes 15-20');
        }
        
        // Touche 0: Supprimer tous les effets
        if (event.key === '0') {
          gameRef.current.platformEffects.clearAllEffects();
          console.log('🗑️ Tous les effets de plateformes supprimés');
        }

        // Touche E: Tester les effets automatiques
        if (event.key === 'e' || event.key === 'E') {
          console.log('🧪 Test des effets automatiques...');
          // Initialiser les effets de plateformes
          // gameRef.current.applyAutomaticPlatformEffects(); // Commenté pour retirer les effets d'exemple
        }
        
        // Touche T: Tester manuellement quelques effets visibles
        if (event.key === 't' || event.key === 'T') {
          console.log('🧪 Application d\'effets de test...');
          let testCount = 0;
          for (const [index, platform] of gameRef.current.platforms.entries()) {
            if (testCount >= 5) break; // Seulement 5 plateformes pour le test
            
            const effects = ['highlight', 'pulse', 'glow'];
            const colors = ['red', 'orange', 'blue'];
            const randomEffect = effects[testCount % effects.length];
            const randomColor = colors[testCount % colors.length];
            
            gameRef.current.platformEffects.addEffect(platform.id, randomEffect, randomColor, -1);
            console.log(`🧪 Effet ${randomEffect} ${randomColor} appliqué à la plateforme ID:${platform.id} à (${platform.x}, ${platform.y})`);
            testCount++;
          }
          console.log(`🧪 ${testCount} effets de test appliqués`);
        }

        // Touche H: Forcer l'apparition d'un pack de soin près du joueur
        if (event.key === 'h' || event.key === 'H') {
          if (gameRef.current && gameRef.current.itemManager) {
            console.log("🔧 [DEBUG] Commande reçue: Apparition d'un Health Pack...");
            gameRef.current.itemManager.spawnItemNearPlayer('health_pack');
          }
        }
      }


    };
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      cancelAnimationFrame(update);
      window.removeEventListener("resize", cb);
      
      // Nettoyer l'event listener visualViewport
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", cb);
      }
      
      window.removeEventListener("openControlsModal", handleControlsModal);
      window.removeEventListener("openInGameMenuModal", handleInGameMenuModal);
      window.removeEventListener("openProjectModal", handleProjectModal);
      window.removeEventListener("openDeathModal", handleDeathModal);
      window.removeEventListener("keydown", handleEscapeKey);

      active = false;

      game.end();
    };
  }, []);

  // Gestion du démarrage du jeu
  const handleGameStart = (difficulty, portfolioData) => {
    setDifficultyConfig(difficulty);
    setTotalProjects(difficulty.projectsRequired);
    setIsInitializing(false);
    setGameStartTime(Date.now());
    setGameTime(0);
    setGameMilliseconds(0);
    setCollectedProjects(0);
    setGameCompleted(false);
    setFinalTime(null);
    setShowSpeedrunModal(false);
    if (gameRef.current) {
      // Passer la configuration de difficulté ET les données portfolio au jeu AVANT de démarrer
      gameRef.current.setDifficulty(difficulty);
      gameRef.current.setPortfolioData(portfolioData);
      // Démarrer le jeu (qui va réinitialiser et générer les projets depuis les données)
      gameRef.current.start();
    }
    // Déclencher l'invincibilité prolongée après fermeture de GameInitPopup (avec un petit délai)
    setTimeout(() => {
      triggerExtraInvincibility();
    }, 100);
  };

  // Gestion du redémarrage depuis la popup speedrun
  const handleRestart = () => {
    setShowSpeedrunModal(false);
    setShowDeathModal(false);
    // Fermer aussi la ProjectPopup si elle est ouverte
    setShowProjectModal(false);
    setCurrentProject(null);
    setIsInitializing(true);
    setGameCompleted(false);
    setFinalTime(null);
    setCollectedProjects(0);
    setGameTime(0);
    setGameMilliseconds(0);
    setGameStartTime(null);
    setMenu(false);
    setRestartKey(prev => prev + 1); // Incrémenter pour forcer la réinitialisation
    // Redémarrer le jeu sera géré par l'utilisateur qui cliquera sur "Lancer le jeu"
  };

  // Gestion du retour au portfolio
  const handleBackToSite = () => {
    window.location.href = '/portfolio';
  };

  // Fonction pour déclencher l'invincibilité prolongée
  const triggerExtraInvincibility = () => {
    // Effacer le timer précédent s'il existe
    if (extraInvincibilityTimer) {
      clearTimeout(extraInvincibilityTimer);
    }
    
    // Créer un nouveau timer de 2 secondes
    const timer = setTimeout(() => {
      // Déclencher l'animation de disparition de l'aura
      if (gameRef.current && typeof gameRef.current.triggerPlayerAuraFadeOut === 'function') {
        gameRef.current.triggerPlayerAuraFadeOut();
      } else {
        console.warn('Game ou triggerPlayerAuraFadeOut non disponible');
      }
      setExtraInvincibilityTimer(null);
    }, 2000);
    
    setExtraInvincibilityTimer(timer);
  };

  return (
    <LanguageProvider>
      <AppContent 
        handleGameStart={handleGameStart}
        isInitializing={isInitializing}
        showControlsModal={showControlsModal}
        setShowControlsModal={setShowControlsModal}
        showInGameMenuModal={showInGameMenuModal}
        setShowInGameMenuModal={setShowInGameMenuModal}
        showProjectModal={showProjectModal}
        setShowProjectModal={setShowProjectModal}
        showSpeedrunModal={showSpeedrunModal}
        setShowSpeedrunModal={setShowSpeedrunModal}
        showDeathModal={showDeathModal}
        setShowDeathModal={setShowDeathModal}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        menu={menu}
        setMenu={setMenu}
        canvasRef={canvasRef}
        gameTime={gameTime}
        gameMilliseconds={gameMilliseconds}
        collectedProjects={collectedProjects}
        totalProjects={totalProjects}
        gameCompleted={gameCompleted}
        finalTime={finalTime}
        formatTime={formatTime}
        formatTimeSimple={formatTimeSimple}
        handleRestart={handleRestart}
        handleBackToSite={handleBackToSite}
        handleMobileKeyPress={handleMobileKeyPress}
        handleMobileKeyRelease={handleMobileKeyRelease}
        nearProject={nearProject}
        timerAlert={timerAlert}
        restartKey={restartKey}
        triggerExtraInvincibility={triggerExtraInvincibility}
        difficultyConfig={difficultyConfig}
      />
    </LanguageProvider>
  );
}

function AppContent({ 
  handleGameStart, 
  isInitializing,
  showControlsModal,
  setShowControlsModal,
  showInGameMenuModal,
  setShowInGameMenuModal,
  showProjectModal,
  setShowProjectModal,
  showSpeedrunModal,
  setShowSpeedrunModal,
  showDeathModal,
  setShowDeathModal,
  currentProject,
  setCurrentProject,
  menu,
  setMenu,
  canvasRef,
  gameTime,
  gameMilliseconds,
  collectedProjects,
  totalProjects,
  gameCompleted,
  finalTime,
  formatTime,
  formatTimeSimple,
  handleRestart,
  handleBackToSite,
  handleMobileKeyPress,
  handleMobileKeyRelease,
  nearProject,
  timerAlert,
  restartKey,
  triggerExtraInvincibility,
  difficultyConfig
}) {
  // État pour l'effet de particules du compteur
  const [showCounterParticles, setShowCounterParticles] = useState(false);

  // Fonction pour déclencher l'effet de particules vertes
  const triggerCounterParticles = () => {
    setShowCounterParticles(true);
    setTimeout(() => {
      setShowCounterParticles(false);
    }, 2000); // Effet pendant 2 secondes
  };

  return (
    <div className={!menu ? "hide-cursor" : ""}>
      {/* Popup d'initialisation */}
      <GameInitPopup 
        isVisible={isInitializing} 
        onGameStart={handleGameStart} 
        resetKey={restartKey}
      />

      {/* Modale des contrôles */}
      <GameControlsPopup 
        isVisible={showControlsModal} 
        onClose={() => setShowControlsModal(false)} 
      />

      {/* Modale in-game menu */}
      <GameInGameMenuPopup 
        isVisible={showInGameMenuModal} 
        onClose={() => setShowInGameMenuModal(false)}
        onBackToModeSelection={handleRestart}
        gameTime={gameMilliseconds}
        collectedProjects={collectedProjects}
        totalProjects={totalProjects}
        formatTime={formatTimeSimple}
        difficultyConfig={difficultyConfig}
      />

      {/* Modale de projet */}
      <ProjectPopup 
        isVisible={showProjectModal} 
        projectData={currentProject}
        onClose={() => {
          setShowProjectModal(false);
          setCurrentProject(null);
          // Déclencher l'effet de particules vertes sur le compteur
          triggerCounterParticles();
          // Déclencher l'invincibilité prolongée après fermeture de ProjectPopup (avec un petit délai)
          setTimeout(() => {
            triggerExtraInvincibility();
          }, 100);
        }}
      />

      {/* Modale de speedrun */}
      <SpeedrunPopup 
        isVisible={showSpeedrunModal}
        finalTime={finalTime}
        collectedProjects={collectedProjects}
        totalProjects={totalProjects}
        formatTime={formatTime}
        onRestart={handleRestart}
        onBackToSite={handleBackToSite}
        difficultyConfig={difficultyConfig}
      />

      {/* Modale de défaite */}
      <DeathPopup 
        isVisible={showDeathModal}
        onRestart={handleRestart}
        onBackToSite={handleBackToSite}
        difficultyConfig={difficultyConfig}
      />

      <canvas ref={canvasRef} />

      {/* Interface de jeu */}
      {!isInitializing && !menu && (
        <>
          {/* Chrono - en bas à droite sur desktop, en haut à droite sur mobile */}
          <div className={`game-timer ${timerAlert ? 'minute-alert' : ''}`}>
            <div className="timer-icon">
              <Clock size={18} />
            </div>
            <div className="timer-value">{formatTimeSimple(gameMilliseconds)}</div>
          </div>

          {/* Interface des effets actifs */}
          <ActiveEffectsUI />

          {/* Compteur de projets - en bas à droite sur desktop */}
          <div className={`projects-counter ${showCounterParticles ? 'celebrating' : ''}`}>
            {/* Barre de progression en arrière-plan */}
            <div className="counter-progress-bar">
              <div 
                className="counter-progress-fill"
                style={{ width: `${totalProjects > 0 ? (collectedProjects / totalProjects) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="counter-icon">
              <FolderOpen size={18} />
            </div>
            <div className="counter-value">
              <span className="collected">{collectedProjects}</span>
              <span className="separator">/</span>
              <span className="total">{totalProjects}</span>
            </div>
            {/* Particules vertes */}
            {showCounterParticles && (
              <div className="counter-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`particle particle-${i}`}></div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Contrôles Desktop */}
      <DesktopControls onShowControlsModal={() => setShowControlsModal(true)} />

      {/* Contrôles Mobile */}
      <MobileControls 
        onKeyPress={handleMobileKeyPress}
        onKeyRelease={handleMobileKeyRelease}
        showCollectButton={nearProject}
        collectedProjects={collectedProjects}
      />
    </div>
  );
}

export default App;
