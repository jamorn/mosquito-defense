// src/game/engine/ParallaxBackground.ts
interface ParallaxLayer {
  image: HTMLImageElement | null;
  speed: number;      // ความเร็วในการเคลื่อนที่
  offset: number;     // ตำแหน่งปัจจุบัน
  y: number;          // ตำแหน่ง Y
}

export class ParallaxBackground {
  private layers: ParallaxLayer[] = [];
  private ctx: CanvasRenderingContext2D;
  
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initLayers();
  }
  
  private initLayers(): void {
    // Layer 1: ท้องฟ้า (เคลื่อนที่ช้าสุด)
    this.layers.push({
      image: null, // จะโหลดรูปทีหลัง หรือวาดเอง
      speed: 0.1,
      offset: 0,
      y: 0,
    });
    
    // Layer 2: เมฆ
    this.layers.push({
      image: null,
      speed: 0.3,
      offset: 0,
      y: 50,
    });
    
    // Layer 3: ต้นไม้ไกล
    this.layers.push({
      image: null,
      speed: 0.5,
      offset: 0,
      y: 100,
    });
  }
  
  public update(delta: number): void {
    for (const layer of this.layers) {
      layer.offset += layer.speed * (delta / 16.66);
    }
  }
  
  public draw(): void {
    // วาดท้องฟ้า (gradient)
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, 800, 600);
    
    // วาดเมฆ (ตัวอย่าง)
    this.drawClouds();
    
    // วาดต้นไม้ไกล
    this.drawDistantTrees();
  }
  
  private drawClouds(): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const cloudLayer = this.layers[1];
    
    for (let i = 0; i < 5; i++) {
      const x = ((i * 200 + cloudLayer.offset) % 900) - 50;
      const y = 50 + Math.sin(i) * 20;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 30, 0, Math.PI * 2);
      this.ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
      this.ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  private drawDistantTrees(): void {
    this.ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    const treeLayer = this.layers[2];
    
    for (let i = 0; i < 10; i++) {
      const x = ((i * 100 + treeLayer.offset) % 900) - 50;
      const y = 150;
      
      // วาดต้นไม้ง่ายๆ
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + 15, y - 40);
      this.ctx.lineTo(x + 30, y);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
}