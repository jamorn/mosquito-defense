// src/game/entities/towers/SprayTower
import { BaseTower } from './BaseTower';
import { TOWER_CONFIGS } from '../../../config/towers.config';
import { Mosquito } from '../mosquitoes/Mosquito';
import { LaserBeam } from '../../../types/game.types';
import { SoundSystem } from '../../engine/SoundSystem';

export class SprayTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, 'SPRAY_SLOW', TOWER_CONFIGS.SPRAY_SLOW);
  }

  public updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    _lasers: LaserBeam[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void {
    if (now - this.lastFired < this.getFireInterval()) return;
    
    const targets = mosquitoes.filter(m => this.getDistanceTo(m) <= this.getRange());
    if (targets.length > 0) {
      this.lastFired = now;
      const dmg = Math.round(this.getDamage());
      targets.forEach(m => {
        m.takeDamage(dmg);
        m.applySlow(1500);
        addParticles(m.x, m.y, '#34d399', 3);
        if (addFloatingText) addFloatingText(m.x, m.y - 15, `-${dmg}`, '#ef4444');
      });
      soundSystem.play('spray');
    }
  }
}