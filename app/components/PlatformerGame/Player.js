import Animation from "./Animation";
import Game from "./Game";
import GameObject from "./GameObject";
import { getDistance } from "./math";
import { getRandomInteger } from "./random";
import { radiansToDegree } from "./util/MathUtil";

export default class Player extends GameObject {
  constructor(game) {
    super(game);
    this.x = 5;
    this.y = 5;

    this.w = 0.55;
    this.h = 0.95;
    this.defaultSize = [this.w, this.h];

    this.onGround = false;
    this.running = false;
    this.gravityTick = 0;

    this.ledgeHang = false;

    this.doubleJumped = false;
    this.frictionValue = 0;
    /**
     * - `0` = Left
     * - `1` = Right
     */
    this.facing = 0;

    /**
     * @type {Game}
     */
    this.game = game;

    // Multiplicateurs d'effets
    this.speedMultiplier = 1;

    // Système de vie
    this.maxHealth = 5;
    this.currentHealth = 5;
    this.showHealthBar = true; // Sera défini selon la difficulté

    this.tiles = {};
    this.tilesHistory = []; // Historique des plateformes touchées avec fade-out
    this.tileFadeOutDuration = 500; // 0.5 secondes de fade-out
    this.tileEffectDuration = 3000; // 3 secondes avant fade-out automatique des anciennes

    this.lastLandY = 0;

    this.animations = {
      idle: new Animation({
        sprite: "player_idle",
        frames: [0, 1, 2, 3, 4, 5, 6],
        speed: 140,
        after: "idle",
        idle: true,
      }),
      look_up: new Animation({
        sprite: "player_look_up",
        frames: [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        speed: 200,
        after: "idle",
        idle: true,
      }),
      run: new Animation({
        sprite: "player_run",
        frames: [0, 1, 2, 3, 4, 5, 7],
        speed: 120,
      }),
      jump: new Animation({
        sprite: "player_jump",
        frames: [0],
        speed: 110,
        after: "fall",
      }),
      fall: new Animation({
        sprite: "player_jump",
        frames: [1, 2],
        speed: 250,
        after: "fall",
      }),
      land: new Animation({
        sprite: "player_land",
        frames: [0, 1],
        speed: 100,
        after: "idle",
        idle: true,
      }),
      slide: new Animation({
        sprite: "player_slide",
        frames: [0, 1, 2],
        speed: 90,
        after: "slide_transition",
        disableController: false,
        size: [1, 0.6],
        yOffset: -0.4,
        xOffset: [0.3, 0.2],
        timeout: false
      }),
      slide_transition: new Animation({
        sprite: "player_slide",
        frames: [3],
        speed: 100,
        after: "idle",
        idle: true,
      }),
      roll: new Animation({
        sprite: "player_front_flip",
        frames: [5, 6, 7, 8, 9, 10, 11, 12],
        speed: 60,
        after: "fall",
        size: [0.55, 0.6],
        yOffset: -0.15,
      }),
      attack1: new Animation({
        sprite: "player_combat_combo_01_attack_01",
        frames: [0, 1, 2, 3, 4, 5],
        speed: 100,
        after: "idle",
        disableController: true,
      }),
      attack2: new Animation({
        sprite: "player_combat_combo_01_attack_02",
        frames: [0, 1, 2, 3, 4],
        speed: 100,
        after: "idle",
        disableController: true,
      }),
      attack3: new Animation({
        sprite: "player_combat_combo_01_attack_03",
        frames: [0, 1, 2, 3],
        speed: 100,
        after: "idle",
        disableController: true,
      }),
      attack4: new Animation({
        sprite: "player_combat_combo_01_attack_04",
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        speed: 100,
        after: "idle",
        disableController: true,
      }),
      ground_slam: new Animation({
        sprite: "player_combat_ground_slam",
        frames: [0, 1, 2, 3, 4, 5, 6],
        speed: 100,
        after: "ground_slam_transition",
        disableController: true,
      }),
      ground_slam_transition: new Animation({
        sprite: "player_combat_ground_slam",
        frames: [7, 8, 9],
        speed: 100,
        after: "idle",
        idle: true,
      }),
      knockback: new Animation({
        sprite: "player_knockback",
        frames: [0, 1, 2, 4, 4, 4, 4, 4, 4, 4, 5],
        speed: 100,
        after: "idle",
        disableController: true,
      }),
      ledge_climb: new Animation({
        sprite: "player_ledge_climb",
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
        speed: 100,
        after: "ledge_climb",
        xOffset: [0.3, -0.3],
        yOffset: 0.9,
      }),
      ledge_hang: new Animation({
        sprite: "player_ledge_hang",
        frames: [0, 1, 2, 3, 4, 5],
        speed: 100,
        after: "ledge_hang",
        xOffset: [-0.1, 0.11],
      }),
      wall_jump: new Animation({
        sprite: "player_wall_jump",
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        speed: 100,
        after: "fall",
      }),
      crouch: new Animation({
        sprite: "player_crouch",
        frames: [0, 1, 2, 3, 4, 5],
        speed: 100,
        after: "crouch",
        size: [0.55, 0.6],
        yOffset: -0.4,
      }),
      crawl: new Animation({
        sprite: "player_crawl",
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
        speed: 120,
        after: "crawl",
        size: [0.55, 0.6],
        yOffset: -0.4,
      }),
    };

    /**
     * @type {Animation}
     */
    this.animation = null;
    this.animationName = "";

    // États pour l'animation de disparition de l'aura
    this.auraFadeOut = false;
    this.auraFadeTime = 0;
    this.auraFadeOutDuration = 1000; // 1 seconde pour la disparition

    this.setAnimation("idle");
    this.crouch = false;
  }

  setCrouch(value) {
    if (!this.crouch && value) {
      this.setAnimation("crouch");
      this.crouch = true;
    } else if (this.crouch && !value) {
      this.crouch = false;

      this.setAnimation("idle");
    }
  }

  setAnimation(animationName, fixSize = true) {
    if (!this.animations[animationName]) {
      throw new Error("Invalid animation: " + animationName);
    }

    if (animationName !== "crouch" && animationName !== "crawl") {
      this.setCrouch(false);
    }
    var oldAnimation = this.animation;

    this.animation = this.animations[animationName];
    this.animationName = animationName;
    this.animationTick = 0;

    if (this.animation.size) {
      this.w = this.animation.size[0];
      this.h = this.animation.size[1];

      this.x += (this.defaultSize[0] - this.animation.size[0]) / 2;
      this.y += this.defaultSize[1] - this.animation.size[1];
    } else {
      [this.w, this.h] = this.defaultSize;

      if (fixSize) {
        if (oldAnimation && oldAnimation.size) {
          this.x -= (this.w - oldAnimation.size[0]) / 2;
          this.y -= this.h - oldAnimation.size[1];
        }
      }
    }
  }

  attack() {
    this.game.camera.shake(0.15, 0.8);

    this.setAnimation("attack1");
  }

  groundSlam() {
    this.setAnimation("ground_slam");
  }

  jump() {
    if (this.doubleJumped && !this.ledgeHang) {
      return
    }
    this.gravityTick = 0;
    this.velocityX = 0;

    this.lastLandY = null;

    this.game.particleSystem.spawnParticles(
      this.getCenter()[0],
      this.getBottom() - 0.1,
      4,
      0.3
    );

    if (!this.onGround) {
      this.setAnimation("roll");
      this.ledgeHang = false;
      this.doubleJumped = true;

      this.velocityY = -4.85;
    } else {
      this.setAnimation("jump");
      this.velocityY = -5;
    }
  }

  slide() {
    if (this.animations.slide.timeout) {
      //prevent double sliding
      return
    }
    this.animations.slide.timeout = true;
    setTimeout(() => {
      this.animations.slide.timeout = false;
    }, 1500)
    this.setAnimation("slide");
  }

  knockback() {
    this.setAnimation("knockback");
    setTimeout(() => {
      this.velocityX = 0.1 * (this.facing == 0 ? 1 : -1);
    }, 100);
  }

  die() {
    // Effet visuel de mort
    this.game.particleSystem.spawnParticles(
      this.x + this.w / 2,
      this.y + this.h / 2,
      15,
      0.8
    );
    
    // Secouer la caméra
    this.game.camera.shake(0.3, 8);
    
    console.log('💀 Mort instantanée - Difficulté Seigneur des ténèbres');
    
    // Déclencher la popup de défaite
    window.dispatchEvent(new CustomEvent('openDeathModal'));
    
    // Repositionner le joueur au début du niveau (pour quand il redémarre)
    this.x = 5;
    this.y = this.game.levelHeight - 12;
    this.velocityX = 0;
    this.velocityY = 0;
    this.setAnimation("idle");
  }

  // Méthode pour déclencher la disparition de l'aura
  triggerAuraFadeOut() {
    this.auraFadeOut = true;
    this.auraFadeTime = 0;
  }

  // Méthodes pour gérer la vie
  takeDamage(amount = 1) {
    if (!this.showHealthBar) return false; // Pas de dégâts si pas de système de vie
    
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    
    if (this.currentHealth <= 0) {
      // Déclencher la popup de défaite
      window.dispatchEvent(new CustomEvent('openDeathModal'));
      return true; // Le joueur est mort
    }
    
    return false; // Le joueur a survécu
  }

  heal(amount = 1) {
    if (!this.showHealthBar) return;
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }

  resetHealth() {
    this.currentHealth = this.maxHealth;
  }

  setHealthBarVisibility(visible) {
    this.showHealthBar = visible;
  }

  // Afficher la barre de vie au-dessus du joueur
  renderHealthBar(delta) {
    if (!this.showHealthBar) return;
    
    const centerX = this.x + this.w / 2;
    const barY = this.y - 0.15; // 20px plus bas (était à -0.4, maintenant à -0.15)
    const barWidth = 1.2;
    const barHeight = 0.08;
    const padding = 0.01;
    
    // Vérifier si le joueur est près d'un projet pour ajuster l'opacité
    const isNearProject = this.game.nearProject || false;
    const baseOpacity = isNearProject ? 0.15 : 1.0; // Quasi transparente près d'un projet
    
    const ctx = this.game.ctx;
    const [screenCenterX, screenBarY] = this.game.camera.transformCoordinates(centerX, barY);
    const screenBarWidth = this.game.camera.transformX(barWidth);
    const screenBarHeight = this.game.camera.transformX(barHeight);
    const screenPadding = this.game.camera.transformX(padding);
    
    const barX = screenCenterX - screenBarWidth / 2;
    
    ctx.save();
    
    // Appliquer l'opacité globale
    ctx.globalAlpha = baseOpacity;
    
    // Fond avec gradient sombre moderne
    const backgroundGradient = ctx.createLinearGradient(barX, screenBarY, barX, screenBarY + screenBarHeight);
    backgroundGradient.addColorStop(0, 'rgba(30, 30, 30, 0.9)');
    backgroundGradient.addColorStop(1, 'rgba(10, 10, 10, 0.9)');
    
    // Fond avec coins arrondis
    ctx.fillStyle = backgroundGradient;
    ctx.beginPath();
    ctx.roundRect(barX, screenBarY, screenBarWidth, screenBarHeight, screenBarHeight / 2);
    ctx.fill();
    
    // Barre de vie avec gradient moderne
    const healthRatio = this.currentHealth / this.maxHealth;
    if (healthRatio > 0) {
      const healthBarWidth = (screenBarWidth - screenPadding * 2) * healthRatio;
      const healthBarX = barX + screenPadding;
      const healthBarY = screenBarY + screenPadding;
      const healthBarHeight = screenBarHeight - screenPadding * 2;
      
      // Couleur qui change selon la vie restante
      let healthGradient;
      if (healthRatio > 0.6) {
        // Vert moderne
        healthGradient = ctx.createLinearGradient(healthBarX, healthBarY, healthBarX, healthBarY + healthBarHeight);
        healthGradient.addColorStop(0, '#4ade80'); // Vert clair
        healthGradient.addColorStop(1, '#16a34a'); // Vert foncé
      } else if (healthRatio > 0.3) {
        // Jaune/Orange moderne
        healthGradient = ctx.createLinearGradient(healthBarX, healthBarY, healthBarX, healthBarY + healthBarHeight);
        healthGradient.addColorStop(0, '#fbbf24'); // Jaune clair
        healthGradient.addColorStop(1, '#d97706'); // Orange foncé
      } else {
        // Rouge moderne
        healthGradient = ctx.createLinearGradient(healthBarX, healthBarY, healthBarX, healthBarY + healthBarHeight);
        healthGradient.addColorStop(0, '#f87171'); // Rouge clair
        healthGradient.addColorStop(1, '#dc2626'); // Rouge foncé
      }
      
      // Barre de vie avec coins arrondis
      ctx.fillStyle = healthGradient;
      ctx.beginPath();
      ctx.roundRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight, healthBarHeight / 2);
      ctx.fill();
      
      // Effet de brillance sur la barre
      const shineGradient = ctx.createLinearGradient(healthBarX, healthBarY, healthBarX, healthBarY + healthBarHeight / 2);
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      
      ctx.fillStyle = shineGradient;
      ctx.beginPath();
      ctx.roundRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight / 2, healthBarHeight / 2);
      ctx.fill();
    }
    
