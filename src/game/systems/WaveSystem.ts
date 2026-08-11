// src/game/systems/WaveSystem.ts
import {
  WAVE_PATTERNS,
  WavePattern,
  getWavePattern,
} from "../../config/waves.config";
import { MosquitoFactory } from "../entities/mosquitoes/MosquitoFactory";
import { Mosquito } from "../entities/mosquitoes/Mosquito";
import { MosquitoType } from "../../types/game.types";
import { SPAWN_POSITION } from "../constants/path";

// ลำดับการปล่อยยุง (คำนวณล่วงหน้าตั้งแต่เริ่ม wave)
// 🎯 ตามที่พี่วาง design: shuffle queue → เก็บ schedule ไว้ล่วงหน้า
//    → ปล่อยตาม absolute game-time (รู้ล่วงหน้าทั้ง wave)
interface SpawnSchedule {
  type: MosquitoType;
  timeMs: number; // เวลาเกิดจริง (สะสม absolute ตั้งแต่เริ่ม wave)
}

export class WaveSystem {
  private currentPattern: WavePattern | null = null;

  // 🎯 Master queue ทั้งเกม (ตาม design พี่):
  //    สร้าง schedule ครบ 1-10 (และ fallback ต่อท้ายเมื่อเล่นเกิน) ล่วงหน้า
  //    แล้วตอน startWave ใช้ shift() pop เอา 1 wave ออกมาใช้
  private masterQueue: SpawnSchedule[][] = [];

  // schedule ของ wave ที่กำลังเล่น (pop ออกจาก masterQueue)
  private spawnSchedule: SpawnSchedule[] = [];
  private currentWaveNumber: number = 1;
  private gameTime: number = 0; // absolute elapsed ตั้งแต่เริ่ม wave (ms)
  private isSpawning: boolean = false;
  private totalToSpawn: number = 0;
  private spawnedCount: number = 0;

  /**
   * เริ่ม wave จาก config — pop เอา 1 wave จาก masterQueue มาใช้
   */
  public startWave(waveNumber: number): WavePattern | null {
    this.currentWaveNumber = waveNumber;

    // ถ้า masterQueue ยังไม่พร้อม (ครั้งแรก) → precompute ล่วงหน้าทั้งเกม
    if (this.masterQueue.length === 0) {
      this.precomputeAllWaves();
    }

    // pop เอา schedule ของ wave ปัจจุบันออกมา (shift = ทีละ 1 wave)
    this.spawnSchedule = this.masterQueue.shift() ?? [];

    this.currentPattern = getWavePattern(waveNumber);

    this.isSpawning = true;
    this.gameTime = 0;
    this.spawnedCount = 0;
    this.totalToSpawn = this.spawnSchedule.length;

    return this.currentPattern;
  }

  /**
   * 🎯 สร้าง master schedule ทั้งเกมล่วงหน้า (ตาม design พี่)
   *    สร้างครบ wave 1-10 จาก config และขยาย fallback ออกไปต่อท้าย
   *    เพื่อให้ pop(elem) ทีละ wave ได้โดยไม่ขาด สูงสุดถึง wave precomputeTarget
   */
  public precomputeAllWaves(target?: number): void {
    const maxWave = target ?? 10;

    this.masterQueue = [];
    for (let w = 1; w <= maxWave; w++) {
      this.currentPattern = getWavePattern(w);

      if (this.currentPattern) {
        // สร้าง schedule จาก composition (พร้อม shuffle + สะสมเวลา)
        const schedule = this.buildScheduleFromPattern(this.currentPattern, w);
        this.masterQueue.push(schedule);
      } else {
        // fallback (wave 11+) — สร้างแบบ deterministic ต่อท้าย
        const schedule = this.buildFallbackSchedule(w);
        this.masterQueue.push(schedule);
      }
    }
  }

