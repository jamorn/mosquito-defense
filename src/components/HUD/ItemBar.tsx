// src/components/HUD/ItemBar.tsx
import React from 'react';
import { ITEM_CONFIGS } from '../../config/items.config';
import { ItemType } from '../../types/game.types';
import { SpecialItem } from '../../game/entities/items/SpecialItem';

interface ItemBarProps {
  items: Record<ItemType, SpecialItem>;
  coins: number;
  currentTime: number;
  gameOver: boolean;
  gameWon: boolean;
  onUseItem: (type: ItemType) => void;
}

export function ItemBar({
  items,
  coins,
  currentTime,
  gameOver,
  gameWon,
  onUseItem,
}: ItemBarProps) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700 shadow-2xl">
      {(Object.keys(ITEM_CONFIGS) as ItemType[]).map(type => {
        const item = items[type];
        const remCooldown = item.getRemainingCooldown(currentTime);
        const canAfford = coins >= item.cost;
        const isReady = remCooldown === 0 && canAfford && !gameOver && !gameWon;

        return (
          <button
            key={type}
            onClick={() => onUseItem(type)}
            disabled={!isReady}
            className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-lg border transition ${
              isReady
                ? 'bg-slate-800 hover:bg-slate-700 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/80 border-slate-800 opacity-50 cursor-not-allowed'
            }`}
            title={`${item.name} - 🪙 ${item.cost}`}
          >
            <span className="text-xl mb-0.5">{ITEM_CONFIGS[type].icon}</span>
            <span className="text-[10px] font-bold text-yellow-400">🪙 {item.cost}</span>

            {remCooldown > 0 && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-lg flex items-center justify-center font-black text-sm text-cyan-400">
                {remCooldown}s
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}