import GameObject from "./GameObject";

export default class Item extends GameObject {
  constructor(game, x, y, type = 'generic') {
    super(game);
    
    this.x = x;
    this.y = y;
    this.w = 0.4;
    this.h = 0.4;
    
    this.type = type;
    this.collected = false;
    this.hovered = false;
    
    // Système de durée de vie
    this.spawnTime = Date.now();
    this.lifespan = null; // null = durée illimitée, nombre = durée en millisecondes
    this.expired = false;
    this.fadeOutDuration = 1000; // 1 seconde de fade-out avant disparition
    this.startFadeOut = false;
    this.fadeOutStartTime = 0;
    
    // Animation
    this.floatOffset = Math.random() * Math.PI * 2;
    this.rotationAngle = 0;
    this.glowIntensity = 0;
    this.pulseSpeed = 2 + Math.random(); // Vitesse de pulsation aléatoire
    
    // Propriétés visuelles par défaut
    this.primaryColor = 'rgba(100, 200, 255, 0.8)';
    this.secondaryColor = 'rgba(255, 255, 255, 0.6)';
    this.glowColor = 'rgba(100, 200, 255, 0.3)';
    
    // Propriétés d'effet
    this.effectData = {};
    this.name = 'Item';
    this.description = 'Un objet mystérieux';
  }

  // Définir la durée de vie de l'item (en millisecondes)
  setLifespan(duration) {
    this.lifespan = duration;
  }

  // Vérifier si l'item a expiré
  checkExpiration() {
    if (!this.lifespan || this.collected || this.expired) return false;
    
    const currentTime = Date.now();
    const age = currentTime - this.spawnTime;
    
    // Commencer le fade-out avant l'expiration
    if (age >= this.lifespan - this.fadeOutDuration && !this.startFadeOut) {
      this.startFadeOut = true;
      this.fadeOutStartTime = currentTime;
    }
    
    // Expirer l'item
    if (age >= this.lifespan) {
      this.expired = true;
      return true;
    }
    
    return false;
  }

  // Calculer l'alpha pour l'effet de fade-out
  getFadeAlpha() {
    if (!this.startFadeOut) return 1.0;
    
    const fadeProgress = (Date.now() - this.fadeOutStartTime) / this.fadeOutDuration;
    return Math.max(0, 1 - fadeProgress);
  }