  /**
   * สร้าง Spawn Schedule จาก composition ของ wave (หลัง shuffle)
   *
   * 🎯 ตาม design ที่พี่วาง (ข้อ 2.5):
   *   - นำ type ตาม composition → shuffle ลำดับ
   *   - หลัง shuffle รู้ลำดับแน่นอนแล้ว → สะสมเวลาเกิด "absolute" ล่วงหน้า
   *     (อิง interval ตาม type; ตัวใหญ่/อ้วน → เว้นช่วงเยอะ ตามหลัก อ้วน+ผอม)
   *   - คืนเป็น array {type, timeMs} สำหรับ wave หนึ่ง
   */
  private buildScheduleFromPattern(
    pattern: WavePattern,
    waveNumber: number,
  ): SpawnSchedule[] {
    // รวบรวม type ตาม composition
    const queue: MosquitoType[] = [];
    for (const comp of pattern.composition) {
      for (let i = 0; i < comp.count; i++) {
        queue.push(comp.type);
      }
    }

    // Shuffle queue for variety
    this.shuffleQueue(queue);

    // สะสมเวลาเกิดล่วงหน้า (absolute) ตาม type
    const schedule: SpawnSchedule[] = [];
    let accTime = 0;
    for (const type of queue) {
      accTime += this.getSpawnIntervalFor(type, waveNumber);
      schedule.push({ type, timeMs: accTime });
    }
    return schedule;
  }

