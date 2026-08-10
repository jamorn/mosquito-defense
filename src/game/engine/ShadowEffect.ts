// src/game/engine/ShadowEffect.ts
// ==========================================
// ShadowEffect - 2.5D Shadow System
// ==========================================

export class ShadowEffect {
  /**
   * วาดเงาใต้วัตถุ (Ellipse)
   * Performance Cost: ต่ำมาก (~0.05ms ต่อวัตถุ)
   */
  public static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    intensity: number = 0.35,
  ): void {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y + height * 0.9,
      width * 0.9,
      height * 0.35,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }

  /**
   * วาดเงาแบบ Soft (Radial Gradient)
   * Performance Cost: ต่ำ-กลาง
   */
  public static drawSoft(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    intensity: number = 0.4,
  ): void {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${intensity * 0.5})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * วาดเงาแบบ Directional (มีทิศทางแสง)
   */
  public static drawDirectional(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    lightAngle: number = Math.PI / 4,
    intensity: number = 0.3,
  ): void {
    const offsetX = Math.cos(lightAngle) * width * 0.3;
    const offsetY = Math.sin(lightAngle) * height * 0.2;

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
    ctx.beginPath();
    ctx.ellipse(
      x + offsetX,
      y + height * 0.9 + offsetY,
      width * 0.85,
      height * 0.3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }
}
