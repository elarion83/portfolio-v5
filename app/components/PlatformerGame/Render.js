import Game from "./Game.js";
import { degreesToRadians } from "./util/MathUtil.js";

export default class Render {
  /**
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;
  }

  setAlpha(alpha) {
    this.game.ctx.globalAlpha = alpha;
  }

  drawLine(startX, startY, endX, endY, strokeWidth, color) {
    this.game.ctx.strokeStyle = color;

    this.game.ctx.beginPath();
    this.game.ctx.moveTo(
      ...this.game.camera.transformCoordinates(startX, startY)
    );
    this.game.ctx.lineTo(...this.game.camera.transformCoordinates(endX, endY));
    this.game.ctx.lineWidth = this.game.camera.transformX(strokeWidth);

    this.game.ctx.stroke();
    this.game.ctx.closePath();
  }

  drawRect(x, y, w, h, color) {
    this.game.ctx.fillStyle = color;
    this.game.ctx.fillRect(...this.game.camera.transformRect(x, y, w, h));
  }

  drawGlassmorphismBorder(x, y, w, h, side) {
    const [screenX, screenY, screenW, screenH] = this.game.camera.transformRect(x, y, w, h);
    
    // Sauvegarde du contexte
    this.game.ctx.save();
    
    // Création d'un gradient pour l'effet glassmorphism
    let gradient;
    if (side === 'left' || side === 'right') {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY);
    } else {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenH);
    }
    
    // Couleurs glassmorphism
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    
    this.game.ctx.fillStyle = gradient;
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Effet de brillance
    this.game.ctx.globalCompositeOperation = 'screen';
    this.game.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Bordure subtile
    this.game.ctx.globalCompositeOperation = 'source-over';
    this.game.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.game.ctx.lineWidth = 1;
    this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    
    // Restauration du contexte
    this.game.ctx.restore();
  }

  drawOrangeBorder(x, y, w, h, side, intensity = 1.0) {
    const [screenX, screenY, screenW, screenH] = this.game.camera.transformRect(x, y, w, h);
    
    // Sauvegarde du contexte
    this.game.ctx.save();
    
    // Création d'un gradient orange intense pour les plateformes touchées
    let gradient;
    if (side === 'left' || side === 'right') {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY);
    } else {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenH);
    }
    
    // Couleurs orange beaucoup plus intenses et visibles
    gradient.addColorStop(0, `rgba(255, 165, 0, ${Math.min(0.9, 0.8 * intensity)})`); // Orange vif
    gradient.addColorStop(0.3, `rgba(226, 141, 29, ${Math.min(0.8, 0.6 * intensity)})`);
    gradient.addColorStop(0.7, `rgba(255, 140, 0, ${Math.min(0.7, 0.4 * intensity)})`);
    gradient.addColorStop(1, `rgba(226, 141, 29, ${Math.min(0.6, 0.3 * intensity)})`);
    
    this.game.ctx.fillStyle = gradient;
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Effet de brillance orange très intense
    this.game.ctx.globalCompositeOperation = 'screen';
    this.game.ctx.fillStyle = `rgba(255, 200, 100, ${Math.min(0.6, 0.4 * intensity)})`;
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Bordure orange très épaisse et visible
    this.game.ctx.globalCompositeOperation = 'source-over';
    this.game.ctx.strokeStyle = `rgba(255, 165, 0, ${Math.min(1.0, 0.9 * intensity)})`;
    this.game.ctx.lineWidth = Math.max(3, intensity * 4); // Bordure plus épaisse
    this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    
    // Effet de lueur orange très intense
    this.game.ctx.shadowColor = `rgba(255, 165, 0, ${Math.min(0.8, 0.6 * intensity)})`;
    this.game.ctx.shadowBlur = Math.max(8, intensity * 12); // Lueur plus intense
    this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    
    // Bordure interne plus claire pour plus de contraste
    this.game.ctx.strokeStyle = `rgba(255, 220, 150, ${Math.min(0.7, 0.5 * intensity)})`;
    this.game.ctx.lineWidth = Math.max(1, intensity * 2);
    this.game.ctx.strokeRect(screenX + 1, screenY + 1, screenW - 2, screenH - 2);
    
    // Restauration du contexte
    this.game.ctx.restore();
  }

  drawCircle(x, y, r, color) {
    this.game.ctx.fillStyle = color;
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      ...this.game.camera.transformCoordinates(x, y),
      this.game.camera.transformX(r),
      2 * Math.PI,
      0
    );
    this.game.ctx.fill();
    this.game.ctx.closePath();
  }

  /**
   * @param {Object} spriteInfo
   * @param {string} spriteInfo.sprite
   * @param {number} spriteInfo.frame
   * @param {string[]} spriteInfo.effects
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  drawSprite(spriteInfo, x, y, w, h) {
    var sprite = this.game.ssm.getSpriteFromInfoObject(spriteInfo);

    if (sprite) {
      this.drawScalingSprite(spriteInfo, x, y, w, h);

      var aspectRatio = sprite.h / sprite.w;
      var passedAspectRatio = h / w;

      if (aspectRatio.toFixed(2) !== passedAspectRatio.toFixed(2)) {
        throw new Error(
          "Invalid aspect ratio while drawing " +
            JSON.stringify(spriteInfo) +
            ", expected: " +
            aspectRatio +
            ", received: " +
            passedAspectRatio
        );
      }
    }
  }

  drawScalingSprite(spriteInfo, x, y, w, h) {
    var sprite = this.game.ssm.getSpriteFromInfoObject(spriteInfo);

    if (sprite) {
      this.drawImage(
        sprite.spriteSheet.image,
        x,
        y,
        w,
        h,
        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h
      );
    }
  }

  drawImage(img, x, y, w, h, sx, sy, sw, sh) {
    this.game.ctx.drawImage(
      img,
      sx,
      sy,
      sw,
      sh,
      ...this.game.camera.transformRect(x, y, w, h).map(Math.round)
    );
  }

  drawImageWithRotation(image, _x, _y, _w, _h, sx, sy, sw, sh, rotateDegrees) {
    var [x, y, width, height] = this.game.camera.transformRect(_x, _y, _w, _h);

    x += width / 2;
    y += height / 2;

    var context = this.game.ctx;

    var angleInRadians = degreesToRadians(rotateDegrees);

    context.translate(x, y);
    context.rotate(angleInRadians);
    context.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      -width / 2,
      -height / 2,
      width,
      height
    );
    context.rotate(-angleInRadians);
    context.translate(-x, -y);
  }

  drawText(text, x, y, fontSize, color) {
    this.game.ctx.fillStyle = color;
    this.game.ctx.font = fontSize + "px";

    this.game.ctx.fillText(
      text,
      ...this.game.camera.transformCoordinates(x, y)
    );
  }

  drawScalingText(text, x, y, maxX, fontSize, color) {
    this.game.ctx.fillStyle = color;
    this.game.ctx.font = fontSize + "px";

    this.game.ctx.fillText(
      text,
      ...this.game.camera.transformCoordinates(x, y),
      this.game.camera.transformX(maxX)
    );
  }

  // Nouvelle méthode pour l'aura dégressive autour du joueur
  drawPlayerAura(x, y, w, h, side, intensity) {
    const [screenX, screenY, screenW, screenH] = this.game.camera.transformRect(x, y, w, h);
    
    // Sauvegarde du contexte
    this.game.ctx.save();
    
    // Création d'un gradient orange avec intensité variable
    let gradient;
    if (side === 'left' || side === 'right') {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY);
    } else {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenH);
    }
    
    // Couleurs orange avec intensité dégressive basée sur la distance
    const baseOpacity = Math.max(0.05, intensity);
    gradient.addColorStop(0, `rgba(226, 141, 29, ${baseOpacity * 0.8})`);
    gradient.addColorStop(0.3, `rgba(226, 141, 29, ${baseOpacity * 0.6})`);
    gradient.addColorStop(0.7, `rgba(226, 141, 29, ${baseOpacity * 0.4})`);
    gradient.addColorStop(1, `rgba(226, 141, 29, ${baseOpacity * 0.2})`);
    
    this.game.ctx.fillStyle = gradient;
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Effet de brillance orange proportionnel à l'intensité
    if (intensity > 0.3) {
      this.game.ctx.globalCompositeOperation = 'screen';
      this.game.ctx.fillStyle = `rgba(226, 141, 29, ${baseOpacity * 0.3})`;
      this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    }
    
    // Bordure orange avec intensité variable
    this.game.ctx.globalCompositeOperation = 'source-over';
    this.game.ctx.strokeStyle = `rgba(226, 141, 29, ${baseOpacity * 1.5})`;
    this.game.ctx.lineWidth = Math.max(1, intensity * 3);
    this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    
    // Effet de lueur orange proportionnel
    if (intensity > 0.2) {
      this.game.ctx.shadowColor = `rgba(226, 141, 29, ${baseOpacity})`;
      this.game.ctx.shadowBlur = intensity * 8;
      this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    }
    
    // Restauration du contexte
    this.game.ctx.restore();
  }

  // Indicateur directionnel vers le projet le plus proche
  drawDirectionalIndicator(playerX, playerY, targetX, targetY, distance) {
    // Ne pas afficher si le projet est très proche (déjà visible)
    if (distance < 3) return;

    // Calculer l'angle vers la cible
    const angle = Math.atan2(targetY - playerY, targetX - playerX);
    
    // Position de l'indicateur (autour du joueur)
    const indicatorDistance = 1.5; // Distance de l'indicateur par rapport au joueur
    const indicatorX = playerX + Math.cos(angle) * indicatorDistance;
    const indicatorY = playerY + Math.sin(angle) * indicatorDistance;
    
    // Transformer les coordonnées pour l'écran
    const [screenX, screenY] = this.game.camera.transformCoordinates(indicatorX, indicatorY);
    
    // Sauvegarde du contexte
    this.game.ctx.save();
    
    // Détecter si on est sur mobile pour ajuster la taille et l'opacité
    const isMobile = window.innerWidth <= 768;
    
    // Opacité plus visible sur mobile, basée sur la distance
    const baseOpacity = Math.max(0.05, Math.min(0.15, 1 - (distance - 3) / 15));
    const opacity = isMobile ? Math.max(baseOpacity * 3, 0.4) : baseOpacity; // Plus visible sur mobile
    
    // Taille de l'indicateur - plus grosse sur mobile
    const baseSize = this.game.camera.transformX(0.3);
    const size = isMobile ? baseSize * 1.8 : baseSize; // 80% plus grosse sur mobile
    
    // Flèche triangulaire
    this.game.ctx.translate(screenX, screenY);
    this.game.ctx.rotate(angle);
    
    // Corps de la flèche
    this.game.ctx.fillStyle = `rgba(226, 141, 29, ${opacity})`;
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(size, 0);
    this.game.ctx.lineTo(-size * 0.5, -size * 0.5);
    this.game.ctx.lineTo(-size * 0.3, 0);
    this.game.ctx.lineTo(-size * 0.5, size * 0.5);
    this.game.ctx.closePath();
    this.game.ctx.fill();
    
    // Bordure très subtile
    this.game.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
    this.game.ctx.lineWidth = 1;
    this.game.ctx.stroke();
    
    // Effet de lueur très discret
    this.game.ctx.shadowColor = `rgba(226, 141, 29, ${opacity * 0.2})`;
    this.game.ctx.shadowBlur = 4;
    this.game.ctx.fill();
    
    // Restauration du contexte
    this.game.ctx.restore();
  }

  // Particules orange intenses autour des plateformes touchées
  drawOrangePlatformParticles(centerX, centerY, intensity, delta, particleSeed = 0) {
    // Afficher des particules même pour les intensités faibles
    if (intensity < 0.2) return;

    // Transformer les coordonnées pour l'écran
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    
    // Sauvegarde du contexte
    this.game.ctx.save();
    
    // Nombre réduit de particules pour un effet subtil
    const particleCount = Math.floor(intensity * 3 + 1); // 1 à 4 particules
    const time = Date.now() * 0.001; // Temps pour l'animation
    
    // Utiliser le seed pour créer des patterns uniques par plateforme
    const seedOffset = particleSeed * 0.001;
    const speedMultiplier = 0.8 + (Math.sin(particleSeed) * 0.4); // Vitesse unique par plateforme
    const radiusOffset = Math.sin(particleSeed * 0.5) * 0.1; // Rayon unique par plateforme
    
    // Particules principales (orbitales)
    for (let i = 0; i < particleCount; i++) {
      // Animation circulaire avec pattern unique par plateforme
      const angle = (time * speedMultiplier + seedOffset + i * (Math.PI * 2 / particleCount)) % (Math.PI * 2);
      const radius = this.game.camera.transformX(0.3 + radiusOffset + Math.sin(time * 3 + i + seedOffset) * 0.15);
      
      // Position de la particule
      const particleX = screenX + Math.cos(angle) * radius;
      const particleY = screenY + Math.sin(angle) * radius * 0.6; // Ellipse plus prononcée
      
      // Taille et opacité modérées avec variation unique par plateforme
      const baseSize = this.game.camera.transformX(0.05); // Taille réduite
      const sizeVariation = Math.sin(particleSeed + i) * 0.2; // Variation de taille unique
      const size = baseSize * (0.8 + 0.4 * Math.sin(time * 4 + i + seedOffset) + sizeVariation);
      const opacity = Math.min(0.6, intensity * 0.5 * (0.6 + 0.4 * Math.sin(time * 3 + i + seedOffset)));
      
      // Dessiner la particule principale
      this.game.ctx.fillStyle = `rgba(226, 141, 29, ${opacity})`;
      this.game.ctx.beginPath();
      this.game.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
      this.game.ctx.fill();
      
      // Effet de lueur modéré
      this.game.ctx.shadowColor = `rgba(255, 165, 0, ${opacity * 0.4})`;
      this.game.ctx.shadowBlur = size * 2;
      this.game.ctx.fill();
      
      // Particule interne plus brillante
      this.game.ctx.fillStyle = `rgba(255, 200, 100, ${opacity * 0.6})`;
      this.game.ctx.beginPath();
      this.game.ctx.arc(particleX, particleY, size * 0.4, 0, Math.PI * 2);
      this.game.ctx.fill();
    }
    
    // Particules secondaires (étincelles) - très réduites avec pattern unique
    const sparkleCount = Math.floor(intensity * 2); // 0 à 2 étincelles
    for (let i = 0; i < sparkleCount; i++) {
      const sparkleSpeedMultiplier = 1.5 + Math.sin(particleSeed + i) * 0.5; // Vitesse unique
      const sparkleAngle = (time * sparkleSpeedMultiplier + seedOffset + i * (Math.PI * 2 / sparkleCount)) % (Math.PI * 2);
      const sparkleRadius = this.game.camera.transformX(0.6 + Math.sin(time * 5 + i + seedOffset) * 0.2);
      
      const sparkleX = screenX + Math.cos(sparkleAngle) * sparkleRadius;
      const sparkleY = screenY + Math.sin(sparkleAngle) * sparkleRadius * 0.4;
      
      const sparkleSize = this.game.camera.transformX(0.04) * (0.5 + 0.5 * Math.sin(time * 6 + i + seedOffset));
      const sparkleOpacity = intensity * 0.4 * (0.3 + 0.4 * Math.sin(time * 4 + i + seedOffset));
      
      // Étincelle
      this.game.ctx.fillStyle = `rgba(255, 220, 120, ${sparkleOpacity})`;
      this.game.ctx.beginPath();
      this.game.ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
      this.game.ctx.fill();
    }
    
    // Effet de pulsation centrale avec rythme unique par plateforme
    const pulseSpeed = 3 + Math.sin(particleSeed) * 2; // Vitesse de pulsation unique
    const pulseIntensity = 0.5 + 0.5 * Math.sin(time * pulseSpeed + seedOffset);
    const pulseSize = this.game.camera.transformX(0.15) * pulseIntensity;
    const pulseOpacity = intensity * 0.4 * pulseIntensity;
    
    this.game.ctx.fillStyle = `rgba(226, 141, 29, ${pulseOpacity})`;
    this.game.ctx.beginPath();
    this.game.ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
    this.game.ctx.fill();
    
    // Restauration du contexte
    this.game.ctx.restore();
  }
}
