import Camera from "./Camera";
import Controller from "./Controller";
import Entity from "./Entity";
import InputManager from "./InputManager";
import ParticleSystem from "./ParticleSystem";
import Player from "./Player";
import Render from "./Render";
import SpriteSheetManager from "./SpriteSheetManager";
import { v4 } from "uuid";
import { getRandomInteger } from "./random";
import PortfolioItem from "./PortfolioItem";
import { degreesToRadians } from "./util/MathUtil.js";

// Fonction pour décoder les entités HTML (identique au portfolio)
function decodeHtmlEntities(text) {
  if (!text) return '';
  
  return text
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'");
}

export default class Game {
  constructor(canvas, ctx, ssm) {
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;

    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * @type {SpriteSheetManager}
     */
    this.ssm = ssm;

    this.render = new Render(this);
    this.camera = new Camera(this);

    this.inputManager = new InputManager();
    this.particleSystem = new ParticleSystem(this);

    this.player = new Player(this);
    this.controller = new Controller(this);

    /**
     * @type {Object.<string, Entity>}
     */
    this.entities = {};

    // État d'initialisation
    this.isInitializing = true;

    const level = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
      [0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0],
      [0, 5, 0, 5, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 0],
      [0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0],
      [0, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0],
      [0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 0],
      [0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      [0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0],
      [0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [5, 5, 5, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
      [5, 5, 5, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
      [5, 5, 5, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
      [5, 5, 5, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
      [5, 5, 5, 0, 0, 0, 5, 5, 0, 0, 0, 5, 5, 5, 5],
      [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5],
      [5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    ];

    this.showInfo = false;
    this.map = level.flat(1);

    this.levelWidth = level[0].length;
    this.levelHeight = level.length;
    this.camera.endY = this.levelHeight - 7;
    this.camera.startY = this.levelHeight - 15;
    this.camera.maxY = this.levelHeight;
    this.camera.minX = 0;

    this.player.y = this.levelHeight - 12;

    this.spawnTick = 0;
    this.fpsTick = 0;
    this.fps = 0;

    if (this.map.length !== this.levelWidth * this.levelHeight) {
      throw new Error("Invalid map length: " + this.map.length);
    }

    /**
     * - `0` = No collision
     * - `1` = Left
     * - `2` = Right
     * - `4` = Top
     * - `8` = Bottom
     */
    this.collisionMap = this.createCollisionMap();

    this.portfolioItems = [];
    this.loadPortfolioItems();
    this.collectedProjectsCount = 0;
    this.lastProjectCollectedTime = Date.now();
    this.nearProject = false; // Track if player is near any project // Temps de la dernière collecte
    
    // Configuration de difficulté par défaut
    this.difficultyConfig = {
      projectsRequired: 20,
      enemyMultiplier: 1.0,
      oneHitKill: false
    };
  }

  end() {
    this.inputManager.end();
  }

  setDifficulty(config) {
    this.difficultyConfig = config;
    this.difficulty = config; // Aussi accessible via .difficulty
    console.log('Difficulté configurée:', config);
  }

  setPlayerInvincible(isInvincible) {
    this.playerInvincible = isInvincible;
  }

  triggerPlayerAuraFadeOut() {
    if (this.player && typeof this.player.triggerAuraFadeOut === 'function') {
      this.player.triggerAuraFadeOut();
    } else {
      console.warn('Player ou triggerAuraFadeOut non disponible dans Game');
    }
  }

  spawnEntity() {
    var id = v4();

    var entity = new Entity(this);
    this.entities[id] = entity;

    var direction = Math.random() > 0.5 ? -1 : 1;

    if (this.camera.startX <= 0) {
      direction = 1;
    }

    if (direction === -1) {
      entity.x = this.camera.endX + 2;
    } else {
      entity.x = this.camera.startX - 2;
    }

    entity.direction = direction;

    entity.y = this.player.y + getRandomInteger(-2, 2);
  }

  createCollisionMap() {
    var collisionMap = [];

    for (var i = 0; i < this.map.length; i++) {
      var block = this.map[i];

      var flag = 0;

      if (block) {
        var [x, y] = this.convertIndexToCoordinates(i);
        var top = this.map[this.convertCoordinatesToIndex(x, y - 1)];
        var bottom = this.map[this.convertCoordinatesToIndex(x, y + 1)];

        var left = this.map[this.convertCoordinatesToIndex(x - 1, y)];
        var right = this.map[this.convertCoordinatesToIndex(x + 1, y)];

        if (x !== 0) {
          flag |= !left ? 1 : 0;
        }
        if (x !== this.levelWidth - 1) {
          flag |= !right ? 2 : 0;
        }
        if (y !== 0) {
          flag |= !top ? 4 : 0;
        }
        if (y !== this.levelHeight - 1) {
          flag |= !bottom ? 8 : 0;
        }
      }

      collisionMap.push(flag);
    }

    return collisionMap;
  }

  getViewport() {
    return [this.canvas.width, this.canvas.height];
  }

  start() {
    this.isInitializing = false;
    this.inputManager.start();
    this.particleSystem.particles = [];
    this.lastProjectCollectedTime = Date.now(); // Réinitialiser le timer au démarrage

    this.camera.followingObject = this.player;
  }

  convertIndexToCoordinates(i) {
    return [i % this.levelWidth, Math.floor(i / this.levelWidth)];
  }

  convertCoordinatesToIndex(x, y) {
    return y * this.levelWidth + x;
  }

  async loadPortfolioItems() {
    try {
      const res = await fetch("https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio?per_page=100");
      const data = await res.json();
      // Exclure le projet id 1602
      const filtered = data.filter(item => item.id !== 1602);
      this.allProjects = filtered;
      this.availableProjects = [...filtered];

      // Trouver les emplacements valides (1ère, 3e, 5e case vide au-dessus d'une plateforme par colonne)
      // Exclure les 2 premières colonnes (x = 0 et x = 1)
      const validPositions = [];
      for (let x = 2; x < this.levelWidth; x++) {
        let found = 0;
        for (let y = 1; y < this.levelHeight; y++) {
          const idx = this.convertCoordinatesToIndex(x, y);
          const idxBelow = this.convertCoordinatesToIndex(x, y + 1);
          if (
            this.map[idx] === 0 &&
            this.map[idxBelow] === 5
          ) {
            found++;
            if (found === 1 || found === 3 || found === 5) {
              validPositions.push({ x, y });
            }
          }
        }
      }

      // Mélanger les positions pour varier
      for (let i = validPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
      }

      // Créer les items initiaux (max 10 visibles simultanément, mais 39 projets au total)
      this.portfolioItems = [];
      for (let i = 0; i < Math.min(validPositions.length, this.availableProjects.length, 10); i++) {
        const pos = validPositions[i];
        const project = this.availableProjects.shift();
        this.portfolioItems.push(
          new PortfolioItem(this, pos.x, pos.y, {
            id: project.id,
            title: decodeHtmlEntities(project.title.rendered),
            description: project.acf?.socle_technique || 'Projet',
            url: project.acf?.url_projet || project.link,
            type: 'web',
            imageUrl: project.acf?.image_background || '',
            logoUrl: project.acf?.logo_url || '',
            department: project.department_name || '',
            year: project.acf?.annee || ''
          })
        );
      }
    } catch (e) {
      console.error('Erreur chargement projets:', e);
      this.portfolioItems = [];
      this.allProjects = [];
      this.availableProjects = [];
    }
  }

  replacePortfolioItem(itemToReplace) {
    // Retirer l'item collecté
    const index = this.portfolioItems.indexOf(itemToReplace);
    if (index > -1) {
      this.portfolioItems.splice(index, 1);
      this.collectedProjectsCount++;
      this.lastProjectCollectedTime = Date.now(); // Mettre à jour le temps de collecte
    }
    // Ajouter un nouveau projet si disponible
    if (this.availableProjects.length > 0) {
      // Recalcule les positions libres valides (1ère, 3e, 5e case par colonne)
      // Exclure les 2 premières colonnes (x = 0 et x = 1)
      const usedPositions = this.portfolioItems.map(item => item.x + '-' + item.y);
      const validPositions = [];
      for (let x = 2; x < this.levelWidth; x++) {
        let found = 0;
        for (let y = 1; y < this.levelHeight; y++) {
          const idx = this.convertCoordinatesToIndex(x, y);
          const idxBelow = this.convertCoordinatesToIndex(x, y + 1);
          if (
            this.map[idx] === 0 &&
            this.map[idxBelow] === 5 &&
            !usedPositions.includes(x + '-' + y)
          ) {
            found++;
            if (found === 1 || found === 3 || found === 5) {
              validPositions.push({ x, y });
            }
          }
        }
      }
      if (validPositions.length > 0) {
        const pos = validPositions[Math.floor(Math.random() * validPositions.length)];
        const newProject = this.availableProjects.shift();
        this.portfolioItems.push(
          new PortfolioItem(this, pos.x, pos.y, {
            id: newProject.id,
            title: decodeHtmlEntities(newProject.title.rendered),
            description: newProject.acf?.socle_technique || 'Projet',
            url: newProject.acf?.url_projet || newProject.link,
            type: 'web',
            imageUrl: newProject.acf?.image_background || '',
            logoUrl: newProject.acf?.logo_url || '',
            department: newProject.department_name || '',
            year: newProject.acf?.annee || ''
          })
        );
      }
    }
  }

  renderGame(delta) {
    this.player.render(delta);
    for (var entityUUID in this.entities) {
      var entity = this.entities[entityUUID];

      entity.render(delta);
    }

    for (var i = 0; i < this.map.length; i++) {
      var collisionFlag = this.collisionMap[i];
      var [x, y] = this.convertIndexToCoordinates(i);

      // Augmenter la distance de rendu sur mobile pour voir plus de plateformes
      const isMobile = window.innerWidth <= 768;
      const renderMargin = isMobile ? 3 : 0; // 3 tiles de marge supplémentaire sur mobile

      if (
        x + 1 > this.camera.startX - renderMargin &&
        y + 1 > this.camera.startY - renderMargin &&
        x <= this.camera.endX + renderMargin &&
        y <= this.camera.endY + renderMargin
      ) {
        var width = 0.03;

        // Bordures glassmorphism modernes
        if (collisionFlag & 1) {
          this.render.drawGlassmorphismBorder(x, y, width, 1, 'left');
        }
        if (collisionFlag & 2) {
          this.render.drawGlassmorphismBorder(x + (1 - width), y, width, 1, 'right');
        }
        if (collisionFlag & 4) {
          this.render.drawGlassmorphismBorder(x, y, 1, width, 'top');
        }
        if (collisionFlag & 8) {
          this.render.drawGlassmorphismBorder(x, y + (1 - width), 1, width, 'bottom');
        }
      }
    }

    // Rendu des plateformes touchées en orange avec particules et fade-out progressif
    // Filtrer pour afficher seulement les plateformes visibles à l'écran
    const isMobile = window.innerWidth <= 768;
    const renderMargin = isMobile ? 10 : 0;
    
    for (var i = 0; i < this.player.tilesHistory.length; i++) {
      var tileEntry = this.player.tilesHistory[i];
      var tile = tileEntry.index;
      var [x, y] = this.convertIndexToCoordinates(parseInt(tile));
      
      // Vérifier si la plateforme est visible à l'écran
      if (!(x + 1 > this.camera.startX - renderMargin &&
            y + 1 > this.camera.startY - renderMargin &&
            x <= this.camera.endX + renderMargin &&
            y <= this.camera.endY + renderMargin)) {
        continue; // Passer cette plateforme si elle n'est pas visible
      }
      
      // Calculer l'intensité basée sur l'âge et le fade-out
      var baseIntensity = i === 0 ? 1.0 : Math.max(0.2, 1 - (i * 0.1)); // Plus récente = 1.0, autres dégradées
      var intensity = baseIntensity;
      
      // Appliquer le fade-out progressif si la tile est en cours de disparition
      if (tileEntry.fadeOutStartTime) {
        const currentTime = Date.now();
        const fadeProgress = (currentTime - tileEntry.fadeOutStartTime) / this.player.tileFadeOutDuration;
        const fadeMultiplier = Math.max(0, 1 - fadeProgress); // De 1.0 à 0.0
        intensity *= fadeMultiplier;
      }
      
      // Ne pas afficher si l'intensité est trop faible
      if (intensity < 0.1) continue;
      
      // Récupérer le flag de collision pour cette tile
      var collisionFlag = this.collisionMap[tile];
      
      if (collisionFlag & 1) {
        this.render.drawOrangeBorder(x, y, 0.05, 1, 'left', intensity);
      }
      if (collisionFlag & 2) {
        this.render.drawOrangeBorder(x + 0.95, y, 0.05, 1, 'right', intensity);
      }
      if (collisionFlag & 4) {
        this.render.drawOrangeBorder(x, y, 1, 0.05, 'top', intensity);
      }
      if (collisionFlag & 8) {
        this.render.drawOrangeBorder(x, y + 0.95, 1, 0.05, 'bottom', intensity);
      }
      
      // Ajouter des particules orange avec pattern unique par plateforme
      this.render.drawOrangePlatformParticles(x + 0.5, y + 0.5, intensity, delta, tileEntry.particleSeed || 0);
    }

    // Aura dégressive autour du joueur
    const playerCenterX = this.player.x + this.player.w / 2;
    const playerCenterY = this.player.y + this.player.h / 2;
    const auraRadius = 3; // Rayon de l'aura en tiles
    
    // Parcourir toutes les tiles visibles pour l'aura
    for (var i = 0; i < this.map.length; i++) {
      var collisionFlag = this.collisionMap[i];
      var [x, y] = this.convertIndexToCoordinates(i);
      
      // Vérifier si la tile est dans la zone visible et a des collisions
      // Utiliser la même marge de rendu que pour les bordures normales
      const isMobile = window.innerWidth <= 768;
      const renderMargin = 0;
      
      if (
        x + 1 > this.camera.startX - renderMargin &&
        y + 1 > this.camera.startY - renderMargin &&
        x <= this.camera.endX + renderMargin &&
        y <= this.camera.endY + renderMargin &&
        collisionFlag > 0
      ) {
        // Calculer la distance du centre de la tile au centre du joueur
        const tileCenterX = x + 0.5;
        const tileCenterY = y + 0.5;
        const distance = Math.sqrt(
          Math.pow(tileCenterX - playerCenterX, 2) + 
          Math.pow(tileCenterY - playerCenterY, 2)
        );
        
        // Si dans le rayon de l'aura, calculer l'intensité
        if (distance <= auraRadius) {
          // Intensité dégressive : 1.0 au centre, 0.0 aux bords
          const intensity = Math.max(0, 1 - (distance / auraRadius));
          
          // Appliquer l'aura avec intensité dégressive
          var width = 0.03;
          if (collisionFlag & 1) {
            this.render.drawPlayerAura(x, y, width, 1, 'left', intensity);
          }
          if (collisionFlag & 2) {
            this.render.drawPlayerAura(x + (1 - width), y, width, 1, 'right', intensity);
          }
          if (collisionFlag & 4) {
            this.render.drawPlayerAura(x, y, 1, width, 'top', intensity);
          }
          if (collisionFlag & 8) {
            this.render.drawPlayerAura(x, y + (1 - width), 1, width, 'bottom', intensity);
          }
        }
      }
    }

    this.particleSystem.render();

    // Affichage des items portfolio
    for (const item of this.portfolioItems) {
      item.render();
    }

    // Indicateur directionnel vers le projet le plus proche
    this.renderDirectionalIndicator();
    
  }

  renderDirectionalIndicator() {
    // Ne pas afficher pendant l'initialisation
    if (this.isInitializing || this.portfolioItems.length === 0) {
      return;
    }

    // Vérifier si 10 secondes se sont écoulées depuis la dernière collecte
    const timeSinceLastCollection = (Date.now() - this.lastProjectCollectedTime) / 1000;
    if (timeSinceLastCollection < 10) {
      return; // Ne pas afficher l'indicateur si moins de 10 secondes
    }

    // Position du joueur
    const playerCenterX = this.player.x + this.player.w / 2;
    const playerCenterY = this.player.y + this.player.h / 2;

    // Trouver le projet le plus proche
    let closestItem = null;
    let closestDistance = Infinity;

    for (const item of this.portfolioItems) {
      const itemCenterX = item.x + item.w / 2;
      const itemCenterY = item.y + item.h / 2;
      
      const distance = Math.sqrt(
        Math.pow(itemCenterX - playerCenterX, 2) + 
        Math.pow(itemCenterY - playerCenterY, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    }

    // Afficher l'indicateur si un projet est trouvé
    if (closestItem) {
      const targetX = closestItem.x + closestItem.w / 2;
      const targetY = closestItem.y + closestItem.h / 2;
      
      this.render.drawDirectionalIndicator(
        playerCenterX, 
        playerCenterY, 
        targetX, 
        targetY, 
        closestDistance
      );
    }
  }

  updateGame(delta) {
    this.fpsTick += delta;
    if (this.fpsTick > 0.5) {
      this.fpsTick = 0;

      this.fps = Math.floor(1 / delta);
    }

    this.spawnTick += delta;
    // Ajuster le taux de spawn selon la difficulté
    const spawnRate = 2 / this.difficultyConfig.enemyMultiplier;
    if (this.spawnTick > spawnRate) {
      this.spawnTick = 0;

      this.spawnEntity();
    }

    this.controller.update(delta);

    var deleteUUIDs = [];

    for (var entityUUID in this.entities) {
      var entity = this.entities[entityUUID];

      entity.update(delta);

      if (entity.delete) {
        deleteUUIDs.push(entityUUID);
      }
    }

    for (var entityUUID of deleteUUIDs) {
      delete this.entities[entityUUID];
    }

    this.player.update(delta);
    this.particleSystem.update(delta);
    this.camera.update(delta);

    // Update des items portfolio
    for (const item of this.portfolioItems) {
      item.update(delta);
    }
  }
}
