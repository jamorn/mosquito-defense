// src/game/entities/mosquitoes/Splitter/SplitterMosquito.ts
import { Mosquito } from "./Mosquito";
import { MOSQUITO_CONFIGS } from "../../../config/mosquitoes.config";

export class SplitterMosquito extends Mosquito {
  constructor(x: number, y: number, wave: number) {
    const config = MOSQUITO_CONFIGS.SPLITTER;
    const hp = Mosquito.calcHp(config.baseHp, config.hpPerWave, wave);
    const speed = config.speed + Math.random() * 0.2;
    super(
      x,
      y,
      "SPLITTER",
      hp,
      speed,
      config.reward,
      config.size,
      config.color,
    );
    this.canSplit = true;
  }
}
