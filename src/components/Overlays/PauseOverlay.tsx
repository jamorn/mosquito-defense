// src/components/Overlays/PauseOverlay.tsx
// ==========================================
// PauseOverlay — แสดงเมื่อเกมหยุดชั่วคราว (Pause)
// ==========================================
// 🎯 ตามที่พี่ต้องการ ระบบ Pause/Resume:
//   - โชว์กลางจอ "⏸ หยุดชั่วคราว" + ปุ่ม Resume / ปุ่มเปิดเสียง
//   - background เบลอจาง ๆ เห็นฉากเกมเบื้องหลังแต่หยุดนิ่ง
//   - mobile: เรียกใช้ touch ง่าย (ปุ่มใหญ่)
import React from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function PauseOverlay({
  onResume,
  soundEnabled,
  onToggleSound,
}: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl max-w-xs w-full mx-6">
        <div className="text-6xl">⏸️</div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-cyan-400 mb-1">
            หยุดชั่วคราว
          </h2>
          <p className="text-sm text-slate-400">
            เกมถูกพักไว้ — กด Resume เพื่อเล่นต่อ
          </p>
        </div>

        {/* ปุ่ม Resume ใหญ่ */}
        <button
          onClick={onResume}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95 text-lg"
        >
          <Play className="w-5 h-5 fill-current" />
          เล่นต่อ (Resume)
        </button>

        {/* ปุ่มเสียง */}
        <button
          onClick={onToggleSound}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition active:scale-95"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-400" /> ปิดเสียง
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" /> เปิดเสียง
            </>
          )}
        </button>
      </div>
    </div>
  );
}
