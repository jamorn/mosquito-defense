// src/game/systems/TargetingSystem.ts
import { BaseTower } from '../entities/towers/BaseTower';
import { Mosquito } from '../entities/mosquitoes/Mosquito';
import { CombatSystem } from './CombatSystem';

export class TargetingSystem {
  /**
   * หาเป้าหมายเดี่ยวที่ดีที่สุด
   */
  public static findSingleTarget(tower: BaseTower, mosquitoes: Mosquito[]): Mosquito | null {
    return CombatSystem.findBestTarget(tower, mosquitoes);
  }
  
  /**
   * หาเป้าหมายทั้งหมดในรัศมี (splash)
   */
  public static findSplashTargets(tower: BaseTower, mosquitoes: Mosquito[]): Mosquito[] {
    return CombatSystem.findAllTargets(tower, mosquitoes);
  }
  
  /**
   * เรียงลำดับเป้าหมายตามความสำคัญ
   */
  public static prioritizeTargets(mosquitoes: Mosquito[]): Mosquito[] {
    return [...mosquitoes].sort((a, b) => {
      // Priority: BOSS > TANK > ARMORED > STEALTH > SPLITTER > SPEEDY > NORMAL
      const priority: Record<string, number> = {
        'BOSS': 7,
        'TANK': 6,
        'ARMORED': 5,
        'STEALTH': 4,
        'SPLITTER': 3,
        'SPEEDY': 2,
        'NORMAL': 1,
      };
      
      const aPriority = priority[a.type] || 0;
      const bPriority = priority[b.type] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Same priority: closer to home first
      return b.pathIndex - a.pathIndex;
    });
  }
}