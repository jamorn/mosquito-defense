// src/game/entities/mosquitoes/Speedy/SpeedyMosquito.ts
import { Mosquito } from "./Mosquito";
import { MOSQUITO_CONFIGS } from "../../../config/mosquitoes.config";

export class SpeedyMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.SPEEDY;
    const hp = Mosquito.calcHp(config.baseHp, config.hpPerWave, wave);
    const speed = config.speed + Math.random() * 0.3;
    super(x, y, "SPEEDY", hp, speed, config.reward, config.size, config.color);
  }
}
