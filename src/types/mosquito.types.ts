// src/types/mosquito.types.ts
import { MosquitoType } from "./game.types";

export interface MosquitoConfig {
  name: string;
  baseHp: number;
  hpPerWave: number;
  speed: number;
  reward: number;
  size: number;
  color: string;
  // Special properties
  armor?: number;
  isStealthed?: boolean;
  canSplit?: boolean;
  regenRate?: number;
  bossDamage?: number; // Damage to home
}

export interface WaveEnemyComposition {
  type: MosquitoType;
  count: number;
  spawnDelay?: number;
}
