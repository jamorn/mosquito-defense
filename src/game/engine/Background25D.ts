// src/game/engine/Background25D.ts
// ==========================================
// Background25D - Parallax Background System
// ==========================================
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/canvas";

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface Tree {
  x: number;
  baseY: number;
  height: number;
  width: number;
  layer: number; // 1 = ไกล, 2 = ใกล้
  swayPhase: number;
}

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  glowPhase: number;
}

export class Background25D {
  private ctx: CanvasRenderingContext2D;
  private clouds: Cloud[] = [];
  private stars: Star[] = [];
  private trees: Tree[] = [];
  private fireflies: Firefly[] = [];
  private time: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initElements();
  }

  /**
   * เริ่มต้นสร้าง Background Elements
   */
  private initElements(): void {
    this.initStars();
    this.initClouds();
    this.initTrees();
    this.initFireflies();
  }

  private initStars(): void {
    for (let i = 0; i < 40; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * 180,
        size: Math.random() * 1.8 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
      });
    }
  }

  private initClouds(): void {
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * CANVAS_WIDTH,
        y: 20 + Math.random() * 80,
        size: 25 + Math.random() * 35,
        speed: 0.15 + Math.random() * 0.25,
        opacity: 0.08 + Math.random() * 0.1,
      });
    }
  }

  private initTrees(): void {
    // ต้นไม้ไกล (Layer 1)
    for (let i = 0; i < 10; i++) {
      this.trees.push({
        x: i * 85 + Math.random() * 40,
        baseY: 160 + Math.random() * 20,
        height: 50 + Math.random() * 35,
        width: 25 + Math.random() * 15,
        layer: 1,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    // ต้นไม้ใกล้ (Layer 2)
    for (let i = 0; i < 6; i++) {
      this.trees.push({
        x: i * 140 + Math.random() * 70,
        baseY: 200 + Math.random() * 25,
        height: 70 + Math.random() * 50,
        width: 35 + Math.random() * 25,
        layer: 2,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  private initFireflies(): void {
    for (let i = 0; i < 12; i++) {
      this.fireflies.push({
        x: Math.random() * CANVAS_WIDTH,
        y: 200 + Math.random() * 300,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        size: 1.5 + Math.random() * 2,
        glowPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Update Background ทุก frame
   */
  public update(delta: number): void {
    this.time += delta * 0.001;
    const factor = delta / 16.66;

    // เมฆเคลื่อนที่ (Parallax Layer 2)
    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * factor;
      if (cloud.x > CANVAS_WIDTH + cloud.size * 2) {
        cloud.x = -cloud.size * 2;
      }
    }

    // หิ่งห้อยเคลื่อนที่
    for (const firefly of this.fireflies) {
      firefly.x += firefly.vx * factor;
      firefly.y += firefly.vy * factor;
      firefly.glowPhase += 0.05 * factor;

      // ห่อขอบ
      if (firefly.x < 0) firefly.x = CANVAS_WIDTH;
      if (firefly.x > CANVAS_WIDTH) firefly.x = 0;
      if (firefly.y < 180) firefly.y = CANVAS_HEIGHT;
      if (firefly.y > CANVAS_HEIGHT) firefly.y = 180;
    }
  }

  /**
   * วาด Background ทั้งหมด
   */
  public draw(): void {
    this.drawSky();
    this.drawStars();
    this.drawMoon();
    this.drawClouds();
    this.drawTrees(1); // ไกลก่อน
    this.drawTrees(2); // ใกล้ทีหลัง
    this.drawFireflies();
    this.drawGroundFog();
  }

  private drawSky(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    // 🎨 ปรับให้สว่างขึ้น (เคย #050810 → #1a2332 มืดเกินไปสำหรับจอเล็ก/mobile)
    gradient.addColorStop(0, "#0b1220");
    gradient.addColorStop(0.3, "#142033");
    gradient.addColorStop(0.6, "#1e2b40");
    gradient.addColorStop(1, "#2c3a52");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private drawStars(): void {
    for (const star of this.stars) {
      const twinkle = Math.sin(
        this.time * star.twinkleSpeed + star.twinklePhase,
      );
      const alpha = 0.3 + twinkle * 0.35;
      const size = star.size * (0.8 + twinkle * 0.2);

      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      this.ctx.fill();

      // ดาวดวงใหญ่มี glow
      if (star.size > 1.5) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, size * 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private drawMoon(): void {
    const moonX = 680;
    const moonY = 60;
    const moonRadius = 25;

    this.ctx.save();

    // Moon Glow
    const glowGradient = this.ctx.createRadialGradient(
      moonX,
      moonY,
      moonRadius * 0.5,
      moonX,
      moonY,
      moonRadius * 3,
    );
    glowGradient.addColorStop(0, "rgba(255, 255, 220, 0.15)");
    glowGradient.addColorStop(1, "rgba(255, 255, 220, 0)");
    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon Body
    this.ctx.fillStyle = "#fef3c7";
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon Craters
    this.ctx.fillStyle = "rgba(217, 196, 140, 0.5)";
    this.ctx.beginPath();
    this.ctx.arc(moonX - 8, moonY - 5, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(moonX + 6, moonY + 7, 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawClouds(): void {
    for (const cloud of this.clouds) {
      this.ctx.fillStyle = `rgba(148, 163, 184, ${cloud.opacity})`;

      this.ctx.beginPath();
      this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      this.ctx.arc(
        cloud.x + cloud.size * 0.7,
        cloud.y - cloud.size * 0.25,
        cloud.size * 0.75,
        0,
        Math.PI * 2,
      );
      this.ctx.arc(
        cloud.x + cloud.size * 1.4,
        cloud.y,
        cloud.size * 0.85,
        0,
        Math.PI * 2,
      );
      this.ctx.arc(
        cloud.x + cloud.size * 0.5,
        cloud.y + cloud.size * 0.2,
        cloud.size * 0.6,
        0,
        Math.PI * 2,
      );
      this.ctx.fill();
    }
  }

  private drawTrees(layer: number): void {
    const isFar = layer === 1;
    // 🎨 ลดความเด่นของต้นไม้ให้เป็นฉากหลังจางๆ (ไม่โผล่กวนสายตากลางจอ)
    const baseAlpha = isFar ? 0.16 : 0.28;
    const swayAmount = isFar ? 1 : 2;

    for (const tree of this.trees) {
      if (tree.layer !== layer) continue;

      // ต้นไม้โยกตามลม
      const sway = Math.sin(this.time * 0.5 + tree.swayPhase) * swayAmount;

      const trunkColor = `rgba(120, 90, 60, ${baseAlpha})`;
      const leafColor = isFar
        ? `rgba(30, 140, 110, ${baseAlpha})`
        : `rgba(20, 120, 95, ${baseAlpha})`;

      this.ctx.save();

      // ลำต้น
      this.ctx.fillStyle = trunkColor;
      this.ctx.fillRect(
        tree.x + tree.width / 2 - 4 + sway * 0.3,
        tree.baseY - tree.height * 0.35,
        8,
        tree.height * 0.35,
      );

      // ใบ (สามเหลี่ยม 3 ชั้น)
      this.ctx.fillStyle = leafColor;

      for (let i = 0; i < 3; i++) {
        const layerHeight = tree.height * (0.4 - i * 0.08);
        const layerWidth = tree.width * (1 - i * 0.25);
        const layerY = tree.baseY - tree.height * 0.3 - i * tree.height * 0.22;

        this.ctx.beginPath();
        this.ctx.moveTo(tree.x + sway - layerWidth / 2, layerY);
        this.ctx.lineTo(tree.x + sway + layerWidth / 2, layerY);
        this.ctx.lineTo(tree.x + sway, layerY - layerHeight);
        this.ctx.closePath();
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  private drawFireflies(): void {
    for (const firefly of this.fireflies) {
      const glow = Math.sin(firefly.glowPhase) * 0.5 + 0.5;
      const alpha = 0.2 + glow * 0.6;

      this.ctx.save();

      // Glow
      this.ctx.fillStyle = `rgba(250, 204, 21, ${alpha * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(firefly.x, firefly.y, firefly.size * 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Core
      this.ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  private drawGroundFog(): void {
    const gradient = this.ctx.createLinearGradient(
      0,
      CANVAS_HEIGHT - 100,
      0,
      CANVAS_HEIGHT,
    );
    // 🎨 ลดความมืดก้นจอ (เคย 0.5, สี #0f172a → ลดเป็น 0.28, สีสว่างขึ้น)
    gradient.addColorStop(0, "rgba(30, 44, 66, 0)");
    gradient.addColorStop(1, "rgba(30, 44, 66, 0.28)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
  }
}
