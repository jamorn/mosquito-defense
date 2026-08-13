// src/game/entities/towers/UVT
import { BaseTower } from "./BaseTower";
import { TOWER_CONFIGS } from "../../../config/towers.config";
import { Mosquito } from "../mosquitoes/Mosquito";
import { LaserBeam } from "../../../types/game.types";
import { SoundSystem } from "../../engine/SoundSystem";

export class UVTrapTower extends BaseTower {
  constructor(x: number, y: number) {
    super(x, y, "UV_TRAP", TOWER_CONFIGS.UV_TRAP);
  }

  /**
   * รูปร่าง: ตะเกียงดักยุง UV
   *   - แสงฟุ้งสีม่วงรอบตัว (glow หมู่)
   *   - หลอด UV ทรงสูงตรงกลาง
   *   - ฐานรองรับ
   */
  protected drawBody(ctx: CanvasRenderingContext2D): void {
    const x = this.x;
    const y = this.y;

    // แสงฟุ้งม่วงรอบตัว (lure)
    const glow = ctx.createRadialGradient(x, y, 4, x, y, 20);
    glow.addColorStop(0, "rgba(192, 132, 252, 0.5)");
    glow.addColorStop(1, "rgba(192, 132, 252, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // หลอด UV ทรงสูง (กลาง)
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 12, 8, 22, 3);
    ctx.fill();

    // เส้นสว่างแนวหลอด
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 9);
    ctx.lineTo(x, y + 9);
    ctx.stroke();

    // ฐานรอง
    ctx.fillStyle = "#3b0764";
    ctx.beginPath();
    ctx.roundRect(x - 10, y + 11, 20, 4, 2);
    ctx.fill();
  }

  public updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    lasers: LaserBeam[],
    _addParticles: (x: number, y: number, color: string, count: number) => void,
    _soundSystem: SoundSystem,
    _addFloatingText?: (
      x: number,
      y: number,
      text: string,
      color: string,
    ) => void,
  ): void {
    if (now - this.lastFired < this.getFireInterval()) return;

    // UV Trap can target stealthed mosquitoes
    const targets = mosquitoes.filter((m) => {
      if (this.getDistanceTo(m) > this.getRange()) return false;
      // UV Trap can see stealth
      return true;
    });

    if (targets.length > 0) {
      this.lastFired = now;
      targets.forEach((m) => {
        // Reveal stealth
        if (m.isStealthed) {
          m.isStealthed = false;
        }
        m.takeDamage(this.getDamage() * 0.75);
        lasers.push({
          startX: this.x,
          startY: this.y,
          endX: m.x,
          endY: m.y,
          color: "#c084fc",
          alpha: 0.8,
          width: 2,
        });
      });
    }
  }
}
