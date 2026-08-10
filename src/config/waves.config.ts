// src/game/config/waves.config.ts
import { MosquitoType, TowerType } from '../types/game.types';
import { WaveEnemyComposition } from '../types/mosquito.types';

export interface WavePattern {
  wave: number;
  name: string;
  description: string;
  hint: string;
  composition: WaveEnemyComposition[];
  recommendedCounters: TowerType[];
  reward: number;
}

export const WAVE_PATTERNS: WavePattern[] = [
  // Wave 1-2: สอนพื้นฐาน
  {
    wave: 1,
    name: '🌱 First Contact',
    description: 'ยุงธรรมดาเริ่มบุก',
    hint: 'วาง Electric Tower ดักทางโค้ง',
    composition: [{ type: 'NORMAL', count: 8 }],
    recommendedCounters: ['SWAT_ELECTRIC'],
    reward: 60,
  },
  {
    wave: 2,
    name: '📈 Growing Threat',
    description: 'ยุงมากขึ้น เตรียมพร้อม!',
    hint: 'เพิ่มป้อม หรืออัพเกรด',
    composition: [
      { type: 'NORMAL', count: 10 },
      { type: 'SPEEDY', count: 2 },
    ],
    recommendedCounters: ['SWAT_ELECTRIC'],
    reward: 70,
  },
  
  // Wave 3: Speed Rush
  {
    wave: 3,
    name: '⚡ SPEED RUSH!',
    description: 'ยุงเร็วทั้งหมด พุ่งเข้าบ้านไม่หยุด',
    hint: '💨 ใช้ Spray ชะลอ + ⚡ Electric ยิงซ้ำ',
    composition: [
      { type: 'SPEEDY', count: 10 },
      { type: 'NORMAL', count: 4 },
    ],
    recommendedCounters: ['SPRAY_SLOW', 'SWAT_ELECTRIC'],
    reward: 100,
  },
  
  // Wave 4: Transition
  {
    wave: 4,
    name: '🔄 Transition',
    description: 'ยุงผสม เตรียมตัวให้พร้อม',
    hint: '🧠 ดู Wave ถัดไป แล้วเตรียม Counter',
    composition: [
      { type: 'NORMAL', count: 8 },
      { type: 'SPEEDY', count: 6 },
      { type: 'TANK', count: 2 },
    ],
    recommendedCounters: ['SPRAY_SLOW', 'TESLA_COIL'],
    reward: 120,
  },
  
  // Wave 5: Armored Battalion
  {
    wave: 5,
    name: '🛡️ ARMORED BATTALION',
    description: 'ยุงเกราะหนา ลดดาเมจส่วนใหญ่',
    hint: '💥 Tesla Tower ทะลุเกราะ! (ราคา 280 🪙)',
    composition: [
      { type: 'ARMORED', count: 5 },
      { type: 'NORMAL', count: 8 },
    ],
    recommendedCounters: ['TESLA_COIL'],
    reward: 150,
  },
  
  // Wave 6: Storm
  {
    wave: 6,
    name: '🌪️ Storm',
    description: 'ยุงเร็ว + เกราะ ผสมกัน',
    hint: '💨 Spray ชะลอ + 💥 Tesla ทะลุเกราะ',
    composition: [
      { type: 'SPEEDY', count: 8 },
      { type: 'ARMORED', count: 4 },
      { type: 'NORMAL', count: 4 },
    ],
    recommendedCounters: ['SPRAY_SLOW', 'TESLA_COIL'],
    reward: 160,
  },
  
  // Wave 7: Stealth Invasion
  {
    wave: 7,
    name: '👻 STEALTH INVASION',
    description: 'ยุงล่องหน ป้อมธรรมดาเล็งไม่ได้',
    hint: '☀️ UV Trap เท่านั้นที่มองเห็น!',
    composition: [
      { type: 'STEALTH', count: 8 },
      { type: 'SPEEDY', count: 4 },
    ],
    recommendedCounters: ['UV_TRAP'],
    reward: 180,
  },
  
  // Wave 8: Inferno
  {
    wave: 8,
    name: '🔥 Inferno',
    description: 'Tank + Armored มาพร้อมกัน',
    hint: '💥 Tesla + ☀️ UV เผาซ้ำ',
    composition: [
      { type: 'TANK', count: 4 },
      { type: 'ARMORED', count: 4 },
      { type: 'NORMAL', count: 6 },
    ],
    recommendedCounters: ['TESLA_COIL', 'UV_TRAP'],
    reward: 200,
  },
  
  // Wave 9: Boss Wave
  {
    wave: 9,
    name: '👑 MOSQUITO KING',
    description: 'บอสใหญ่ + ลูกสมุนนับไม่ถ้วน',
    hint: '❄️ Freeze บอส แล้ว 💥 Tesla Burst!',
    composition: [
      { type: 'BOSS', count: 1 },
      { type: 'SPLITTER', count: 8 },
      { type: 'ARMORED', count: 4 },
    ],
    recommendedCounters: ['TESLA_COIL', 'UV_TRAP'],
    reward: 300,
  },
  
  // Wave 10: Final Wave
  {
    wave: 10,
    name: '💀 ALL-OUT ASSAULT',
    description: 'ทุกรุ่นผสมกัน เตรียมตัวให้พร้อม!',
    hint: '🧠 ใช้ป้อมให้หลากหลาย วางแผนดีๆ',
    composition: [
      { type: 'ARMORED', count: 4 },
      { type: 'STEALTH', count: 4 },
      { type: 'SPLITTER', count: 4 },
      { type: 'SPEEDY', count: 6 },
      { type: 'TANK', count: 4 },
    ],
    recommendedCounters: ['TESLA_COIL', 'UV_TRAP', 'SPRAY_SLOW'],
    reward: 500,
  },
];

// Helper: Get wave pattern by wave number
export const getWavePattern = (wave: number): WavePattern | null => {
  return WAVE_PATTERNS.find(p => p.wave === wave) || null;
};

// Helper: Get hint for failed wave
export const getWaveHint = (wave: number): string => {
  const pattern = getWavePattern(wave);
  return pattern?.hint || '💡 ลองปรับตำแหน่งป้อม หรืออัพเกรดเพิ่ม';
};