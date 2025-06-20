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

  render() {
    if (this.collected) return;
    
    const time = Date.now() * 0.002;
    const floatY = Math.sin(time + this.floatOffset) * 0.08;
    const currentY = this.y + floatY;
    
    // Rotation
    this.rotationAngle += 0.03;
    
    // Effet de lueur pulsante
    this.glowIntensity = 0.4 + Math.sin(time * this.pulseSpeed) * 0.3;
    
    // Lueur externe
    this.game.render.drawCircle(
      this.x + this.w / 2, 
      currentY + this.h / 2, 
      this.w * 1.2, 
      this.glowColor.replace('0.3', (this.glowIntensity * 0.4).toString())
    );
    
    // Corps principal de l'item
    this.drawItemBody(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Icône spécifique à l'item
    this.drawIcon(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Particules autour de l'item
    this.drawParticles(this.x + this.w / 2, currentY + this.h / 2, time);
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

  // La création d'items spécifiques est gérée par ItemManager
} 