// src/game/entities/towers/TowerFactory.ts
import { BaseTower } from './BaseTower';
import { ElectricTower } from './ElectricTower';
import { SprayTower } from './SprayTower';
import { UVTrapTower } from './UVTrapTower';
import { TeslaTower } from './TeslaTower';
import { TowerType } from '../../../types/game.types';

export class TowerFactory {
  public static createTower(type: TowerType, x: number, y: number): BaseTower {
    switch (type) {
      case 'SWAT_ELECTRIC':
        return new ElectricTower(x, y);
      case 'SPRAY_SLOW':
        return new SprayTower(x, y);
      case 'UV_TRAP':
        return new UVTrapTower(x, y);
      case 'TESLA_COIL':
        return new TeslaTower(x, y);
      default:
        return new ElectricTower(x, y);
    }
  }
}