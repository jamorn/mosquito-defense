// src/game/entities/mosquitoes/Mosquito/Mosquito.ts
import { GameObject } from '../GameObject';
import { Point } from '../../../types/game.types';
import { MosquitoType } from '../../../types/game.types';

export abstract class Mosquito extends GameObject {
  public id: string;
  public type: MosquitoType;
  public hp: number;
  public maxHp: number;
  public speed: number;
  public baseSpeed: number;
  public reward: number;
  public size: number;
  public color: string;
  public pathIndex: number = 0;
  public slowTimer: number = 0;
  public freezeTimer: number = 0;
  protected wingAngle: number = 0;

  // 🆕 Counter-Play Properties
  public armor: number = 0;
  public isStealthed: boolean = false;
  public canSplit: boolean = false;
  public hasSplit: boolean = false;
  public bossDamage: number = 1;

  constructor(
    x: number,
    y: number,
    type: MosquitoType,
    hp: number,
    speed: number,
    reward: number,
    size: number,
    color: string
  ) {
    super(x, y);
    this.id = Math.random().toString(36).substring(7);
    this.type = type;
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.baseSpeed = speed;
    this.reward = reward;
    this.size = size;
    this.color = color;
  }

  public applySlow(durationMs: number): void {
    this.slowTimer = durationMs;
  }

  public applyFreeze(durationMs: number): void {
    this.freezeTimer = durationMs;
  }

  public update(delta: number, path: Point[]): boolean {
    // Freeze Effect
    if (this.freezeTimer > 0) {
      this.freezeTimer -= delta;
      return true;
    }

    // Slow Effect
    if (this.slowTimer > 0) {
      this.slowTimer -= delta;
      this.speed = this.baseSpeed * 0.5;
    } else {
      this.speed = this.baseSpeed;
    }

    // Delta-time scaled movement
    const moveAmount = this.speed * (delta / 16.66);

    const target = path[this.pathIndex + 1];
    if (target) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < moveAmount) {
        this.x = target.x;
        this.y = target.y;
        this.pathIndex++;
      } else {
        this.x += (dx / dist) * moveAmount;
        this.y += (dy / dist) * moveAmount;
      }
      return true;
    }
    return false;
  }

  public takeDamage(amount: number): boolean {
    this.hp -= amount;
    return this.hp <= 0;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Stealth visual (semi-transparent if stealthed)
    if (this.isStealthed) {
      ctx.globalAlpha = 0.3;
    }
    
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.freezeTimer > 0 ? '#38bdf8' : this.color;

    ctx.fillStyle = this.freezeTimer > 0 ? '#93c5fd' : this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    if (this.freezeTimer <= 0) this.wingAngle += 0.3;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    const wingOffset = Math.sin(this.wingAngle) * (this.size + 4);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 6, this.y - wingOffset);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 6, this.y - wingOffset);
    ctx.stroke();
    ctx.restore();

    // HP Bar
    const barW = this.size * 2.2;
    const barH = 4;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(this.x - barW / 2, this.y - this.size - 8, barW, barH);

    const hpRatio = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.2 ? '#eab308' : '#ef4444';
    ctx.fillRect(this.x - barW / 2, this.y - this.size - 8, barW * hpRatio, barH);
    
    // Armor indicator
    if (this.armor > 0) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}