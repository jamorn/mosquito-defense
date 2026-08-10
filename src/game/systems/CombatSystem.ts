// src/game/systems/CombatSystem.ts
import { BaseTower } from '../entities/towers/BaseTower';
import { Mosquito } from '../entities/mosquitoes/Mosquito';
import { DamageResult } from '../../types/game.types';

/**
 * 🎯 CombatSystem: หัวใจของ Counter-Play
 * 
 * กฎการแก้ทาง:
 * - Armored → ต้อง Tesla (ทะลุเกราะ)
 * - Stealth → ต้อง UV Trap (ตรวจจับ)
 * - Splitter → Spray ยิงกลุ่มจัดการตัวแบ่ง
 */
export class CombatSystem {
  
  /**
   * คำนวณความเสียหายที่เป้าหมายได้รับ
   */
  public static calculateDamage(tower: BaseTower, target: Mosquito): DamageResult {
    let damage = tower.getDamage();
    let isBlocked = false;
    let isReduced = false;
    let reason: 'STEALTH' | 'ARMOR' | 'NONE' = 'NONE';
    
    // Rule 1: Stealth Check - UV Trap only can attack stealth
    if (target.isStealthed) {
      if (!tower.hasStealthDetection()) {
        return { damage: 0, isBlocked: true, isReduced: false, reason: 'STEALTH' };
      }
    }
    
    // Rule 2: Armor Check - Tesla pierces armor
    if (target.armor > 0) {
      if (tower.hasArmorPiercing()) {
        // Tesla gets bonus damage vs armored
        damage *= 1.5;
      } else {
        // Other towers have reduced damage
        damage = Math.max(1, damage - target.armor);
        isReduced = true;
        reason = 'ARMOR';
      }
    }
    
    return { damage, isBlocked, isReduced, reason };
  }
  
  /**
   * ตรวจว่า tower โจมตี target ได้ไหม
   */
  public static canTarget(tower: BaseTower, target: Mosquito): boolean {
    // Range check
    if (tower.getDistanceTo(target) > tower.getRange()) {
      return false;
    }
    
    // Stealth check - only UV Trap can target stealth
    if (target.isStealthed && !tower.hasStealthDetection()) {
      return false;
    }
    
    return true;
  }
  
  /**
   * หาเป้าหมายที่ดีที่สุด (ใกล้บ้านที่สุด)
   */
  public static findBestTarget(tower: BaseTower, mosquitoes: Mosquito[]): Mosquito | null {
    let bestTarget: Mosquito | null = null;
    let maxPathIndex = -1;
    
    for (const m of mosquitoes) {
      if (!this.canTarget(tower, m)) continue;
      
      if (m.pathIndex > maxPathIndex) {
        maxPathIndex = m.pathIndex;
        bestTarget = m;
      }
    }
    
    return bestTarget;
  }
  
  /**
   * หาเป้าหมายทั้งหมดในรัศมี (สำหรับ splash damage)
   */
  public static findAllTargets(tower: BaseTower, mosquitoes: Mosquito[]): Mosquito[] {
    return mosquitoes.filter(m => this.canTarget(tower, m));
  }
}