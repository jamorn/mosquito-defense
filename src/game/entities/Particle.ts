// src/game/entities/Particle.ts
import { GameObject } from './GameObject';

export class Particle extends GameObject {
  private vx: number;
  private vy: number;
  private color: string;
  private alpha: number = 1;
  private size: number;

  constructor(x: number, y: number, color: string) {
    super(x, y);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.size = Math.random() * 4 + 2;
  }

  public update(delta: number): boolean {
    const factor = delta / 16.66;
    this.x += this.vx * factor;
    this.y += this.vy * factor;
    this.alpha -= 0.025 * factor;
    return this.alpha > 0;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}