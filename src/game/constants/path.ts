// src/game/constants/path.ts
import { Point } from '../../types/game.types';

export const GAME_PATH: Point[] = [
  { x: 0, y: 150 },
  { x: 250, y: 150 },
  { x: 250, y: 350 },
  { x: 500, y: 350 },
  { x: 500, y: 180 },
  { x: 700, y: 180 },
  { x: 700, y: 480 },
  { x: 800, y: 480 },
];

export const HOME_POSITION = GAME_PATH[GAME_PATH.length - 1];
export const SPAWN_POSITION = GAME_PATH[0];