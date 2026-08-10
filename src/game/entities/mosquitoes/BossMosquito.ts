// src/game/entities/mosquitoes/Boss/B
import { Mosquito } from './Mosquito';
import { MOSQUITO_CONFIGS } from '../../../config/mosquitoes.config';

export class BossMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.BOSS;
    const hp = config.baseHp + wave * config.hpPerWave;
    const speed = config.speed + Math.random() * 0.1;
    super(x, y, 'BOSS', hp, speed, config.reward, config.size, config.color);
    this.bossDamage = config.bossDamage || 5;
  }
}