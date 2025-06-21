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

  render() {
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

    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];

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
}
