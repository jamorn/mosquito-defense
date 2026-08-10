import React from 'react';
import { TOWER_CONFIGS } from '../../config/towers.config';
import { TowerType } from '../../types/game.types';
import { BaseTower } from '../../game/entities/towers/BaseTower';

interface TowerShopProps {
  selectedTowerType: TowerType | null;
  selectedTowerInstance: BaseTower | null;
  coins: number;
  onSelectTower: (type: TowerType) => void;
}

export function TowerShop({
  selectedTowerType,
  selectedTowerInstance,
  coins,
  onSelectTower,
}: TowerShopProps) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        🛒 ร้านค้าป้อมปืน
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {(Object.keys(TOWER_CONFIGS) as TowerType[]).map(key => {
          const config = TOWER_CONFIGS[key];
          const isSelected = selectedTowerType === key && !selectedTowerInstance;
          const canAfford = coins >= config.cost;

          return (
            <button
              key={key}
              onClick={() => onSelectTower(key)}
              className={`flex items-center justify-between p-3 rounded-xl border transition text-left ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/20'
                  : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
              } ${!canAfford ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-slate-800">
                  {config.icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100">{config.name}</div>
                  <div className="text-xs text-slate-400">{config.description}</div>
                </div>
              </div>
              <div className="font-extrabold text-yellow-400 text-sm whitespace-nowrap pl-2">
                🪙 {config.cost}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}