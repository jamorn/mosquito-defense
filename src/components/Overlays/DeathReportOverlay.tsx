// ==========================================
// Death Report - รายงานการเสียชีวิต
// ==========================================
import React, { useState } from 'react';
import { RotateCcw, Play, Skull, Bug, FileText, HeartPulse } from 'lucide-react';
import { DeathReport } from '../../types/health.types';
import { MOSQUITO_CONFIGS } from '../../config/mosquitoes.config';
import { MosquitoType } from '../../types/game.types';

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
        {/* Header */}
        <div className="text-center mb-4">
          <Skull className="w-14 h-14 text-red-500 mx-auto mb-2 animate-pulse" />
          <h2 className="text-3xl font-black text-red-500 mb-1">เสียชีวิต!</h2>
          <p className="text-slate-400 text-sm">{report.causeOfDeath}</p>
        </div>

        {/* Statistics Card */}
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
              const config = MOSQUITO_CONFIGS[type as MosquitoType];
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

        {/* Details Toggle */}
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
            {report.infections.length > 0 ? (
              report.infections.map(inf => (
                <div key={inf.diseaseId} className="mb-2 pb-2 border-b border-slate-700 last:border-0">
                  <div className="font-bold text-white">{inf.diseaseName}</div>
                  <div className="text-slate-400">
                    ติดเชื้อจาก: {MOSQUITO_CONFIGS[inf.infectedBy]?.name || 'ไม่ทราบ'}
                  </div>
                  <div className="text-slate-400">
                    ความรุนแรง: <span className="text-red-400">{inf.severity}</span>
                  </div>
                </div>
              ))
            ) : (
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