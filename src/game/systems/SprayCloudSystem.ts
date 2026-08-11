// src/game/systems/SprayCloudSystem.ts
// ==========================================
// SprayCloudSystem - ระบบละอองยากันยุงแบบ "Grid Density"
// ==========================================
// 🎯 ตามที่พี่ design:
//   - ป้อม Spray ฉีด → inject density ลง grid บริเวณพัดหน้ายา
//   - หลายป้อมฉีดซ้อนจุดเดียว → density สะสม → "ก้อนเมฆ" ทึบ (คลุมยุงมิด)
//   - ทุก frame density ค่อยๆ decay (จาง растворя) ตามเวลา
//   - หลัก "ฟุ้งกระจาย": ยุงอ่าน densityAt ณ ตำแหน่งของตน
//     → กลางก้อนหนา / ปลาย-ขอบจาง (per-cell falloff)
// ==========================================

import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/canvas";

const CELL_SIZE = 40; // ขนาด cell ของ grid (px)
const MAX_DENSITY = 100; // density สูงสุดต่อ cell (ดู "ก้อนเมฆ" ทึบ)
const DECAY_RATE = 0.5; // density ลดต่อ frame (ยิ่งมาก จางเร็ว)
const INJECT_DENSITY = 45; // density ต่อ 1 ครั้งที่ Spray ยิง
const SPRAY_RADIUS = 70; // รัศมีพัดของละอองต่อการฉีด (px)

export class SprayCloudSystem {
  private cols: number;
  private rows: number;
  private grid: number[];

  constructor() {
    this.cols = Math.ceil(CANVAS_WIDTH / CELL_SIZE);
    this.rows = Math.ceil(CANVAS_HEIGHT / CELL_SIZE);
    this.grid = new Array(this.cols * this.rows).fill(0);
  }

  private idx(x: number, y: number): number {
    const col = Math.min(this.cols - 1, Math.max(0, Math.floor(x / CELL_SIZE)));
    const row = Math.min(this.rows - 1, Math.max(0, Math.floor(y / CELL_SIZE)));
    return row * this.cols + col;
  }

  /**
   * ฉีดละอองเข้าบริเวณ (center x,y + รัศมี) — เพิ่ม density โดยมี falloff
   * กลางหนา/ขอบจาง (หลักฟุ้งกระจาย)
   */
  public inject(x: number, y: number, radius: number = SPRAY_RADIUS): void {
    const x0 = Math.max(0, Math.floor((x - radius) / CELL_SIZE));
    const x1 = Math.min(this.cols - 1, Math.floor((x + radius) / CELL_SIZE));
    const y0 = Math.max(0, Math.floor((y - radius) / CELL_SIZE));
    const y1 = Math.min(this.rows - 1, Math.floor((y + radius) / CELL_SIZE));

    for (let r = y0; r <= y1; r++) {
      for (let c = x0; c <= x1; c++) {
        const cellX = c * CELL_SIZE + CELL_SIZE / 2;
        const cellY = r * CELL_SIZE + CELL_SIZE / 2;
        const d = Math.hypot(cellX - x, cellY - y);
        if (d > radius) continue;

        // กลางหนา ขอบจาง (falloff เชิงเส้น)
        const falloff = 1 - d / radius;
        const idx = r * this.cols + c;
        this.grid[idx] = Math.min(
          MAX_DENSITY,
          this.grid[idx] + INJECT_DENSITY * falloff,
        );
      }
    }
  }

  /**
   * ทุก frame — ลด density ลง (ละอองค่อยๆ จาง растворяหาย)
   */
  public decay(delta: number): void {
    const reduction = DECAY_RATE * (delta / 16.66);
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] > 0) {
        this.grid[i] = Math.max(0, this.grid[i] - reduction);
      }
    }
  }

  /**
   * ความหนาแน่น 0..1 ณ ตำแหน่ง (หลักฟุ้งกระจาย) — ใช้เช็คพิษ/ชะลอยุง
   */
  public getDensity(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= CANVAS_WIDTH || y >= CANVAS_HEIGHT) return 0;
    return Math.min(1, this.grid[this.idx(x, y)] / MAX_DENSITY);
  }

  /**
   * วาดละอองเป็น "ก้อนเมฆฟุ้ง" แบบ 2.5D (ตาม spray.md)
   *    ใช้ Radial Gradient Soft Feathered:
   *      - กลางหนาแน่น (alpha สูง)
   *      - กลางขอบจางลง (Mid volume)
   *      - ขอบฟุ้งหายเป็น 0 (Feather)
   *    ยิ่ง density สูง → ยิ่งทึบ (ซ้อนเป็นก้อนเมฆคลุมยุงมิด)
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const idx = r * this.cols + c;
        const d = this.grid[idx];
        if (d <= 0) continue;

        const ratio = d / MAX_DENSITY; // 0..1
        const cx = c * CELL_SIZE + CELL_SIZE / 2;
        const cy = r * CELL_SIZE + CELL_SIZE / 2;

        // รัศมีละออง ขยายตาม density (หนา → โต/ทึบ)
        const radius = CELL_SIZE * (0.4 + ratio * 0.3);
        const coreAlpha = Math.min(0.85, 0.15 + ratio * 0.65); // ยิ่งหนา ยิ่งเข้ม

        // 🎯 Soft Radial Gradient (ตาม spray.md) — ขอบฟุ้งเป็น 0
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(226, 240, 255, ${coreAlpha.toFixed(2)})`); // กลางหนา
        grad.addColorStop(
          0.4,
          `rgba(226, 240, 255, ${(coreAlpha * 0.6).toFixed(2)})`,
        ); // กลางจางลง
        grad.addColorStop(1, `rgba(226, 240, 255, 0)`); // ขอบ fading หมด

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  public reset(): void {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = 0;
    }
  }
}
