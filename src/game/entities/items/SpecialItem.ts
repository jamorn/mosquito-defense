import { ItemType } from '../../../types/game.types';
import { Mosquito } from '../mosquitoes/Mosquito';
import { SoundSystem } from '../../engine/SoundSystem';

export abstract class SpecialItem {
  public type: ItemType;
  public name: string;
  public cost: number;
  public cooldown: number;
  public lastUsedTime: number = 0;

  constructor(type: ItemType, name: string, cost: number, cooldown: number) {
    this.type = type;
    this.name = name;
    this.cost = cost;
    this.cooldown = cooldown;
  }

  public canUse(coins: number, now: number): boolean {
    const isCooldownOff = (now - this.lastUsedTime) >= this.cooldown * 1000;
    return coins >= this.cost && isCooldownOff;
  }

  public getRemainingCooldown(now: number): number {
    const elapsed = (now - this.lastUsedTime) / 1000;
    return Math.max(0, Math.ceil(this.cooldown - elapsed));
  }

  abstract execute(
    mosquitoes: Mosquito[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    setLives: React.Dispatch<React.SetStateAction<number>>,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void;

  public toJSON() {
    return { type: this.type, lastUsedTime: this.lastUsedTime };
  }
}