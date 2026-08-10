// src/game/engine/Isometric.ts
export class Isometric {
  private tileWidth: number = 64;
  private tileHeight: number = 32;
  
  /**
   * แปลงพิกัด 2D → Isometric
   */
  public toIso(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - y) * (this.tileWidth / 2),
      y: (x + y) * (this.tileHeight / 2),
    };
  }
  
  /**
   * แปลง Isometric → 2D (สำหรับ click detection)
   */
  public fromIso(isoX: number, isoY: number): { x: number; y: number } {
    return {
      x: (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2,
      y: (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2,
    };
  }
}