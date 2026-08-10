// src/game/entities/towers/TeslaTower
import { BaseTower } from './BaseTower';
import { TOWER_CONFIGS } from '../../../config/towers.config';
import { Mosquito } from '../mosquitoes/Mosquito';
import { LaserBeam } from '../../../types/game.types';
import { SoundSystem } from '../../engine/SoundSystem';

export class TeslaTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, 'TESLA_COIL', TOWER_CONFIGS.TESLA_COIL);
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
      
      // Tesla has armor piercing - full damage to armored
      let actualDmg = dmg;
      if (target.armor > 0) {
        actualDmg = Math.round(dmg * 1.5); // Bonus vs armored
      }
      
      target.takeDamage(actualDmg);
      lasers.push({
        startX: this.x,
        startY: this.y,
        endX: target.x,
        endY: target.y,
        color: this.config.glowColor,
        alpha: 1,
        width: 4,
      });
      addParticles(target.x, target.y, this.config.glowColor, 8);
      if (addFloatingText) addFloatingText(target.x, target.y - 15, `-${actualDmg}`, '#ef4444');
      soundSystem.play('zap');
    }
  }
}