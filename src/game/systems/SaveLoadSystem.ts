// src/game/systems/SaveLoadSystem.ts
import { saveToStorage, loadFromStorage, clearStorage } from '../../utils/storage';
import { TowerFactory } from '../entities/towers/TowerFactory';
import { BaseTower } from '../entities/towers/BaseTower';
import { ItemFactory } from '../entities/items/ItemFactory';
import { SpecialItem } from '../entities/items/SpecialItem';
import { ItemType, TowerType } from '../../types/game.types';
import { SerializedTower } from '../../types/tower.types';

export interface SaveData {
  coins: number;
  lives: number;
  wave: number;
  towers: SerializedTower[];
  items: Record<string, { type: ItemType; lastUsedTime: number }>;
  timestamp: number;
}

export class SaveLoadSystem {
  /**
   * บันทึกเกม
   */
  public static save(
    coins: number,
    lives: number,
    wave: number,
    towers: BaseTower[],
    items: Record<ItemType, SpecialItem>
  ): boolean {
    const saveData: SaveData = {
      coins,
      lives,
      wave,
      towers: towers.map(t => t.toJSON()),
      items: Object.entries(items).reduce((acc, [key, item]) => {
        acc[key] = item.toJSON() as { type: ItemType; lastUsedTime: number };
        return acc;
      }, {} as Record<string, { type: ItemType; lastUsedTime: number }>),
      timestamp: Date.now(),
    };
    
    return saveToStorage(saveData);
  }
  
  /**
   * โหลดเกม
   */
  public static load(): {
    coins: number;
    lives: number;
    wave: number;
    towers: BaseTower[];
    items: Record<ItemType, SpecialItem>;
  } | null {
    const data = loadFromStorage<SaveData>();
    if (!data) return null;
    
    try {
      // Rebuild towers
      const towers = data.towers.map(t => {
        const tower = TowerFactory.createTower(t.type, t.x, t.y);
        tower.level = t.level;
        return tower;
      });
      
      // Rebuild items
      const items = {
        BOMB: ItemFactory.createItem('BOMB'),
        FREEZE: ItemFactory.createItem('FREEZE'),
        REPAIR: ItemFactory.createItem('REPAIR'),
      };
      
      // Restore item cooldowns
      if (data.items) {
        for (const [key, itemData] of Object.entries(data.items)) {
          if (items[key as ItemType]) {
            items[key as ItemType].lastUsedTime = itemData.lastUsedTime;
          }
        }
      }
      
      return {
        coins: data.coins,
        lives: data.lives,
        wave: data.wave,
        towers,
        items,
      };
    } catch (e) {
      console.error('Failed to load save:', e);
      return null;
    }
  }
  
  /**
   * ลบ save
   */
  public static clear(): void {
    clearStorage();
  }
  
  /**
   * ตรวจว่ามี save อยู่ไหม
   */
  public static hasSave(): boolean {
    return loadFromStorage<SaveData>() !== null;
  }
}