import GameObject from "./GameObject";

export default class PortfolioItem extends GameObject {
  constructor(game, x, y, projectData) {
    super(game);
    
    this.x = x;
    this.y = y;
    this.w = 0.3;
    this.h = 0.3;
    
    this.projectData = projectData;
    this.collected = false;
    this.hovered = false;
    this.showTooltip = false;
    this.tooltipTimer = 0;
    this.tooltipOpacity = 0; // Pour l'animation de fade
    this.tooltipScale = 0.8; // Pour l'animation de scale
    
    // Animation
    this.floatOffset = Math.random() * Math.PI * 2;
    this.rotationAngle = 0;
    this.glowIntensity = 0;
    
    // Préchargement image projet
    this.imageLoaded = false;
    this.imageObj = null;
    if (projectData.imageUrl) {
      this.imageObj = new window.Image();
      this.imageObj.src = projectData.imageUrl;
      this.imageObj.onload = () => {
        this.imageLoaded = true;
        if (this.game && this.game.renderGame) requestAnimationFrame(() => this.game.renderGame(0));
      };
    }
    // Préchargement logo
    this.logoLoaded = false;
    this.logoObj = null;
    if (projectData.logoUrl) {
      this.logoObj = new window.Image();
      this.logoObj.src = projectData.logoUrl;
      this.logoObj.onload = () => {
        this.logoLoaded = true;
        if (this.game && this.game.renderGame) requestAnimationFrame(() => this.game.renderGame(0));
      };
    }
  }

