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
    
    // Système de zoom uniforme pour tous les appareils
    this.baseZoomLevel = 1.0;
    this.currentZoomLevel = this.baseZoomLevel;
    this.minZoomLevel = 0.5;
    this.maxZoomLevel = 2.5;
    
    // Dimensions de base pour le calcul du zoom - adaptées pour mobile
    // Détecter l'orientation et ajuster en conséquence
    const viewport = this.game.getViewport();
    const aspectRatio = viewport[0] / viewport[1];
    
    if (aspectRatio < 1) {
      // Mode portrait (mobile) - priorité à la hauteur
      this.baseWidth = 12;
      this.baseHeight = 16;
    } else {
      // Mode paysage (desktop) - format classique
      this.baseWidth = 16;
      this.baseHeight = 10;
    }
    
    // Calculer les dimensions initiales avec le zoom
    this.endX = this.baseWidth / this.currentZoomLevel;
    this.endY = this.baseHeight / this.currentZoomLevel;

    this.mut = [1, 1];
    this.offsetX = 0;
    this.offsetY = 0;
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

      // Calculer la position cible de la caméra selon la direction du joueur
      var targetCameraCenter = [followingCenter[0], followingCenter[1]];
      
      // Ajuster la position horizontale selon la direction du joueur
      if (this.followingObject.facing !== undefined) {
        const cameraWidth = this.getWidth();
        if (this.followingObject.facing === 0) {
          // Joueur regarde à gauche : positionner le joueur à 70% de la gauche (pour voir plus à gauche)
          targetCameraCenter[0] = followingCenter[0] - (cameraWidth * 0.2); // Décaler caméra vers la droite
        } else {
          // Joueur regarde à droite : positionner le joueur à 70% de la droite (pour voir plus à droite)
          targetCameraCenter[0] = followingCenter[0] + (cameraWidth * 0.2); // Décaler caméra vers la gauche
        }
      }

      var diffX = targetCameraCenter[0] - cameraCenter[0];
      var diffY = targetCameraCenter[1] - cameraCenter[1];

      if (Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01) {
        var newCenter = [cameraCenter[0], cameraCenter[1]];
        var speed =
          getDistance(
            targetCameraCenter[0],
            targetCameraCenter[1],
            cameraCenter[0],
            cameraCenter[1]
          ) *
          delta *
          this.followSpeed;

        function move(dim) {
          if (newCenter[dim] < targetCameraCenter[dim]) {
            if (newCenter[dim] + speed < targetCameraCenter[dim]) {
              newCenter[dim] += speed;
            } else {
              newCenter[dim] = targetCameraCenter[dim];
            }
          } else if (newCenter[dim] > targetCameraCenter[dim]) {
            if (newCenter[dim] - speed > targetCameraCenter[dim]) {
              newCenter[dim] -= speed;
            } else {
              newCenter[dim] = targetCameraCenter[dim];
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
    const aspectRatio = viewport[0] / viewport[1];
    
    // Recalculer les dimensions de base selon l'orientation
    if (aspectRatio < 1) {
      // Mode portrait (mobile)
      this.baseWidth = 12;
      this.baseHeight = 16;
    } else {
      // Mode paysage (desktop)
      this.baseWidth = 16;
      this.baseHeight = 10;
    }
    
    // Recalculer les dimensions avec le zoom actuel
    const newWidth = this.baseWidth / this.currentZoomLevel;
    const newHeight = this.baseHeight / this.currentZoomLevel;
    
    this.setPositionCenterAndSize(...this.getCenter(), newWidth, newHeight);
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
    
    // Calculer les multiplicateurs pour X et Y
    var multX = viewport[0] / this.getWidth();
    var multY = viewport[1] / this.getHeight();
    
    // Utiliser le plus petit multiplicateur pour maintenir le ratio d'aspect
    // et éviter l'étirement lors du zoom
    var uniformMult = Math.min(multX, multY);
    
    this.mut = [uniformMult, uniformMult];
    
    // Calculer les offsets pour centrer le jeu sur l'écran
    var actualWidth = this.getWidth() * uniformMult;
    var actualHeight = this.getHeight() * uniformMult;
    
    this.offsetX = (viewport[0] - actualWidth) / 2;
    this.offsetY = (viewport[1] - actualHeight) / 2;
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
    
    // Ajouter les offsets pour centrer le jeu
    transform[0] += this.offsetX || 0;
    transform[1] += this.offsetY || 0;
    
    return transform;
  }

  transformRect(x, y, w, h) {
    return [
      ...this.transformCoordinates(x, y),
      this.transformX(w),
      this.transformY(h),
    ];
  }

  // Méthodes de zoom
  zoomIn() {
    const newZoomLevel = Math.min(this.currentZoomLevel + 0.2, this.maxZoomLevel);
    this.setZoom(newZoomLevel);
  }

  zoomOut() {
    const newZoomLevel = Math.max(this.currentZoomLevel - 0.2, this.minZoomLevel);
    this.setZoom(newZoomLevel);
  }

  setZoom(zoomLevel) {
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

  get zoom() {
    return this.currentZoomLevel;
  }

  resetZoom() {
    this.setZoom(this.baseZoomLevel);
  }
}
