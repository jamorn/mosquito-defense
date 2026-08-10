// src/utils/math.ts
import { Point } from '../types/game.types';

export function getDistance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function pointToSegmentDistance(p: Point, v: Point, w: Point): number {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return getDistance(p, v);
  
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  
  return getDistance(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y),
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}