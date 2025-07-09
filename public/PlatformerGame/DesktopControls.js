"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from './GameInitPopup';

const DesktopControls = ({ onShowControlsModal }) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const mappedKeys = {
        'arrowleft': '←',
        'arrowright': '→',
        ' ': 'Espace',
        'c': 'C',
        'm': 'M',
        '+': '+',
        '=': '+', // Souvent + nécessite Shift, donc = aussi
        '-': '−',
        '_': '−'  // Souvent - avec Shift donne _
      };
      
      if (mappedKeys[key]) {
        const displayKey = mappedKeys[key];
        setPressedKeys(prev => new Set([...prev, displayKey]));
        
        // Gérer les actions de zoom
        if (displayKey === '+' && window.game && window.game.camera) {
          window.game.camera.zoomIn();
        } else if (displayKey === '−' && window.game && window.game.camera) {
          window.game.camera.zoomOut();
        }
      }
      
      // Gestion spéciale pour la touche 0 (reset zoom)
      if (key === '0' && window.game && window.game.camera) {
        setPressedKeys(prev => new Set([...prev, '0']));
        window.game.camera.resetZoom();
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const mappedKeys = {
        'arrowleft': '←',
        'arrowright': '→',
        ' ': 'Espace',
        'c': 'C',
        'm': 'M',
        '+': '+',
        '=': '+',
        '-': '−',
        '_': '−',
        '0': '0'
      };
      
      if (mappedKeys[key]) {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(mappedKeys[key]);
          return newSet;
        });
      }
    };

    const handleMouseDown = () => {
      setPressedKeys(prev => new Set([...prev, 'Clic']));
    };

    const handleMouseUp = () => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete('Clic');
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="desktop-controls">
      <div className="controls-section">
        <span className="controls-label">{t('movementShort')}</span>
        <div className="controls-keys">
          <kbd className={pressedKeys.has('←') ? 'key-pressed' : ''}>←</kbd>
          <kbd className={pressedKeys.has('→') ? 'key-pressed' : ''}>→</kbd>
        </div>
      </div>
      
      <div className="controls-section">
        <span className="controls-label">{t('actionsShort')}</span>
        <div className="controls-keys">
          <kbd className={pressedKeys.has('Espace') ? 'key-pressed' : ''}>Espace</kbd>
          <kbd className={pressedKeys.has('Clic') ? 'key-pressed' : ''}>Clic</kbd>
        </div>
      </div>

      <div className="controls-section">
        <span className="controls-label">{t('commandShort')}</span>
        <div className="controls-keys">
          <kbd 
            className={pressedKeys.has('C') ? 'key-pressed' : ''}
            onClick={onShowControlsModal}
            style={{ cursor: 'pointer' }}
            title={t('controlsTooltip')}
          >
            C
          </kbd>
          <kbd 
            className={pressedKeys.has('M') ? 'key-pressed' : ''}
            style={{ cursor: 'pointer' }}
            title="Menu"
          >
            M
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default DesktopControls; 