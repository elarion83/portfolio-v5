import Game from "./Game";
import { getRandom, getRandomInteger } from "./random";

export default class ParticleSystem {
  constructor(game) {
    /**
     * @type {Game}
     */
    this.game = game;

    /**
     * @type {Array.<{ x: number, y: number, size: number, ticks: number, vx: number, vy: number, alpha: number }>}
     */
    this.particles = [];

    /**
     * @type {Array.<{ x: number, y: number, text: string, ticks: number, vy: number, alpha: number, fontSize: number }>}
     */
    this.floatingTexts = [];

    // Messages pour les items qui disparaissent
    this.disappearMessages = [
      'Too late',
      'Bye bye',
      'Ciao...',
      'Hasta la vista...',
      'Missed it',
      'Gone...',
      'Adios',
      'See ya'
    ];
  }

  spawnParticles(x, y, amount = 5, sizeScale = 1) {
    var realAmount =
      amount === 1 ? amount : getRandomInteger(amount * 0.9, amount * 1.1);

    for (var i = 0; i < realAmount; i++) {
      var angle = getRandom(0, Math.PI * 2);
      var speed = getRandom(0.1, 6) / 100;

      var dx = (Math.cos(angle) * getRandom(3, 5)) / 100;
      var dy = (Math.sin(angle) * getRandom(3, 5)) / 100;

      this.particles.push({
        x: x + dx,
        y: y + dy,
        size: getRandom(3, 6 * sizeScale) / 100,
        ticks: getRandom(0, 1),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: getRandom(0, 0.1),
      });
    }
  }

  spawnHealthChangeParticles(x, y, type = 'heal') {
    const amount = 10; // 10 particules pour les deux types
    const symbol = type === 'heal' ? '+' : '-';
    const color = type === 'heal' ? '#4ade80' : '#f87171';
    const player = this.game.player;
    
    for (var i = 0; i < amount; i++) {
      // Position de départ variée sur toute la barre de vie (largeur ~1.2)
      const relOffsetX = getRandom(-0.6, 0.6); // Répartition sur toute la largeur de la barre
      const relOffsetY = getRandom(-0.02, 0.02); // Très peu de dispersion verticale
      
      // Direction vers le haut avec très peu de dispersion
      var angle = getRandom(-Math.PI / 12, Math.PI / 12) - Math.PI / 2; // -15° à +15° - 90° (vers le haut)
      var speed = getRandom(1.5, 2.5) / 100; // Vitesse plus uniforme
      
      // Propriétés visuelles variées
      const fontSize = getRandom(14, 20);
      const baseAlpha = getRandom(0.8, 1.0);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 0.002;

      this.particles.push({
        relOffsetX,
        relOffsetY,
        playerRef: player,
        size: getRandom(6, 10) / 100,
        ticks: 0,
        vx,
        vy,
        alpha: baseAlpha,
        baseAlpha,
        color: color,
        type: 'health',
        symbol: symbol,
        fontSize: fontSize
      });
    }
  }

  spawnDangerousPlatformWarning(platformX, platformY) {
    // Génère un seed unique basé sur la position pour chaque plateforme dangereuse
    if (!this.dangerousSeeds) this.dangerousSeeds = {};
    const key = `${platformX},${platformY}`;
    if (!this.dangerousSeeds[key]) {
      this.dangerousSeeds[key] = Math.floor(Math.random() * 100000);
    }
  }

  render() {
    // Rendu des particules orbitales sur les plateformes dangereuses
    if (this.dangerousSeeds && this.game.dangerousPlatformIds) {
      for (const platformId of this.game.dangerousPlatformIds) {
        const platform = this.game.getPlatformById(platformId);
        if (platform) {
          const key = `${platform.x},${platform.y}`;
          const seed = this.dangerousSeeds[key];
          if (seed !== undefined) {
            this.drawDangerousOrbitalParticles(platform.x + 0.5, platform.y + 0.5, 1.0, 0, seed);
          }
        }
      }
    }

    // Rendu des textes flottants
    for (const text of this.floatingTexts) {
      const [screenX, screenY] = this.game.camera.transformCoordinates(text.x, text.y);
      
      this.game.ctx.save();
      this.game.ctx.globalAlpha = text.alpha * 0.6; // Opacité globale réduite
      this.game.ctx.fillStyle = '#ffa07a'; // Couleur plus claire (light salmon)
      this.game.ctx.font = `${text.fontSize}px Arial`;
      this.game.ctx.textAlign = 'center';
      this.game.ctx.textBaseline = 'middle';
      
      // Effet de lueur plus discret
      this.game.ctx.shadowColor = '#ffa07a';
      this.game.ctx.shadowBlur = 2; // Lueur réduite
      
      this.game.ctx.fillText(text.text, screenX, screenY);
      this.game.ctx.restore();
    }

    // Rendu des autres particules
    for (var particle of this.particles) {
      this.game.ctx.globalAlpha = Math.min(1, Math.max(0, particle.alpha));

      if (particle.type === 'health') {
        // Suivre la position du joueur
        let px = 0, py = 0;
        if (particle.playerRef) {
          px = particle.playerRef.x + particle.playerRef.w / 2 + (particle.relOffsetX || 0);
          py = particle.playerRef.y - 0.15 + (particle.relOffsetY || 0);
        }
        else {
          px = this.game.player.x + this.game.player.w / 2;
          py = this.game.player.y - 0.15;
        }
        // Appliquer le déplacement de la particule (mouvement vers le haut)
        px += (particle.vx || 0) * particle.ticks * 60;
        py += (particle.vy || 0) * particle.ticks * 60;

        const [screenX, screenY] = this.game.camera.transformCoordinates(px, py);
        this.game.ctx.save();
        this.game.ctx.fillStyle = particle.color || '#4ade80';
        this.game.ctx.font = `${particle.fontSize || 16}px Arial`;
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        this.game.ctx.fillText(particle.symbol || '+', screenX, screenY);
        this.game.ctx.restore();
      } else {
        // Rendu normal pour les autres particules
        this.game.render.drawRect(
          particle.x,
          particle.y,
          Math.max(0, particle.size),
          Math.max(0, particle.size),
          "#fff"
        );
      }
    }
    this.game.ctx.globalAlpha = 1;
  }

