// src/game/entities/mosquitoes/Splitter/SplitterMosquito.ts
import { Mosquito } from './Mosquito';
import { MOSQUITO_CONFIGS } from '../../../config/mosquitoes.config';

export class SplitterMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.SPLITTER;
    const hp = config.baseHp + wave * config.hpPerWave;
    const speed = config.speed + Math.random() * 0.2;
    super(x, y, 'SPLITTER', hp, speed, config.reward, config.size, config.color);
    this.canSplit = true;
  }
}