import React from 'react';

const MobileControls = ({ onKeyPress, onKeyRelease }) => {
  const handleTouchStart = (key) => {
    onKeyPress(key);
  };

  const handleTouchEnd = (key) => {
    onKeyRelease(key);
  };

  const handleAttack = () => {
    // Simuler un clic de souris pour l'attaque
    if (window.game && window.game.inputManager) {
      window.game.inputManager.handleMouseEvent(0, true);
      // Relâcher après un court délai
      setTimeout(() => {
        if (window.game && window.game.inputManager) {
          window.game.inputManager.handleMouseEvent(0, false);
        }
      }, 100);
    }
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
          ←
        </button>
        <button
          className="mobile-btn mobile-btn-right"
          onTouchStart={() => handleTouchStart('d')}
          onTouchEnd={() => handleTouchEnd('d')}
          onMouseDown={() => handleTouchStart('d')}
          onMouseUp={() => handleTouchEnd('d')}
        >
          →
        </button>
      </div>

      {/* Boutons d'action */}
      <div className="mobile-actions">
        <button
          className="mobile-btn mobile-btn-jump"
          onTouchStart={() => handleTouchStart(' ')}
          onTouchEnd={() => handleTouchEnd(' ')}
          onMouseDown={() => handleTouchStart(' ')}
          onMouseUp={() => handleTouchEnd(' ')}
        >
          ⬆
        </button>
        <button
          className="mobile-btn mobile-btn-collect"
          onTouchStart={() => handleTouchStart('e')}
          onTouchEnd={() => handleTouchEnd('e')}
          onMouseDown={() => handleTouchStart('e')}
          onMouseUp={() => handleTouchEnd('e')}
        >
          E
        </button>
        <button
          className="mobile-btn mobile-btn-attack"
          onTouchStart={handleAttack}
          onMouseDown={handleAttack}
        >
          ⚔
        </button>
      </div>
    </div>
  );
};

export default MobileControls; 