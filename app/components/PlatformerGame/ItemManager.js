import Item from "./Item";
import SpeedBoostItem from "./SpeedBoostItem";
import HealthItem from "./HealthItem";

export default class ItemManager {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.spawnTimer = 0;
    this.lastSpawnTime = 0;
    
    // Définir les taux de spawn en fonction de l'environnement
    if (process.env.NODE_ENV === 'development') {
      this.spawnInterval = 1500; // 1.5 secondes en dev
      this.maxItems = 15;        // Jusqu'à 15 items en dev
      console.log('🔧 Mode DEV: Taux de spawn des items augmenté.');
    } else {
      this.spawnInterval = 5000; // 5 secondes en production
      this.maxItems = 8;
    }
    
    this.spawnProbabilities = {
      'speed_boost': 0.6, // 60% de chance
      'health_pack': 0.4  // 40% de chance
    };
  }

  update(delta) {
    if (this.game.isInitializing) return;

    // Filtrer les items collectés ou expirés
    const itemsBeforeFilter = this.items.length;
    this.items = this.items.filter(item => {
      if (item.collected || item.expired) {
        if (item.expired) {
          console.log(`⏰ Item expiré: ${item.name}`);
        }
        return false;
      }
      item.update(delta);
      return true;
    });
    
    // Log si des items ont été supprimés
    const itemsRemoved = itemsBeforeFilter - this.items.length;
    if (itemsRemoved > 0) {
      console.log(`🗑️ ${itemsRemoved} item(s) supprimé(s) (collectés ou expirés)`);
    }

    this.updateSpawning(delta);
  }

  updateSpawning(delta) {
    const currentTime = Date.now();
    
    if (this.items.length < this.maxItems && 
        currentTime - this.lastSpawnTime > this.spawnInterval) {
      
      this.spawnRandomItem();
      this.lastSpawnTime = currentTime;
    }
  }

  spawnRandomItem() {
    const itemType = this.getRandomItemType();
    const position = this.findValidSpawnPosition();
    if (!position) {
      console.log("❌ Position invalide pour spawner un item");
      return;
    }

    const item = this.createItem(itemType, position.x, position.y);
    if (item) {
      this.items.push(item);
      console.log(`📦 Item spawné: ${item.name}`);
    }
  }

  /**
   * Fait apparaître un item d'un type spécifique près du joueur.
   * C'est une fonction de débogage.
   * @param {string} itemType - Le type de l'item à faire apparaître (ex: 'health_pack').
   */
  spawnItemNearPlayer(itemType) {
    if (!this.game.player) return null;

    const playerCenter = this.game.player.getCenter();
    // Apparaît légèrement au-dessus du joueur pour qu'il tombe
    const position = { x: playerCenter[0], y: playerCenter[1] - 2 }; 

    // On vérifie si la position est valide, sinon on ne fait rien.
    if (!this.isValidSpawnPosition(position.x, position.y)) {
        console.warn(`🔧 [DEBUG] Position de spawn près du joueur non valide.`);
        // On pourrait chercher une autre position, mais pour un debug simple, on s'arrête là.
        return null;
    }

    const item = this.createItem(itemType, position.x, position.y);
    if (item) {
      this.items.push(item);
      console.log(`🔧 [DEBUG] Item forcé: ${item.name} près du joueur.`);
      return item;
    }
    return null;
  }

  createItem(type, x, y) {
    switch (type) {
      case 'speed_boost':
        return new SpeedBoostItem(this.game, x, y);
      case 'health_pack':
        return new HealthItem(this.game, x, y);
      default:
        // Retourne null si le type n'est pas reconnu
        console.warn(`Type d'item inconnu: ${type}`);
        return null;
    }
  }

  getRandomItemType() {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const type in this.spawnProbabilities) {
      cumulativeProbability += this.spawnProbabilities[type];
      if (rand <= cumulativeProbability) {
        return type;
      }
    }

    // Fallback au cas où
    return 'speed_boost';
  }

  findValidSpawnPosition() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const x = 3 + Math.random() * (this.game.levelWidth - 6);
      const y = 2 + Math.random() * (this.game.levelHeight - 10);
      
      if (this.isValidSpawnPosition(x, y)) {
        return { x, y };
      }
      
      attempts++;
    }
    
    return null;
  }

  isValidSpawnPosition(x, y) {
    const tileIndex = this.game.convertCoordinatesToIndex(Math.floor(x), Math.floor(y));
    if (this.game.map[tileIndex] === 5) {
      return false;
    }
    
    let hasGround = false;
    for (let i = 1; i <= 3; i++) {
      const belowIndex = this.game.convertCoordinatesToIndex(Math.floor(x), Math.floor(y) + i);
      if (this.game.map[belowIndex] === 5) {
        hasGround = true;
        break;
      }
    }
    
    if (!hasGround) {
      return false;
    }
    
    const minDistance = 2;
    for (const item of this.items) {
      const distance = Math.sqrt(
        Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2)
      );
      if (distance < minDistance) {
        return false;
      }
    }
    
    return true;
  }

  render() {
    for (const item of this.items) {
      item.render();
    }
  }

  clear() {
    this.items = [];
    this.lastSpawnTime = 0;
  }
} 