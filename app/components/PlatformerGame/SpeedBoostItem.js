import Item from "./Item";

export default class SpeedBoostItem extends Item {
  constructor(game, x, y) {
    super(game, x, y, 'speed_boost');
    
    // Propriétés visuelles spécifiques au boost de vitesse
    this.primaryColor = 'rgba(255, 200, 50, 0.9)';
    this.secondaryColor = 'rgba(255, 255, 100, 0.8)';
    this.glowColor = 'rgba(255, 200, 50, 0.4)';
    
    // Propriétés d'effet
    this.effectData = {
      speedMultiplier: 1.2,
      duration: 5000 // 5 secondes en millisecondes
    };
    
    // Calculer le pourcentage pour l'affichage
    const percentage = Math.round(this.effectData.speedMultiplier * 100);
    this.name = `Vitesse x${percentage}%`;
    this.description = `Augmente la vitesse de ${percentage - 100}% pendant 5 secondes`;
    
    // Animation plus rapide pour suggérer la vitesse
    this.pulseSpeed = 4;
  }

  drawIcon(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const iconSize = this.game.camera.transformX(this.w * 0.25);
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(-this.rotationAngle * 0.5); // Rotation inverse plus lente
    
    // Icône de flèches pour suggérer la vitesse
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    
    // Dessiner 3 flèches qui se suivent
    for (let i = 0; i < 3; i++) {
      const offsetX = (i - 1) * iconSize * 0.4;
      const arrowSize = iconSize * (0.8 - i * 0.1); // Flèches qui diminuent
      
      ctx.beginPath();
      ctx.moveTo(offsetX - arrowSize, -arrowSize * 0.3);
      ctx.lineTo(offsetX + arrowSize, 0);
      ctx.lineTo(offsetX - arrowSize, arrowSize * 0.3);
      ctx.lineTo(offsetX - arrowSize * 0.5, 0);
      ctx.closePath();
      
      ctx.globalAlpha = 1 - i * 0.2; // Transparence progressive
      ctx.fill();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  drawParticles(centerX, centerY, time) {
    // Appeler les particules de base
    super.drawParticles(centerX, centerY, time);
    
    // Ajouter des traînées de vitesse
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    
    // Traînées qui simulent la vitesse
    for (let i = 0; i < 5; i++) {
      const angle = time * 3 + (i * Math.PI * 2) / 5;
      const distance = this.game.camera.transformX(0.2 + i * 0.05);
      const x = screenX + Math.cos(angle) * distance;
      const y = screenY + Math.sin(angle) * distance;
      
      ctx.save();
      ctx.globalAlpha = this.glowIntensity * (0.6 - i * 0.1);
      ctx.fillStyle = this.primaryColor;
      
      // Traînée en forme d'étoile
      const trailSize = this.game.camera.transformX(0.03);
      ctx.beginPath();
      ctx.moveTo(x + trailSize, y);
      ctx.lineTo(x + trailSize * 0.3, y + trailSize * 0.3);
      ctx.lineTo(x, y + trailSize);
      ctx.lineTo(x - trailSize * 0.3, y + trailSize * 0.3);
      ctx.lineTo(x - trailSize, y);
      ctx.lineTo(x - trailSize * 0.3, y - trailSize * 0.3);
      ctx.lineTo(x, y - trailSize);
      ctx.lineTo(x + trailSize * 0.3, y - trailSize * 0.3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }

  applyEffect() {
    // Appliquer l'effet de boost de vitesse au joueur
    if (this.game.effectManager) {
      this.game.effectManager.addEffect('speed_boost', {
        multiplier: this.effectData.speedMultiplier,
        duration: this.effectData.duration,
        name: this.name,
        icon: '⚡️', // Éclair plus visible avec variation d'émoji
        color: this.primaryColor
      });
    }
    
    console.log(`⚡ Boost de vitesse activé ! (+50% pendant 5s)`);
  }
} 