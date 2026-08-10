// src/components/HUD/WaveIndicator.tsx
import React from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import { WavePattern } from '../../config/waves.config';

interface WaveIndicatorProps {
  pattern: WavePattern | null;
  isWaveActive: boolean;
}

export function WaveIndicator({ pattern, isWaveActive }: WaveIndicatorProps) {
  if (!pattern || !isWaveActive) return null;
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/50 rounded-xl px-4 py-2 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <span className="font-black text-amber-400 text-sm">{pattern.name}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <Lightbulb className="w-3 h-3 text-cyan-400" />
        <span>{pattern.hint}</span>
      </div>
    </div>
  );
}