    // Bordure externe élégante
    const borderGradient = ctx.createLinearGradient(barX, screenBarY, barX, screenBarY + screenBarHeight);
    borderGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    borderGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    borderGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = Math.max(1, this.game.camera.transformX(0.015));
    ctx.beginPath();
    ctx.roundRect(barX, screenBarY, screenBarWidth, screenBarHeight, screenBarHeight / 2);
    ctx.stroke();
    
    // Ombre portée subtile
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = this.game.camera.transformX(0.02);
    ctx.shadowOffsetY = this.game.camera.transformX(0.01);
    
    ctx.restore();
  }

  render(delta) {
    // Effet d'invincibilité si la popup projet est ouverte
    if (this.game.playerInvincible) {
      this.renderInvincibilityEffect(delta);
    }
    
    // Afficher la barre de vie
    this.renderHealthBar(delta);
    // animator
    this.animationTick += delta * 1000;

    var index = Math.floor(this.animationTick / this.animation.speed);
    var done = false;
    if (index > this.animation.frames.length - 1) {
      if (index > this.animation.frames.length) {
        done = true;
      }

      index = this.animation.frames.length - 1;
    }

    var frame = this.animation.frames[index];

    if (this.game.showInfo) {
      this.game.render.drawRect(
        this.x,
        this.y,
        this.w,
        this.h,
        this.onGround ? "#444" : "#663333"
      );
    }

    var xOffset = 0;

    var [w, h] = this.defaultSize;

    this.game.render.drawSprite(
      {
        sprite: this.animation.sprite,
        frame: frame,
        effects: this.facing == 0 ? ["flipHorizontally"] : [],
      },
      this.x -
        w * 1.55 +
        (Array.isArray(this.animation.xOffset)
          ? this.animation.xOffset[this.facing]
          : this.animation.xOffset) +
        xOffset,
      this.y - h * 1.05 + this.animation.yOffset,
      w * h * 4.3,
      w * h * 4.3 * 0.875
    );

    if (done) {
      if (this.animation.after) {
        if (this.animationName === "idle" && Math.random() > 0.5) {
          this.setAnimation("look_up");
        } else {
          this.setAnimation(this.animation.after);
        }
      } else {
        this.setAnimation(this.animationName);
      }
    }

    // animation logic
    if (this.running) {
      if (this.animation.idle) {
        this.setAnimation("run");
      }
      if (this.animationName === "crouch") {
        this.setAnimation("crawl");
      }
    } else {
      if (this.animationName === "run") {
        this.setAnimation("idle");
      }
      if (this.animationName === "crawl") {
        this.setAnimation("crouch");
      }
    }

    if (!this.onGround) {
      if (
        this.animation.idle ||
        (!this.ledgeHang && this.animationName === "ledge_hang")
      ) {
        this.setAnimation("fall");
      }
    } else {
      if (this.animationName === "fall") {
        this.setAnimation("idle");
      }
    }
  }

  renderInvincibilityEffect(delta) {
    const centerX = this.x + this.w / 2;
    const centerY = this.y + this.h / 2;
    const time = Date.now() * 0.003;
    
    // Calculer l'opacité et la position Y pour l'effet de disparition
    let opacity = 1;
    let offsetY = 0;
    
    if (this.auraFadeOut) {
      const progress = Math.min(this.auraFadeTime / this.auraFadeOutDuration, 1);
      opacity = 1 - progress;
      offsetY = -progress * 1.5; // L'aura monte en disparaissant
      
      if (progress >= 1) {
        // Fin de l'animation de disparition
        this.auraFadeOut = false;
        this.auraFadeTime = 0;
        return; // Ne plus afficher l'aura
      }
    }
    
    // Aura dorée autour du joueur
    const auraRadius = 0.8 + Math.sin(time * 2) * 0.1;
    this.game.render.drawCircle(
      centerX, 
      centerY + offsetY, 
      auraRadius, 
      `rgba(255, 215, 0, ${(0.3 + Math.sin(time * 3) * 0.15) * opacity})`
    );
    
    // Particules dorées flottantes
    for (let i = 0; i < 6; i++) {
      const angle = time + (i * Math.PI * 2 / 6);
      const distance = 0.6 + Math.sin(time * 1.5 + i) * 0.2;
      const particleX = centerX + Math.cos(angle) * distance;
      const particleY = centerY + offsetY + Math.sin(angle) * distance;
      
      this.game.render.drawCircle(
        particleX, 
        particleY, 
        0.05, 
        `rgba(255, 215, 0, ${(0.8 + Math.sin(time * 4 + i) * 0.2) * opacity})`
      );
    }
    
    // Effet de brillance
    this.game.render.drawCircle(
      centerX, 
      centerY + offsetY, 
      0.4, 
      `rgba(255, 255, 255, ${(0.2 + Math.sin(time * 4) * 0.1) * opacity})`
    );
  }

  update(delta) {
    var wasOnGround = this.onGround;

    super.update(delta);
    
    // Mise à jour du timer de disparition de l'aura
    if (this.auraFadeOut) {
      this.auraFadeTime += delta * 1000; // Convertir en millisecondes
    }
    
    // Gestion de l'historique des tiles touchées (pour les plateformes orange)
    if (this.onGround && Object.keys(this.tiles).length > 0) {
      const currentTiles = Object.keys(this.tiles);
      
      // Ajouter les nouvelles tiles à l'historique
      for (const tileIndex of currentTiles) {
        // Vérifier si cette tile n'est pas déjà dans l'historique récent
        const existingIndex = this.tilesHistory.findIndex(entry => entry.index === tileIndex);
        
        if (existingIndex !== -1) {
          // Mettre à jour le timestamp de la tile existante
          this.tilesHistory[existingIndex].timestamp = Date.now();
        } else {
          // Ajouter la nouvelle tile avec un seed aléatoire pour les particules
          this.tilesHistory.push({
            index: tileIndex,
            timestamp: Date.now(),
            particleSeed: Math.random() * 1000 // Seed unique pour randomiser les particules
          });
        }
      }
      
      // Trier par timestamp (plus récent en premier)
      this.tilesHistory.sort((a, b) => b.timestamp - a.timestamp);
      
      // Démarrer le fade-out automatique pour les anciennes tiles (garder seulement la plus récente)
      const currentTime = Date.now();
      for (let i = 1; i < this.tilesHistory.length; i++) { // Commencer à l'index 1 pour garder la plus récente
        const tile = this.tilesHistory[i];
        const age = currentTime - tile.timestamp;
        if (age > this.tileEffectDuration && !tile.fadeOutStartTime) {
          tile.fadeOutStartTime = currentTime;
        }
      }
    }
    
    // Nettoyer les tiles dont le fade-out est terminé
    const currentTime = Date.now();
    this.tilesHistory = this.tilesHistory.filter(tile => {
      if (tile.fadeOutStartTime) {
        const fadeProgress = (currentTime - tile.fadeOutStartTime) / this.tileFadeOutDuration;
        return fadeProgress < 1; // Garder seulement si le fade n'est pas terminé
      }
      return true; // Garder les tiles actives
    });

    if (!this.onGround && !this.ledgeHang) {
      this.gravityTick += delta;
      this.y += Math.min(this.gravityTick / 5, delta * 10);
    } else {
      this.gravityTick = 0;
    }
    if (!this.animationName.includes("slide")) {
      this.frictionValue = 0;
    } else {
      this.velocityX = Math.sqrt(-0.07 * this.frictionValue + 3) * (this.facing == 0 ? -1 : 1);
      this.frictionValue++
    }
    if (this.onGround) {
      //resetting movement checks
      this.doubleJumped = false

      if (!wasOnGround) {
        var y = Math.floor(this.y);
        if (y !== this.lastLandY) {
          this.lastLandY = y;

          this.game.particleSystem.spawnParticles(
            this.getCenter()[0],
            this.getBottom() - 0.1,
            5,
            0.3
          );

          if (this.velocityY < 0) {
            this.velocityY = 0;
          } else {
          }
          if (
            this.animationName !== "ground_slam" &&
            this.animationName !== "knockback"
          ) {
            this.setAnimation("land", true);
          } else {
            this.game.camera.shake(0.1, 4);
          }
        }
      }
    }

    // game boundaries
    this.x = Math.max(0, Math.min(this.game.levelWidth - this.w, this.x));
    this.y = Math.max(0, Math.min(this.game.levelHeight - this.h, this.y));
    
    // Repositionner le joueur s'il touche les 10px du bas de l'écran
    const screenHeight = this.game.canvas.height / this.game.camera.zoom;
    const playerBottomScreen = (this.y + this.h - this.game.camera.y) * this.game.camera.zoom;
    
    if (playerBottomScreen >= this.game.canvas.height - 10) {
      // Repositionner le joueur plus haut dans le niveau
      this.y = Math.max(0, this.y - 2); // Décaler de 2 unités vers le haut
      this.velocityY = Math.min(this.velocityY, 0); // Arrêter la chute
    }
  }
}
