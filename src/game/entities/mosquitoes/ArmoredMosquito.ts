// src/game/entities/mosquitoes/Armored/ArmoredMosquito.ts
import { Mosquito } from "./Mosquito";
import { MOSQUITO_CONFIGS } from "../../../config/mosquitoes.config";

export class ArmoredMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.ARMORED;
    const hp = Mosquito.calcHp(config.baseHp, config.hpPerWave, wave);
    const speed = config.speed + Math.random() * 0.2;
    super(x, y, "ARMORED", hp, speed, config.reward, config.size, config.color);
    this.armor = config.armor || 30;
  }
}
