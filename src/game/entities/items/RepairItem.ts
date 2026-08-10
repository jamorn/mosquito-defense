// src/game/entities/items/RepairItem
import { SpecialItem } from './SpecialItem';
import { Mosquito } from '../mosquitoes/Mosquito';
import { SoundSystem } from '../../engine/SoundSystem';

export class RepairItem extends SpecialItem {
  constructor() {
    super('REPAIR', 'ซ่อมแซมบ้าน', 120, 15);
  }

  public execute(
    _mosquitoes: Mosquito[],
    _addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    setLives: React.Dispatch<React.SetStateAction<number>>,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void {
    setLives(prev => prev + 5);
    if (addFloatingText) addFloatingText(750, 480, '+5 HP', '#22c55e');
    soundSystem.play('heal');
  }
}