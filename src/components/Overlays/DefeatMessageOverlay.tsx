// src/components/HUD/Overlays/DefeatMessage/DefeatMessageOverlay.tsx
// ==========================================
// Defeat Message - ข้อความให้กำลังใจตอนแพ้
// ==========================================
import React from 'react';
import { DefeatMessage } from '../../config/defeat-messages.config';

interface DefeatMessageOverlayProps {
  message: DefeatMessage;
}

export function DefeatMessageOverlay({ message }: DefeatMessageOverlayProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-amber-500/30 rounded-2xl p-6 max-w-md mx-auto shadow-2xl">
      {/* Emoji + Encouragement */}
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{message.emoji}</div>
        <p className="text-slate-200 font-bold text-lg leading-relaxed">
          {message.encouragement}
        </p>
      </div>

      {/* Tips */}
      <div className="bg-slate-950/50 rounded-xl p-4 space-y-3">
        <div className="text-amber-400 font-bold text-sm text-center mb-3">
          🛡️ วิธีปกป้องครอบครัวจากยุง
        </div>
        {message.tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 text-slate-300 text-sm"
          >
            <span className="text-lg">{tip.split(' ')[0]}</span>
            <span className="flex-1">{tip.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      <div className="text-center mt-4 text-xs text-slate-500 italic">
        "แพ้ในเกมได้ แต่ชนะในชีวิตจริง" 💪
      </div>
    </div>
  );
}