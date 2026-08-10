// src/types/tower.types.ts
import { TowerType } from "./game.types";

export interface TowerConfig {
  name: string;
  cost: number;
  icon: string;
  description: string;
  range: number;
  damage: number;
  fireRate: number;
  color: string;
  glowColor: string;
  // Counter properties
  armorPiercing?: boolean;
  stealthDetection?: boolean;
  splashDamage?: boolean;
}

export interface SerializedTower {
  x: number;
  y: number;
  type: TowerType;
  level: number;
}
