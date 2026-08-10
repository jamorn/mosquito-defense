// src/game/entities/items/Freeze
import { SpecialItem } from './SpecialItem';
import { Mosquito } from '../mosquitoes/Mosquito';
import { SoundSystem } from '../../engine/SoundSystem';

export class FreezeItem extends SpecialItem {
  constructor() {
    super('FREEZE', 'สเปรย์แช่แข็ง', 80, 12);
  }

  public execute(
    mosquitoes: Mosquito[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    _setLives: React.Dispatch<React.SetStateAction<number>>,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void {
    mosquitoes.forEach(m => {
      m.applyFreeze(4000);
      addParticles(m.x, m.y, '#38bdf8', 10);
      if (addFloatingText) addFloatingText(m.x, m.y - 15, 'FROZEN!', '#38bdf8');
    });
    soundSystem.play('freeze');
  }
}