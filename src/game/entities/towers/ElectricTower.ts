// src/game/entities/towers/ElectricTower.ts
import { BaseTower } from './BaseTower';
import { TOWER_CONFIGS } from '../../../config/towers.config';
import { Mosquito } from '../mosquitoes/Mosquito';
import { LaserBeam } from '../../../types/game.types';
import { SoundSystem } from '../../engine/SoundSystem';

export class ElectricTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, 'SWAT_ELECTRIC', TOWER_CONFIGS.SWAT_ELECTRIC);
  }

  public updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    lasers: LaserBeam[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void {
    if (now - this.lastFired < this.getFireInterval()) return;
    
    const target = this.getFirstTarget(mosquitoes);
    if (target) {
      this.lastFired = now;
      const dmg = Math.round(this.getDamage());
      target.takeDamage(dmg);
      lasers.push({
        startX: this.x,
        startY: this.y,
        endX: target.x,
        endY: target.y,
        color: this.config.glowColor,
        alpha: 1,
        width: 2,
      });
      addParticles(target.x, target.y, this.config.glowColor, 5);
      if (addFloatingText) addFloatingText(target.x, target.y - 15, `-${dmg}`, '#ef4444');
      soundSystem.play('zap');
    }
  }
}