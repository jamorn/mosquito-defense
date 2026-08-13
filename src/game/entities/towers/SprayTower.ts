// src/game/entities/towers/SprayTower
import { BaseTower } from "./BaseTower";
import { TOWER_CONFIGS } from "../../../config/towers.config";
import { Mosquito } from "../mosquitoes/Mosquito";
import { LaserBeam } from "../../../types/game.types";
import { SoundSystem } from "../../engine/SoundSystem";
import { SprayCloudSystem } from "../../systems/SprayCloudSystem";

export class SprayTower extends BaseTower {
  // 🆕 อ้างอิงถึงระบบละออง (ตั้งจากภายนอกใน App) — ใช้ฉีดละอองเข้าก๊อบ
  public cloudSystem: SprayCloudSystem | null = null;

  constructor(x: number, y: number) {
    super(x, y, "SPRAY_SLOW", TOWER_CONFIGS.SPRAY_SLOW);
  }

  /**
   * รูปร่าง: ขวดสเปรย์ยากันยุง (ทรงตั้ง)
   *   - ลำตัวขวดทรงตั้ง 4 เหลี่ยมมน
   *   - ฝาหัวกด + หัวฉีดเล็กๆ
   */
  protected drawBody(ctx: CanvasRenderingContext2D): void {
    const x = this.x;
    const y = this.y;

    // ฝาหัวกด (ด้านบน)
    ctx.fillStyle = "#065f46";
    ctx.fillRect(x - 7, y - 14, 14, 6); // ฝา
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(x - 2, y - 17, 4, 5, 2); // หัวฉีดยื่นขึ้น
    ctx.fill();

    // ลำตัวขวด (กระบอกมน)
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 8, 18, 18, 5); // ตัวขวดทรงตั้ง
    ctx.fill();

    // เส้นแนวตั้งให้ดูเป็นขวดมีฝา
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 6, y - 4, 12, 10);

    // ฉลากยุง 🦟 เล็กๆ กลางขวด
    ctx.fillStyle = "#ffffff";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🦟", x, y + 1);
  }

  public updateAndAttack(
    now: number,
    mosquitoes: Mosquito[],
    _lasers: LaserBeam[],
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

    const targets = mosquitoes.filter(
      (m) => this.getDistanceTo(m) <= this.getRange(),
    );
    if (targets.length > 0) {
      this.lastFired = now;

      // 🎯 หา "จุดกลางฝูงยุง" ใน range — ละอองจะพุ่งไปนอนตรงนั้น
      let avgX = 0;
      let avgY = 0;
      for (const m of targets) {
        avgX += m.x;
        avgY += m.y;
      }
      avgX /= targets.length;
      avgY /= targets.length;

      // จำกัดไม่ให้เกิน range ของป้อม (ยิงไกลสุดแค่ปลาย range)
      const dx = avgX - this.x;
      const dy = avgY - this.y;
      const dist = Math.hypot(dx, dy);
      const maxReach = this.getRange();
      let aimX = avgX;
      let aimY = avgY;
      if (dist > maxReach) {
        aimX = this.x + (dx / dist) * maxReach;
        aimY = this.y + (dy / dist) * maxReach;
      }

      // 🆕 วางละออง "พุ่งไปทางยุง แล้วนอนตรงนั้น" (จุดกลางฝูง)
      if (this.cloudSystem) {
        this.cloudSystem.inject(aimX, aimY, 70);
      }

      // ดาเมจเล็กน้อย (เปียก/พิษแรก) + particle ให้เห็นพุ่งตามทิศ
      const dmg = Math.round(this.getDamage());
      targets.forEach((m) => {
        m.takeDamage(dmg);
        if (addFloatingText)
          addFloatingText(m.x, m.y - 15, `-${dmg}`, "#ef4444");
      });

      // 🆕 เส้นฉีดพุ่งจากหัวฉีดป้อม → จุดละออง (เห็นทิศทางตามยุง)
      const steps = 10;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const px = this.x + (aimX - this.x) * t;
        const py = this.y + (aimY - this.y) * t;
        addParticles(px, py, "#5eead4", 1);
      }

      soundSystem.play("spray");
    }
  }
}
