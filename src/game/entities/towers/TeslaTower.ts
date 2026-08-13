// src/game/entities/towers/TeslaTower
import { BaseTower } from "./BaseTower";
import { TOWER_CONFIGS } from "../../../config/towers.config";
import { Mosquito } from "../mosquitoes/Mosquito";
import { LaserBeam } from "../../../types/game.types";
import { SoundSystem } from "../../engine/SoundSystem";

export class TeslaTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, "TESLA_COIL", TOWER_CONFIGS.TESLA_COIL);
  }

  /**
   * รูปร่าง: คอยล์สายฟ้า (ขดลวดวงแหวนซ้อนทับกัน)
   *   - เสากลาง
   *   - ขดลวด 3 ขด รอบเสา
   *   - ยอดปลายสะสมประจุ (จุดไฟท้ายสุด)
   */
  protected drawBody(ctx: CanvasRenderingContext2D): void {
    const x = this.x;
    const y = this.y;

    // เสากลาง
    ctx.fillStyle = "#78350f";
    ctx.fillRect(x - 2, y - 12, 4, 24);

    // ขดลวด 3 ขด (โค้งรอบ)
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const cy = y - 7 + i * 7; // ขดบนลงล่าง
      ctx.beginPath();
      ctx.ellipse(x, cy, 13, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // ยอดปลายสะสมประจุ (จุดสว่าง)
    ctx.fillStyle = "#fef3c7";
    ctx.shadowColor = "#fbbf24";
    ctx.beginPath();
    ctx.arc(x, y - 13, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "rgba(0,0,0,0)";

    // แกนกลางขด (จุดลึกยืน)
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.ellipse(x, y, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  public updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    lasers: LaserBeam[],
    addParticles: (x: number, y: number, color: string, count: number) => void,
    soundSystem: SoundSystem,
    addFloatingText?: (
      x: number,
      y: number,
      text: string,
      color: string,
    ) => void,
  ): void {
    if (now - this.lastFired < this.getFireInterval()) return;

    const target = this.getFirstTarget(mosquitoes);
    if (target) {
      this.lastFired = now;
      const dmg = Math.round(this.getDamage());

      // Tesla has armor piercing - full damage to armored
      let actualDmg = dmg;
      if (target.armor > 0) {
        actualDmg = Math.round(dmg * 1.5); // Bonus vs armored
      }

      target.takeDamage(actualDmg);
      lasers.push({
        startX: this.x,
        startY: this.y,
        endX: target.x,
        endY: target.y,
        color: this.config.glowColor,
        alpha: 1,
        width: 4,
      });
      addParticles(target.x, target.y, this.config.glowColor, 8);
      if (addFloatingText)
        addFloatingText(target.x, target.y - 15, `-${actualDmg}`, "#ef4444");
      soundSystem.play("zap");
    }
  }
}
