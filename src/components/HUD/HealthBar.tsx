// src/components/HUD/HealthBar.tsx
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
  const percentage = Math.max(0, (hp / maxHp) * 100);
  const symptoms = HEALTH_SYMPTOMS[healthInfo.status];

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart 
            className={`w-5 h-5 ${
              hp > 50 ? 'text-green-400' : 
              hp > 25 ? 'text-amber-400' : 
              'text-red-400 animate-pulse'
            }`} 
          />
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