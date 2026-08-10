// ==========================================
// Health System Types
// ==========================================
import { MosquitoType } from './game.types';

export type HealthStatus = 
  | 'HEALTHY'      // 100-76%
  | 'MILD'         // 75-51%
  | 'SICK'         // 50-26%
  | 'CRITICAL'     // 25-1%
  | 'DEAD';        // 0%

export interface PlayerHealthState {
  hp: number;
  maxHp: number;
  status: HealthStatus;
  isAlive: boolean;
}

export interface BiteRecord {
  mosquitoType: MosquitoType;
  mosquitoName: string;
  damage: number;
  timestamp: number;
  diseases: string[];
}

export interface InfectionRecord {
  diseaseId: string;
  diseaseName: string;
  infectedBy: MosquitoType;
  timestamp: number;
  severity: InfectionSeverity;
}

export type InfectionSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'FATAL';

export interface DeathReport {
  causeOfDeath: string;
  finalBite: BiteRecord;
  totalBites: number;
  bitesByType: Partial<Record<MosquitoType, number>>;
  infections: InfectionRecord[];
  survivalTime: number;
  wavesSurvived: number;
  biteHistory: BiteRecord[];
}