  update(delta) {
    var deleting = [];

    // Mise à jour des textes flottants
    for (let i = 0; i < this.floatingTexts.length; i++) {
      const text = this.floatingTexts[i];
      
      // Mouvement vers le haut
      text.y += delta * text.vy * 60;
      text.ticks += delta;
      
      // Calculer l'alpha basé sur le temps écoulé
      const elapsed = Date.now() - text.startTime;
      const progress = elapsed / text.duration;
      
      if (progress >= 1) {
        // Texte expiré
        deleting.unshift(i);
      } else {
        // Fade-out progressif
        text.alpha = Math.max(0, 1 - progress);
      }
    }

    // Supprimer les textes expirés
    for (var i = 0; i < deleting.length; i++) {
      this.floatingTexts.splice(deleting[i], 1);
    }

    // Mise à jour des particules
    deleting = [];
    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];

      // Gestion normale pour toutes les particules
      particle.x += delta * particle.vx;
      particle.y += delta * particle.vy;
      particle.ticks += delta;

      if (particle.ticks > 2) {
        particle.size -= delta / 200;
        particle.alpha -= delta / 2;

        if (particle.size < 0.0001 || particle.alpha < 0.0001) {
          deleting.unshift(i);
        }
      } else if (particle.alpha < 1) {
        particle.alpha += delta * 3;
      }
    }

    for (var i = 0; i < deleting.length; i++) {
      this.particles.splice(deleting[i], 1);
    }
  }

  // Particules orbitales rouges foncées pour plateformes dangereuses
  drawDangerousOrbitalParticles(centerX, centerY, intensity, delta, particleSeed = 0) {
    if (intensity < 0.2) return;
    const [screenX, screenY] = this.game.camera.transformCoordinates(centerX, centerY);
    this.game.ctx.save();
    const particleCount = Math.floor(intensity * 2.5 + 2); // 2 à 4 particules
    const time = Date.now() * 0.001;
    const seedOffset = particleSeed * 0.001;
    const speedMultiplier = 0.7 + (Math.sin(particleSeed) * 0.3);
    const radiusOffset = Math.sin(particleSeed * 0.5) * 0.08;
    for (let i = 0; i < particleCount; i++) {
      const angle = (time * speedMultiplier + seedOffset + i * (Math.PI * 2 / particleCount)) % (Math.PI * 2);
      const radius = this.game.camera.transformX(0.22 + radiusOffset + Math.sin(time * 2.5 + i + seedOffset) * 0.09);
      const particleX = screenX + Math.cos(angle) * radius;
      const particleY = screenY + Math.sin(angle) * radius * 0.6;
      const baseSize = this.game.camera.transformX(0.035);
      const sizeVariation = Math.sin(particleSeed + i) * 0.13;
      const size = baseSize * (0.8 + 0.4 * Math.sin(time * 3 + i + seedOffset) + sizeVariation);
      const opacity = Math.min(0.5, intensity * 0.45 * (0.6 + 0.4 * Math.sin(time * 2.5 + i + seedOffset)));
      // Couleur rouge/orange foncé
      this.game.ctx.fillStyle = `rgba(180, 40, 40, ${opacity})`;
      this.game.ctx.beginPath();
      this.game.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
      this.game.ctx.fill();
      // Particule interne plus brillante
      this.game.ctx.fillStyle = `rgba(255, 80, 40, ${opacity * 0.7})`;
      this.game.ctx.beginPath();
      this.game.ctx.arc(particleX, particleY, size * 0.4, 0, Math.PI * 2);
      this.game.ctx.fill();
    }
    this.game.ctx.restore();
  }

  // Créer un texte flottant quand un item disparaît
  spawnDisappearText(x, y) {
    const randomMessage = this.disappearMessages[Math.floor(Math.random() * this.disappearMessages.length)];
    
    this.floatingTexts.push({
      x: x,
      y: y,
      text: randomMessage,
      ticks: 0,
      vy: -0.015, // Mouvement plus lent vers le haut
      alpha: 0.7, // Opacité initiale réduite
      fontSize: 10 + Math.random() * 4, // Taille plus petite : 10 à 14px
      startTime: Date.now(),
      duration: 2000 // 2 secondes au lieu de 2.5
    });
  }
}
