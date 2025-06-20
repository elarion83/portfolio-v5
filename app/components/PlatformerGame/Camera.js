import Game from "./Game";
import { getRandom } from "./random";
import { getDistance } from "./util/MathUtil";

export default class Camera {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;
    this.startX = 0;
    this.startY = 0;
    
    // Système de zoom - seulement sur mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.baseZoomLevel = 1.2; // Léger zoom sur mobile pour une meilleure visibilité
      this.currentZoomLevel = this.baseZoomLevel;
      this.minZoomLevel = 0.8;
      this.maxZoomLevel = 2.5;
      
      // Dimensions de base pour le calcul du zoom - ratio fixe 16:10
      this.baseWidth = 16;
      this.baseHeight = 10;
      
      // Calculer les dimensions initiales avec le zoom
      this.endX = this.baseWidth / this.currentZoomLevel;
      this.endY = this.baseHeight / this.currentZoomLevel;
    } else {
      // Desktop : pas de zoom, dimensions fixes
      this.baseZoomLevel = 1.0;
      this.currentZoomLevel = 1.0;
      this.minZoomLevel = 1.0;
      this.maxZoomLevel = 1.0;
      
      // Dimensions de base plus larges pour desktop
      this.baseWidth = 20;
      this.baseHeight = 12;
      
      this.endX = this.baseWidth;
      this.endY = this.baseHeight;
    }

    this.mut = [1, 1];
    this.followingObject = null;
    this.followSpeed = 2;
    this.followX = true;
    this.followY = true;

    this.minX = null;
    this.minY = null;

    this.maxX = null;
    this.maxY = null;

    this.shakeTick = 0;
    this.shakeMagnitude = 1;

    this.calculateMultiplier();
  }

  shake(tick = 0.3, magnitude = 1) {
    this.shakeTick = tick;
    this.shakeMagnitude = magnitude;
  }

  update(delta) {
    if (this.followingObject) {
      var followingCenter = this.followingObject.getCenter();
      var cameraCenter = this.getCenter();

      if (typeof this.maxY === "number") {
        followingCenter[1] = Math.min(
          this.maxY - this.getHeight() / 2,
          followingCenter[1]
        );
      }

      if (typeof this.minX === "number") {
        followingCenter[0] = Math.max(
          this.minX + this.getWidth() / 2,
          followingCenter[0]
        );
      }

      var diffX = followingCenter[0] - cameraCenter[0];
      var diffY = followingCenter[1] - cameraCenter[1];

      if (Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01) {
        var newCenter = [cameraCenter[0], cameraCenter[1]];
        var speed =
          getDistance(
            followingCenter[0],
            followingCenter[1],
            cameraCenter[0],
            cameraCenter[1]
          ) *
          delta *
          this.followSpeed;

        function move(dim) {
          if (newCenter[dim] < followingCenter[dim]) {
            if (newCenter[dim] + speed < followingCenter[dim]) {
              newCenter[dim] += speed;
            } else {
              newCenter[dim] = followingCenter[dim];
            }
          } else if (newCenter[dim] > followingCenter[dim]) {
            if (newCenter[dim] - speed > followingCenter[dim]) {
              newCenter[dim] -= speed;
            } else {
              newCenter[dim] = followingCenter[dim];
            }
          }
        }

        if (Math.abs(diffX) > 0.1 && this.followX) {
          move(0);
        }

        if (Math.abs(diffY) > 0.1 && this.followY) {
          move(1);
        }

        if (this.shakeTick > 0) {
          this.shakeTick -= delta;

          newCenter[0] += (getRandom(-1, 1) / 100) * this.shakeMagnitude;
          newCenter[1] += (getRandom(-1, 1) / 100) * this.shakeMagnitude;
        }

        this.setPositionCenter(newCenter[0], newCenter[1]);
      }
    }
  }

  updateAspectRatio(maintainHeight = true) {
    var viewport = this.game.getViewport();
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // MOBILE : Maintenir un ratio d'aspect fixe (16:10)
      const targetGameRatio = 16 / 10; // 1.6
      const viewportRatio = viewport[0] / viewport[1];
      
      // Calculer les nouvelles dimensions en maintenant le ratio d'aspect du jeu
      let newWidth, newHeight;
      
      if (viewportRatio > targetGameRatio) {
        // Le viewport est plus large que notre ratio cible
        // On maintient la hauteur et on ajuste la largeur
        newHeight = this.getHeight();
        newWidth = newHeight * targetGameRatio;
      } else {
        // Le viewport est plus haut que notre ratio cible  
        // On maintient la largeur et on ajuste la hauteur
        newWidth = this.getWidth();
        newHeight = newWidth / targetGameRatio;
      }
      
      this.setPositionCenterAndSize(...this.getCenter(), newWidth, newHeight);
    } else {
      // DESKTOP : Comportement original (s'adapter au viewport sans ratio fixe)
      if (maintainHeight) {
        var height = this.getHeight();
        var newWidth = height * (viewport[0] / viewport[1]);
        this.setPositionCenterAndSize(...this.getCenter(), newWidth, height);
      } else {
        var width = this.getWidth();
        var newHeight = width * (viewport[1] / viewport[0]);
        this.setPositionCenterAndSize(...this.getCenter(), width, newHeight);
      }
    }
  }

  scaleSize(scalar = 1) {
    this.setPositionCenterAndSize(
      ...this.getCenter(),
      this.getWidth() * scalar,
      this.getHeight() * scalar
    );
  }

  setPositionCenter(centerX, centerY) {
    this.setPositionCenterAndSize(
      centerX,
      centerY,
      this.endX - this.startX,
      this.endY - this.startY
    );
  }

  setPositionCenterAndSize(centerX, centerY, width, height) {
    var cameraMax = [width, height];

    this.startX = centerX - cameraMax[0] / 2;
    this.startY = centerY - cameraMax[1] / 2;
    this.endX = centerX + cameraMax[0] / 2;
    this.endY = centerY + cameraMax[1] / 2;

    this.calculateMultiplier();
  }

  setSize(width, height) {
    var center = this.getCenter();

    this.setPositionCenterAndSize(center[0], center[1], width, height);
  }

  getCenter() {
    return [
      this.startX + this.getWidth() / 2,
      this.startY + this.getHeight() / 2,
    ];
  }

  getWidth() {
    return this.endX - this.startX;
  }

  getHeight() {
    return this.endY - this.startY;
  }

  calculateMultiplier() {
    var viewport = this.game.getViewport();
    this.mut = [viewport[0] / this.getWidth(), viewport[1] / this.getHeight()];
  }

  transformX(x) {
    return x * this.mut[0];
  }

  transformY(y) {
    return y * this.mut[1];
  }

  transformCoordinates(x, y) {
    var transform = [x - this.startX, y - this.startY];
    transform[0] *= this.mut[0];
    transform[1] *= this.mut[1];
    return transform;
  }

  transformRect(x, y, w, h) {
    return [
      ...this.transformCoordinates(x, y),
      this.transformX(w),
      this.transformY(h),
    ];
  }

  // Méthodes de zoom - désactivées sur desktop
  zoomIn() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return; // Pas de zoom sur desktop
    
    const newZoomLevel = Math.min(this.currentZoomLevel + 0.2, this.maxZoomLevel);
    this.setZoom(newZoomLevel);
  }

  zoomOut() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return; // Pas de zoom sur desktop
    
    const newZoomLevel = Math.max(this.currentZoomLevel - 0.2, this.minZoomLevel);
    this.setZoom(newZoomLevel);
  }

  setZoom(zoomLevel) {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return; // Pas de zoom sur desktop
    
    this.currentZoomLevel = Math.max(this.minZoomLevel, Math.min(this.maxZoomLevel, zoomLevel));
    
    // Calculer les nouvelles dimensions
    const newWidth = this.baseWidth / this.currentZoomLevel;
    const newHeight = this.baseHeight / this.currentZoomLevel;
    
    // Maintenir la position du centre
    const center = this.getCenter();
    this.setPositionCenterAndSize(center[0], center[1], newWidth, newHeight);
  }

  getZoomLevel() {
    return this.currentZoomLevel;
  }

  resetZoom() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return; // Pas de zoom sur desktop
    
    this.setZoom(this.baseZoomLevel);
  }
}
