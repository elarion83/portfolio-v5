import Item from "./Item";

export default class HealthItem extends Item {
  constructor(game, x, y) {
    super(game, x, y, 'health_pack');
    console.log("--- HEALTH ITEM MODULE v2 LOADED ---"); // Log pour forcer la recompilation
    
    // Durée de vie entre 8 et 15 secondes
    const lifespanSeconds = 8 + Math.random() * 7;
    this.setLifespan(lifespanSeconds * 1000);
    
    // Propriétés visuelles pour un pack de soin
    this.primaryColor = 'rgba(50, 255, 150, 0.9)';   // Vert clair
    this.secondaryColor = 'rgba(200, 255, 220, 0.8)'; // Blanc-vert
    this.glowColor = 'rgba(50, 255, 150, 0.4)';      // Lueur verte
    
    // Propriétés de l'effet de soin
    this.healAmount = 1;
    
    this.name = `Pack de Soin`;
    this.description = `Restaure ${this.healAmount} point de vie (disparaît dans ${Math.round(lifespanSeconds)}s)`;
    
    this.pulseSpeed = 1.5; // Pulsation plus lente et apaisante
  }

  drawIcon(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const iconSize = this.game.camera.transformX(this.w * 0.3);
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(this.rotationAngle * 0.2); // Rotation lente
    
    // Icône de croix de soin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    
    const barWidth = iconSize * 0.8;
    const barHeight = iconSize * 0.25;
    
    // Barre verticale
    ctx.fillRect(-barHeight / 2, -barWidth / 2, barHeight, barWidth);
    ctx.strokeRect(-barHeight / 2, -barWidth / 2, barHeight, barWidth);
    
    // Barre horizontale
    ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
    ctx.strokeRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
    
    ctx.restore();
  }

  drawParticles(centerX, centerY, time) {
    // Particules de base
    super.drawParticles(centerX, centerY, time);
    
    // Ajouter des petites bulles de soin qui montent
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    
    for (let i = 0; i < 4; i++) {
      const angle = (time / 2) + (i * Math.PI / 2);
      const distance = this.game.camera.transformX(0.1 + Math.sin(angle * 2) * 0.05);
      
      const particleX = screenX + Math.cos(angle) * distance * 2;
      const particleY = screenY + Math.sin(angle) * distance - (time % 5000 / 5000) * this.game.camera.transformY(0.5); // Montent
      
      ctx.save();
      ctx.globalAlpha = this.glowIntensity * (0.8 - (time % 5000 / 5000)); // Fade out en montant
      ctx.fillStyle = this.primaryColor;
      
      ctx.beginPath();
      ctx.arc(particleX, particleY, this.game.camera.transformX(0.02), 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  applyEffect() {
    // [DEBUG] Log détaillé pour vérifier l'état de la vie du joueur
    console.log(`[HEALTH DEBUG] Tentative de soin. Player State: currentHealth=${this.game.player.currentHealth}, maxHealth=${this.game.player.maxHealth}`);

    // Vérifier si le joueur a besoin de soin, en utilisant la bonne propriété `currentHealth`
    if (this.game.player.currentHealth < this.game.player.maxHealth) {
      this.game.player.heal(this.healAmount);
      // Le message de succès est déjà dans la méthode `heal` du joueur
      
      // On peut ajouter un effet visuel de soin sur le joueur ici
      this.game.particleSystem.spawnParticles(this.x, this.y, 15, 0.8);
      
      return true; // L'effet a été appliqué
    } else {
      console.log(`❤️ Pack de soin ramassé, mais vie déjà au maximum.`);
      // On pourrait quand même donner un petit bonus, comme quelques points
      return false; // L'effet n'a pas été nécessaire
    }
  }
} 