// src/game/entities/towers/ElectricTower.ts
import { BaseTower } from "./BaseTower";
import { TOWER_CONFIGS } from "../../../config/towers.config";
import { Mosquito } from "../mosquitoes/Mosquito";
import { LaserBeam } from "../../../types/game.types";
import { SoundSystem } from "../../engine/SoundSystem";

export class ElectricTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, "SWAT_ELECTRIC", TOWER_CONFIGS.SWAT_ELECTRIC);
  }

  /**
   * รูปร่าง: ไม้ช็อตยุงไฟฟ้า (กระบอกทรงยาว)
   *   - ตัวกระบอกแนวนอน
   *   - ปลายหัวแฉกโลหะ (⚡)
   *   - ต่อกับขั้วจับ (ด้านหลัง)
   */
  protected drawBody(ctx: CanvasRenderingContext2D): void {
    const x = this.x;
    const y = this.y;

    // ตัวกระบอกแนวนอน (กลาง)
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 5, 28, 10, 4);
    ctx.fill();

    // ขั้วจับ (ด้านหลัง, เล็กกว่าตรง)
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(x - 16, y - 3, 6, 6, 2);
    ctx.fill();

    // หัวแฉกโลหะที่ปลาย (ด้านหน้า)
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 3;
    // แฉกบน
    ctx.beginPath();
    ctx.moveTo(x + 14, y);
    ctx.lineTo(x + 20, y - 6);
    ctx.moveTo(x + 14, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x + 14, y);
    ctx.lineTo(x + 20, y + 6);
    ctx.stroke();

    // ปุ่ม/จุดเตือนตรงกลาง
    ctx.fillStyle = "#e0f2fe";
    ctx.beginPath();
    ctx.arc(x - 7, y, 2, 0, Math.PI * 2);
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
      target.takeDamage(dmg);
      lasers.push({
        startX: this.x,
        startY: this.y,
        endX: target.x,
        endY: target.y,
        color: this.config.glowColor,
        alpha: 1,
        width: 2,
      });
      addParticles(target.x, target.y, this.config.glowColor, 5);
      if (addFloatingText)
        addFloatingText(target.x, target.y - 15, `-${dmg}`, "#ef4444");
      soundSystem.play("zap");
    }
  }
}
