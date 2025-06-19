import { useEffect, useRef, useState } from "react";
import Game from "./Game";
import SpriteSheets from "./data/SpriteSheets";
import SpriteSheetManager from "./SpriteSheetManager";
import SpriteSheet from "./SpriteSheet";
import GameInitPopup, { LanguageProvider, useLanguage } from "./GameInitPopup";
import GameControlsPopup from "./GameControlsPopup";
import ProjectPopup from "./ProjectPopup";
import DesktopControls from "./DesktopControls";
import MobileControls from "./MobileControls";
import "./PlatformerGame.css";

function App() {
  var canvasRef = useRef();
  var [isInitializing, setIsInitializing] = useState(true);
  var [showControlsModal, setShowControlsModal] = useState(false);
  var [showProjectModal, setShowProjectModal] = useState(false);
  var [currentProject, setCurrentProject] = useState(null);
  var [gameTime, setGameTime] = useState(0);
  var [collectedProjects, setCollectedProjects] = useState(0);
  var [totalProjects] = useState(39);

  /**
   * Show menu
   */
  var [menu, setMenu] = useState(false);
  var gameRef = useRef();

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

  // Chrono du jeu
  useEffect(() => {
    let interval;
    if (!isInitializing && !menu) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInitializing, menu]);

  // Event listener pour la collecte de projets
  useEffect(() => {
    const handleProjectCollected = () => {
      setCollectedProjects(prev => prev + 1);
    };
    window.addEventListener("projectCollected", handleProjectCollected);
    return () => window.removeEventListener("projectCollected", handleProjectCollected);
  }, []);

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

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
      drawGlassmorphismBackground(ctx, canvas.width, canvas.height, delta);

      if (game.active) {
        game.updateGame(delta);
      }
      game.renderGame(delta);

      active && requestAnimationFrame(update);
    }

    // Fonction pour dessiner le fond glassmorphism
    function drawGlassmorphismBackground(ctx, width, height, delta) {
      // Fond de base avec gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.3, '#1a1a2e');
      gradient.addColorStop(0.7, '#16213e');
      gradient.addColorStop(1, '#0f0f23');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Motifs géométriques subtils
      ctx.save();
      ctx.globalAlpha = 0.03;
      
      // Grille de points
      const gridSize = 40;
      ctx.fillStyle = '#ffffff';
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Lignes diagonales subtiles
      ctx.strokeStyle = '#ffffff';
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
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
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

    // Event listener pour la touche Échap
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showProjectModal) {
          setShowProjectModal(false);
          setCurrentProject(null);
        } else if (showControlsModal) {
          setShowControlsModal(false);
        }
      }
    };
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      cancelAnimationFrame(update);
      window.removeEventListener("resize", cb);
      window.removeEventListener("openControlsModal", handleControlsModal);
      window.removeEventListener("openProjectModal", handleProjectModal);
      window.removeEventListener("keydown", handleEscapeKey);

      active = false;

      game.end();
    };
  }, []);

  // Gestion du démarrage du jeu
  const handleGameStart = () => {
    setIsInitializing(false);
    if (gameRef.current) {
      gameRef.current.start();
    }
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
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        menu={menu}
        setMenu={setMenu}
        canvasRef={canvasRef}
        gameTime={gameTime}
        collectedProjects={collectedProjects}
        totalProjects={totalProjects}
        handleMobileKeyPress={handleMobileKeyPress}
        handleMobileKeyRelease={handleMobileKeyRelease}
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
  currentProject,
  setCurrentProject,
  menu,
  setMenu,
  canvasRef,
  gameTime,
  collectedProjects,
  totalProjects,
  handleMobileKeyPress,
  handleMobileKeyRelease
}) {
  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={!menu ? "hide-cursor" : ""}>
      {/* Popup d'initialisation */}
      <GameInitPopup 
        isVisible={isInitializing} 
        onGameStart={handleGameStart} 
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
        }}
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
          <div className="game-timer">
            <div className="timer-icon">⏱️</div>
            <div className="timer-value">{formatTime(gameTime)}</div>
          </div>

          {/* Compteur de projets - en bas à droite sur desktop */}
          <div className="projects-counter">
            <div className="counter-icon">📁</div>
            <div className="counter-value">
              <span className="collected">{collectedProjects}</span>
              <span className="separator">/</span>
              <span className="total">{totalProjects}</span>
            </div>
          </div>
        </>
      )}

      {/* Contrôles Desktop */}
      <DesktopControls onShowControlsModal={() => setShowControlsModal(true)} />

      {/* Contrôles Mobile */}
      <MobileControls 
        onKeyPress={handleMobileKeyPress}
        onKeyRelease={handleMobileKeyRelease}
      />
    </div>
  );
}

export default App;
