// src/game/engine/DepthEffect.ts
export class DepthEffect {
  /**
   * คำนวณขนาดตามความลึก
   * @param baseSize ขนาดพื้นฐาน
   * @param depth ความลึก (0 = ใกล้, 1 = ไกล)
   */
  public static getScaledSize(baseSize: number, depth: number): number {
    const minScale = 0.5;  // ไกลสุด = 50%
    const maxScale = 1.0;  // ใกล้สุด = 100%
    const scale = maxScale - (maxScale - minScale) * depth;
    return baseSize * scale;
  }
  
  /**
   * คำนวณความโปร่งใสตามความลึก
   */
  public static getDepthAlpha(depth: number): number {
    return 1 - depth * 0.3; // ไกล = จางลง 30%
  }
  
  /**
   * คำนวณตำแหน่ง Y ตามความลึก (สำหรับ isometric)
   */
  public static getDepthOffset(depth: number): number {
    return depth * 20; // ไกล = สูงขึ้น 20px
  }
}

/*
// ใน Mosquito.draw()
public draw(ctx: CanvasRenderingContext2D): void {
  // คำนวณ depth จาก pathIndex (ยิ่งใกล้บ้าน = ยิ่งใกล้)
  const depth = 1 - (this.pathIndex / 7); // 0-1
  
  // ปรับขนาดตาม depth
  const scaledSize = DepthEffect.getScaledSize(this.size, depth);
  const alpha = DepthEffect.getDepthAlpha(depth);
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // วาดยุงด้วยขนาดที่ปรับแล้ว
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, scaledSize, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}
*/