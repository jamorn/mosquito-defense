// src/game/engine/Renderer.ts (ปรับปรุง)
// ==========================================
// Renderer - 2.5D Lite Rendering System
// ==========================================
import { Background25D } from "./Background25D";
import { ShadowEffect } from "./ShadowEffect";
import { GAME_PATH, HOME_POSITION } from "../constants/path";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE } from "../constants/canvas";
import { Mosquito } from "../entities/mosquitoes/Mosquito";
import { BaseTower } from "../entities/towers/BaseTower";
import { Particle } from "../entities/Particle";
import { FloatingTextEntity } from "../entities/FloatingText";
import { LaserBeam } from "../../types/game.types";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private background: Background25D;
  private frameCount: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.background = new Background25D(ctx);
  }

  /**
   * Update Background Animation
   */
  public update(delta: number): void {
    this.background.update(delta);
    this.frameCount++;
  }

  /**
   * ล้างจอและวาด Background 2.5D
   */
  public clear(): void {
    this.background.draw();
  }

  /**
   * วาด Grid (จางลงเพื่อให้ Background เด่น)
   */
  public drawGrid(): void {
    this.ctx.strokeStyle = "rgba(30, 41, 59, 0.2)";
    this.ctx.lineWidth = 0.5;

    this.ctx.beginPath();
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(CANVAS_WIDTH, y);
    }
    this.ctx.stroke();
  }

  /**
   * วาด Path — สงบ/ชัด ไม่ฟุ้งเกิน (ลดออร่าจากเดิม 5 layer → 3 layer)
   */
  public drawPath(): void {
    this.ctx.save();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    // Path ปั้น (ทั้งเส้นทาง) — ใช้ครั้งเดียว แล้ววาด 3 ชั้นทับ
    this.ctx.beginPath();
    this.ctx.moveTo(GAME_PATH[0].x, GAME_PATH[0].y);
    for (let i = 1; i < GAME_PATH.length; i++) {
      this.ctx.lineTo(GAME_PATH[i].x, GAME_PATH[i].y);
    }

    // Layer 1: พื้นถนน (ขอบอ่อน, แทบไม่ glow)
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = "rgba(14, 116, 144, 0.55)";
    this.ctx.lineWidth = 14;
    this.ctx.stroke();

    // Layer 2: พื้นถนนทึบด้านใน
    this.ctx.strokeStyle = "rgba(8, 51, 68, 0.85)";
    this.ctx.lineWidth = 11;
    this.ctx.stroke();

    // Layer 3: เส้นกึ่งกลางจาง (บอกทิศทาง, ไม่เรืองแสง)
    this.ctx.strokeStyle = "rgba(125, 211, 252, 0.45)";
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Animated Flow Effect (ลดเหลือ 2 จุด, จาง ไม่ฟุ้ง)
    this.drawPathFlow();

    this.ctx.restore();
  }

  /**
   * วาด Flow Effect บน Path (จุดแสงเคลื่อนที่, จางและน้อยลง)
   */
  private drawPathFlow(): void {
    const flowSpeed = 0.001;
    const numFlows = 2;

    for (let i = 0; i < numFlows; i++) {
      const progress = (this.frameCount * flowSpeed + i / numFlows) % 1;
      const pos = this.getPointOnPath(progress);

      if (pos) {
        this.ctx.fillStyle = "rgba(34, 211, 238, 0.5)";
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  /**
   * คำนวณตำแหน่งบน Path ตาม progress (0-1)
   */
  private getPointOnPath(progress: number): { x: number; y: number } | null {
    const totalSegments = GAME_PATH.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const segmentFraction = segmentProgress - segmentIndex;

    if (segmentIndex >= totalSegments) return null;

    const start = GAME_PATH[segmentIndex];
    const end = GAME_PATH[segmentIndex + 1];

    return {
      x: start.x + (end.x - start.x) * segmentFraction,
      y: start.y + (end.y - start.y) * segmentFraction,
    };
  }

  /**
   * วาด Home Base แบบ Glow + Icon
   */
  public drawHome(): void {
    this.ctx.save();

    // Outer Glow
    this.ctx.shadowBlur = 35;
    this.ctx.shadowColor = "#ef4444";
    this.ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
    this.ctx.beginPath();
    this.ctx.arc(HOME_POSITION.x, HOME_POSITION.y, 32, 0, Math.PI * 2);
    this.ctx.fill();

    // Middle Glow
    this.ctx.shadowBlur = 25;
    this.ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
    this.ctx.beginPath();
    this.ctx.arc(HOME_POSITION.x, HOME_POSITION.y, 26, 0, Math.PI * 2);
    this.ctx.fill();

    // Core
    this.ctx.shadowBlur = 15;
    this.ctx.fillStyle = "#dc2626";
    this.ctx.beginPath();
    this.ctx.arc(HOME_POSITION.x, HOME_POSITION.y, 20, 0, Math.PI * 2);
    this.ctx.fill();

    // Border
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = "#fca5a5";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // House Icon
    this.ctx.font = "18px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("🏠", HOME_POSITION.x, HOME_POSITION.y);

    this.ctx.restore();
  }

  /**
   * วาด Shadows ทั้งหมดก่อน (2.5D Effect)
   */
  private drawShadows(mosquitoes: Mosquito[], towers: BaseTower[]): void {
    // เงาป้อม (วาดก่อน เพราะอยู่ใต้ยุง)
    for (const tower of towers) {
      ShadowEffect.draw(this.ctx, tower.x, tower.y, 20, 20, 0.3);
    }

    // เงายุง
    for (const mosquito of mosquitoes) {
      ShadowEffect.draw(
        this.ctx,
        mosquito.x,
        mosquito.y,
        mosquito.size,
        mosquito.size,
        0.35,
      );
    }
  }

  /**
   * วาด Mosquitoes แบบ Depth-sorted (ไกล → ใกล้)
   */
  public drawMosquitoes(mosquitoes: Mosquito[]): void {
    // เรียงตาม pathIndex (ไกล = pathIndex ต่ำ, ใกล้ = pathIndex สูง)
    const sorted = [...mosquitoes].sort((a, b) => a.pathIndex - b.pathIndex);

    for (const mosquito of sorted) {
      mosquito.draw(this.ctx);
    }
  }

  /**
   * วาด Towers
   */
  public drawTowers(towers: BaseTower[]): void {
    for (const tower of towers) {
      tower.draw(this.ctx);
    }
  }

  /**
   * วาด Lasers (Safe Backward Loop)
   */
  public drawLasers(lasers: LaserBeam[]): void {
    for (let i = lasers.length - 1; i >= 0; i--) {
      const laser = lasers[i];

      this.ctx.save();
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = laser.color;
      this.ctx.strokeStyle = laser.color;
      this.ctx.lineWidth = laser.width;
      this.ctx.globalAlpha = laser.alpha;
      this.ctx.lineCap = "round";

      this.ctx.beginPath();
      this.ctx.moveTo(laser.startX, laser.startY);
      this.ctx.lineTo(laser.endX, laser.endY);
      this.ctx.stroke();
      this.ctx.restore();

      laser.alpha -= 0.1;
      if (laser.alpha <= 0) {
        lasers.splice(i, 1);
      }
    }
  }

  /**
   * วาด Particles
   */
  public drawParticles(particles: Particle[], delta: number): void {
    for (let i = particles.length - 1; i >= 0; i--) {
      const alive = particles[i].update(delta);
      if (alive) {
        particles[i].draw(this.ctx);
      } else {
        particles.splice(i, 1);
      }
    }
  }

  /**
   * วาด Floating Texts
   */
  public drawFloatingTexts(texts: FloatingTextEntity[], delta: number): void {
    for (let i = texts.length - 1; i >= 0; i--) {
      const alive = texts[i].update(delta);
      if (alive) {
        texts[i].draw(this.ctx);
      } else {
        texts.splice(i, 1);
      }
    }
  }

  /**
   * วาด Range Highlight สำหรับ Tower ที่เลือก
   */
  public drawRangeHighlight(tower: BaseTower): void {
    tower.drawRangeHighlight(this.ctx);
  }

  /**
   * 🆕 วาด Ghost Preview ของป้อมขณะวาง (ตามตำแหน่งเมาส์)
   *    - สีเขียว/สีป้อม = วางได้ (canPlace === true)
   *    - สีแดงกึ่งโปร่งใส = วางไม่ได้
   *    พร้อมวง Range ให้เห็นก่อนวาง + วงบอกระยะห้ามวาง
   */
  public drawTowerPreview(
    x: number,
    y: number,
    config: import("../../types/tower.types").TowerConfig,
    canPlace: boolean,
  ): void {
    this.ctx.save();
    this.ctx.globalAlpha = 0.55;
    this.ctx.setLineDash([6, 6]);

    // Range Highlight (จาก config.range)
    this.ctx.strokeStyle = canPlace
      ? "rgba(34, 197, 94, 0.4)"
      : "rgba(239, 68, 68, 0.4)";
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(x, y, config.range, 0, Math.PI * 2);
    this.ctx.stroke();

    // ตัวป้อม Ghost
    this.ctx.shadowBlur = 14;
    this.ctx.shadowColor = canPlace ? config.glowColor : "#ef4444";
    this.ctx.strokeStyle = canPlace ? config.glowColor : "#f87171";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 18, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.fillStyle = canPlace ? "#164e37" : "#450a0a";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 15, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = canPlace ? config.glowColor : "#ef4444";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // วงเลื่อนตำแหน่ง (ระยะห้ามวาง 35 ตาม isValidPlacement)
    this.ctx.strokeStyle = canPlace
      ? "rgba(34, 197, 94, 0.7)"
      : "rgba(239, 68, 68, 0.7)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 35, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * ==========================================
   * MAIN RENDER METHOD - 2.5D Lite
   * ==========================================
   * วาดทุกอย่างตามลำดับความลึก:
   * 1. Background (Parallax)
   * 2. Grid
   * 3. Path (Glow)
   * 4. Home Base
   * 5. Shadows
   * 6. Towers
   * 7. Mosquitoes (Depth-sorted)
   * 8. Lasers
   * 9. Particles
   * 10. Floating Texts
   */
  public drawScene(
    mosquitoes: Mosquito[],
    towers: BaseTower[],
    lasers: LaserBeam[],
    particles: Particle[],
    floatingTexts: FloatingTextEntity[],
    delta: number,
  ): void {
    // 1. Background (Parallax 2.5D)
    this.clear();

    // 2. Grid (จางๆ)
    this.drawGrid();

    // 3. Path (Neon Glow)
    this.drawPath();

    // 4. Home Base (Glow)
    this.drawHome();

    // 5. Shadows (2.5D Depth Effect)
    this.drawShadows(mosquitoes, towers);

    // 6. Towers (ก่อน เพราะอยู่ "ใต้" ยุง)
    this.drawTowers(towers);

    // 7. Mosquitoes (Depth-sorted: ไกล → ใกล้)
    this.drawMosquitoes(mosquitoes);

    // 8. Lasers
    this.drawLasers(lasers);

    // 9. Particles
    this.drawParticles(particles, delta);

    // 10. Floating Texts (บนสุด)
    this.drawFloatingTexts(floatingTexts, delta);
  }
}
