// src/game/entities/mosquitoes/stealthMosquito.ts
import { Mosquito } from './Mosquito';
import { MOSQUITO_CONFIGS } from '../../../config/mosquitoes.config';

export class StealthMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.STEALTH;
    const hp = config.baseHp + wave * config.hpPerWave;
    const speed = config.speed + Math.random() * 0.2;
    super(x, y, 'STEALTH', hp, speed, config.reward, config.size, config.color);
    this.isStealthed = true;
  }
}