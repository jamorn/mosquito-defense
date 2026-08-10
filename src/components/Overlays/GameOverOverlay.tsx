// src/components/Overlays/GameOverOverlay.ts
import React from 'react';
import { RotateCcw, Play } from 'lucide-react';
import { getWaveHint } from '../../config/waves.config';

interface GameOverOverlayProps {
  failedWave: number | null;
  onRetryWave: () => void;
  onResetGame: () => void;
}

export function GameOverOverlay({ failedWave, onRetryWave, onResetGame }: GameOverOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-5xl font-black text-red-500 mb-2 tracking-wider">GAME OVER!</h2>
      
      {/* Show failed wave info */}
      {failedWave && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-4 max-w-md">
          <div className="text-red-400 font-bold mb-1">
            💀 แพ้ที่ Wave {failedWave}
          </div>
          <div className="text-slate-300 text-sm">
            {getWaveHint(failedWave)}
          </div>
        </div>
      )}
      
      <p className="text-slate-300 text-lg mb-6">ยุงบุกรุกเข้าบ้านสำเร็จ! ลองปรับกลยุทธ์แล้วสู้ใหม่อีกครั้ง</p>
      
      {/* Retry Wave Button - Primary */}
      <button
        onClick={onRetryWave}
        className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg transition mb-3 transform active:scale-95"
      >
        <RotateCcw className="w-6 h-6" /> 
        🔄 ลอง Wave {failedWave} ใหม่
      </button>
      
      {/* Start New Game Button - Secondary */}
      <button
        onClick={onResetGame}
        className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg transition text-sm"
      >
        <Play className="w-4 h-4" /> 
        เริ่มเกมใหม่ (Wave 1)
      </button>
    </div>
  );
}