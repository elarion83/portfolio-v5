import Item from "./Item";
import SpeedBoostItem from "./SpeedBoostItem";

export default class ItemManager {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.spawnTimer = 0;
    this.spawnInterval = 5000;
    this.maxItems = 8;
    this.lastSpawnTime = 0;
    
    this.spawnProbabilities = {
      'speed_boost': 100
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

  createItem(type, x, y) {
    switch (type) {
      case 'speed_boost':
        return new SpeedBoostItem(this.game, x, y);
      default:
        return new Item(this.game, x, y, type);
    }
  }

  getRandomItemType() {
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