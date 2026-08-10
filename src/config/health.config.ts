// src/game/config/health.config.ts
// ==========================================
// Health System Configuration
// ==========================================
import { MosquitoType } from '../types/game.types';
import { HealthStatus } from '../types/health.types';

// ความเสียหายต่อกัด (%) ตามประเภทยุง
export const BITE_DAMAGE: Record<MosquitoType, number> = {
  NORMAL: 2,
  SPEEDY: 3,
  TANK: 5,
  ARMORED: 5,
  STEALTH: 4,
  SPLITTER: 3,
  BOSS: 15,
};

// ความเสี่ยงติดเชื้อ (%) ตามประเภทยุง
export const INFECTION_CHANCE: Record<MosquitoType, number> = {
  NORMAL: 10,
  SPEEDY: 25,
  TANK: 20,
  ARMORED: 30,
  STEALTH: 35,
  SPLITTER: 20,
  BOSS: 100,
};

// Health Status Thresholds
export interface HealthThreshold {
  status: HealthStatus;
  minHp: number;
  label: string;
  color: string;
  emoji: string;
}

export const HEALTH_THRESHOLDS: HealthThreshold[] = [
  { status: 'HEALTHY',  minHp: 76, label: 'สุขภาพดี',   color: '#22c55e', emoji: '💚' },
  { status: 'MILD',     minHp: 51, label: 'เริ่มป่วย',  color: '#eab308', emoji: '🤒' },
  { status: 'SICK',     minHp: 26, label: 'ป่วยหนัก',   color: '#f97316', emoji: '🤕' },
  { status: 'CRITICAL', minHp: 1,  label: 'วิกฤต!',     color: '#ef4444', emoji: '🚑' },
  { status: 'DEAD',     minHp: 0,  label: 'เสียชีวิต',  color: '#6b7280', emoji: '💀' },
];

// อาการตาม Health Status
export const HEALTH_SYMPTOMS: Record<HealthStatus, string[]> = {
  HEALTHY: ['รู้สึกปกติ', 'ไม่มีอาการ'],
  MILD: ['เริ่มมีไข้ต่ำ', 'ปวดศีรษะเล็กน้อย', 'อ่อนเพลีย'],
  SICK: ['ไข้สูง', 'ปวดเมื่อยตัว', 'คลื่นไส้', 'ผื่นขึ้น'],
  CRITICAL: ['ไข้สูงมาก', 'เลือดออก', 'ชัก', 'หมดสติ'],
  DEAD: ['เสียชีวิต'],
};

// Helper: หา Health Status จาก HP
export const getHealthStatus = (hp: number): HealthStatus => {
  for (const threshold of HEALTH_THRESHOLDS) {
    if (hp >= threshold.minHp) return threshold.status;
  }
  return 'DEAD';
};

// Helper: หาข้อมูล Status
export const getHealthInfo = (hp: number): HealthThreshold => {
  const status = getHealthStatus(hp);
  return HEALTH_THRESHOLDS.find(t => t.status === status) || HEALTH_THRESHOLDS[4];
};