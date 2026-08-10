// src/components/Overlays/VictoryOverlay
import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

interface VictoryOverlayProps {
  onResetGame: () => void;
}

export function VictoryOverlay({ onResetGame }: VictoryOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <Sparkles className="w-16 h-16 text-yellow-400 animate-bounce mb-3" />
      <h2 className="text-5xl font-black text-yellow-400 mb-2">VICTORY!</h2>
      <p className="text-slate-200 text-lg mb-6">คุณปราบยุงร้ายได้สำเร็จ ปลอดภัยไร้ไข้เลือดออก!</p>
      <button
        onClick={onResetGame}
        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
      >
        <RotateCcw className="w-5 h-5" /> เล่นใหม่อีกครั้ง
      </button>
    </div>
  );
}