// src/game/entities/items/BombItem
import { SpecialItem } from './SpecialItem';
import { Mosquito } from '../mosquitoes/Mosquito';
import { SoundSystem } from '../../engine/SoundSystem';

export class BombItem extends SpecialItem {
  constructor() {
    super('BOMB', 'ระเบิดยากันยุง', 100, 10);
  }

  public execute(
    mosquitoes: Mosquito[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    _setLives: React.Dispatch<React.SetStateAction<number>>,
    addFloatingText?: (x: number, y: number, text: string, color: string) => void
  ): void {
    mosquitoes.forEach(m => {
      m.takeDamage(200);
      addParticles(m.x, m.y, '#ef4444', 15);
      if (addFloatingText) addFloatingText(m.x, m.y - 15, '-200', '#ef4444');
    });
    for (let x = 100; x <= 700; x += 150) {
      for (let y = 100; y <= 500; y += 150) {
        addParticles(x, y, '#f59e0b', 8);
      }
    }
    soundSystem.play('bomb');
  }
}