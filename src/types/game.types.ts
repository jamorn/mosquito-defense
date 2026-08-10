// src/types/game.types.ts
// ==========================================
// CORE GAME TYPES
// ==========================================

export interface Point {
  x: number;
  y: number;
}

export type TowerType =
  | "SWAT_ELECTRIC"
  | "SPRAY_SLOW"
  | "UV_TRAP"
  | "TESLA_COIL";
export type MosquitoType =
  | "NORMAL"
  | "SPEEDY"
  | "TANK"
  | "BOSS"
  | "ARMORED"
  | "STEALTH"
  | "SPLITTER";
export type ItemType = "BOMB" | "FREEZE" | "REPAIR";

export interface LaserBeam {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  alpha: number;
  width: number;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface DamageResult {
  damage: number;
  isBlocked: boolean;
  isReduced: boolean;
  reason?: "STEALTH" | "ARMOR" | "NONE";
}

export interface GameState {
  coins: number;
  lives: number;
  wave: number;
  isWaveActive: boolean;
  gameOver: boolean;
  gameWon: boolean;
  failedWave: number | null;
}
