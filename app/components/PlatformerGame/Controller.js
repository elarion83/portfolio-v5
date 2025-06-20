import Game from "./Game";

export default class Controller {
  constructor(game) {
    /**
     * @type {Game}
     */
    this.game = game;

    this.controlling = this.game.player;
  }

  update(delta) {
    // Désactiver tous les contrôles pendant l'initialisation
    if (this.game.isInitializing) {
      return;
    }

    var baseSpeed = (this.controlling.onGround ? 6 : 5.5);
    var speed = baseSpeed * (this.controlling.speedMultiplier || 1) * delta;

    if (this.game.inputManager.isKeyDown("shift")) {
      speed /= 5;
    }

    if (this.controlling.crouch) {
      speed /= 5;
    }

    // Vérifier si les popups sont ouvertes pour désactiver les mouvements gauche/droite
    const isPopupOpen = this.game.playerInvincible && (
      // Vérifier les popups via les événements DOM ou les états globaux
      document.querySelector('.project-popup') || 
      document.querySelector('.pause-menu-popup')
    );

    var left =
      !isPopupOpen && (
        this.game.inputManager.isKeyDown("a") ||
        this.game.inputManager.isKeyDown("ArrowLeft")
      );

    var right =
      !isPopupOpen && (
        this.game.inputManager.isKeyDown("d") ||
        this.game.inputManager.isKeyDown("ArrowRight")
      );

    var move = left ^ right && !this.controlling.animation.disableController;

    if (move) {
      if (left) {
        this.controlling.x -= speed;
        this.controlling.facing = 0;
      }

      if (right) {
        this.controlling.x += speed;
        this.controlling.facing = 1;
      }

      if (!this.controlling.running) {
        this.controlling.running = true;
      }
    } else {
      if (this.controlling.running) {
        this.controlling.running = false;
      }
    }

    var crouchValue = false;

    if (
      this.game.inputManager.isKeyDown("s") ||
      this.game.inputManager.isKeyDown("ArrowDown")
    ) {
      if (this.controlling.ledgeHang) {
        this.controlling.y += delta;
      } else {
        if (this.controlling.onGround) {
          if (move) {
            if (this.controlling.crouch) {
              crouchValue = true;
            } else {
              this.controlling.slide();
            }
          } else {
            crouchValue =
              this.controlling.animationName === "crouch" ||
              this.controlling.animationName === "crawl" ||
              this.controlling.animation.idle;
          }
        } else {
        }
      }
    }

    this.controlling.setCrouch(crouchValue);

    if (
      this.game.inputManager.isKeyPressed("w") ||
      this.game.inputManager.isKeyPressed(" ") ||
      this.game.inputManager.isKeyPressed("ArrowUp")
    ) {
      if (!this.controlling.animation.disableController) {
        this.controlling.jump();
      }
    }

    if (!this.controlling.animation.disableController) {
      // Désactiver l'attaque par clic sur mobile (écran < 768px)
      if (window.innerWidth >= 768) {
        if (this.game.inputManager.isMousePressed("0")) {
          if (this.controlling.onGround) {
            this.controlling.attack();
          } else {
            this.controlling.groundSlam();
          }
        }
      }

      if (this.game.inputManager.isKeyPressed("f")) {
        this.controlling.knockback();
      }

      if (this.game.inputManager.isKeyPressed("g")) {
        this.game.showInfo = !this.game.showInfo;
      }

      if (this.game.inputManager.isKeyPressed("c")) {
        // Émettre un événement personnalisé pour ouvrir la modale des contrôles
        window.dispatchEvent(new CustomEvent('openControlsModal'));
      }
    }

    if (this.game.inputManager.isKeyPressed("-")) {
      this.game.camera.scaleSize(1.1);
    }
    if (this.game.inputManager.isKeyPressed("=")) {
      this.game.camera.scaleSize(0.9);
    }

    if (this.controlling.x > this.game.levelWidth / 5) {
      var map = this.game.map;
      var rows = [];

      for (var i = 0; i < map.length; i++) {
        var [x, y] = this.game.convertIndexToCoordinates(i);
        var row = rows[y] || (rows[y] = []);

        row.push(map[i]);
      }

      var newMap = [];

      for (var i = 0; i < rows.length; i++) {
        newMap.push(...rows[i], ...rows[i]);
      }

      this.game.map = newMap;
      this.game.levelWidth *= 2;

      this.game.collisionMap = this.game.createCollisionMap();
    }
  }
}