  render() {
    if (this.collected) return;
    
    const time = Date.now() * 0.002;
    const floatY = Math.sin(time + this.floatOffset) * 0.05;
    const currentY = this.y + floatY;
    
    // Effet de lueur
    this.glowIntensity = 0.3 + Math.sin(time * 3) * 0.2;
    this.game.render.drawCircle(
      this.x + this.w / 2, 
      currentY + this.h / 2, 
      this.w * 0.8, 
      `rgba(255, 215, 0, ${this.glowIntensity * 0.3})`
    );
    
    // Corps principal de l'item
    this.drawItemBody(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Icône du projet
    this.drawProjectIcon(this.x + this.w / 2, currentY + this.h / 2, time);
    
    // Tooltip si survolé ou en animation de sortie
    if (this.showTooltip || this.tooltipOpacity > 0) {
      this.drawTooltip();
    }
  }

  drawItemBody(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const screenSize = this.game.camera.transformX(this.w * 0.6);
    
    ctx.save();
    
    // Rotation subtile
    this.rotationAngle += 0.02;
    ctx.translate(screenX, screenY);
    ctx.rotate(this.rotationAngle);
    
    // Gradient radial pour le corps
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, screenSize);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
    gradient.addColorStop(0.6, 'rgba(255, 165, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 140, 0, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, screenSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Bordure brillante
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Effet de brillance
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-screenSize * 0.3, -screenSize * 0.3, screenSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    ctx.restore();
  }

  drawProjectIcon(centerX, centerY, time) {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    const iconSize = this.game.camera.transformX(this.w * 0.3);
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(-this.rotationAngle); // Contre-rotation pour garder l'icône droite
    
    // Icône basée sur le type de projet
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    
    switch (this.projectData.type) {
      case 'web':
        // Icône de globe
        ctx.beginPath();
        ctx.arc(0, 0, iconSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, iconSize * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'mobile':
        // Icône de téléphone
        ctx.fillRect(-iconSize * 0.4, -iconSize * 0.6, iconSize * 0.8, iconSize * 1.2);
        ctx.strokeRect(-iconSize * 0.4, -iconSize * 0.6, iconSize * 0.8, iconSize * 1.2);
        break;
      case 'game':
        // Icône de manette
        ctx.beginPath();
        ctx.arc(-iconSize * 0.3, 0, iconSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(iconSize * 0.3, 0, iconSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      default:
        // Icône de code
        ctx.fillRect(-iconSize * 0.4, -iconSize * 0.3, iconSize * 0.8, iconSize * 0.6);
        ctx.strokeRect(-iconSize * 0.4, -iconSize * 0.3, iconSize * 0.8, iconSize * 0.6);
    }
    
    ctx.restore();
  }

  drawTooltip() {
    const ctx = this.game.ctx;
    const [screenX, screenY] = this.game.camera.transformCoordinates(this.x + this.w / 2, this.y - 0.3);
    ctx.save();
    
    // Animation d'entrée/sortie avec scale et opacité
    const centerX = screenX;
    const centerY = screenY - 60 - 18; // Centre de la tooltip
    
    ctx.translate(centerX, centerY);
    ctx.scale(this.tooltipScale, this.tooltipScale);
    ctx.translate(-centerX, -centerY);
    
    // Appliquer l'opacité de l'animation
    ctx.globalAlpha = this.tooltipOpacity;
    
    const tooltipWidth = 320;
    const tooltipHeight = 120;
    const tooltipX = screenX - tooltipWidth / 2;
    const tooltipY = screenY - tooltipHeight - 18;
    const radius = 18;
    
    // Créer le path de la tooltip
    ctx.beginPath();
    ctx.moveTo(tooltipX + radius, tooltipY);
    ctx.lineTo(tooltipX + tooltipWidth - radius, tooltipY);
    ctx.quadraticCurveTo(tooltipX + tooltipWidth, tooltipY, tooltipX + tooltipWidth, tooltipY + radius);
    ctx.lineTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight - radius);
    ctx.quadraticCurveTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight, tooltipX + tooltipWidth - radius, tooltipY + tooltipHeight);
    ctx.lineTo(tooltipX + radius, tooltipY + tooltipHeight);
    ctx.quadraticCurveTo(tooltipX, tooltipY + tooltipHeight, tooltipX, tooltipY + tooltipHeight - radius);
    ctx.lineTo(tooltipX, tooltipY + radius);
    ctx.quadraticCurveTo(tooltipX, tooltipY, tooltipX + radius, tooltipY);
    ctx.closePath();
    
    // Fond simple et propre avec opacité animée
    ctx.globalAlpha = this.tooltipOpacity * 0.85;
    ctx.fillStyle = 'rgba(30, 30, 40, 0.92)';
    ctx.shadowColor = `rgba(0,0,0,${this.tooltipOpacity * 0.25})`;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Image projet (ou cercle gris)
    ctx.save();
    ctx.beginPath();
    ctx.arc(tooltipX + 54, tooltipY + tooltipHeight / 2, 40, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (this.imageLoaded && this.imageObj) {
      // Calculer les proportions pour maintenir l'aspect ratio dans le cercle
      const imageAspectRatio = this.imageObj.width / this.imageObj.height;
      const circleSize = 80; // Diamètre du cercle
      let imageWidth, imageHeight;
      let offsetX = 0, offsetY = 0;
      
      if (imageAspectRatio > 1) {
        // Image plus large que haute - ajuster la hauteur
        imageHeight = circleSize;
        imageWidth = circleSize * imageAspectRatio;
        offsetX = -(imageWidth - circleSize) / 2; // Centrer horizontalement
      } else {
        // Image plus haute que large - ajuster la largeur
        imageWidth = circleSize;
        imageHeight = circleSize / imageAspectRatio;
        offsetY = -(imageHeight - circleSize) / 2; // Centrer verticalement
      }
      
      ctx.drawImage(this.imageObj, tooltipX + 14 + offsetX, tooltipY + 20 + offsetY, imageWidth, imageHeight);
    } else {
      ctx.fillStyle = 'rgba(80,80,80,0.25)';
      ctx.fill();
    }
    ctx.restore();
    
    // Bordure moderne et colorée autour de l'image ronde
    ctx.save();
    const circleCenterX = tooltipX + 54;
    const circleCenterY = tooltipY + tooltipHeight / 2;
    const circleRadius = 40;
    
    // Bordure extérieure sombre pour contraste
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleRadius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Bordure principale colorée (orange du thème)
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleRadius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(226, 141, 29, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Bordure intérieure claire
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleRadius + 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Reflet en haut (effet glassmorphism)
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleRadius + 2, Math.PI * 1.2, Math.PI * 1.8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
    // Titre avec troncature
    ctx.globalAlpha = this.tooltipOpacity;
    ctx.font = 'bold 17px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    
    // Calculer la largeur disponible pour le titre
    const availableWidth = tooltipWidth - 120; // 110px (marge gauche) + 10px (marge droite)
    let titleText = this.projectData.title;
    
    // Mesurer la largeur du texte et tronquer si nécessaire
    ctx.font = 'bold 17px Arial'; // S'assurer que la font est définie avant de mesurer
    let textWidth = ctx.measureText(titleText).width;
    
    if (textWidth > availableWidth) {
      // Tronquer le texte et ajouter "..."
      while (textWidth > availableWidth - ctx.measureText('...').width && titleText.length > 0) {
        titleText = titleText.slice(0, -1);
        textWidth = ctx.measureText(titleText).width;
      }
      titleText += '...';
    }
    
    ctx.fillText(titleText, tooltipX + 110, tooltipY + 38);
    // Techno principale avec troncature
    ctx.font = '500 13px Arial';
    ctx.fillStyle = '#e28d1d';
    
    let descriptionText = this.projectData.description;
    let descTextWidth = ctx.measureText(descriptionText).width;
    
    if (descTextWidth > availableWidth) {
      while (descTextWidth > availableWidth - ctx.measureText('...').width && descriptionText.length > 0) {
        descriptionText = descriptionText.slice(0, -1);
        descTextWidth = ctx.measureText(descriptionText).width;
      }
      descriptionText += '...';
    }
    
    ctx.fillText(descriptionText, tooltipX + 110, tooltipY + 60);
    
    // Département (optionnel) avec troncature
    if (this.projectData.department) {
      ctx.font = '12px Arial';
      ctx.fillStyle = '#bdbdbd';
      
      let departmentText = this.projectData.department;
      let deptTextWidth = ctx.measureText(departmentText).width;
      
      if (deptTextWidth > availableWidth) {
        while (deptTextWidth > availableWidth - ctx.measureText('...').width && departmentText.length > 0) {
          departmentText = departmentText.slice(0, -1);
          deptTextWidth = ctx.measureText(departmentText).width;
        }
        departmentText += '...';
      }
      
      ctx.fillText(departmentText, tooltipX + 110, tooltipY + 80);
    }
    // Logo projet (optionnel)
    if (this.logoObj && this.logoLoaded) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      
      // Calculer les proportions pour maintenir l'aspect ratio (2x plus gros)
      const maxLogoSize = 80; // Doublé de 40 à 80
      const logoAspectRatio = this.logoObj.width / this.logoObj.height;
      let logoWidth, logoHeight;
      
      if (logoAspectRatio > 1) {
        // Logo plus large que haut
        logoWidth = maxLogoSize;
        logoHeight = maxLogoSize / logoAspectRatio;
      } else {
        // Logo plus haut que large
        logoHeight = maxLogoSize;
        logoWidth = maxLogoSize * logoAspectRatio;
      }
      
      // Repositionner pour le logo plus gros (ajusté pour 80px au lieu de 40px)
      const logoX = tooltipX + tooltipWidth - 90 + (80 - logoWidth) / 2;
      const logoY = tooltipY + tooltipHeight - 90 + (80 - logoHeight) / 2;
      
      // Effet blanc avec glow
      ctx.filter = 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 16px rgba(255,255,255,0.3))';
      ctx.drawImage(this.logoObj, logoX, logoY, logoWidth, logoHeight);
      ctx.filter = 'none';
      
      ctx.restore();
    }
    ctx.restore();
    // Bouton E EN DESSOUS de la popup
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.font = 'bold 13px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('[E] Open', screenX, tooltipY + tooltipHeight + 22);
    ctx.restore();
  }

  update(delta) {
    // Désactiver les interactions pendant l'initialisation
    if (this.game.isInitializing) {
      return;
    }

    // Vérifier si le joueur est proche
    const playerCenter = this.game.player.getCenter();
    const itemCenter = [this.x + this.w / 2, this.y + this.h / 2];
    const distance = Math.sqrt(
      Math.pow(playerCenter[0] - itemCenter[0], 2) + 
      Math.pow(playerCenter[1] - itemCenter[1], 2)
    );
    
    const isNear = distance < 1.5;
    
    if (isNear) {
      // Marquer ce projet comme proche
      this.game.nearProject = true;
      
      // Émettre l'événement de proximité seulement si c'est un changement d'état
      if (!this.hovered) {
        console.log('📱 Émission événement proximité: TRUE pour', this.projectData.title);
        window.dispatchEvent(new CustomEvent('projectProximity', { detail: { near: true } }));
      }
      
      this.hovered = true;
      this.tooltipTimer += delta;
      if (this.tooltipTimer > 0.3) { // Plus rapide pour l'apparition
        this.showTooltip = true;
      }
      
      // Vérifier si le joueur appuie sur E pour collecter
      if (this.game.inputManager.isKeyPressed('e')) {
        this.collect();
      }
    } else {
      // Émettre l'événement de proximité si on s'éloigne de CE projet
      if (this.hovered) {
        console.log('📱 Émission événement proximité: FALSE pour', this.projectData.title);
        
        // Vérifier si aucun autre projet n'est proche avant d'émettre false
        const anyProjectNear = this.game.portfolioItems.some(item => {
          if (item === this) return false; // Ignorer ce projet
          const itemPlayerCenter = this.game.player.getCenter();
          const itemItemCenter = [item.x + item.w / 2, item.y + item.h / 2];
          const itemDistance = Math.sqrt(
            Math.pow(itemPlayerCenter[0] - itemItemCenter[0], 2) + 
            Math.pow(itemPlayerCenter[1] - itemItemCenter[1], 2)
          );
          return itemDistance < 1.5;
        });
        
        if (!anyProjectNear) {
          this.game.nearProject = false;
          window.dispatchEvent(new CustomEvent('projectProximity', { detail: { near: false } }));
        }
      }
      
      this.hovered = false;
      this.showTooltip = false;
      this.tooltipTimer = 0;
    }

    // Animation de la tooltip (entrée/sortie fluide)
    const animationSpeed = delta * 6; // Vitesse d'animation (plus élevé = plus rapide)
    
    if (this.showTooltip) {
      // Animation d'entrée
      this.tooltipOpacity = Math.min(1, this.tooltipOpacity + animationSpeed);
      this.tooltipScale = Math.min(1, this.tooltipScale + animationSpeed * 0.8);
    } else {
      // Animation de sortie
      this.tooltipOpacity = Math.max(0, this.tooltipOpacity - animationSpeed);
      this.tooltipScale = Math.max(0.8, this.tooltipScale - animationSpeed * 0.8);
    }
  }

  collect() {
    // Effet de particules dorées
    this.game.particleSystem.spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 12, 0.6);
    
    // Shake de caméra
    this.game.camera.shake(0.3, 4);
    
    // Émettre un événement pour mettre à jour le compteur
    window.dispatchEvent(new CustomEvent('projectCollected'));
    
    // Émettre un événement pour ouvrir la popup de projet
    window.dispatchEvent(new CustomEvent('openProjectModal', {
      detail: {
        ...this.projectData,
        collectedCount: this.game.collectedProjectsCount + 1, // +1 car ce projet va être collecté
        totalProjects: 39
      }
    }));
    
    // Remplacer cet item par un nouveau projet
    this.game.replacePortfolioItem(this);
  }
} 