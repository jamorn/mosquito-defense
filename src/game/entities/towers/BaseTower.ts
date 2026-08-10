// src/game/entities/towers/BaseTower.ts
import { GameObject } from '../GameObject';
import { TowerType } from '../../../types/game.types';
import { TowerConfig, SerializedTower } from '../../../types/tower.types';
import { Mosquito } from '../mosquitoes/Mosquito';
import { LaserBeam } from '../../../types/game.types';
import { SoundSystem } from '../../engine/SoundSystem';

export abstract class BaseTower extends GameObject {
  public id: string;
  public type: TowerType;
  public level: number = 1;
  public config: TowerConfig;
  public pulseTimer: number = 0;
  protected lastFired: number = 0;

  constructor(x: number, y: number, type: TowerType, config: TowerConfig) {
    super(x, y);
    this.id = Math.random().toString(36).substring(7);
    this.type = type;
    this.config = config;
    this.pulseTimer = 500;
  }

  public getRange(): number {
    return this.config.range + (this.level - 1) * 15;
  }

  public getDamage(): number {
    return this.config.damage * Math.pow(1.3, this.level - 1);
  }

  public getFireInterval(): number {
    return Math.max(150, this.config.fireRate - (this.level - 1) * 30);
  }

  public getUpgradeCost(): number {
    return Math.floor(this.config.cost * 0.8 * this.level);
  }

  public getSellRefund(): number {
    return Math.floor(this.config.cost * 0.6 * this.level);
  }

  public upgrade(): void {
    this.level += 1;
    this.pulseTimer = 500;
  }

  // Counter properties
  public hasArmorPiercing(): boolean {
    return this.config.armorPiercing || false;
  }

  public hasStealthDetection(): boolean {
    return this.config.stealthDetection || false;
  }

  public hasSplashDamage(): boolean {
    return this.config.splashDamage || false;
  }

  protected getFirstTarget(mosquitoes: Mosquito[]): Mosquito | null {
    let bestTarget: Mosquito | null = null;
    let maxPathIndex = -1;

    for (const m of mosquitoes) {
      if (this.getDistanceTo(m) <= this.getRange()) {
        if (m.pathIndex > maxPathIndex) {
          maxPathIndex = m.pathIndex;
          bestTarget = m;
        }
      }
    }
    return bestTarget;
  }

  abstract updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    lasers: LaserBeam[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void;

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.pulseTimer > 0) {
      const pulseRadius = 18 + (500 - this.pulseTimer) / 8;
      const pulseAlpha = this.pulseTimer / 500;
      ctx.save();
      ctx.strokeStyle = this.config.glowColor;
      ctx.globalAlpha = pulseAlpha * 0.7;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.config.glowColor;

    ctx.strokeStyle = this.config.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.config.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`L${this.level}`, this.x, this.y + 26);
    ctx.restore();
  }

  public drawRangeHighlight(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.getRange(), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  public toJSON(): SerializedTower {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
      level: this.level,
    };
  }
}