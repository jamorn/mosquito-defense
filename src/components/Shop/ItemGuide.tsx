// src/components/Shop/ItemGuide.tsx
import React from 'react';
import { ITEM_CONFIGS } from '../../config/items.config';
import { ItemType } from '../../types/game.types';

export function ItemGuide() {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        ✨ สกิลช่วยเหลือพิเศษ
      </h2>
      <div className="space-y-2 text-xs">
        {(Object.keys(ITEM_CONFIGS) as ItemType[]).map(type => (
          <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">{ITEM_CONFIGS[type].icon}</span>
              <div>
                <div className="font-bold text-slate-200">{ITEM_CONFIGS[type].name}</div>
                <div className="text-[10px] text-slate-400">{ITEM_CONFIGS[type].description}</div>
              </div>
            </div>
            <div className="text-yellow-400 font-bold">🪙 {ITEM_CONFIGS[type].cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}