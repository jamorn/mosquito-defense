// src/game/systems/HealthSystem.ts
// ==========================================
// Health System - จัดการสุขภาพผู้เล่น
// ==========================================
import { MosquitoType } from '../../types/game.types';
import { 
  PlayerHealthState, 
  BiteRecord, 
  InfectionRecord, 
  DeathReport,
  HealthStatus,
  InfectionSeverity 
} from '../../types/health.types';
import { 
  BITE_DAMAGE, 
  INFECTION_CHANCE, 
  getHealthStatus,
  HEALTH_SYMPTOMS 
} from '../../config/health.config';
import { getDiseasesByMosquito } from '../../config/diseases.config';
import { MOSQUITO_CONFIGS } from '../../config/mosquitoes.config';

export class HealthSystem {
  private hp: number = 100;
  private maxHp: number = 100;
  private biteHistory: BiteRecord[] = [];
  private infections: InfectionRecord[] = [];
  private startTime: number = Date.now();
  private isAlive: boolean = true;

  /**
   * รีเซ็ตสุขภาพ (เริ่มเกมใหม่ / Retry)
   */
  public reset(): void {
    this.hp = 100;
    this.biteHistory = [];
    this.infections = [];
    this.startTime = Date.now();
    this.isAlive = true;
  }

  /**
   * ถูกยุงกัด!
   * @returns true ถ้ายังรอด, false ถ้าตาย
   */
  public takeBite(mosquitoType: MosquitoType): boolean {
    if (!this.isAlive) return false;

    const damage = BITE_DAMAGE[mosquitoType];
    const config = MOSQUITO_CONFIGS[mosquitoType];
    const diseases = getDiseasesByMosquito(mosquitoType);

    // บันทึกการถูกกัด
    const bite: BiteRecord = {
      mosquitoType,
      mosquitoName: config.name,
      damage,
      timestamp: Date.now(),
      diseases: diseases.map(d => d.nameTh),
    };
    this.biteHistory.push(bite);

    // ลด HP
    this.hp = Math.max(0, this.hp - damage);

    // ตรวจสอบติดเชื้อ
    this.checkInfection(mosquitoType);

    // ตรวจสอบว่าตายหรือไม่
    if (this.hp <= 0) {
      this.isAlive = false;
      return false;
    }

    return true;
  }

  /**
   * ตรวจสอบการติดเชื้อ
   */
  private checkInfection(mosquitoType: MosquitoType): void {
    const chance = INFECTION_CHANCE[mosquitoType];
    const roll = Math.random() * 100;

    if (roll < chance) {
      const diseases = getDiseasesByMosquito(mosquitoType);
      
      if (diseases.length > 0) {
        const disease = diseases[Math.floor(Math.random() * diseases.length)];
        
        const alreadyInfected = this.infections.some(i => i.diseaseId === disease.id);
        
        if (!alreadyInfected) {
          this.infections.push({
            diseaseId: disease.id,
            diseaseName: disease.nameTh,
            infectedBy: mosquitoType,
            timestamp: Date.now(),
            severity: this.getSeverity(disease.dangerLevel),
          });
        }
      }
    }
  }

  private getSeverity(dangerLevel: number): InfectionSeverity {
    if (dangerLevel >= 5) return 'FATAL';
    if (dangerLevel >= 4) return 'SEVERE';
    if (dangerLevel >= 3) return 'MODERATE';
    return 'MILD';
  }

  /**
   * ฟื้นฟู HP (จาก Repair Item)
   */
  public heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  /**
   * สร้าง Death Report
   */
  public generateDeathReport(finalBite: BiteRecord, wavesSurvived: number): DeathReport {
    const bitesByType = this.biteHistory.reduce((acc, bite) => {
      acc[bite.mosquitoType] = (acc[bite.mosquitoType] || 0) + 1;
      return acc;
    }, {} as Partial<Record<MosquitoType, number>>);

    return {
      causeOfDeath: this.getCauseOfDeath(),
      finalBite,
      totalBites: this.biteHistory.length,
      bitesByType,
      infections: this.infections,
      survivalTime: Date.now() - this.startTime,
      wavesSurvived,
      biteHistory: this.biteHistory,
    };
  }

  private getCauseOfDeath(): string {
    if (this.infections.length === 0) {
      return 'ถูกยุงกัดจนเสียเลือดมาก';
    }
    
    const fatalInfections = this.infections.filter(
      i => i.severity === 'FATAL' || i.severity === 'SEVERE'
    );
    if (fatalInfections.length > 0) {
      return `เสียชีวิตจาก ${fatalInfections.map(i => i.diseaseName).join(', ')}`;
    }
    
    return 'ถูกยุงกัดหลายครั้งจนร่างกายทนไม่ไหว';
  }

  // Getters
  public getHp(): number { return this.hp; }
  public getMaxHp(): number { return this.maxHp; }
  public getStatus(): HealthStatus { return getHealthStatus(this.hp); }
  public getIsAlive(): boolean { return this.isAlive; }
  public getBiteCount(): number { return this.biteHistory.length; }
  public getInfections(): InfectionRecord[] { return [...this.infections]; }
  public getSymptoms(): string[] { return HEALTH_SYMPTOMS[this.getStatus()]; }
}