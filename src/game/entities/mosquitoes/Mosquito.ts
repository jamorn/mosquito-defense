// src/game/entities/mosquitoes/Mosquito/Mosquito.ts
import { GameObject } from "../GameObject";
import { Point } from "../../../types/game.types";
import { MosquitoType } from "../../../types/game.types";

export abstract class Mosquito extends GameObject {
  public id: string;
  public type: MosquitoType;
  public hp: number;
  public maxHp: number;
  public speed: number;
  public baseSpeed: number;
  public reward: number;
  public size: number;
  public color: string;
  public pathIndex: number = 0;
  public slowTimer: number = 0;
  public freezeTimer: number = 0;
  protected wingAngle: number = 0;

  // 🆕 Counter-Play Properties
  public armor: number = 0;
  public isStealthed: boolean = false;
  public canSplit: boolean = false;
  public hasSplit: boolean = false;
  public bossDamage: number = 1;

  // 🆕 Poison / "เมา" จากละอองยากันยุง (Spray)
  //    poisonLevel 0..POISON_MAX สะสมพิษตาม density ของละออง ณ ตำแหน่ง
  //    พ้นโซน/จาง → ค่อยๆ ฟื้นตัว (คำนวณใน updatePoison)
  public poisonLevel: number = 0;
  public poisonLastExposure: number = 0; // timestamp ครั้งที่สัมผัสละอองล่าสุด
  private poisonPulse: number = 0; // สำหรับวาด Tab พิษให้กระพริบ

  constructor(
    x: number,
    y: number,
    type: MosquitoType,
    hp: number,
    speed: number,
    reward: number,
    size: number,
    color: string,
  ) {
    super(x, y);
    this.id = Math.random().toString(36).substring(7);
    this.type = type;
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.baseSpeed = speed;
    this.reward = reward;
    this.size = size;
    this.color = color;
  }

  public applySlow(durationMs: number): void {
    this.slowTimer = durationMs;
  }

  public applyFreeze(durationMs: number): void {
    this.freezeTimer = durationMs;
  }

  // ── Poison / "เมา" จากละออง Spray ────────────────────────────────────
  // หลัก (ตามที่พี่ design):
  //   - densityAt = ความหนาแน่นละออง ณ ตำแหน่งยุง (0..1, หลักฟุ้งกระจาย)
  //     กลางก้อนหนา → density สูง, ปลาย/ขอบจาง → density ต่ำ
  //   - อยู่ในละออง (density > 0) → สะสม poison ตาม density (หนา → ติดพิษเร็ว)
  //   - พ้นโซน → ค่อยๆ ฟื้นตัว (poison ลด) ตามอัตรา
  //   - poison สูง → ชะลอ (เมา) มาก ตาม "ความเมา"
  // ----------------------------------------------------------------------
  private static readonly POISON_MAX = 1.0;

  /**
   * กระทบยุงทุก frame ด้วย density ณ ตำแหน่ง (จาก SprayCloudSystem)
   * @param densityAt 0..1 (ฟุ้งกระจาย) — 0 = ไม่อยู่ในละออง
   * @param delta ms
   */
  public updatePoison(densityAt: number, delta: number): void {
    if (densityAt > 0) {
      // อยู่ในละออง (อากาศไม่ถ่ายเท / เมา) → สะสมพิษตาม density
      // หนาแน่น → เป็นลมเร็วขึ้น
      const intake = densityAt * (delta / 16.66) * 0.03;
      this.poisonLevel = Math.min(
        Mosquito.POISON_MAX,
        this.poisonLevel + intake,
      );
      this.poisonLastExposure = performance.now();
    } else {
      // 🆕 พ้นออกจากโซนละออง (อากาศถ่ายเทสะดวก) → ฟื้น "อย่างรวดเร็ว"
      //    จำลองเป็นคนเป็นลม: ออกไปที่โล่ง → ร่างกายกลับมาปกติไว
      const FAST_RECOVER = 0.35; // ลด poison เร็วมากต่อ frame
      this.poisonLevel = Math.max(
        0,
        this.poisonLevel - FAST_RECOVER * (delta / 16.66),
      );
    }
    this.poisonPulse += delta;
  }

  public get poisonFactor(): number {
    // เมา → ช้าลงตาม poisonLevel (0 = ปกติ, 1 = ช้าเต็มที่ = 0.5x)
    return 1 - 0.5 * this.poisonLevel; // 1..0.5
  }

