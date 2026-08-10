// src/game/entities/mosquitoes/M
import { Mosquito } from './Mosquito';
import { NormalMosquito } from './NormalMosquito';
import { SpeedyMosquito } from './SpeedyMosquito';
import { TankMosquito } from './TankMosquito';
import { BossMosquito } from './BossMosquito';
import { ArmoredMosquito } from './ArmoredMosquito';
import { StealthMosquito } from './StealthMosquito';
import { SplitterMosquito } from './SplitterMosquito';
import { MosquitoType } from '../../../types/game.types';

export class MosquitoFactory {
  public static create(
    type: MosquitoType,
    x: number,
    y: number,
    wave: number
  ): Mosquito {
    switch (type) {
      case 'NORMAL':
        return new NormalMosquito(x, y, wave);
      case 'SPEEDY':
        return new SpeedyMosquito(x, y, wave);
      case 'TANK':
        return new TankMosquito(x, y, wave);
      case 'BOSS':
        return new BossMosquito(x, y, wave);
      case 'ARMORED':
        return new ArmoredMosquito(x, y, wave);
      case 'STEALTH':
        return new StealthMosquito(x, y, wave);
      case 'SPLITTER':
        return new SplitterMosquito(x, y, wave);
      default:
        return new NormalMosquito(x, y, wave);
    }
  }
}