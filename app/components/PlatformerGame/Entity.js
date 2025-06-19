import GameObject from "./GameObject";

export default class Entity extends GameObject {
  constructor(game) {
    super(game);

    this.w = 0.1;
    this.h = 0.1;

    this.direction = -1;
    
    // Système de traînée
    this.trailPositions = [];
    this.maxTrailLength = 8;
    this.trailUpdateInterval = 0.05; // Mise à jour toutes les 50ms
    this.trailTimer = 0;
  }

  render() {
    this.drawTrail();
    this.drawGlassmorphismEnemy();
  }

  drawTrail() {
    if (this.trailPositions.length < 2) return;
    
    const ctx = this.game.ctx;
    ctx.save();
    
    // Dessiner la traînée de l'arrière vers l'avant
    for (let i = 0; i < this.trailPositions.length - 1; i++) {
      const pos = this.trailPositions[i];
      const nextPos = this.trailPositions[i + 1];
      
      // Opacité décroissante vers l'arrière
      const alpha = (i / this.trailPositions.length) * 0.4;
      const size = (i / this.trailPositions.length) * 0.8 + 0.2;
      
      // Interpolation pour une traînée fluide
      const trailX = pos.x + (nextPos.x - pos.x) * 0.5;
      const trailY = pos.y + (nextPos.y - pos.y) * 0.5;
      
      const [screenX, screenY] = this.game.camera.transformCoordinates(trailX, trailY);
      const screenSize = this.game.camera.transformX(this.w * size);
      
      // Gradient pour chaque segment de traînée
      const gradient = ctx.createRadialGradient(
        screenX, screenY, 0,
        screenX, screenY, screenSize
      );
      gradient.addColorStop(0, `rgba(255, 100, 100, ${alpha * 0.8})`);
      gradient.addColorStop(0.6, `rgba(255, 60, 60, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 40, 40, ${alpha * 0.2})`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Effet de lueur subtile
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255, 150, 150, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.restore();
  }

  drawGlassmorphismEnemy() {
    const centerX = this.x + this.w / 2;
    const centerY = this.y + this.h / 2;
    const radius = Math.max(this.w, this.h) / 2;
    
    // Animation subtile basée sur le temps
    const time = Date.now() * 0.003;
    const pulseScale = 1 + Math.sin(time * 2) * 0.1;
    const glowIntensity = 0.5 + Math.sin(time * 3) * 0.3;
    
    // Effet de lueur externe
    this.game.render.drawCircle(centerX, centerY, radius * 1.5 * pulseScale, `rgba(255, 100, 100, ${0.1 * glowIntensity})`);
    this.game.render.drawCircle(centerX, centerY, radius * 1.2 * pulseScale, `rgba(255, 150, 150, ${0.15 * glowIntensity})`);
    
    // Corps principal avec gradient
    this.drawEnemyBody(centerX, centerY, radius * pulseScale);
    
    // Effet de brillance
    this.drawEnemyHighlight(centerX, centerY, radius * pulseScale, time);
    
    // Particules flottantes
    this.drawFloatingParticles(centerX, centerY, time);
  }

  drawEnemyBody(centerX, centerY, radius) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const screenRadius = this.game.camera.transformX(radius);
    
    ctx.save();
    
    // Gradient radial pour le corps
    const gradient = ctx.createRadialGradient(
      screenX, screenY, 0,
      screenX, screenY, screenRadius
    );
    gradient.addColorStop(0, 'rgba(255, 80, 80, 0.9)');
    gradient.addColorStop(0.6, 'rgba(255, 60, 60, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 40, 40, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Bordure subtile
    ctx.strokeStyle = 'rgba(255, 120, 120, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }

  drawEnemyHighlight(centerX, centerY, radius, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const screenRadius = this.game.camera.transformX(radius);
    
    ctx.save();
    
    // Effet de brillance animé
    const highlightAngle = time * 0.5;
    const highlightX = screenX + Math.cos(highlightAngle) * screenRadius * 0.3;
    const highlightY = screenY + Math.sin(highlightAngle) * screenRadius * 0.3;
    
    const highlightGradient = ctx.createRadialGradient(
      highlightX, highlightY, 0,
      highlightX, highlightY, screenRadius * 0.4
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  drawFloatingParticles(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    // Particules flottantes autour de l'ennemi
    for (let i = 0; i < 3; i++) {
      const angle = time + i * Math.PI * 2 / 3;
      const distance = 0.15 + Math.sin(time * 2 + i) * 0.05;
      const particleX = centerX + Math.cos(angle) * distance;
      const particleY = centerY + Math.sin(angle) * distance;
      
      const [particleScreenX, particleScreenY] = this.game.camera.transformCoordinates(particleX, particleY);
      const particleSize = this.game.camera.transformX(0.02);
      
      ctx.fillStyle = `rgba(255, 150, 150, ${0.7 + Math.sin(time * 4 + i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(particleScreenX, particleScreenY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  update(delta) {
    // Mise à jour de la traînée
    this.trailTimer += delta;
    if (this.trailTimer >= this.trailUpdateInterval) {
      this.trailTimer = 0;
      
      // Ajouter la position actuelle à la traînée
      this.trailPositions.push({
        x: this.x + this.w / 2,
        y: this.y + this.h / 2,
        timestamp: Date.now()
      });
      
      // Limiter la longueur de la traînée
      if (this.trailPositions.length > this.maxTrailLength) {
        this.trailPositions.shift();
      }
    }

    this.x += delta * this.direction * 3;

    super.update();

    if (this.collidesWith(this.game.player)) {
      if (this.game.player.animationName === "attack1") {
        this.direction = this.game.player.facing === 0 ? -1 : 1;

        this.game.particleSystem.spawnParticles(this.x, this.y, 6, 0.5);

        this.game.camera.shake();
      } else if (this.game.player.animationName === "ground_slam") {
        this.colliding = true;
        this.game.camera.shake();
      } else {
        // Vérifier si le joueur est invincible (popup projet ouverte)
        if (this.game.playerInvincible) {
          // Joueur invincible - juste repousser l'ennemi sans dégâts
          this.direction = this.game.player.facing === 0 ? -1 : 1;
          this.game.particleSystem.spawnParticles(this.x, this.y, 3, 0.2);
          return; // Pas de dégâts
        }

        this.game.player.facing = this.direction < 0 ? 1 : 0;

        this.game.player.knockback();
        this.colliding = true;
        
        // Vérifier si c'est la difficulté "one hit kill"
        if (this.game.difficultyConfig && this.game.difficultyConfig.oneHitKill) {
          // Déclencher la mort instantanée du joueur
          this.game.player.die();
        }
      }
    }

    if (this.colliding) {
      this.delete = true;

      this.game.particleSystem.spawnParticles(this.x, this.y, 5, 0.3);
    }
  }
}
