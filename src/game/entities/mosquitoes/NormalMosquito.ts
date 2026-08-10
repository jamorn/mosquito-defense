// src/game/entities/mosquitoes/Normal/NormalMosquito.ts
import { Mosquito } from './Mosquito';
import { MOSQUITO_CONFIGS } from '../../../config/mosquitoes.config';

export class NormalMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.NORMAL;
    const hp = config.baseHp + wave * config.hpPerWave;
    const speed = config.speed + Math.random() * 0.3;
    super(x, y, 'NORMAL', hp, speed, config.reward, config.size, config.color);
  }
}