  /**
   * Fallback wave สำหรับ wave ที่ไม่มีใน config
   *
   * 🎯 หมายเหตุ (ตาม Docs/suggestion01.md ข้อ 2.2):
   * เดิมสุ่มได้แค่ NORMAL/SPEEDY/TANK/BOSS ทำให้ยุง Counter-Play
   * (ARMORED/STEALTH/SPLITTER) หายไปจาก wave ท้ายๆ ที่ fallback
   * → ป้อม Tesla/UV/Spray ไร้ประโยชน์ช่วงท้ายเกม
   *
   * วิธีแก้: เพิ่ม type พิเศษเข้ามาแบบค่อยเป็นค่อยไปตาม wave
   */
  private buildFallbackSchedule(waveNumber: number): SpawnSchedule[] {
    const count = 8 + waveNumber * 4;
    const schedule: SpawnSchedule[] = [];

    let accTime = 0;
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let type: MosquitoType = "NORMAL";

      // Boss → ทุก 3 wave ตำแหน่งท้าย
      if (waveNumber % 3 === 0 && i === count - 1) {
        type = "BOSS";
      }
      // จัดลำดับความแข็งตาม threshold ที่เพิ่มตาม wave
      else if (waveNumber >= 8 && rand > 0.85) {
        type = "ARMORED";
      } else if (waveNumber >= 6 && rand > 0.8) {
        type = "STEALTH";
      } else if (waveNumber >= 5 && rand > 0.75) {
        type = "SPLITTER";
      } else if (waveNumber >= 5 && rand > 0.55) {
        type = "TANK";
      } else if (waveNumber >= 3 && rand > 0.6) {
        type = "SPEEDY";
      }

      accTime += this.getSpawnIntervalFor(type, waveNumber);
      schedule.push({ type, timeMs: accTime });
    }
    return schedule;
  }

  private shuffleQueue(queue: MosquitoType[]): void {
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  /**
   * เรียกทุก frame เพื่อ spawn ตัวถัดไป
   *
   * 🎯 ตาม Docs/suggestion01.md ข้อ 2.1 (Lazy Spawning):
   * spawnQueue เก็บแค่ `MosquitoType[]` → สร้าง Mosquito instance
   * เฉพาะตัวที่ถึงเวลาจริง (ลดการสร้าง object ค้าง RAM ล่วงหน้า)
   */
  /**
   * เรียกทุก frame เพื่อ spawn ตัวถัดไป (ถ้า "ประตูว่าง")
   *
   * 🎯 ตามที่พี่วาง: ระบบหลังบ้านทำงานเงียบๆ ไม่ต้องให้ผู้เล่นรู้
   *    เกณฑ์ = ถ้าจุดเกิด (ประตูหน้า) ไม่มีอะไรขวาง → ปล่อยตัวต่อไปได้เรื่อยๆ
   *    ถ้ามีตัวใดขวางปากทาง → hold ไว้ก่อน (ยังไม่ shift)
   *
   * @param onScreenMosquitoes ยุงทั้งหมดที่อยู่บนจอ (ใช้ตรวจว่าประตูว่างไหม)
   */
  public update(
    delta: number,
    onScreenMosquitoes?: Mosquito[],
  ): Mosquito | null {
    if (!this.isSpawning || this.spawnSchedule.length === 0) {
      return null;
    }

    // absolute game-time สะสมตั้งแต่เริ่ม wave
    this.gameTime += delta;

    const next = this.spawnSchedule[0];

    // ยังไม่ถึงเวลาเกิด → รอ
    if (this.gameTime < next.timeMs) {
      return null;
    }

    // ถึงเวลาแล้ว แต่ "ประตู (จุดเกิด)" ยังมีอะไรขวาง → hold ไว้ (ไม่ shift)
    if (onScreenMosquitoes && this.isSpawnPointBlocked(onScreenMosquitoes)) {
      return null;
    }

    // ✅ ถึงเวลา + ประตูว่าง → ปล่อยตัวนี้
    this.spawnSchedule.shift();
    this.spawnedCount++;
    return MosquitoFactory.create(
      next.type,
      SPAWN_POSITION.x,
      SPAWN_POSITION.y,
      this.currentWaveNumber,
    );
  }

  /**
   * ตรวจว่า "จุดเกิด / ประตูหน้า" มีอะไรขวางอยู่หรือไม่
   * (ใช้หลักการ อ้วน+ผอม: minGap = size ยุงใหม่ + size ตัวขวาง)
   */
  private isSpawnPointBlocked(onScreenMosquitoes: Mosquito[]): boolean {
    const next = this.spawnSchedule[0];
    if (!next) return false;

    // ขนาดของยุงตัวใหม่ที่ยังไม่ได้สร้าง — ใช้ค่าโดยประมาณจาก config
    const newSize = MosquitoFactory.getSizeOfType(next.type);

    return onScreenMosquitoes.some((m) => {
      const minGap = newSize + m.size;
      return (
        Math.hypot(m.x - SPAWN_POSITION.x, m.y - SPAWN_POSITION.y) < minGap
      );
    });
  }

  /**
   * คำนวณเว้นช่วงการปล่อย (ms) สำหรับยุงแต่ละ type (ใช้ precompute schedule)
   *
   * 🎯 ตาม Docs/suggestion01.md ข้อ 2.3 + design สร้าง schedule ล่วงหน้า:
   * อิง wave + ปรับตามประเภท (ตัวใหญ่/อ้วน → เว้นช่วงเยอะ ตามหลัก อ้วน+ผอม
   * เพื่อให้เกิดห่างกันก่อนที่ proximity จะทำงาน)
   */
  private getSpawnIntervalFor(type: MosquitoType, waveNumber: number): number {
    const base = Math.max(400, 800 - waveNumber * 30);

    switch (type) {
      case "BOSS":
        return base * 3; // บอสเว้นห่างมากสุด
      case "TANK":
      case "ARMORED":
        return base * 1.8; // ตัวใหญ่ เกราะหนา ให้เกิดช้าลง
      case "NORMAL":
      case "SPEEDY":
      case "STEALTH":
      case "SPLITTER":
      default:
        return base; // ตัวเล็ก/เร็ว เกิดถี่ตามปกติ
    }
  }

  public get allSpawned(): boolean {
    return this.spawnSchedule.length === 0;
  }

  public get waveInfo(): WavePattern | null {
    return this.currentPattern;
  }

  public get remainingToSpawn(): number {
    return this.spawnSchedule.length;
  }

  public reset(): void {
    this.spawnSchedule = [];
    this.gameTime = 0;
    this.isSpawning = false;
    this.currentPattern = null;
  }
}
