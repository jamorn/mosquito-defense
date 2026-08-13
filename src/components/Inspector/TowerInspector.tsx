// src/components/Inspector/TowerInspector.tsx
import React from "react";
import { TOWER_CONFIGS } from "../../config/towers.config";
import { BaseTower } from "../../game/entities/towers/BaseTower";
import { ArrowUp, X, Coins, Trash2 } from "lucide-react";

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
    return null;
  }

  const getUpgradeCost = () => selectedTowerInstance.getUpgradeCost();
  const canUpgrade = coins >= getUpgradeCost();
  const canUpgradeMore = selectedTowerInstance.level < 3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {TOWER_CONFIGS[selectedTowerInstance.type].icon}
            </span>
            <div>
              <div className="font-black text-slate-100 text-lg leading-tight">
                {TOWER_CONFIGS[selectedTowerInstance.type].name}
              </div>
              <div className="text-xs text-cyan-400 font-semibold">
                ⭐ ระดับ {selectedTowerInstance.level}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-800/70 rounded-xl py-3">
            <div className="text-[10px] text-slate-400 font-semibold">
              ระยะยิง
            </div>
            <div className="text-lg font-black text-emerald-400">
              {selectedTowerInstance.getRange()}
            </div>
          </div>
          <div className="bg-slate-800/70 rounded-xl py-3">
            <div className="text-[10px] text-slate-400 font-semibold">
              พลังโจมตี
            </div>
            <div className="text-lg font-black text-red-400">
              {Math.round(selectedTowerInstance.getDamage())}
            </div>
          </div>
          <div className="bg-slate-800/70 rounded-xl py-3">
            <div className="text-[10px] text-slate-400 font-semibold">
              ความเสียหาย
            </div>
            <div className="text-lg font-black text-amber-400">
              {selectedTowerInstance.level}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          {canUpgradeMore ? (
            <button
              onClick={onUpgrade}
              disabled={!canUpgrade}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <ArrowUp className="w-5 h-5" />
              อัปเกรด
              <span className="flex items-center gap-1 text-sm font-bold">
                <Coins className="w-4 h-4" /> {getUpgradeCost()}
              </span>
            </button>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-3.5 bg-slate-800/70 rounded-xl text-emerald-400 font-black">
              ⭐ ระดับสูงสุดแล้ว
            </div>
          )}

          <button
            onClick={onSell}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-black rounded-xl border border-red-500/30 transition active:scale-95"
          >
            <Trash2 className="w-5 h-5" />
            ขาย
          </button>
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          เคาะที่พื้นว่างเพื่อปิด หรือแตะป้อมอื่นเพื่อดูข้อมูล
        </div>
      </div>
    </div>
  );
}
