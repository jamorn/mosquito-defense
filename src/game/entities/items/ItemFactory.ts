// src/game/entities/items/ItemFactory
import { SpecialItem } from './SpecialItem';
import { BombItem } from './BombItem';
import { FreezeItem } from './FreezeItem';
import { RepairItem } from './RepairItem';
import { ItemType } from '../../../types/game.types';

export class ItemFactory {
  public static createItem(type: ItemType): SpecialItem {
    switch (type) {
      case 'BOMB':
        return new BombItem();
      case 'FREEZE':
        return new FreezeItem();
      case 'REPAIR':
        return new RepairItem();
      default:
        return new BombItem();
    }
  }
}