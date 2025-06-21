import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, Sword, Minus, Plus, Home, Menu } from 'lucide-react';

// Icône de main personnalisée pour le bouton O
const HandIcon = ({ size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
    <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
    <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);

// Icône de recherche avec X pour le zoom reset
const SearchXIcon = ({ size = 14 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m13.5 8.5-5 5"/>
    <path d="m8.5 8.5 5 5"/>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const MobileControls = ({ onKeyPress, onKeyRelease, showCollectButton = false, collectedProjects = 0 }) => {
  const handleTouchStart = (key, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onKeyPress(key);
  };

  const handleTouchEnd = (key, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onKeyRelease(key);
  };

  const handleAttackStart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

  const handleAttackEnd = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('📱 Attack END');
    // Relâcher l'attaque
    if (window.game && window.game.inputManager) {
      window.game.inputManager.handleMouseEvent(0, false);
    }
  };

  const handleZoomIn = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.game && window.game.camera) {
      window.game.camera.zoomIn();
    }
  };

  const handleZoomOut = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.game && window.game.camera) {
      window.game.camera.zoomOut();
    }
  };

  const handleZoomReset = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.game && window.game.camera) {
      window.game.camera.resetZoom();
    }
  };

  const handleMenu = (e) => {
    // Empêcher la propagation pour éviter les conflits
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Déclencher directement l'événement personnalisé comme dans le Controller
    window.dispatchEvent(new CustomEvent('openInGameMenuModal'));
  };

  return (
    <div className="mobile-controls">
      {/* Contrôles de mouvement */}
      <div className="mobile-movement">
        <button
          className="mobile-btn mobile-btn-left"
          onTouchStart={(e) => handleTouchStart('a', e)}
          onTouchEnd={(e) => handleTouchEnd('a', e)}
          onMouseDown={(e) => handleTouchStart('a', e)}
          onMouseUp={(e) => handleTouchEnd('a', e)}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="mobile-btn mobile-btn-right"
          onTouchStart={(e) => handleTouchStart('d', e)}
          onTouchEnd={(e) => handleTouchEnd('d', e)}
          onMouseDown={(e) => handleTouchStart('d', e)}
          onMouseUp={(e) => handleTouchEnd('d', e)}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Contrôles de zoom */}
      <div className="mobile-zoom-controls">
        <button
          className="mobile-btn mobile-btn-zoom-out"
          onTouchStart={handleZoomOut}
          onTouchEnd={(e) => e.preventDefault()}
          onMouseDown={handleZoomOut}
          onMouseUp={(e) => e.preventDefault()}
          onClick={handleZoomOut}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          <Minus size={16} />
        </button>
        <button
          className="mobile-btn mobile-btn-zoom-reset"
          onTouchStart={handleZoomReset}
          onTouchEnd={(e) => e.preventDefault()}
          onMouseDown={handleZoomReset}
          onMouseUp={(e) => e.preventDefault()}
          onClick={handleZoomReset}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          <SearchXIcon size={14} />
        </button>
        <button
          className="mobile-btn mobile-btn-zoom-in"
          onTouchStart={handleZoomIn}
          onTouchEnd={(e) => e.preventDefault()}
          onMouseDown={handleZoomIn}
          onMouseUp={(e) => e.preventDefault()}
          onClick={handleZoomIn}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Bouton Menu en haut à droite */}
      <div className="mobile-menu-control">
        <button
          className="mobile-btn mobile-btn-menu"
          onTouchStart={handleMenu}
          onTouchEnd={(e) => e.preventDefault()}
          onMouseDown={handleMenu}
          onMouseUp={(e) => e.preventDefault()}
          onClick={handleMenu}
          title="Menu (M)"
          style={{ 
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Boutons d'action */}
      <div className="mobile-actions">
        {/* Colonne de gauche : Bouton E conditionnel */}
        {showCollectButton && (
          <div className="mobile-actions-left">
            <button
              className={`mobile-btn mobile-btn-collect ${collectedProjects === 0 ? 'first-project-pulse' : ''}`}
              onTouchStart={(e) => handleTouchStart('o', e)}
              onTouchEnd={(e) => handleTouchEnd('o', e)}
              onMouseDown={(e) => handleTouchStart('o', e)}
              onMouseUp={(e) => handleTouchEnd('o', e)}
              style={{ touchAction: 'manipulation', userSelect: 'none' }}
            >
              <HandIcon size={20} />
            </button>
          </div>
        )}
        
        {/* Colonne de droite : Saut au-dessus de l'attaque */}
        <div className="mobile-actions-right">
          <button
            className="mobile-btn mobile-btn-jump"
            onTouchStart={(e) => handleTouchStart(' ', e)}
            onTouchEnd={(e) => handleTouchEnd(' ', e)}
            onMouseDown={(e) => handleTouchStart(' ', e)}
            onMouseUp={(e) => handleTouchEnd(' ', e)}
            style={{ touchAction: 'manipulation', userSelect: 'none' }}
          >
            <ChevronUp size={24} />
          </button>
          <button
            className="mobile-btn mobile-btn-attack"
            onTouchStart={handleAttackStart}
            onTouchEnd={handleAttackEnd}
            onMouseDown={handleAttackStart}
            onMouseUp={handleAttackEnd}
            style={{ touchAction: 'manipulation', userSelect: 'none' }}
          >
            <Sword size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls; 