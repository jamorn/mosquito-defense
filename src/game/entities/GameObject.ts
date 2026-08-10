// src/game/entities/GameObject.ts
import { Point } from '../../types/game.types';

export abstract class GameObject {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getDistanceTo(other: Point): number {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
}