import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, Sword, Minus, Plus, Home, Pause } from 'lucide-react';

const MobileControls = ({ onKeyPress, onKeyRelease, showCollectButton = false, collectedProjects = 0 }) => {
  const handleTouchStart = (key) => {
    onKeyPress(key);
  };

  const handleTouchEnd = (key) => {
    onKeyRelease(key);
  };

  const handleAttackStart = () => {
    // Simuler un clic de souris pour l'attaque
    if (window.game && window.game.inputManager) {
      if (window.game.controller.controlling.onGround) {
        window.game.controller.controlling.attack();
      } else {
        window.game.controller.controlling.groundSlam();
      }
      window.game.inputManager.handleMouseEvent(0, true);
    }
  };

  const handleAttackEnd = () => {
    console.log('📱 Attack END');
    // Relâcher l'attaque
    if (window.game && window.game.inputManager) {
      window.game.inputManager.handleMouseEvent(0, false);
    }
  };

  const handleZoomIn = () => {
    if (window.game && window.game.camera) {
      window.game.camera.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (window.game && window.game.camera) {
      window.game.camera.zoomOut();
    }
  };

  const handleZoomReset = () => {
    if (window.game && window.game.camera) {
      window.game.camera.resetZoom();
    }
  };

  const handlePause = () => {
    // Simuler l'appui sur la touche P
    const event = new KeyboardEvent('keydown', { key: 'P' });
    window.dispatchEvent(event);
  };

  return (
    <div className="mobile-controls">
      {/* Contrôles de mouvement */}
      <div className="mobile-movement">
        <button
          className="mobile-btn mobile-btn-left"
          onTouchStart={() => handleTouchStart('a')}
          onTouchEnd={() => handleTouchEnd('a')}
          onMouseDown={() => handleTouchStart('a')}
          onMouseUp={() => handleTouchEnd('a')}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="mobile-btn mobile-btn-right"
          onTouchStart={() => handleTouchStart('d')}
          onTouchEnd={() => handleTouchEnd('d')}
          onMouseDown={() => handleTouchStart('d')}
          onMouseUp={() => handleTouchEnd('d')}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Contrôles de zoom */}
      <div className="mobile-zoom-controls">
        <button
          className="mobile-btn mobile-btn-zoom-out"
          onTouchStart={handleZoomOut}
          onMouseDown={handleZoomOut}
        >
          <Minus size={16} />
        </button>
        <button
          className="mobile-btn mobile-btn-zoom-reset"
          onTouchStart={handleZoomReset}
          onMouseDown={handleZoomReset}
        >
          <Home size={14} />
        </button>
        <button
          className="mobile-btn mobile-btn-zoom-in"
          onTouchStart={handleZoomIn}
          onMouseDown={handleZoomIn}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Bouton pause positionné au-dessus du saut */}
      <div className="mobile-pause-control">
        <button
          className="mobile-btn mobile-btn-pause"
          onTouchStart={handlePause}
          onMouseDown={handlePause}
          title="Pause (P)"
        >
          <Pause size={16} />
        </button>
      </div>

      {/* Boutons d'action */}
      <div className="mobile-actions">
        {/* Colonne de gauche : Bouton E conditionnel */}
        {showCollectButton && (
          <div className="mobile-actions-left">
            <button
              className={`mobile-btn mobile-btn-collect ${collectedProjects === 0 ? 'first-project-pulse' : ''}`}
              onTouchStart={() => handleTouchStart('e')}
              onTouchEnd={() => handleTouchEnd('e')}
              onMouseDown={() => handleTouchStart('e')}
              onMouseUp={() => handleTouchEnd('e')}
            >
              E
            </button>
          </div>
        )}
        
        {/* Colonne de droite : Saut au-dessus de l'attaque */}
        <div className="mobile-actions-right">
          <button
            className="mobile-btn mobile-btn-jump"
            onTouchStart={() => handleTouchStart(' ')}
            onTouchEnd={() => handleTouchEnd(' ')}
            onMouseDown={() => handleTouchStart(' ')}
            onMouseUp={() => handleTouchEnd(' ')}
          >
            <ChevronUp size={24} />
          </button>
          <button
            className="mobile-btn mobile-btn-attack"
            onTouchStart={handleAttackStart}
            onTouchEnd={handleAttackEnd}
            onMouseDown={handleAttackStart}
            onMouseUp={handleAttackEnd}
          >
            <Sword size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls; 