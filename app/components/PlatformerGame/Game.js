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
import PlatformEffectManager from "./PlatformEffectManager";
import PortfolioItem from "./PortfolioItem";
import ItemManager from "./ItemManager";
import EffectManager from "./EffectManager";
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
    this.itemManager = new ItemManager(this);
    this.effectManager = new EffectManager(this);
    this.platformEffects = new PlatformEffectManager(this);

    this.player = new Player(this);
    this.controller = new Controller(this);

    /**
     * @type {Object.<string, Entity>}
     */
    this.entities = {};

    // État d'initialisation
    this.isInitializing = true;

    const level = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0],
      [5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,0,0,5],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,5,5,5,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,5,5,5,5,5,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
      [5,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0],
      [5,5,5,5,5,5,5,5,0,5,5,5,5,5,5,5,5,5,5,5,0,5,5,5,5,5,5,5,5,0,5,5,5,5,5,0,5,5,0,5,5,5,5,5,5,5,5,0,5,5,5,5,5,5,5,5,0,5,5,5],
      [5,5,5,5,5,5,5,5,0,0,0,0,0,5,5,5,5,5,5,5,0,5,5,5,5,5,5,5,5,0,5,5,5,5,0,0,0,0,0,5,5,5,5,5,5,5,5,0,5,5,5,5,5,5,5,5,0,5,5,5],
      [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  ];

    this.showInfo = false;
    this.levelData = level; // Sauvegarder les données de niveau
    this.map = level.flat(1);

    this.levelWidth = level[0].length;
    this.levelHeight = level.length;

    // Générer les IDs des plateformes avec métadonnées (après avoir défini levelWidth/levelHeight)
    this.platforms = this.generatePlatformIds(level);
    
    // Les effets seront appliqués dans start() après le reset
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
    this.allProjects = [];
    this.availableProjects = [];
    this.collectedProjectsCount = 0;
    this.chronologicalIndex = 0;
    this.lastProjectCollectedTime = Date.now();
    this.nearProject = false; // Track if player is near any project // Temps de la dernière collecte
    
    // Configuration de difficulté par défaut
    this.difficultyConfig = {
      projectsRequired: 20,
      enemyMultiplier: 1.0,
      oneHitKill: false
    };
    
    // Cache pour les données portfolio
    this.portfolioDataCache = null;
  }

  end() {
    this.inputManager.end();
    this.itemManager.clear();
    this.effectManager.clear();
  }

  setDifficulty(config) {
    this.difficultyConfig = config;
    this.difficulty = config; // Aussi accessible via .difficulty
    console.log('Difficulté configurée:', config);
    
    // Configurer le système de vie selon la difficulté
    this.configureHealthSystem();
  }

  setPortfolioData(data) {
    this.portfolioDataCache = data;
    console.log(`📊 Données portfolio mises en cache: ${data ? data.length : 0} projets`);
  }

  configureHealthSystem() {
    if (!this.player) return;
    
    const diffKey = this.getDifficultyKey();
    
    // Modes sans barre de vie
    if (diffKey === 'discovery' || diffKey === 'darklord') {
      this.player.setHealthBarVisibility(false);
    } else {
      // Modes avec barre de vie (quick, battlefield)
      this.player.setHealthBarVisibility(true);
      this.player.resetHealth();
    }
  }
  
  getDifficultyKey() {
    if (!this.difficultyConfig) return 'quick';
    
    // Déterminer le mode basé sur les propriétés
    if (this.difficultyConfig.oneHitKill) return 'darklord';
    if (this.difficultyConfig.enemyMultiplier === 0.5) return 'discovery';
    if (this.difficultyConfig.enemyMultiplier === 2.0) return 'battlefield';
    return 'quick';
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

  reset() {
    console.log('🔄 Réinitialisation complète du jeu...');
    
    // Effacer tous les items spawned (projets portfolio)
    const portfolioItemsCount = this.portfolioItems.length;
    this.portfolioItems = [];
    this.allProjects = [];
    this.availableProjects = [];
    this.collectedProjectsCount = 0;
    this.chronologicalIndex = 0;
    this.lastProjectCollectedTime = Date.now();
    console.log(`🗑️ ${portfolioItemsCount} projets portfolio effacés`);
    
    // Effacer tous les items de jeu (speed boosts, etc.)
    const gameItemsCount = this.itemManager.items.length;
    this.itemManager.clear();
    console.log(`🗑️ ${gameItemsCount} items de jeu effacés`);
    
    // Réinitialiser les entités (ennemis)
    const entitiesCount = Object.keys(this.entities).length;
    this.entities = {};
    this.spawnTick = 0;
    console.log(`🗑️ ${entitiesCount} ennemis effacés`);
    
    // Réinitialiser les systèmes
    const particlesCount = this.particleSystem.particles.length;
    this.particleSystem.particles = [];
    this.effectManager.clear();
    this.platformEffects.clearAllEffects();
    console.log(`🗑️ ${particlesCount} particules effacées`);
    
    // Réinitialiser le joueur
    this.player.x = 2;
    this.player.y = this.levelHeight - 12;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.resetHealth();
    this.player.tilesHistory = [];
    
    // Réinitialiser la caméra
    this.camera.x = 0;
    this.camera.y = 0;
    this.camera.followingObject = this.player;
    
    console.log('✅ Jeu réinitialisé - Tous les items ont été effacés');
  }

  start() {
    console.log('🚀 Démarrage du jeu...');
    
    // Réinitialisation complète avant de commencer
    this.reset();
    
    this.isInitializing = false;
    this.inputManager.start();
    
    // Recharger les projets selon le mode de difficulté
    this.loadPortfolioItems();
    
    // Configurer le système de vie au démarrage
    this.configureHealthSystem();
    
    // Appliquer les effets visuels automatiques après le reset
    setTimeout(() => {
      this.applyAutomaticPlatformEffects();
      console.log('🎨 Effets visuels appliqués après démarrage');
    }, 200); // Délai pour s'assurer que tout est initialisé
    
    console.log('✅ Jeu démarré');
  }

  convertIndexToCoordinates(i) {
    return [i % this.levelWidth, Math.floor(i / this.levelWidth)];
  }

  convertCoordinatesToIndex(x, y) {
    return y * this.levelWidth + x;
  }

  generatePlatformIds(level) {
    const platforms = new Map();
    let platformId = 1;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[y].length; x++) {
        const tileValue = level[y][x];
        
        if (tileValue === 5) { // Si c'est une plateforme
          const index = this.convertCoordinatesToIndex(x, y);
          
          // Déterminer le type de plateforme basé sur sa position
          const platformType = this.determinePlatformType(level, x, y);
          
          const platformData = {
            id: platformId,
            type: platformType,
            x: x,
            y: y,
            index: index,
            tileValue: tileValue,
            neighbors: this.getPlatformNeighbors(level, x, y),
            createdAt: Date.now()
          };
          
          platforms.set(index, platformData);
          platformId++;
        }
      }
    }

    console.log(`🧱 Généré ${platforms.size} plateformes avec IDs uniques`);
    return platforms;
  }

  determinePlatformType(level, x, y) {
    const hasTop = y > 0 && level[y - 1][x] === 5;
    const hasBottom = y < level.length - 1 && level[y + 1][x] === 5;
    const hasLeft = x > 0 && level[y][x - 1] === 5;
    const hasRight = x < level[y].length - 1 && level[y][x + 1] === 5;

    // Déterminer le type basé sur les connexions
    if (!hasTop && !hasBottom && !hasLeft && !hasRight) {
      return 'isolated'; // Plateforme isolée
    } else if (!hasTop && hasBottom) {
      return 'top_surface'; // Surface du dessus
    } else if (hasTop && !hasBottom) {
      return 'bottom_surface'; // Surface du dessous
    } else if (!hasLeft && hasRight) {
      return 'left_edge'; // Bord gauche
    } else if (hasLeft && !hasRight) {
      return 'right_edge'; // Bord droit
    } else if (!hasTop && !hasBottom) {
      return 'horizontal_bridge'; // Pont horizontal
    } else if (!hasLeft && !hasRight) {
      return 'vertical_pillar'; // Pilier vertical
    } else {
      return 'interior'; // Plateforme intérieure
    }
  }

  getPlatformNeighbors(level, x, y) {
    const neighbors = {
      top: null,
      bottom: null,
      left: null,
      right: null
    };

    if (y > 0 && level[y - 1][x] === 5) {
      neighbors.top = this.convertCoordinatesToIndex(x, y - 1);
    }
    if (y < level.length - 1 && level[y + 1][x] === 5) {
      neighbors.bottom = this.convertCoordinatesToIndex(x, y + 1);
    }
    if (x > 0 && level[y][x - 1] === 5) {
      neighbors.left = this.convertCoordinatesToIndex(x - 1, y);
    }
    if (x < level[y].length - 1 && level[y][x + 1] === 5) {
      neighbors.right = this.convertCoordinatesToIndex(x + 1, y);
    }

    return neighbors;
  }

  // Méthode utilitaire pour récupérer une plateforme par ses coordonnées
  getPlatformByCoordinates(x, y) {
    const index = this.convertCoordinatesToIndex(x, y);
    return this.platforms.get(index);
  }

  // Méthode utilitaire pour récupérer une plateforme par son ID
  getPlatformById(id) {
    for (const [index, platform] of this.platforms.entries()) {
      if (platform.id === id) {
        return platform;
      }
    }
    return null;
  }

  // Méthode utilitaire pour récupérer toutes les plateformes d'un type donné
  getPlatformsByType(type) {
    const result = [];
    for (const [index, platform] of this.platforms.entries()) {
      if (platform.type === type) {
        result.push(platform);
      }
    }
    return result;
  }

  // Attribuer un ID pour les répétitions du niveau
  assignPlatformIdForRepetition(x, y, index) {
    // Déterminer la répétition basée sur la position X
    const repetition = Math.floor(x / this.levelWidth) + 1;
    
    // Si c'est la première répétition, utiliser la méthode normale
    if (repetition === 1) {
      return this.assignPlatformId(x, y, index);
    }
    
    // Pour les répétitions suivantes, générer un ID avec préfixe
    const localX = x % this.levelWidth;
    const originalIndex = this.convertCoordinatesToIndex(localX, y);
    
    // Trouver le prochain ID disponible pour cette répétition
    const repetitionPrefix = `R${repetition}`;
    let repetitionId = 1;
    
    // Chercher un ID libre pour cette répétition
    while (this.getPlatformById(`${repetitionPrefix}${repetitionId.toString().padStart(3, '0')}`)) {
      repetitionId++;
    }
    
    const newId = `${repetitionPrefix}${repetitionId.toString().padStart(3, '0')}`;
    
    // Déterminer le type de plateforme
    const platformType = this.determinePlatformTypeFromMap(x, y);
    
    const platformData = {
      id: newId,
      type: platformType,
      x: x,
      y: y,
      index: index,
      tileValue: 5,
      repetition: repetition,
      localX: localX,
      originalIndex: originalIndex,
      neighbors: this.getPlatformNeighborsFromMap(x, y),
      createdAt: Date.now(),
      dynamicallyAssigned: true
    };
    
    this.platforms.set(index, platformData);
    console.log(`🔄 ID ${newId} assigné à la répétition ${repetition}, plateforme (${x}, ${y}) -> local (${localX}, ${y})`);
    
    // Appliquer un effet visuel avec une certaine probabilité
    this.maybeApplyEffectToNewPlatform(platformData);
    
    return platformData;
  }

  // Attribuer automatiquement un ID à une plateforme qui n'en a pas
  assignPlatformId(x, y, providedIndex = null) {
    const index = providedIndex !== null ? providedIndex : this.convertCoordinatesToIndex(x, y);
    const tileValue = this.map[index];
    
    // Vérifier si c'est bien une plateforme (5) et qu'elle n'a pas déjà d'ID
    if (tileValue === 5 && !this.platforms.has(index)) {
      // Trouver le prochain ID disponible
      let maxId = 0;
      for (const [_, platform] of this.platforms.entries()) {
        if (platform.id > maxId) {
          maxId = platform.id;
        }
      }
      
      const newId = maxId + 1;
      
      // Déterminer le type de plateforme
      const platformType = this.determinePlatformTypeFromMap(x, y);
      
      const platformData = {
        id: newId,
        type: platformType,
        x: x,
        y: y,
        index: index,
        tileValue: tileValue,
        neighbors: this.getPlatformNeighborsFromMap(x, y),
        createdAt: Date.now(),
        dynamicallyAssigned: true // Marquer comme assigné dynamiquement
      };
      
      this.platforms.set(index, platformData);
      console.log(`🆔 ID ${newId} assigné automatiquement à la plateforme (${x}, ${y})`);
      
      return platformData;
    }
    
    return null;
  }

  // Version adaptée pour déterminer le type depuis la map existante
  determinePlatformTypeFromMap(x, y) {
    const hasTop = y > 0 && this.map[this.convertCoordinatesToIndex(x, y - 1)] === 5;
    const hasBottom = y < this.levelHeight - 1 && this.map[this.convertCoordinatesToIndex(x, y + 1)] === 5;
    const hasLeft = x > 0 && this.map[this.convertCoordinatesToIndex(x - 1, y)] === 5;
    const hasRight = x < this.levelWidth - 1 && this.map[this.convertCoordinatesToIndex(x + 1, y)] === 5;

    // Déterminer le type basé sur les connexions
    if (!hasTop && !hasBottom && !hasLeft && !hasRight) {
      return 'isolated'; // Plateforme isolée
    } else if (!hasTop && hasBottom) {
      return 'top_surface'; // Surface du dessus
    } else if (hasTop && !hasBottom) {
      return 'bottom_surface'; // Surface du dessous
    } else if (!hasLeft && hasRight) {
      return 'left_edge'; // Bord gauche
    } else if (hasLeft && !hasRight) {
      return 'right_edge'; // Bord droit
    } else if (!hasTop && !hasBottom) {
      return 'horizontal_bridge'; // Pont horizontal
    } else if (!hasLeft && !hasRight) {
      return 'vertical_pillar'; // Pilier vertical
    } else {
      return 'interior'; // Plateforme intérieure
    }
  }

  // Version adaptée pour les voisins depuis la map existante
  getPlatformNeighborsFromMap(x, y) {
    const neighbors = {
      top: null,
      bottom: null,
      left: null,
      right: null
    };

    if (y > 0 && this.map[this.convertCoordinatesToIndex(x, y - 1)] === 5) {
      neighbors.top = this.convertCoordinatesToIndex(x, y - 1);
    }
    if (y < this.levelHeight - 1 && this.map[this.convertCoordinatesToIndex(x, y + 1)] === 5) {
      neighbors.bottom = this.convertCoordinatesToIndex(x, y + 1);
    }
    if (x > 0 && this.map[this.convertCoordinatesToIndex(x - 1, y)] === 5) {
      neighbors.left = this.convertCoordinatesToIndex(x - 1, y);
    }
    if (x < this.levelWidth - 1 && this.map[this.convertCoordinatesToIndex(x + 1, y)] === 5) {
      neighbors.right = this.convertCoordinatesToIndex(x + 1, y);
    }

    return neighbors;
  }

  // Appliquer des effets visuels automatiques sur certaines plateformes avec propagation
  applyAutomaticPlatformEffects() {
    console.log(`[SIMPLIFIED TEST] Application des effets automatiques...`);

    // Test 1: Forcer un effet GLOW BLEU sur la plateforme 10
    console.log("  - Application d'un GLOW BLEU sur la plateforme 10");
    this.platformEffects.addEffect(10, 'glow', { color: '#0080ff', intensity: 1.2 });

    // Test 2: Forcer un effet PULSE ORANGE sur la plateforme 20
    console.log("  - Application d'un PULSE ORANGE sur la plateforme 20");
    this.platformEffects.addEffect(20, 'pulse', { color: '#ff8000', speed: 2 });

    // Test 3: Forcer un effet HIGHLIGHT ROUGE sur la plateforme 30
    console.log("  - Application d'un HIGHLIGHT ROUGE sur la plateforme 30");
    this.platformEffects.addEffect(30, 'highlight', { color: '#ff0000', intensity: 0.8 });
    
    console.log(`[SIMPLIFIED TEST] Effets appliqués.`);
  }

  // Créer une zone d'effet autour d'une plateforme avec intensité dégressive
  createEffectZone(centerPlatform, effectType, color) {
    const zone = [];
    const maxDistance = 1; // Rayon réduit à 1 (seulement les voisins directs)
    
    // Ajouter la plateforme centrale (intensité 100%)
    this.platformEffects.addEffect(centerPlatform.id, effectType, color);
    zone.push({ platform: centerPlatform, distance: 0, intensity: 1.0 });
    
    // Propager aux plateformes voisines
    for (let distance = 1; distance <= maxDistance; distance++) {
      const platformsAtDistance = this.getPlatformsAtDistance(centerPlatform, distance);
      
      for (const platform of platformsAtDistance) {
        // Probabilité réduite de propagation (seulement 40% des voisins)
        if (Math.random() < 0.4) {
          this.platformEffects.addEffect(platform.id, effectType, color);
          zone.push({ platform: platform, distance: distance, intensity: 0.6 });
        }
      }
    }
    
    return zone;
  }

  // Trouver toutes les plateformes à une distance donnée d'une plateforme centrale
  getPlatformsAtDistance(centerPlatform, targetDistance) {
    const result = [];
    const centerX = centerPlatform.x;
    const centerY = centerPlatform.y;
    
    for (const [index, platform] of this.platforms.entries()) {
      const distance = Math.abs(platform.x - centerX) + Math.abs(platform.y - centerY); // Distance Manhattan
      
      if (distance === targetDistance) {
        result.push(platform);
      }
    }
    
    return result;
  }

  // Appliquer un effet à une nouvelle plateforme selon certaines probabilités
  maybeApplyEffectToNewPlatform(platform) {
    const effects = ['highlight', 'pulse', 'glow'];
    const colors = {
      highlight: { color: '#ff0000', intensity: 0.8 }, // Rouge
      pulse: { color: '#ff8000', speed: 2 },           // Orange
      glow: { color: '#0080ff', intensity: 1.2 }       // Bleu
    };
    
    let shouldApplyEffect = false;
    let effectType = '';
    
    // Probabilités similaires au système automatique
    switch (platform.type) {
      case 'isolated':
        if (Math.random() < 0.7) {
          shouldApplyEffect = true;
          effectType = 'glow';
        }
        break;
        
      case 'top_surface':
        if (Math.random() < 0.25) {
          shouldApplyEffect = true;
          effectType = 'pulse';
        }
        break;
        
      case 'left_edge':
      case 'right_edge':
        if (Math.random() < 0.2) {
          shouldApplyEffect = true;
          effectType = 'highlight';
        }
        break;
        
      case 'horizontal_bridge':
      case 'vertical_pillar':
        if (Math.random() < 0.3) {
          shouldApplyEffect = true;
          effectType = effects[Math.floor(Math.random() * effects.length)];
        }
        break;
        
      default:
        if (Math.random() < 0.08) {
          shouldApplyEffect = true;
          effectType = effects[Math.floor(Math.random() * effects.length)];
        }
        break;
    }
    
    // Appliquer l'effet si déterminé
    if (shouldApplyEffect && effectType) {
      const color = colors[effectType];
      
      this.platformEffects.addEffect(platform.id, effectType, color);
      console.log(`✨ Effet ${effectType} appliqué à la nouvelle plateforme ID:${platform.id} (répétition ${platform.repetition})`);
    }
  }

  // Scanner toutes les plateformes visibles et attribuer des IDs si nécessaire
  scanVisiblePlatforms() {
    const isMobile = window.innerWidth <= 768;
    const renderMargin = isMobile ? 3 : 0;
    let assignedCount = 0;

    for (let i = 0; i < this.map.length; i++) {
      const [x, y] = this.convertIndexToCoordinates(i);
      
      const isVisible = (
        x + 1 > this.camera.startX - renderMargin &&
        y + 1 > this.camera.startY - renderMargin &&
        x <= this.camera.endX + renderMargin &&
        y <= this.camera.endY + renderMargin
      );

      if (isVisible && this.map[i] === 5) {
        const index = this.convertCoordinatesToIndex(x, y);
        if (!this.platforms.has(index)) {
          if (this.assignPlatformId(x, y)) {
            assignedCount++;
          }
        }
      }
    }

    if (assignedCount > 0) {
      console.log(`🔍 Scan terminé: ${assignedCount} nouveaux IDs attribués aux plateformes visibles`);
    }
    
    return assignedCount;
  }

  // Ajouter une plateforme dynamiquement à la map et lui attribuer un ID
  addDynamicPlatform(x, y) {
    if (x < 0 || x >= this.levelWidth || y < 0 || y >= this.levelHeight) {
      console.warn(`❌ Position invalide pour ajouter une plateforme: (${x}, ${y})`);
      return null;
    }

    const index = this.convertCoordinatesToIndex(x, y);
    
    // Ajouter la plateforme à la map
    this.map[index] = 5;
    
    // Recalculer la collision map pour cette position
    this.updateCollisionForTile(x, y);
    
    // Attribuer automatiquement un ID
    const platform = this.assignPlatformId(x, y);
    
    if (platform) {
      console.log(`➕ Plateforme dynamique ajoutée: ID ${platform.id} à (${x}, ${y})`);
    }
    
    return platform;
  }

  // Mettre à jour la collision map pour une tuile spécifique
  updateCollisionForTile(x, y) {
    const index = this.convertCoordinatesToIndex(x, y);
    const block = this.map[index];
    
    let flag = 0;
    
    if (block) {
      const top = this.map[this.convertCoordinatesToIndex(x, y - 1)];
      const bottom = this.map[this.convertCoordinatesToIndex(x, y + 1)];
      const left = this.map[this.convertCoordinatesToIndex(x - 1, y)];
      const right = this.map[this.convertCoordinatesToIndex(x + 1, y)];

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
    
    this.collisionMap[index] = flag;
  }

  loadPortfolioItems() {
    console.log('🎮 Génération des projets depuis les données en cache...');
    
    // Vérifier que les données sont disponibles
    if (!this.portfolioDataCache || this.portfolioDataCache.length === 0) {
      console.error('❌ Aucune donnée portfolio en cache !');
      this.portfolioItems = [];
      this.allProjects = [];
      this.availableProjects = [];
      return;
    }
    
      const diffKey = this.getDifficultyKey();
    const filtered = this.portfolioDataCache; // Données déjà filtrées (sans id 1602)
    console.log(`📊 ${filtered.length} projets disponibles en cache`);
      
      if (diffKey === 'discovery') {
        // Mode chronologique : inverser l'ordre des projets et placement séquentiel
        this.allProjects = [...filtered].reverse(); // Ordre chronologique inverse (le plus ancien en premier)
        this.availableProjects = [...this.allProjects];
        
        console.log(`🌟 Mode Histoire: ${this.allProjects.length} projets chargés`);
        console.log(`📅 Premier projet (le plus ancien): ${this.allProjects[0]?.title?.rendered} (${this.allProjects[0]?.acf?.annee})`);
        
        // Créer des positions séquentielles proches les unes des autres
        this.portfolioItems = [];
        this.chronologicalIndex = 0; // Index pour suivre la progression chronologique
        
        // Placer seulement le premier projet au début (le plus ancien)
        if (this.availableProjects.length > 0) {
          const firstProject = this.availableProjects[0];
          console.log(`🎯 Placement du premier projet: ${decodeHtmlEntities(firstProject.title.rendered)}`);
          this.portfolioItems.push(
            new PortfolioItem(this, 3, 18, { // Position de départ
              id: firstProject.id,
              title: decodeHtmlEntities(firstProject.title.rendered),
              description: firstProject.acf?.socle_technique || 'Projet',
              url: firstProject.acf?.url_projet || firstProject.link,
              type: 'web',
              imageUrl: firstProject.acf?.image_background || '',
              logoUrl: firstProject.acf?.logo_url || '',
              department: firstProject.department_name || '',
            year: firstProject.acf?.annee || '',
            pagespeed: firstProject.acf?.informations_pagespeed ? {
              performance: parseInt(firstProject.acf.informations_pagespeed.performance) || 0,
              accessibility: parseInt(firstProject.acf.informations_pagespeed.accessibilite) || 0,
              bestPractices: parseInt(firstProject.acf.informations_pagespeed.bonnes) || 0,
              seo: parseInt(firstProject.acf.informations_pagespeed.seo) || 0
            } : null
            })
          );
          console.log(`✅ Mode Histoire: 1 seul projet placé initialement`);
        }
      } else {
        // Modes normaux : placement aléatoire
      this.allProjects = filtered;
        
        // Déterminer le nombre de projets selon le mode
        let maxProjects;
        if (this.difficultyConfig && this.difficultyConfig.projectsRequired) {
        // Utiliser la configuration de difficulté pour tous les modes
            maxProjects = this.difficultyConfig.projectsRequired;
        } else {
          // Fallback sur l'ancienne logique si pas de config
          if (diffKey === 'quick') {
            maxProjects = 10;
          } else if (diffKey === 'battlefield') {
            maxProjects = 15;
          } else if (diffKey === 'darklord') {
            maxProjects = filtered.length;
          } else {
            maxProjects = 10;
          }
        }
        
        // Limiter les projets disponibles selon le mode
        this.availableProjects = [...filtered].slice(0, maxProjects);
        console.log(`🎯 Mode ${diffKey}: ${this.availableProjects.length} projets sur ${filtered.length} disponibles`);

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

        // Créer les items initiaux (max 10 visibles simultanément)
      this.portfolioItems = [];
        const itemsToPlace = Math.min(validPositions.length, this.availableProjects.length, 10);
        for (let i = 0; i < itemsToPlace; i++) {
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
            year: project.acf?.annee || '',
            pagespeed: project.acf?.informations_pagespeed ? {
              performance: parseInt(project.acf.informations_pagespeed.performance) || 0,
              accessibility: parseInt(project.acf.informations_pagespeed.accessibilite) || 0,
              bestPractices: parseInt(project.acf.informations_pagespeed.bonnes) || 0,
              seo: parseInt(project.acf.informations_pagespeed.seo) || 0
            } : null
          })
        );
        }
        console.log(`✅ ${this.portfolioItems.length} projets placés initialement`);
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
    
    const diffKey = this.getDifficultyKey();
    
    if (diffKey === 'discovery') {
      // Mode chronologique : placer le prochain projet dans l'ordre chronologique
      this.chronologicalIndex++;
      console.log(`📈 Mode Histoire: passage au projet ${this.chronologicalIndex + 1}/${this.allProjects.length}`);
      
      if (this.chronologicalIndex < this.allProjects.length) {
        const nextProject = this.allProjects[this.chronologicalIndex];
        console.log(`🔄 Prochain projet: ${decodeHtmlEntities(nextProject.title.rendered)} (${nextProject.acf?.annee})`);
        
        // Trouver la position du projet précédent (qui vient d'être collecté)
        const previousProject = itemToReplace;
        const previousX = previousProject.x;
        const previousY = previousProject.y;
        
        console.log(`📍 Position du projet précédent: (${previousX}, ${previousY})`);
        
        // Placer le nouveau projet 5-8 colonnes à droite
        const offsetX = 5 + Math.floor(Math.random() * 4); // 5, 6, 7 ou 8 colonnes à droite
        let targetX = previousX + offsetX;
        
        // S'assurer qu'on ne dépasse pas les limites de la carte
        if (targetX >= this.levelWidth - 1) {
          // Si on dépasse à droite, revenir au début avec un peu de décalage
          targetX = 3 + Math.floor(Math.random() * 2); // Position 3 ou 4
          console.log(`🔄 Retour au début de la carte: colonne ${targetX}`);
        }
        
        console.log(`🎯 Recherche position en colonne ${targetX} [+${offsetX} colonnes à droite (5-8)]`);
        
        // Trouver les positions valides dans cette colonne (1ère, 3ème, 5ème, 7ème case au-dessus d'une plateforme)
        const validPositionsInColumn = [];
        let found = 0;
        for (let y = 1; y < this.levelHeight; y++) {
          const idx = this.convertCoordinatesToIndex(targetX, y);
          const idxBelow = this.convertCoordinatesToIndex(targetX, y + 1);
          if (
            this.map[idx] === 0 &&
            this.map[idxBelow] === 5
          ) {
            found++;
            if (found === 1 || found === 3 || found === 5 || found === 7) {
              validPositionsInColumn.push(y);
              console.log(`📍 Position valide trouvée en colonne ${targetX}: hauteur ${y} (${found}ème position)`);
            }
          }
        }
        
        let finalX = targetX;
        let finalY;
        
        if (validPositionsInColumn.length > 0) {
          // Choisir une position valide au hasard parmi celles disponibles
          finalY = validPositionsInColumn[Math.floor(Math.random() * validPositionsInColumn.length)];
          console.log(`✅ Position choisie: (${finalX}, ${finalY}) parmi ${validPositionsInColumn.length} positions valides`);
        } else {
          // Si aucune position valide dans cette colonne, chercher dans les colonnes adjacentes
          console.log(`⚠️ Aucune position valide en colonne ${targetX}, recherche dans les colonnes adjacentes...`);
          let foundAlternative = false;
          
          for (let deltaX = 1; deltaX <= 3 && !foundAlternative; deltaX++) {
            for (let direction of [-1, 1]) {
              const altX = targetX + (direction * deltaX);
              if (altX >= 2 && altX < this.levelWidth - 1) {
                const altValidPositions = [];
                let altFound = 0;
                for (let y = 1; y < this.levelHeight; y++) {
                  const idx = this.convertCoordinatesToIndex(altX, y);
                  const idxBelow = this.convertCoordinatesToIndex(altX, y + 1);
                  if (this.map[idx] === 0 && this.map[idxBelow] === 5) {
                    altFound++;
                    if (altFound === 1 || altFound === 3 || altFound === 5 || altFound === 7) {
                      altValidPositions.push(y);
                    }
                  }
                }
                if (altValidPositions.length > 0) {
                  finalX = altX;
                  finalY = altValidPositions[Math.floor(Math.random() * altValidPositions.length)];
                  console.log(`✅ Position alternative trouvée: (${finalX}, ${finalY}) en colonne ${altX}`);
                  foundAlternative = true;
                  break;
                }
              }
            }
          }
          
          if (!foundAlternative) {
            // Fallback : utiliser la position par défaut
            finalX = 3;
            finalY = 18;
            console.log(`❌ Aucune position alternative trouvée, utilisation position par défaut: (${finalX}, ${finalY})`);
          }
        }
        
        // Vérification finale de la position (devrait être valide grâce à la logique ci-dessus)
        const idxBelow = this.convertCoordinatesToIndex(finalX, finalY + 1);
        console.log(`🔍 Vérification finale position (${finalX}, ${finalY}): plateforme en dessous = ${this.map[idxBelow] === 5 ? 'OUI' : 'NON'}`);
        
        if (this.map[idxBelow] !== 5) {
          console.log(`❌ ERREUR: Position finale invalide, utilisation position de secours`);
          finalX = 3;
          finalY = 18;
        }
        
        this.portfolioItems.push(
          new PortfolioItem(this, finalX, finalY, {
            id: nextProject.id,
            title: decodeHtmlEntities(nextProject.title.rendered),
            description: nextProject.acf?.socle_technique || 'Projet',
            url: nextProject.acf?.url_projet || nextProject.link,
            type: 'web',
            imageUrl: nextProject.acf?.image_background || '',
            logoUrl: nextProject.acf?.logo_url || '',
            department: nextProject.department_name || '',
              year: nextProject.acf?.annee || '',
              pagespeed: nextProject.acf?.informations_pagespeed ? {
                performance: parseInt(nextProject.acf.informations_pagespeed.performance) || 0,
                accessibility: parseInt(nextProject.acf.informations_pagespeed.accessibilite) || 0,
                bestPractices: parseInt(nextProject.acf.informations_pagespeed.bonnes) || 0,
                seo: parseInt(nextProject.acf.informations_pagespeed.seo) || 0
              } : null
          })
        );
        console.log(`✅ Nouveau projet placé en (${finalX}, ${finalY}): ${decodeHtmlEntities(nextProject.title.rendered)}`);
      }
    } else {
      // Modes normaux : placement aléatoire
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
            year: newProject.acf?.annee || '',
            pagespeed: newProject.acf?.informations_pagespeed ? {
              performance: parseInt(newProject.acf.informations_pagespeed.performance) || 0,
              accessibility: parseInt(newProject.acf.informations_pagespeed.accessibilite) || 0,
              bestPractices: parseInt(newProject.acf.informations_pagespeed.bonnes) || 0,
              seo: parseInt(newProject.acf.informations_pagespeed.seo) || 0
            } : null
          })
        );
        }
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

      const isVisible = (
        x + 1 > this.camera.startX - renderMargin &&
        y + 1 > this.camera.startY - renderMargin &&
        x <= this.camera.endX + renderMargin &&
        y <= this.camera.endY + renderMargin
      );

      if (isVisible) {
        // Vérifier si c'est une plateforme (5) et lui attribuer un ID si elle n'en a pas
        if (this.map[i] === 5) {
          if (!this.platforms.has(i)) {
            this.assignPlatformIdForRepetition(x, y, i);
          }
        }

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

    // Rendu des effets de plateformes (avant les items pour qu'ils soient en arrière-plan)
   // this.platformEffects.render();

    // Affichage des items portfolio
    for (const item of this.portfolioItems) {
      item.render();
    }

    // Affichage des items collectibles
    this.itemManager.render();

    // Indicateur directionnel vers le projet le plus proche
    this.renderDirectionalIndicator();
    
    // Afficher les informations des plateformes si le mode debug est activé
    if (this.showInfo) {
      this.renderPlatformInfo();
    }
  }

  renderDirectionalIndicator() {
    // Ne pas afficher pendant l'initialisation
    if (this.isInitializing || this.portfolioItems.length === 0) {
      return;
    }

    // En mode découverte, toujours afficher la flèche - sinon délai de 10 secondes
    const timeSinceLastCollection = (Date.now() - this.lastProjectCollectedTime) / 1000;
    const isDiscoveryMode = this.selectedDifficulty === 'discovery' || process.env.NODE_ENV === 'development';
    
    if (!isDiscoveryMode && timeSinceLastCollection < 10) {
      return; // Ne pas afficher l'indicateur si moins de 10 secondes (sauf en mode découverte)
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

  renderPlatformInfo() {
    // Afficher des informations sur les plateformes visibles à l'écran
    const isMobile = window.innerWidth <= 768;
    const renderMargin = isMobile ? 3 : 0;

    // Compter les plateformes par type
    const platformCounts = {};
    let visiblePlatforms = 0;

    for (const [index, platform] of this.platforms.entries()) {
      const x = platform.x;
      const y = platform.y;

      // Vérifier si la plateforme est visible
      const isVisible = (
        x + 1 > this.camera.startX - renderMargin &&
        y + 1 > this.camera.startY - renderMargin &&
        x <= this.camera.endX + renderMargin &&
        y <= this.camera.endY + renderMargin
      );

      if (isVisible) {
        visiblePlatforms++;
        
        // Afficher l'ID de la plateforme au centre de celle-ci
        const [screenX, screenY] = this.camera.transformCoordinates(x + 0.5, y + 0.5);
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`ID:${platform.id}`, screenX, screenY - 5);
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(platform.type, screenX, screenY + 10);
        this.ctx.restore();
        
        // Compter par type
        platformCounts[platform.type] = (platformCounts[platform.type] || 0) + 1;
      }
    }

    // Afficher les statistiques globales dans le coin supérieur gauche
    const [statsX, statsY] = this.camera.transformCoordinates(this.camera.startX + 0.5, this.camera.startY + 0.5);
    
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(statsX, statsY, 200, 120);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    
    let lineY = statsY + 20;
    this.ctx.fillText(`Total plateformes: ${this.platforms.size}`, statsX + 10, lineY);
    lineY += 18;
    this.ctx.fillText(`Plateformes visibles: ${visiblePlatforms}`, statsX + 10, lineY);
    lineY += 15;
    
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`Types:`, statsX + 10, lineY);
    lineY += 15;
    
    for (const [type, count] of Object.entries(platformCounts)) {
      this.ctx.fillText(`  ${type}: ${count}`, statsX + 10, lineY);
      lineY += 12;
    }
    
    this.ctx.restore();
  }

  updateGame(delta) {
    this.fpsTick += delta;
    if (this.fpsTick > 0.5) {
      this.fpsTick = 0;

      this.fps = Math.floor(1 / delta);
    }

    // Ne pas spawner d'ennemis pendant l'initialisation
    if (!this.isInitializing) {
    this.spawnTick += delta;
    // Ajuster le taux de spawn selon la difficulté
    const spawnRate = 2 / this.difficultyConfig.enemyMultiplier;
    if (this.spawnTick > spawnRate) {
      this.spawnTick = 0;

      this.spawnEntity();
      }
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
    this.itemManager.update(delta);
    this.effectManager.update(delta);
    this.platformEffects.update(delta);
    this.camera.update(delta);

    // Update des items portfolio
    for (const item of this.portfolioItems) {
      item.update(delta);
    }
  }
}
