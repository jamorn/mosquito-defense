// src/game/entities/mosquitoes/Boss/BossMosquito.ts
import { Mosquito } from "./Mosquito";
import { MOSQUITO_CONFIGS } from "../../../config/mosquitoes.config";

export class BossMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.BOSS;
    const hp = Mosquito.calcHp(config.baseHp, config.hpPerWave, wave);
    const speed = config.speed + Math.random() * 0.1;
    super(x, y, "BOSS", hp, speed, config.reward, config.size, config.color);
    this.bossDamage = config.bossDamage || 5;
  }
}
