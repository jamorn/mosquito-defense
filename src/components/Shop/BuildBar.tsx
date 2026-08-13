import { TOWER_CONFIGS } from "../../config/towers.config";
import { TowerType } from "../../types/game.types";

interface BuildBarProps {
  selectedTowerType: TowerType | null;
  selectedTowerInstance: { id: string } | null; // มีป้อมที่ถูกเลือกอยู่
  coins: number;
  onSelectTower: (type: TowerType) => void;
  /** แนวจัดเรียง: "col" (PC ขวา) / "row" (มือถือแถวล่าง) */
  direction?: "col" | "row";
}

export function BuildBar({
  selectedTowerType,
  selectedTowerInstance,
  coins,
  onSelectTower,
  direction = "col",
}: BuildBarProps) {
  const towerKeys = Object.keys(TOWER_CONFIGS) as TowerType[];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
        🏗️ Build
      </div>

      <div
        className={`flex gap-2 select-none ${
          direction === "col" ? "flex-col" : "flex-row"
        }`}
      >
        {towerKeys.map((key) => {
          const config = TOWER_CONFIGS[key];
          const isSelected =
            selectedTowerType === key && !selectedTowerInstance;
          const canAfford = coins >= config.cost;

          return (
            <button
              key={key}
              onClick={() => onSelectTower(key)}
              aria-label={config.name}
              title={`${config.name} 🪙${config.cost}`}
              className={`relative w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all ${
                isSelected
                  ? "border-cyan-400 bg-cyan-950/60 scale-105 ring-2 ring-cyan-500/30"
                  : "border-slate-700 bg-slate-800/70 hover:border-slate-500"
              } ${!canAfford ? "opacity-40 grayscale" : ""}`}
            >
              {/* ไอคอนป้อม */}
              <span className="text-2xl leading-none drop-shadow">
                {config.icon}
              </span>
              {/* ราคา */}
              <span
                className={`text-[9px] font-bold leading-none ${
                  canAfford ? "text-yellow-400" : "text-slate-500"
                }`}
              >
                🪙{config.cost}
              </span>

              {/* มุมขีด "ไปปุ่ม" แค่ visual */}
              {!canAfford && (
                <span className="absolute inset-0 rounded-xl bg-slate-950/30 flex items-center justify-center text-slate-400">
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
