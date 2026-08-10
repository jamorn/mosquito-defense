// src/game/entities/mosquitoes/Tank/TankMosquito.ts
import { Mosquito } from './Mosquito';
import { MOSQUITO_CONFIGS } from '../../../config/mosquitoes.config';

export class TankMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.TANK;
    const hp = config.baseHp + wave * config.hpPerWave;
    const speed = config.speed + Math.random() * 0.2;
    super(x, y, 'TANK', hp, speed, config.reward, config.size, config.color);
  }
}