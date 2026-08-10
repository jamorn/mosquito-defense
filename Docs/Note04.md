🏥 Player Health System: สุขภาพ 100% → ตาย
🎯 แนวคิด
┌─────────────────────────────────────────────────────────┐
│ │
│ เริ่มเกม: สุขภาพดี 100% 💚 │
│ ↓ │
│ ถูกยุงกัด: HP ลดลงเรื่อยๆ │
│ ↓ │
│ 75%: เริ่มป่วย 🤒 │
│ ↓ │
│ 50%: ป่วยหนัก 🤕 │
│ ↓ │
│ 25%: วิกฤต 🚑 │
│ ↓ │
│ 0%: เสียชีวิต 💀 │
│ ↓ │
│ รายงาน: "ถูกยุงกัด 12 ตัว, ติดเชื้อ 3 โรค" │
│ │
└─────────────────────────────────────────────────────────┘
📁 ไฟล์ที่ 1: src/types/health.types.ts
// ==========================================
// Player Health & Death Report Types
// ==========================================
import { MosquitoType } from './game.types';

export interface PlayerHealthState {
hp: number; // 0-100
maxHp: number; // 100
status: HealthStatus;
isAlive: boolean;
}

export type HealthStatus =
| 'HEALTHY' // 100-76%
| 'MILD' // 75-51%
| 'SICK' // 50-26%
| 'CRITICAL' // 25-1%
| 'DEAD'; // 0%

export interface BiteRecord {
mosquitoType: MosquitoType;
mosquitoName: string;
damage: number; // % HP ที่ลด
timestamp: number; // เวลาที่ถูกกัด
diseases: string[]; // โรคที่อาจติดเชื้อ
}

export interface InfectionRecord {
diseaseId: string;
diseaseName: string;
infectedBy: MosquitoType;
timestamp: number;
severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'FATAL';
}

export interface DeathReport {
// สาเหตุการตาย
causeOfDeath: string;
finalBite: BiteRecord;

// สถิติการถูกกัด
totalBites: number;
bitesByType: Record<MosquitoType, number>;

// โรคที่ติดเชื้อ
infections: InfectionRecord[];

// เวลาที่รอดชีวิต
survivalTime: number; // milliseconds
wavesSurvived: number;

// ยุงที่กัดทั้งหมด
biteHistory: BiteRecord[];
}

📁 ไฟล์ที่ 2: src/config/health.config.ts
// ==========================================
// Health System Configuration
// ==========================================
import { MosquitoType } from '../types/game.types';
import { HealthStatus } from '../types/health.types';

// ความเสียหายต่อกัด (%) ตามประเภทยุง
export const BITE_DAMAGE: Record<MosquitoType, number> = {
NORMAL: 2, // ยุงรำคาญ กัดเบาๆ
SPEEDY: 3, // ยุงลาย กัดเจ็บ
TANK: 5, // ยุงก้นปล่อง กัดหนัก
ARMORED: 5, // ยุงลาย กัดหนัก
STEALTH: 4, // ยุงก้นปล่อง กัดโดยไม่รู้ตัว
SPLITTER: 3, // ยุงลายเสือ กัดเจ็บ
BOSS: 15, // บอส กัดสาหัส!
};

// ความเสี่ยงติดเชื้อ (%) ตามประเภทยุง
export const INFECTION_CHANCE: Record<MosquitoType, number> = {
NORMAL: 10, // 10%
SPEEDY: 25, // 25%
TANK: 20, // 20%
ARMORED: 30, // 30%
STEALTH: 35, // 35%
SPLITTER: 20, // 20%
BOSS: 100, // 100% (บอสต้องติดเชื้อ!)
};

