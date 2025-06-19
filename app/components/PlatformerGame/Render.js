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

  drawOrangeBorder(x, y, w, h, side) {
    const [screenX, screenY, screenW, screenH] = this.game.camera.transformRect(x, y, w, h);
    
    // Sauvegarde du contexte
    this.game.ctx.save();
    
    // Création d'un gradient orange pour les plateformes touchées
    let gradient;
    if (side === 'left' || side === 'right') {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY);
    } else {
      gradient = this.game.ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenH);
    }
    
    // Couleurs orange avec transparence
    gradient.addColorStop(0, 'rgba(226, 141, 29, 0.4)');
    gradient.addColorStop(0.3, 'rgba(226, 141, 29, 0.25)');
    gradient.addColorStop(0.7, 'rgba(226, 141, 29, 0.15)');
    gradient.addColorStop(1, 'rgba(226, 141, 29, 0.1)');
    
    this.game.ctx.fillStyle = gradient;
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Effet de brillance orange
    this.game.ctx.globalCompositeOperation = 'screen';
    this.game.ctx.fillStyle = 'rgba(226, 141, 29, 0.2)';
    this.game.ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Bordure orange plus visible
    this.game.ctx.globalCompositeOperation = 'source-over';
    this.game.ctx.strokeStyle = 'rgba(226, 141, 29, 0.6)';
    this.game.ctx.lineWidth = 2;
    this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    
    // Effet de lueur orange
    this.game.ctx.shadowColor = 'rgba(226, 141, 29, 0.3)';
    this.game.ctx.shadowBlur = 4;
    this.game.ctx.strokeRect(screenX, screenY, screenW, screenH);
    
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
    
    // Opacité très faible et basée sur la distance
    const baseOpacity = Math.max(0.05, Math.min(0.15, 1 - (distance - 3) / 15));
    const opacity = baseOpacity;
    
    // Dessiner l'indicateur (flèche/point)
    const size = this.game.camera.transformX(0.3);
    
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
}
