// src/game/config/counter-matrix.ts
import { MosquitoType, TowerType } from '../types/game.types';

export interface CounterInfo {
  weakness: TowerType[];
  resistance: TowerType[];
  strategy: string;
}

export const COUNTER_MATRIX: Record<MosquitoType, CounterInfo> = {
  NORMAL: {
    weakness: ['SWAT_ELECTRIC'],
    resistance: [],
    strategy: 'Electric Tower จัดการได้ง่าย',
  },
  SPEEDY: {
    weakness: ['SPRAY_SLOW'],
    resistance: [],
    strategy: 'ชะลอด้วย Spray แล้ว Electric ยิงซ้ำ',
  },
  TANK: {
    weakness: ['TESLA_COIL', 'UV_TRAP'],
    resistance: [],
    strategy: 'ต้องการดาเมจสูงต่อเนื่อง',
  },
  BOSS: {
    weakness: ['TESLA_COIL'],
    resistance: [],
    strategy: 'Freeze + Tesla Burst Combo',
  },
  ARMORED: {
    weakness: ['TESLA_COIL'],
    resistance: ['SWAT_ELECTRIC', 'SPRAY_SLOW', 'UV_TRAP'],
    strategy: 'Tesla เท่านั้นที่ทะลุเกราะ',
  },
  STEALTH: {
    weakness: ['UV_TRAP'],
    resistance: ['SWAT_ELECTRIC', 'SPRAY_SLOW', 'TESLA_COIL'],
    strategy: 'UV Trap เท่านั้นที่ตรวจจับได้',
  },
  SPLITTER: {
    weakness: ['SPRAY_SLOW'],
    resistance: ['TESLA_COIL'],
    strategy: 'Splash damage ป้องกันการแบ่งตัว',
  },
};