  public update(
    delta: number,
    path: Point[],
    allMosquitoes?: Mosquito[],
  ): boolean {
    // Freeze Effect
    if (this.freezeTimer > 0) {
      this.freezeTimer -= delta;
      return true;
    }

    // Slow Effect (จากป้อม freeze/slow)
    let slowFactor = 1;
    if (this.slowTimer > 0) {
      this.slowTimer -= delta;
      slowFactor = 0.5;
    }

    // ── Proximity Sensor (ต่อคิวอัตโนมัติ) ────────────────────────────────
    // 🎯 ตามข้อคิดพี่ (Analog "proximity switch" ในโรงงาน):
    //   ยุงตัวหลังมี "sensor วงกลม" ล้อมรอบ → เมื่อ detect ยุงตัวหน้าในรัศมี
    //   จะค่อยๆ ชลอ (และเร่งกลับเมื่อห่าง) แบบอัตโนมัติ
    //   ใช้รัศมี = this.size + buffer (เผื่อ buffer ให้ detect ไว้ล่วงหน้า
    //   มากพอ → หยุดได้แน่นอน แม้โค้งหักศอก)
    //   min gap ระหว่างคู่ = sizeA + sizeB (Analog "คนอ้วน+ผอมยืนต่อคิว")
    // ────────────────────────────────────────────────────────────────────
    let sepFactor = 1;
    if (allMosquitoes && allMosquitoes.length > 0) {
      const sensorRadius = this.size + 50; // buffer เผื่อชลอไว้ล่วงหน้า

      for (const other of allMosquitoes) {
        if (other === this) continue;

        // 🎯 ต้องเป็น "ยุงตัวหน้า" เท่านั้น (เดินไกลกว่าตามเส้นทาง)
        //    อย่าเอาใครก็ได้ใน sensor มาดึงกัน → ฝูงกระจุก
        const ahead =
          other.pathIndex > this.pathIndex ||
          (other.pathIndex === this.pathIndex &&
            other.getTotalProgress(path) > this.getTotalProgress(path) - 0.001);

        // กรณี pathIndex เท่ากัน ใช้ระยะฉายไปตามทิศการเคลื่อนเพื่อตัดสิน "หน้า/หลัง"
        if (!ahead) continue;

        const d = Math.hypot(other.x - this.x, other.y - this.y);
        if (d > sensorRadius) continue; // ยังไกล ไม่อยู่ใน sensor

        const minGap = this.size + other.size;

        // smooth factor 0..1 : ใกล้ → ชลอมาก, ห่าง → เร็วเต็ม
        const factor = (d - minGap) / (sensorRadius - minGap);
        sepFactor = Math.min(sepFactor, Math.max(0, Math.min(1, factor)));
      }
      // เมื่อไม่มีตัวหน้าใน sensor → sepFactor คง 1 (ความเร็วเต็ม)
    }

    // ความเร็วจริง = baseSpeed × slowFactor(จาก freeze/slow) × sepFactor(จากตัวหน้า)
    //                × poisonFactor(จาก "เมา" ยากันยุง)
    this.speed = this.baseSpeed * slowFactor * sepFactor * this.poisonFactor;

    // Delta-time scaled movement
    const moveAmount = this.speed * (delta / 16.66);

    const target = path[this.pathIndex + 1];
    if (target) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < moveAmount) {
        this.x = target.x;
        this.y = target.y;
        this.pathIndex++;
      } else {
        this.x += (dx / dist) * moveAmount;
        this.y += (dy / dist) * moveAmount;
      }
      return true;
    }
    return false;
  }

  public takeDamage(amount: number): boolean {
    this.hp -= amount;
    return this.hp <= 0;
  }

  /**
   * ระยะความคืบหน้าตามเส้นทาง (รวม % ภายใน segment ปัจจุบัน)
   * ใช้ตัดสิน "ตัวหน้า / ตัวหลัง" ใน segment เดียวกันได้แม่นยำ
   */
  public getTotalProgress(path?: Point[]): number {
    if (!path || this.pathIndex >= path.length - 1) {
      return this.pathIndex;
    }
    const cur = path[this.pathIndex];
    const next = path[this.pathIndex + 1];
    const segLen = Math.hypot(next.x - cur.x, next.y - cur.y) || 1;
    const traveled = Math.hypot(this.x - cur.x, this.y - cur.y);
    return this.pathIndex + traveled / segLen;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Stealth visual (semi-transparent if stealthed)
    if (this.isStealthed) {
      ctx.globalAlpha = 0.3;
    }

    ctx.shadowBlur = 12;
    ctx.shadowColor = this.freezeTimer > 0 ? "#38bdf8" : this.color;

    ctx.fillStyle = this.freezeTimer > 0 ? "#93c5fd" : this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    if (this.freezeTimer <= 0) this.wingAngle += 0.3;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    const wingOffset = Math.sin(this.wingAngle) * (this.size + 4);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 6, this.y - wingOffset);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 6, this.y - wingOffset);
    ctx.stroke();
    ctx.restore();

    // HP Bar
    const barW = this.size * 2.2;
    const barH = 4;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(this.x - barW / 2, this.y - this.size - 8, barW, barH);

    const hpRatio = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle =
      hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.2 ? "#eab308" : "#ef4444";
    ctx.fillRect(
      this.x - barW / 2,
      this.y - this.size - 8,
      barW * hpRatio,
      barH,
    );

    // Armor indicator
    if (this.armor > 0) {
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 🆕 Tab "เมา/ติดพิษ" — ขึ้นเหนือ HP bar (วงเล็กๆ เขียว)
    //    จะแสดงเมื่อ poison > 0 เท่านั้น (พอหมด 0 → remove tab)
    //    และจะบอก "ระดับเมา" ผูกกับความเข้ม
    if (this.poisonLevel > 0) {
      // ปุ่มพิษ: วงกลมเล็กๆ ขนาดตาม poison เหนือ HP bar
      const pulse = 0.6 + 0.4 * Math.sin(this.poisonPulse / 160);
      const tabY = this.y - this.size - 16; // เหนือ HP bar
      ctx.save();
      ctx.globalAlpha = pulse;

      // วงพิษเล็ก (บอกระดับเมา)
      const r = 3 + this.poisonLevel * 2.5;
      ctx.fillStyle = this.poisonLevel >= 0.4 ? "#10b981" : "#6ee7b7"; // เมา = เขียวเข้ม
      ctx.beginPath();
      ctx.arc(this.x, tabY, r, 0, Math.PI * 2);
      ctx.fill();

      // ตัวอักษรสถานะ
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.poisonLevel >= 0.4 ? "☠" : "☠", this.x, tabY);
      ctx.restore();
    }
  }
}
