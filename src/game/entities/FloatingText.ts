// src/game/entities/FloatingText.ts
import { FloatingText as FloatingTextType } from '../../types/game.types';

export class FloatingTextEntity implements FloatingTextType {
  public x: number;
  public y: number;
  public text: string;
  public color: string;
  public alpha: number = 1;
  public vy: number = -1.2;

  constructor(x: number, y: number, text: string, color: string) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
  }

  public update(delta: number): boolean {
    const factor = delta / 16.66;
    this.y += this.vy * factor;
    this.alpha -= 0.02 * factor;
    return this.alpha > 0;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}