  render() {
    if (this.collected || this.expired) return;
    
    const time = Date.now() * 0.002;
    const floatY = Math.sin(time + this.floatOffset) * 0.08;
    const currentY = this.y + floatY;
    
    // Rotation
    this.rotationAngle += 0.03;
    
    // Effet de lueur pulsante
    this.glowIntensity = 0.4 + Math.sin(time * this.pulseSpeed) * 0.3;
    
    // Appliquer l'effet de fade-out si nécessaire
    const fadeAlpha = this.getFadeAlpha();
    const ctx = this.game.ctx;
    
    ctx.save();
    ctx.globalAlpha = fadeAlpha;
    
    // Lueur externe
    this.game.render.drawCircle(
      this.x + this.w / 2, 
      currentY + this.h / 2, 
      this.w * 1.2, 
      this.glowColor.replace('0.3', (this.glowIntensity * 0.4 * fadeAlpha).toString())
    );
    
    // Corps principal de l'item
    this.drawItemBody(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Icône spécifique à l'item
    this.drawIcon(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Particules autour de l'item
    this.drawParticles(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Barre de durée de vie (si l'item a une durée limitée)
    if (this.lifespan) {
      this.drawLifespanBar(this.x + this.w / 2, currentY - this.h / 2 - 0.15);
    }
    
    ctx.restore();
  }

  drawItemBody(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const radius = this.game.camera.transformX(this.w * 0.4);
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(this.rotationAngle);
    
    // Gradient radial pour le corps
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, this.primaryColor);
    gradient.addColorStop(0.7, this.secondaryColor);
    gradient.addColorStop(1, this.primaryColor.replace('0.8', '0.2'));
    
    // Corps hexagonal
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Bordure brillante
    ctx.strokeStyle = this.secondaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }

  drawIcon(centerX, centerY, time) {
    // À override dans les classes dérivées
  }

  drawParticles(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    
    // Petites particules qui tournent autour
    for (let i = 0; i < 3; i++) {
      const angle = time * 2 + (i * Math.PI * 2) / 3;
      const distance = this.game.camera.transformX(0.3);
      const x = screenX + Math.cos(angle) * distance;
      const y = screenY + Math.sin(angle) * distance;
      const size = this.game.camera.transformX(0.05);
      
      ctx.save();
      ctx.globalAlpha = this.glowIntensity;
      ctx.fillStyle = this.secondaryColor;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  update(delta) {
    if (this.collected || this.game.isInitializing) return;

    // Vérifier l'expiration
    this.checkExpiration();
    if (this.expired) return;

    // Vérifier si le joueur est proche
    const playerCenter = this.game.player.getCenter();
    const itemCenter = [this.x + this.w / 2, this.y + this.h / 2];
    const distance = Math.sqrt(
      Math.pow(playerCenter[0] - itemCenter[0], 2) + 
      Math.pow(playerCenter[1] - itemCenter[1], 2)
    );
    
    const isNear = distance < 0.8; // Distance de collecte
    
    if (isNear && !this.collected) {
      this.collect();
    }
  }

  collect() {
    if (this.collected) return;
    
    this.collected = true;
    
    // Effet visuel de collecte
    this.game.particleSystem.spawnParticles(
      this.x + this.w / 2,
      this.y + this.h / 2,
      8,
      0.5,
      this.primaryColor
    );
    
    // Appliquer l'effet
    this.applyEffect();
    
    // Son ou autre feedback
    console.log(`📦 Item collecté: ${this.name}`);
    
    // Émettre un événement pour les statistiques
    window.dispatchEvent(new CustomEvent('itemCollected', { 
      detail: { 
        type: this.type,
        name: this.name,
        effect: this.effectData
      } 
    }));
  }

  applyEffect() {
    // À override dans les classes dérivées
    console.log(`Effet appliqué: ${this.name}`);
  }

  // Dessiner la barre de durée de vie
  drawLifespanBar(centerX, barY) {
    if (!this.lifespan) return;
    
    const ctx = this.game.ctx;
    const currentTime = Date.now();
    const age = currentTime - this.spawnTime;
    const remainingTime = Math.max(0, this.lifespan - age);
    const timeProgress = remainingTime / this.lifespan; // De 1 à 0
    
    // Dimensions de la barre
    const barWidth = this.w * 1.2;
    const barHeight = 0.06;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX - barWidth / 2, barY);
    const screenBarWidth = this.game.camera.transformX(barWidth);
    const screenBarHeight = this.game.camera.transformY(barHeight);
    
    ctx.save();
    
    // Fond de la barre (gris semi-transparent)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(screenX, screenY, screenBarWidth, screenBarHeight);
    
    // Bordure de la barre
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX, screenY, screenBarWidth, screenBarHeight);
    
    // Barre de progression (couleur qui change selon le temps restant)
    if (timeProgress > 0) {
      const progressWidth = screenBarWidth * timeProgress;
      
      // Couleur qui passe du vert au rouge selon le temps restant
      let barColor;
      if (timeProgress > 0.6) {
        // Vert : beaucoup de temps restant
        barColor = `rgba(100, 255, 100, 0.8)`;
      } else if (timeProgress > 0.3) {
        // Orange : temps modéré
        barColor = `rgba(255, 200, 50, 0.8)`;
      } else {
        // Rouge : peu de temps restant + effet de clignotement
        const blinkIntensity = Math.sin(currentTime * 0.01) * 0.3 + 0.7;
        barColor = `rgba(255, 100, 100, ${0.8 * blinkIntensity})`;
      }
      
      ctx.fillStyle = barColor;
      ctx.fillRect(screenX, screenY, progressWidth, screenBarHeight);
      
      // Effet de brillance sur la barre
      const gradient = ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenBarHeight);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(screenX, screenY, progressWidth, screenBarHeight);
    }
    
    ctx.restore();
  }

  // La création d'items spécifiques est gérée par ItemManager
} 