// src/game/entities/towers/UVT
import { BaseTower } from './BaseTower';
import { TOWER_CONFIGS } from '../../../config/towers.config';
import { Mosquito } from '../mosquitoes/Mosquito';
import { LaserBeam } from '../../../types/game.types';
import { SoundSystem } from '../../engine/SoundSystem';

export class UVTrapTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, 'UV_TRAP', TOWER_CONFIGS.UV_TRAP);
  }

  public updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    lasers: LaserBeam[],
    _addParticles: (x: number, y: number, color: string, count: number) => void,
    _soundSystem: SoundSystem,
    _addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void {
    if (now - this.lastFired < this.getFireInterval()) return;
    
    // UV Trap can target stealthed mosquitoes
    const targets = mosquitoes.filter(m => {
      if (this.getDistanceTo(m) > this.getRange()) return false;
      // UV Trap can see stealth
      return true;
    });
    
    if (targets.length > 0) {
      this.lastFired = now;
      targets.forEach(m => {
        // Reveal stealth
        if (m.isStealthed) {
          m.isStealthed = false;
        }
        m.takeDamage(this.getDamage() * 0.75);
        lasers.push({
          startX: this.x,
          startY: this.y,
          endX: m.x,
          endY: m.y,
          color: '#c084fc',
          alpha: 0.8,
          width: 2,
        });
      });
    }
  }
}