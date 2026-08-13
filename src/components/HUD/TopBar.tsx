// src/components/HUD/TopBar.tsx
import React from "react";
import {
  Shield,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Save,
  FolderOpen,
  HelpCircle,
} from "lucide-react";

interface TopBarProps {
  coins: number;
  lives: number;
  wave: number;
  enemiesRemaining: number;
  isWaveActive: boolean;
  gameOver: boolean;
  gameWon: boolean;
  soundEnabled: boolean;
  isPaused: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onStartWave: () => void;
  onSave: () => void;
  onLoad: () => void;
  onShowHelp: () => void;
}

export function TopBar({
  coins,
  lives,
  wave,
  enemiesRemaining,
  isWaveActive,
  gameOver,
  gameWon,
  soundEnabled,
  isPaused,
  onToggleSound,
  onTogglePause,
  onStartWave,
  onSave,
  onLoad,
  onShowHelp,
}: TopBarProps) {
  return (
    <div className="w-full max-w-[800px] flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl mb-3 shadow-lg flex-wrap gap-3">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-yellow-400 font-extrabold text-lg sm:text-xl">
          <span>🪙</span>
          <span>{coins}</span>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-extrabold text-lg sm:text-xl">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 fill-red-500/20" />
          <span>{lives} HP</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-base sm:text-lg">
          <span>🌊 Wave {wave} / 10</span>
        </div>
        {isWaveActive && (
          <div className="flex items-center gap-1.5 text-purple-400 font-bold text-sm sm:text-base animate-pulse">
            <span>🦟 {enemiesRemaining}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onShowHelp}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
          title="วิธีเล่น (How to Play)"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
        </button>
        <button
          onClick={onSave}
          disabled={isWaveActive || gameOver || gameWon}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition disabled:opacity-30"
          title="บันทึกเกม (Save)"
        >
          <Save className="w-4 h-4 text-emerald-400" />
        </button>
        <button
          onClick={onLoad}
          disabled={isWaveActive || gameOver || gameWon}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition disabled:opacity-30"
          title="โหลดเกม (Load)"
        >
          <FolderOpen className="w-4 h-4 text-cyan-400" />
        </button>
        <button
          onClick={onToggleSound}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
          title="เปิด/ปิด เสียง"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* ⏸️ Pause / Resume */}
        <button
          onClick={onTogglePause}
          disabled={gameOver || gameWon}
          className={`p-2 rounded-lg transition ${
            isPaused
              ? "bg-amber-500 text-slate-950"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
          } disabled:opacity-30`}
          title={isPaused ? "เล่นต่อ (Resume)" : "หยุดชั่วคราว (Pause)"}
        >
          {isPaused ? (
            <Play className="w-4 h-4 fill-current" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onStartWave}
          disabled={isWaveActive || gameOver || gameWon || isPaused}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold shadow-lg transition transform active:scale-95 text-sm sm:text-base ${
            isWaveActive
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : isPaused
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
          }`}
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          <span>{isWaveActive ? "กำลังป้องกัน..." : "ปล่อยยุง (Start)"}</span>
        </button>
      </div>
    </div>
  );
}