// Health Status Thresholds
export const HEALTH_THRESHOLDS: { status: HealthStatus; minHp: number; label: string; color: string; emoji: string }[] = [
{ status: 'HEALTHY', minHp: 76, label: 'สุขภาพดี', color: '#22c55e', emoji: '💚' },
{ status: 'MILD', minHp: 51, label: 'เริ่มป่วย', color: '#eab308', emoji: '🤒' },
{ status: 'SICK', minHp: 26, label: 'ป่วยหนัก', color: '#f97316', emoji: '🤕' },
{ status: 'CRITICAL', minHp: 1, label: 'วิกฤต!', color: '#ef4444', emoji: '🚑' },
{ status: 'DEAD', minHp: 0, label: 'เสียชีวิต', color: '#6b7280', emoji: '💀' },
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
export const getHealthInfo = (hp: number) => {
const status = getHealthStatus(hp);
return HEALTH_THRESHOLDS.find(t => t.status === status) || HEALTH_THRESHOLDS[4];
};

📁 ไฟล์ที่ 3: src/game/systems/HealthSystem.ts
// ==========================================
// Health System - จัดการสุขภาพผู้เล่น
// ==========================================
import { MosquitoType } from '../../types/game.types';
import {
PlayerHealthState,
BiteRecord,
InfectionRecord,
DeathReport,
HealthStatus
} from '../../types/health.types';
import {
BITE_DAMAGE,
INFECTION_CHANCE,
getHealthStatus,
HEALTH_SYMPTOMS
} from '../../config/health.config';
import { getDiseasesByMosquito, DISEASES } from '../../config/diseases.config';
import { MOSQUITO_CONFIGS } from '../../config/mosquitoes.config';

export class HealthSystem {
private hp: number = 100;
private maxHp: number = 100;
private biteHistory: BiteRecord[] = [];
private infections: InfectionRecord[] = [];
private startTime: number = Date.now();
private isAlive: boolean = true;

/\*\*

- รีเซ็ตสุขภาพ (เริ่มเกมใหม่ / Retry)
  \*/
  public reset(): void {
  this.hp = 100;
  this.biteHistory = [];
  this.infections = [];
  this.startTime = Date.now();
  this.isAlive = true;
  }

/\*\*

- ถูกยุงกัด!
- @returns true ถ้ายังรอด, false ถ้าตาย
  \*/
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

/\*\*

- ตรวจสอบการติดเชื้อ
  _/
  private checkInfection(mosquitoType: MosquitoType): void {
  const chance = INFECTION_CHANCE[mosquitoType];
  const roll = Math.random() _ 100;

  if (roll < chance) {
  const diseases = getDiseasesByMosquito(mosquitoType);

      // สุ่มเลือก 1 โรคที่ติดเชื้อ
      if (diseases.length > 0) {
        const disease = diseases[Math.floor(Math.random() * diseases.length)];

        // ตรวจสอบว่ายังไม่เคยติดเชื้อนี้
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

private getSeverity(dangerLevel: number): 'MILD' | 'MODERATE' | 'SEVERE' | 'FATAL' {
if (dangerLevel >= 5) return 'FATAL';
if (dangerLevel >= 4) return 'SEVERE';
if (dangerLevel >= 3) return 'MODERATE';
return 'MILD';
}

/\*\*

- ฟื้นฟู HP (จาก Repair Item)
  \*/
  public heal(amount: number): void {
  this.hp = Math.min(this.maxHp, this.hp + amount);
  }

/\*\*

- สร้าง Death Report
  \*/
  public generateDeathReport(finalBite: BiteRecord, wavesSurvived: number): DeathReport {
  const bitesByType = this.biteHistory.reduce((acc, bite) => {
  acc[bite.mosquitoType] = (acc[bite.mosquitoType] || 0) + 1;
  return acc;
  }, {} as Record<MosquitoType, number>);

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

    const fatalInfections = this.infections.filter(i => i.severity === 'FATAL' || i.severity === 'SEVERE');
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

📁 ไฟล์ที่ 4: src/components/HUD/HealthBar.tsx
// ==========================================
// Health Bar - แสดงสุขภาพผู้เล่น
// ==========================================
import React from 'react';
import { Heart, Activity } from 'lucide-react';
import { getHealthInfo, HEALTH_SYMPTOMS } from '../../config/health.config';
import { InfectionRecord } from '../../types/health.types';

interface HealthBarProps {
hp: number;
maxHp: number;
biteCount: number;
infections: InfectionRecord[];
}

export function HealthBar({ hp, maxHp, biteCount, infections }: HealthBarProps) {
const healthInfo = getHealthInfo(hp);
const percentage = Math.max(0, (hp / maxHp) \* 100);
const symptoms = HEALTH_SYMPTOMS[healthInfo.status];

return (

<div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 space-y-2">
{/_ Header _/}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<Heart className={`w-5 h-5 ${hp > 50 ? 'text-green-400' : hp > 25 ? 'text-amber-400' : 'text-red-400 animate-pulse'}`} />
<span className="font-bold text-sm text-slate-200">
{healthInfo.emoji} {healthInfo.label}
</span>
</div>
<span className="text-xs text-slate-400">
🦟 ถูกกัด: {biteCount} ครั้ง
</span>
</div>

      {/* HP Bar */}
      <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: healthInfo.color,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-white drop-shadow">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Symptoms */}
      {healthInfo.status !== 'HEALTHY' && (
        <div className="text-[10px] text-slate-400">
          <span className="text-amber-400">อาการ:</span> {symptoms.slice(0, 2).join(', ')}
        </div>
      )}

      {/* Infections */}
      {infections.length > 0 && (
        <div className="text-[10px] space-y-0.5">
          <div className="text-red-400 font-bold flex items-center gap-1">
            <Activity className="w-3 h-3" /> ติดเชื้อ:
          </div>
          {infections.map(inf => (
            <div key={inf.diseaseId} className="text-slate-300 ml-3">
              • {inf.diseaseName}
              <span className={`ml-1 ${
                inf.severity === 'FATAL' ? 'text-red-400 font-bold' :
                inf.severity === 'SEVERE' ? 'text-orange-400' :
                'text-yellow-400'
              }`}>
                ({inf.severity})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>

);
}
📁 ไฟล์ที่ 5: src/components/Overlays/DeathReportOverlay.tsx
// ==========================================
// Death Report - รายงานการเสียชีวิต
// ==========================================
import React, { useState } from 'react';
import { RotateCcw, Play, Skull, Bug, FileText, Clock, HeartPulse } from 'lucide-react';
import { DeathReport } from '../../types/health.types';
import { MOSQUITO_CONFIGS } from '../../config/mosquitoes.config';

interface DeathReportOverlayProps {
report: DeathReport;
failedWave: number | null;
onRetryWave: () => void;
onResetGame: () => void;
}

export function DeathReportOverlay({
report,
failedWave,
onRetryWave,
onResetGame,
}: DeathReportOverlayProps) {
const [showDetails, setShowDetails] = useState(false);

const formatTime = (ms: number): string => {
const seconds = Math.floor(ms / 1000);
const minutes = Math.floor(seconds / 60);
const secs = seconds % 60;
return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

return (

<div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto">
<div className="max-w-lg w-full">
{/_ Header _/}
<div className="text-center mb-4">
<Skull className="w-14 h-14 text-red-500 mx-auto mb-2 animate-pulse" />
<h2 className="text-3xl font-black text-red-500 mb-1">เสียชีวิต!</h2>
<p className="text-slate-400 text-sm">{report.causeOfDeath}</p>
</div>

        {/* 📊 Statistics Card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 text-sm">📊 รายงานการถูกยุงกัด</span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              <div className="text-2xl font-black text-red-400">{report.totalBites}</div>
              <div className="text-[10px] text-slate-400">ถูกกัดทั้งหมด</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              <div className="text-2xl font-black text-amber-400">{report.infections.length}</div>
              <div className="text-[10px] text-slate-400">โรคที่ติดเชื้อ</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              <div className="text-2xl font-black text-cyan-400">{formatTime(report.survivalTime)}</div>
              <div className="text-[10px] text-slate-400">เวลาที่รอด</div>
            </div>
          </div>

          {/* Bites by Type */}
          <div className="text-xs space-y-1 mb-3">
            <div className="font-bold text-slate-300 mb-1">🦟 ถูกกัดโดย:</div>
            {Object.entries(report.bitesByType).map(([type, count]) => {
              const config = MOSQUITO_CONFIGS[type as keyof typeof MOSQUITO_CONFIGS];
              return (
                <div key={type} className="flex justify-between text-slate-400">
                  <span>{config.name}</span>
                  <span className="text-red-400 font-bold">×{count}</span>
                </div>
              );
            })}
          </div>

          {/* Infections */}
          {report.infections.length > 0 && (
            <div className="text-xs space-y-1">
              <div className="font-bold text-red-400 mb-1 flex items-center gap-1">
                <HeartPulse className="w-3 h-3" /> โรคที่ติดเชื้อ:
              </div>
              {report.infections.map(inf => (
                <div key={inf.diseaseId} className="flex justify-between">
                  <span className="text-slate-300">{inf.diseaseName}</span>
                  <span className={`font-bold ${
                    inf.severity === 'FATAL' ? 'text-red-400' :
                    inf.severity === 'SEVERE' ? 'text-orange-400' :
                    'text-yellow-400'
                  }`}>
                    {inf.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Final Bite Info */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 mb-3">
          <div className="text-red-400 font-bold text-sm mb-1">
            💀 กัดสุดท้ายโดย: {report.finalBite.mosquitoName}
          </div>
          <div className="text-slate-300 text-xs">
            🩸 นำพาโรค: {report.finalBite.diseases.join(', ')}
          </div>
        </div>

        {/* ดูรายละเอียดเพิ่มเติม */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition mb-3"
        >
          <Bug className="w-4 h-4 text-cyan-400" />
          {showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดโรคทั้งหมด 🤔'}
        </button>

        {/* Disease Details */}
        {showDetails && (
          <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-3 mb-3 max-h-40 overflow-y-auto text-xs">
            {report.infections.map(inf => (
              <div key={inf.diseaseId} className="mb-2 pb-2 border-b border-slate-700 last:border-0">
                <div className="font-bold text-white">{inf.diseaseName}</div>
                <div className="text-slate-400">
                  ติดเชื้อจาก: {MOSQUITO_CONFIGS[inf.infectedBy]?.name || 'ไม่ทราบ'}
                </div>
                <div className="text-slate-400">
                  ความรุนแรง: <span className="text-red-400">{inf.severity}</span>
                </div>
              </div>
            ))}

            {report.infections.length === 0 && (
              <div className="text-slate-400 text-center">
                ไม่มีการติดเชื้อ (เสียชีวิตจากการเสียเลือด)
              </div>
            )}
          </div>
        )}

        {/* Prevention Tips */}
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3 mb-4">
          <div className="text-emerald-400 font-bold text-xs mb-1">🛡️ ป้องกันในชีวิตจริง:</div>
          <ul className="text-slate-300 text-[10px] space-y-0.5">
            <li>✅ กำจัดแหล่งน้ำขังรอบบ้าน</li>
            <li>✅ นอนในมุ้ง หรือติดมุ้งลวด</li>
            <li>✅ ใช้ยากันยุงที่มี DEET</li>
            <li>✅ หากมีไข้สูงหลังถูกยุงกัด รีบพบแพทย์</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRetryWave}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            🔄 ลอง Wave {failedWave} ใหม่
          </button>

          <button
            onClick={onResetGame}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg transition text-sm"
          >
            <Play className="w-4 h-4" />
            เริ่มเกมใหม่ (Wave 1)
          </button>
        </div>
      </div>
    </div>

);
}

📁 ไฟล์ที่ 6: ปรับปรุง App.tsx (ส่วน Health)
// ใน App.tsx เพิ่ม:

import { HealthSystem } from './game/systems/HealthSystem';
import { HealthBar } from './components/HUD/HealthBar';
import { DeathReportOverlay } from './components/Overlays/DeathReportOverlay';
import { DeathReport, BiteRecord } from './types/health.types';
import { BITE_DAMAGE } from './config/health.config';

// State
const [playerHp, setPlayerHp] = useState<number>(100);
const [biteCount, setBiteCount] = useState<number>(0);
const [deathReport, setDeathReport] = useState<DeathReport | null>(null);

// Ref
const healthSystemRef = useRef<HealthSystem>(new HealthSystem());

// ใน Game Loop (ส่วนที่ยุงถึงบ้าน):
if (!isStillMoving) {
const mosquitoType = m.type;
const damage = BITE_DAMAGE[mosquitoType];

// 🆕 ใช้ HealthSystem แทน setLives แบบเดิม
const isAlive = healthSystemRef.current.takeBite(mosquitoType);
setPlayerHp(healthSystemRef.current.getHp());
setBiteCount(healthSystemRef.current.getBiteCount());

if (!isAlive) {
// สร้าง Death Report
const finalBite: BiteRecord = {
mosquitoType,
mosquitoName: MOSQUITO_CONFIGS[mosquitoType].name,
damage,
timestamp: Date.now(),
diseases: getDiseasesByMosquito(mosquitoType).map(d => d.nameTh),
};

    const report = healthSystemRef.current.generateDeathReport(finalBite, waveRef.current);
    setDeathReport(report);
    setGameOver(true);
    setFailedWave(waveRef.current);

}

mosquitoesRef.current.splice(i, 1);
soundSystemRef.current.play('hit');
continue;
}

// ใน retryWave():
const retryWave = useCallback(() => {
// ... โค้ดเดิม ...
healthSystemRef.current.reset(); // 🆕 รีเซ็ตสุขภาพ
setPlayerHp(100);
setBiteCount(0);
setDeathReport(null);
// ... โค้ดเดิม ...
}, [failedWave, addFloatingText]);

// ใน resetGame():
const resetGame = useCallback(() => {
// ... โค้ดเดิม ...
healthSystemRef.current.reset();
setPlayerHp(100);
setBiteCount(0);
setDeathReport(null);
// ... โค้ดเดิม ...
}, []);

// ใน Render (แทน GameOverOverlay เดิม):
{gameOver && deathReport && (
<DeathReportOverlay
    report={deathReport}
    failedWave={failedWave}
    onRetryWave={retryWave}
    onResetGame={resetGame}
  />
)}

// ใน Sidebar หรือใต้ TopBar:
<HealthBar
  hp={playerHp}
  maxHp={100}
  biteCount={biteCount}
  infections={healthSystemRef.current.getInfections()}
/>

🎬 ตัวอย่าง: Death Report
┌─────────────────────────────────────────────────────────┐
│ │
│ 💀 เสียชีวิต! │
│ เสียชีวิตจาก ไข้เลือดออก, มาลาเรีย │
│ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📊 รายงานการถูกยุงกัด │ │
│ │ │ │
│ │ ┌─────────┬─────────┬─────────┐ │ │
│ │ │ 12 │ 3 │ 4:32 │ │ │
│ │ │ถูกกัด │ติดเชื้อ │เวลารอด │ │ │
│ │ └─────────┴─────────┴─────────┘ │ │
│ │ │ │
│ │ 🦟 ถูกกัดโดย: │ │
│ │ ยุงลาย (Aedes) ×5 │ │
│ │ ยุงก้นปล่อง (Anopheles) ×4 │ │
│ │ ยุงรำคาญ (Culex) ×3 │ │
│ │ │ │
│ │ ❤️ โรคที่ติดเชื้อ: │ │
│ │ ไข้เลือดออก SEVERE │ │
│ │ มาลาเรีย SEVERE │ │
│ │ ชิกุนกุนยา MODERATE │ │
│ └─────────────────────────────────────────────────┘ │
│ │
│ 💀 กัดสุดท้ายโดย: ยุงก้นปล่อง (Anopheles) │
│ 🩸 นำพาโรค: มาลาเรีย │
│ │
│ [🤔 ดูรายละเอียดโรคทั้งหมด] │
│ │
│ 🛡️ ป้องกันในชีวิตจริง: │
│ ✅ กำจัดแหล่งน้ำขัง │
│ ✅ นอนในมุ้ง │
│ ✅ ใช้ยากันยุงที่มี DEET │
│ ✅ หากมีไข้สูง รีบพบแพทย์ │
│ │
│ [🔄 ลอง Wave 7 ใหม่] [เริ่มเกมใหม่] │
│ │
└─────────────────────────────────────────────────────────┘
✅ สรุป
ส่วน
ไฟล์
หน้าที่
Types
health.types.ts
โครงสร้างข้อมูล
Config
health.config.ts
ค่า HP, Damage, อาการ
System
HealthSystem.ts
Logic การถูกกัด, ติดเชื้อ
UI
HealthBar.tsx
แสดง HP, อาการ
UI
DeathReportOverlay.tsx
รายงานการตาย
App
App.tsx
เชื่อมทั้งหมด

💝 สิ่งที่เกมสื่อ
"คุณไม่ได้แค่ 'แพ้เกม'
คุณ 'เสียชีวิต' จากโรคที่มากับยุง
และนี่คือสิ่งที่จะเกิดขึ้นในชีวิตจริง
ถ้าคุณไม่ระวัง" 🦟💀🏥
เกมนี้จะทำให้ผู้เล่น "จำ" ว่ายุงอันตรายแค่ไหน เพราะเขา "ตาย" มาแล้วในเกม

🎯 สิ่งที่เกมนี้สอน (โดยไม่รู้ตัว)
┌─────────────────────────────────────────────────────────┐
│ │
│ 🧠 Logic & Problem Solving │
│ "ยุงเกราะ → ใช้ Tesla" │
│ → คิดเป็นระบบ, วิเคราะห์ปัญหา │
│ │
│ 🏥 สุขภาพ & ความรู้โรค │
│ "ยุงลายพาไข้เลือดออก" │
│ → รู้จักโรค, วิธีป้องกัน │
│ │
│ 💰 การบริหารทรัพยากร │
│ "เงิน有限 ต้องเลือกว่าจะซื้ออะไร" │
│ → วางแผน, จัดลำดับความสำคัญ │
│ │
│ ⏱️ การตัดสินใจภายใต้แรงกดดัน │
│ "ยุงมาแล้ว! ต้องทำอะไรก่อน?" │
│ → คิดเร็ว, ตัดสินใจเด็ดขาด │
│ │
│ 🌱 ความตระหนักเรื่องสิ่งแวดล้อม │
│ "น้ำขัง = แหล่งเพาะพันธุ์ยุง" │
│ → ดูแลสิ่งแวดล้อมรอบตัว │
│ │
└─────────────────────────────────────────────────────────┘
