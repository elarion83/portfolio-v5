export default class PlatformEffectManager {
  constructor(game) {
    this.game = game;
    this.effects = new Map(); // ID plateforme -> Array d'effets
    this.globalTime = 0;
  }

  /**
   * Ajouter un effet à une ou plusieurs plateformes
   * @param {number|Array<number>} platformIds - ID(s) de plateforme(s)
   * @param {string} effectType - Type d'effet ('highlight', 'pulse', 'glow', 'shake', 'rainbow')
   * @param {Object} options - Options de l'effet (color, intensity, speed, duration, etc.)
   */
  addEffect(platformIds, effectType, options = {}) {
    const ids = Array.isArray(platformIds) ? platformIds : [platformIds];
    
    ids.forEach(id => {
      if (!this.effects.has(id)) {
        this.effects.set(id, []);
      }
      
      const effect = {
        type: effectType,
        options: {
          color: options.color || '#ff0000',
          intensity: options.intensity || 1.0,
          speed: options.speed || 1.0,
          duration: options.duration || null, // null = infini
          ...options
        },
        startTime: this.globalTime,
        id: Math.random().toString(36).substr(2, 9) // ID unique pour l'effet
      };
      
      this.effects.get(id).push(effect);
      console.log(`🎨 Effet '${effectType}' ajouté à la plateforme ${id}`);
    });
  }

  /**
   * Supprimer un effet spécifique d'une plateforme
   * @param {number} platformId - ID de la plateforme
   * @param {string} effectType - Type d'effet à supprimer
   */
  removeEffect(platformId, effectType) {
    if (this.effects.has(platformId)) {
      const platformEffects = this.effects.get(platformId);
      const filteredEffects = platformEffects.filter(effect => effect.type !== effectType);
      
      if (filteredEffects.length === 0) {
        this.effects.delete(platformId);
      } else {
        this.effects.set(platformId, filteredEffects);
      }
      
      console.log(`🗑️ Effet '${effectType}' supprimé de la plateforme ${platformId}`);
    }
  }

  /**
   * Supprimer tous les effets d'une plateforme
   * @param {number} platformId - ID de la plateforme
   */
  removeAllEffects(platformId) {
    if (this.effects.has(platformId)) {
      this.effects.delete(platformId);
      console.log(`🗑️ Tous les effets supprimés de la plateforme ${platformId}`);
    }
  }

  /**
   * Nettoyer tous les effets
   */
  clearAllEffects() {
    this.effects.clear();
    console.log('🗑️ Tous les effets de plateformes supprimés');
  }

  /**
   * Mettre à jour les effets (gestion du temps, suppression des effets expirés)
   * @param {number} delta - Temps écoulé
   */
  update(delta) {
    this.globalTime += delta;

    // Supprimer les effets expirés
    for (const [platformId, effects] of this.effects.entries()) {
      const activeEffects = effects.filter(effect => {
        if (effect.options.duration === null) return true; // Effet permanent
        return (this.globalTime - effect.startTime) < effect.options.duration;
      });

      if (activeEffects.length === 0) {
        this.effects.delete(platformId);
      } else if (activeEffects.length !== effects.length) {
        this.effects.set(platformId, activeEffects);
      }
    }
  }

  /**
   * Rendu des effets sur les plateformes
   * @param {number} delta - Temps écoulé
   */
  render(delta) {
    if (this.effects.size === 0) return;

    // Parcourir toutes les plateformes avec effets
    for (const [platformId, effects] of this.effects.entries()) {
      // Vérifier les plateformes visibles pour cet ID (incluant les répétitions)
      const visibleInstances = this.getVisiblePlatformInstances(platformId);
      
      visibleInstances.forEach(platformInstance => {
        // Appliquer chaque effet de cette plateforme
        effects.forEach(effect => {
          this.renderEffect(platformInstance, effect, delta);
        });
      });
    }
  }

  /**
   * Rendu d'un effet spécifique sur une plateforme
   * @param {Object} platform - Données de la plateforme
   * @param {Object} effect - Données de l'effet
   * @param {number} delta - Temps écoulé
   */
  renderEffect(platform, effect, delta) {
    const [screenX, screenY] = this.game.camera.transformCoordinates(platform.x, platform.y);
    const [screenW, screenH] = this.game.camera.transformCoordinates(platform.x + 1, platform.y + 1);
    const time = this.globalTime - effect.startTime;

    switch (effect.type) {
      case 'highlight':
        this.renderHighlight(screenX, screenY, screenW - screenX, screenH - screenY, effect, time);
        break;
      
      case 'pulse':
        this.renderPulse(screenX, screenY, screenW - screenX, screenH - screenY, effect, time);
        break;
      
      case 'glow':
        this.renderGlow(screenX, screenY, screenW - screenX, screenH - screenY, effect, time);
        break;
      
      case 'shake':
        // Le shake sera géré différemment car il affecte la position
        break;
      
      case 'rainbow':
        this.renderRainbow(screenX, screenY, screenW - screenX, screenH - screenY, effect, time);
        break;
    }
  }

  renderHighlight(x, y, w, h, effect, time) {
    this.game.ctx.save();
    this.game.ctx.fillStyle = effect.options.color;
    this.game.ctx.globalAlpha = effect.options.intensity * 0.3;
    this.game.ctx.fillRect(x, y, w, h);
    this.game.ctx.restore();
  }

  renderPulse(x, y, w, h, effect, time) {
    const pulseIntensity = Math.sin(time * effect.options.speed * 5) * 0.5 + 0.5;
    this.game.ctx.save();
    this.game.ctx.fillStyle = effect.options.color;
    this.game.ctx.globalAlpha = pulseIntensity * effect.options.intensity * 0.4;
    this.game.ctx.fillRect(x, y, w, h);
    this.game.ctx.restore();
  }

  renderGlow(x, y, w, h, effect, time) {
    this.game.ctx.save();
    this.game.ctx.shadowColor = effect.options.color;
    this.game.ctx.shadowBlur = 20 * effect.options.intensity;
    this.game.ctx.fillStyle = effect.options.color;
    this.game.ctx.globalAlpha = 0.2 * effect.options.intensity;
    this.game.ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    this.game.ctx.restore();
  }

  renderRainbow(x, y, w, h, effect, time) {
    const hue = (time * effect.options.speed * 50) % 360;
    this.game.ctx.save();
    this.game.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.3 * effect.options.intensity})`;
    this.game.ctx.fillRect(x, y, w, h);
    this.game.ctx.restore();
  }

  /**
   * Obtenir tous les effets d'une plateforme
   * @param {number} platformId - ID de la plateforme
   * @returns {Array} Liste des effets
   */
  getEffects(platformId) {
    return this.effects.get(platformId) || [];
  }

  /**
   * Vérifier si une plateforme a un effet spécifique
   * @param {number} platformId - ID de la plateforme
   * @param {string} effectType - Type d'effet
   * @returns {boolean}
   */
  hasEffect(platformId, effectType) {
    const effects = this.effects.get(platformId);
    return effects ? effects.some(effect => effect.type === effectType) : false;
  }

  /**
   * Obtenir toutes les instances visibles d'une plateforme (incluant les répétitions)
   * @param {number} platformId - ID de la plateforme
   * @returns {Array} Liste des instances visibles avec leurs coordonnées réelles
   */
  getVisiblePlatformInstances(platformId) {
    const basePlatform = this.game.getPlatformById(platformId);
    if (!basePlatform) return [];

    const instances = [];
    const isMobile = window.innerWidth <= 768;
    const renderMargin = isMobile ? 3 : 0;
    
    // Calculer combien de répétitions sont potentiellement visibles
    const cameraStartX = this.game.camera.startX - renderMargin;
    const cameraEndX = this.game.camera.endX + renderMargin;
    
    const startRepetition = Math.floor(cameraStartX / this.game.levelWidth);
    const endRepetition = Math.ceil(cameraEndX / this.game.levelWidth);
    
    // Vérifier chaque répétition possible
    for (let rep = startRepetition; rep <= endRepetition; rep++) {
      const actualX = basePlatform.x + (rep * this.game.levelWidth);
      const actualY = basePlatform.y;
      
      // Vérifier si cette instance est visible
      const isVisible = (
        actualX + 1 > cameraStartX &&
        actualY + 1 > this.game.camera.startY - renderMargin &&
        actualX <= cameraEndX &&
        actualY <= this.game.camera.endY + renderMargin
      );
      
      if (isVisible) {
        instances.push({
          ...basePlatform,
          x: actualX,
          y: actualY,
          repetition: rep
        });
      }
    }
    
    return instances;
  }
} 