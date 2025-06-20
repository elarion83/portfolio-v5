export default class EffectManager {
  constructor(game) {
    this.game = game;
    this.activeEffects = new Map();
    this.effectHistory = [];
  }

  addEffect(type, data) {
    const effect = {
      type,
      name: data.name || type,
      icon: data.icon || '🔮',
      color: data.color || 'rgba(100, 200, 255, 0.8)',
      startTime: Date.now(),
      duration: data.duration || 5000,
      multiplier: data.multiplier || 1,
      data: data,
      active: true
    };

    // Si un effet du même type existe déjà, le remplacer
    if (this.activeEffects.has(type)) {
      console.log(`🔄 Rechargement de l'effet: ${effect.name}`);
    } else {
      console.log(`✨ Nouvel effet activé: ${effect.name}`);
    }

    this.activeEffects.set(type, effect);

    // Appliquer l'effet immédiatement
    this.applyEffect(effect);

    // Émettre un événement pour l'interface utilisateur
    window.dispatchEvent(new CustomEvent('effectAdded', { 
      detail: effect
    }));
  }

  removeEffect(type) {
    const effect = this.activeEffects.get(type);
    if (effect) {
      effect.active = false;
      this.unapplyEffect(effect);
      this.activeEffects.delete(type);
      
      console.log(`⏰ Effet expiré: ${effect.name}`);
      
      // Émettre un événement pour l'interface utilisateur
      window.dispatchEvent(new CustomEvent('effectRemoved', { 
        detail: effect
      }));
    }
  }

  applyEffect(effect) {
    switch (effect.type) {
      case 'speed_boost':
        this.game.player.speedMultiplier = (this.game.player.speedMultiplier || 1) * effect.multiplier;
        break;
      // Ajouter d'autres types d'effets ici
      default:
        console.log(`Type d'effet non reconnu: ${effect.type}`);
    }
  }

  unapplyEffect(effect) {
    switch (effect.type) {
      case 'speed_boost':
        this.game.player.speedMultiplier = (this.game.player.speedMultiplier || 1) / effect.multiplier;
        // S'assurer que le multiplicateur ne descend pas sous 1
        if (this.game.player.speedMultiplier < 1) {
          this.game.player.speedMultiplier = 1;
        }
        break;
      // Ajouter d'autres types d'effets ici
    }
  }

  update(delta) {
    const currentTime = Date.now();
    const effectsToRemove = [];

    // Vérifier les effets expirés
    this.activeEffects.forEach((effect, type) => {
      const elapsed = currentTime - effect.startTime;
      if (elapsed >= effect.duration) {
        effectsToRemove.push(type);
      }
    });

    // Supprimer les effets expirés
    effectsToRemove.forEach(type => {
      this.removeEffect(type);
    });
  }

  getActiveEffects() {
    return Array.from(this.activeEffects.values());
  }

  getRemainingTime(type) {
    const effect = this.activeEffects.get(type);
    if (!effect) return 0;
    
    const elapsed = Date.now() - effect.startTime;
    return Math.max(0, effect.duration - elapsed);
  }

  hasEffect(type) {
    return this.activeEffects.has(type);
  }

  clear() {
    // Supprimer tous les effets actifs
    this.activeEffects.forEach((effect, type) => {
      this.unapplyEffect(effect);
    });
    this.activeEffects.clear();
    
    // Réinitialiser les multiplicateurs du joueur
    if (this.game.player) {
      this.game.player.speedMultiplier = 1;
    }
  }

  // Méthode pour débugger
  getDebugInfo() {
    const effects = this.getActiveEffects();
    return {
      activeEffectsCount: effects.length,
      playerSpeedMultiplier: this.game.player?.speedMultiplier || 1,
      effects: effects.map(effect => ({
        type: effect.type,
        name: effect.name,
        remainingTime: this.getRemainingTime(effect.type)
      }))
    };
  }
} 