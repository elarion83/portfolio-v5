"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, FolderOpen } from "lucide-react";
import Game from "./Game";
import SpriteSheets from "./data/SpriteSheets";
import SpriteSheetManager from "./SpriteSheetManager";
import SpriteSheet from "./SpriteSheet";
import GameInitPopup, { LanguageProvider, useLanguage } from "./GameInitPopup";
import GameControlsPopup from "./GameControlsPopup";
import ProjectPopup from "./ProjectPopup";
import SpeedrunPopup from "./SpeedrunPopup";
import DeathPopup from "./DeathPopup";
import PauseMenuPopup from "./PauseMenuPopup";
import DesktopControls from "./DesktopControls";
import MobileControls from "./MobileControls";
import "./PlatformerGame.css";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSpeedrunModal, setShowSpeedrunModal] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
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
      const shouldBeInvincible = isInitializing || showProjectModal || showSpeedrunModal || showDeathModal || showControlsModal || showPauseMenu || extraInvincibilityTimer !== null;
      gameRef.current.setPlayerInvincible(shouldBeInvincible);
    }
  }, [isInitializing, showProjectModal, showSpeedrunModal, showDeathModal, showControlsModal, showPauseMenu, extraInvincibilityTimer]);

  // Gérer l'event listener de pause avec les bonnes conditions
  useEffect(() => {
    const handlePauseModal = () => {
      // Vérifier les conditions avant d'ouvrir/fermer la pause
      if (isInitializing || showSpeedrunModal || showDeathModal || showProjectModal || showControlsModal) {
        return; // Ne pas ouvrir la pause dans ces cas
      }
      setShowPauseMenu(prev => !prev);
    };

    window.addEventListener("openPauseModal", handlePauseModal);
    
    return () => {
      window.removeEventListener("openPauseModal", handlePauseModal);
    };
  }, [isInitializing, showSpeedrunModal, showDeathModal, showProjectModal, showControlsModal]);

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
          setFinalTime(completionTime);
          setGameCompleted(true);
          
          // Déclencher l'événement de fin de jeu
          setTimeout(() => {
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
    const totalMs = Math.floor(milliseconds);
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  // Formatage pour l'affichage en jeu (avec millisecondes)
  const formatTimeSimple = (milliseconds) => {
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
        } else if (showPauseMenu) {
          setShowPauseMenu(false);
        } else if (!isInitializing && !showSpeedrunModal && !showDeathModal) {
          // Ouvrir le menu de pause seulement si le jeu est en cours
          setShowPauseMenu(true);
        }
      } else if (event.key === 'p' || event.key === 'P') {
        // Déclencher l'événement de pause
        window.dispatchEvent(new CustomEvent('openPauseModal'));
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
      window.removeEventListener("openProjectModal", handleProjectModal);
      window.removeEventListener("openDeathModal", handleDeathModal);
      window.removeEventListener("keydown", handleEscapeKey);

      active = false;

      game.end();
    };
  }, []);

  // Gestion du démarrage du jeu
  const handleGameStart = (difficulty) => {
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
      gameRef.current.start();
      // Passer la configuration de difficulté au jeu
      gameRef.current.setDifficulty(difficulty);
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

  // Handlers pour la modale de pause
  const handlePauseResume = () => {
    setShowPauseMenu(false);
  };

  const handlePauseQuickRestart = () => {
    setShowPauseMenu(false);
    // Redémarrer avec la même difficulté
    if (difficultyConfig) {
      handleGameStart(difficultyConfig);
    }
  };

  const handlePauseBackToModeSelection = () => {
    setShowPauseMenu(false);
    // Retourner à la sélection de mode
    handleRestart();
  };

  return (
    <LanguageProvider>
      <AppContent 
        handleGameStart={handleGameStart}
        isInitializing={isInitializing}
        showControlsModal={showControlsModal}
        setShowControlsModal={setShowControlsModal}
        showProjectModal={showProjectModal}
        setShowProjectModal={setShowProjectModal}
        showSpeedrunModal={showSpeedrunModal}
        setShowSpeedrunModal={setShowSpeedrunModal}
        showDeathModal={showDeathModal}
        setShowDeathModal={setShowDeathModal}
        showPauseMenu={showPauseMenu}
        setShowPauseMenu={setShowPauseMenu}
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
        handlePauseResume={handlePauseResume}
        handlePauseQuickRestart={handlePauseQuickRestart}
        handlePauseBackToModeSelection={handlePauseBackToModeSelection}
      />
    </LanguageProvider>
  );
}

function AppContent({ 
  handleGameStart, 
  isInitializing,
  showControlsModal,
  setShowControlsModal,
  showProjectModal,
  setShowProjectModal,
  showSpeedrunModal,
  setShowSpeedrunModal,
  showDeathModal,
  setShowDeathModal,
  showPauseMenu,
  setShowPauseMenu,
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
  difficultyConfig,
  handlePauseResume,
  handlePauseQuickRestart,
  handlePauseBackToModeSelection
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
      />

      {/* Modale de défaite */}
      <DeathPopup 
        isVisible={showDeathModal}
        onRestart={handleRestart}
        onBackToSite={handleBackToSite}
      />

      {/* Modale de pause */}
      <PauseMenuPopup 
        isVisible={showPauseMenu}
        onQuickRestart={handlePauseQuickRestart}
        onBackToModeSelection={handlePauseBackToModeSelection}
        onResume={handlePauseResume}
        currentDifficulty={difficultyConfig}
      />

      <div className={"main-menu" + (menu ? " main-menu-show" : "")}>
        <h1>Platformer</h1>
        <p>by: MichaelXF</p>

        <button
          className='main-btn'
          onClick={() => {
            // Start game
            setMenu(false);
          }}
        >
          Play
        </button>
      </div>

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
