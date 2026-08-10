// src/game/entities/LaserBeam
// ==========================================
// LaserBeam - เอฟเฟกต์ลำแสงเลเซอร์
// ==========================================
import { GameObject } from './GameObject';

export class LaserBeam extends GameObject {
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;
  public color: string;
  public alpha: number;
  public width: number;
  private decayRate: number;

  constructor(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
    alpha: number = 1,
    width: number = 2,
    decayRate: number = 0.1
  ) {
    // ใช้ตำแหน่งกลางของลำแสงเป็น GameObject position
    super((startX + endX) / 2, (startY + endY) / 2);
    
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = color;
    this.alpha = alpha;
    this.width = width;
    this.decayRate = decayRate;
  }

  /**
   * อัปเดต LaserBeam (ลด alpha ลงเรื่อยๆ)
   * @returns true ถ้ายังแสดงอยู่, false ถ้าจางหายแล้ว
   */
  public update(delta: number): boolean {
    const factor = delta / 16.66;
    this.alpha -= this.decayRate * factor;
    return this.alpha > 0;
  }

  /**
   * วาด LaserBeam
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.alpha <= 0) return;

    ctx.save();
    
    // Glow effect
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    
    // Main beam
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
    
    // Inner glow (brighter core)
    if (this.width > 2) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = this.width * 0.3;
      ctx.globalAlpha = Math.max(0, this.alpha * 0.5);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * ตรวจสอบว่า LaserBeam ยังแสดงอยู่หรือไม่
   */
  public isAlive(): boolean {
    return this.alpha > 0;
  }

  /**
   * อัปเดตตำแหน่ง (ถ้าต้องการให้ลำแสงเคลื่อนที่)
   */
  public updatePosition(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.x = (startX + endX) / 2;
    this.y = (startY + endY) / 2;
  }

  /**
   * Factory method: สร้าง LaserBeam แบบง่าย
   */
  public static create(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string
  ): LaserBeam {
    return new LaserBeam(startX, startY, endX, endY, color);
  }

  /**
   * Factory method: สร้าง LaserBeam แบบหนา (สำหรับ Tesla)
   */
  public static createHeavy(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string
  ): LaserBeam {
    return new LaserBeam(startX, startY, endX, endY, color, 1, 4, 0.08);
  }

  /**
   * Factory method: สร้าง LaserBeam แบบบาง (สำหรับ UV)
   */
  public static createThin(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string
  ): LaserBeam {
    return new LaserBeam(startX, startY, endX, endY, color, 0.8, 2, 0.12);
  }
}