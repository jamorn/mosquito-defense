// src/components/Inspector/TowerInspector.tsx
import React from 'react';
import { TOWER_CONFIGS } from '../../config/towers.config';
import { BaseTower } from '../../game/entities/towers/BaseTower';

interface TowerInspectorProps {
  selectedTowerInstance: BaseTower | null;
  coins: number;
  onUpgrade: () => void;
  onSell: () => void;
  onClose: () => void;
}

export function TowerInspector({
  selectedTowerInstance,
  coins,
  onUpgrade,
  onSell,
  onClose,
}: TowerInspectorProps) {
  if (!selectedTowerInstance) {
    return (
      <div className="p-4 bg-slate-800/30 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
        คลิกป้อมบนแผนที่เพื่อดูข้อมูล หรืออัปเกรด
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-200">
          {TOWER_CONFIGS[selectedTowerInstance.type].name} (Lv.{selectedTowerInstance.level})
        </span>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          ✕ ปิด
        </button>
      </div>

      <div className="text-xs text-slate-300 space-y-1">
        <div>🎯 ระยะยิง: {selectedTowerInstance.getRange()}</div>
        <div>⚡ พลังโจมตี: {Math.round(selectedTowerInstance.getDamage())}</div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onUpgrade}
          disabled={coins < selectedTowerInstance.getUpgradeCost()}
          className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg transition"
        >
          อัปเกรด (🪙 {selectedTowerInstance.getUpgradeCost()})
        </button>
        <button
          onClick={onSell}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs rounded-lg transition border border-red-500/30"
        >
          ขาย
        </button>
      </div>
    </div>
  );
}