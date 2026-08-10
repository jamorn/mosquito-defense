// src/game/config/items.config.ts
import { ItemType } from '../types/game.types';

export interface ItemConfig {
  name: string;
  cost: number;
  icon: string;
  description: string;
  cooldown: number;
}

export const ITEM_CONFIGS: Record<ItemType, ItemConfig> = {
  BOMB: {
    name: 'ระเบิดยากันยุง',
    cost: 100,
    icon: '💣',
    description: 'ทำความเสียหายยุงทั้งหน้าจออย่างหนัก',
    cooldown: 10,
  },
  FREEZE: {
    name: 'สเปรย์แช่แข็ง',
    cost: 80,
    icon: '❄️',
    description: 'แช่แข็งหยุดยุงทุกตัวเป็นเวลา 4 วินาที',
    cooldown: 12,
  },
  REPAIR: {
    name: 'ซ่อมแซมบ้าน',
    cost: 120,
    icon: '🛠️',
    description: 'ฟื้นฟู HP บ้าน +5 หน่วย',
    cooldown: 15,
  },
};