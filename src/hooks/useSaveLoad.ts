// src/hooks/useSaveLoad.ts
import { useCallback } from 'react';
import { SaveLoadSystem } from '../game/systems/SaveLoadSystem';
import { BaseTower } from '../game/entities/towers/BaseTower';
import { SpecialItem } from '../game/entities/items/SpecialItem';
import { ItemType } from '../types/game.types';

export function useSaveLoad() {
  const save = useCallback((
    coins: number,
    lives: number,
    wave: number,
    towers: BaseTower[],
    items: Record<ItemType, SpecialItem>
  ): boolean => {
    return SaveLoadSystem.save(coins, lives, wave, towers, items);
  }, []);
  
  const load = useCallback(() => {
    return SaveLoadSystem.load();
  }, []);
  
  const clear = useCallback(() => {
    SaveLoadSystem.clear();
  }, []);
  
  const hasSave = useCallback(() => {
    return SaveLoadSystem.hasSave();
  }, []);
  
  return { save, load, clear, hasSave };
}