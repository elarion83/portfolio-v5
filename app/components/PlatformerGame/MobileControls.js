import React from 'react';

const MobileControls = ({ onKeyPress, onKeyRelease, showCollectButton = false }) => {
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
        {/* Colonne de gauche : Bouton E conditionnel */}
        {showCollectButton && (
          <div className="mobile-actions-left">
            <button
              className="mobile-btn mobile-btn-collect"
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
            ⬆
          </button>
          <button
            className="mobile-btn mobile-btn-attack"
            onTouchStart={handleAttackStart}
            onTouchEnd={handleAttackEnd}
            onMouseDown={handleAttackStart}
            onMouseUp={handleAttackEnd}
          >
            ⚔
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls; 