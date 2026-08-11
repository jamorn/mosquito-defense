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

export class WaveSystem {
  private currentPattern: WavePattern | null = null;

  // สร้างเฉพาะ type ไว้ล่วงหน้า → ค่อยสร้าง Mosquito instance ตอนถึงเวลา (Lazy)
  // 🎯 ตาม Docs/suggestion01.md ข้อ 2.1
  private spawnQueue: MosquitoType[] = [];
  private spawnTimer: number = 0;
  private isSpawning: boolean = false;
  private totalToSpawn: number = 0;
  private spawnedCount: number = 0;

  /**
   * เริ่ม wave จาก config
   */
  public startWave(waveNumber: number): WavePattern | null {
    this.currentPattern = getWavePattern(waveNumber);

    if (!this.currentPattern) {
      // Fallback: generate random wave for waves beyond config
      this.generateFallbackWave(waveNumber);
    } else {
      this.buildSpawnQueue();
    }

    this.isSpawning = true;
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.totalToSpawn = this.spawnQueue.length;

    return this.currentPattern;
  }

  /**
   * สร้าง spawn queue ตาม composition
   */
  private buildSpawnQueue(): void {
    this.spawnQueue = [];

    if (!this.currentPattern) return;

    for (const comp of this.currentPattern.composition) {
      for (let i = 0; i < comp.count; i++) {
        this.spawnQueue.push(comp.type);
      }
    }

    // Shuffle queue for variety
    this.shuffleQueue();
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
  private generateFallbackWave(waveNumber: number): void {
    this.spawnQueue = [];
    const count = 8 + waveNumber * 4;

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

      this.spawnQueue.push(type);
    }

    this.currentPattern = {
      wave: waveNumber,
      name: `🌊 Wave ${waveNumber}`,
      description: "Wave พิเศษ",
      hint: "💡 ใช้ป้อมให้หลากหลาย",
      composition: [],
      recommendedCounters: [],
      reward: 50 + waveNumber * 10,
    };
  }

  private shuffleQueue(): void {
    for (let i = this.spawnQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.spawnQueue[i], this.spawnQueue[j]] = [
        this.spawnQueue[j],
        this.spawnQueue[i],
      ];
    }
  }

  /**
   * เรียกทุก frame เพื่อ spawn ตัวถัดไป
   *
   * 🎯 ตาม Docs/suggestion01.md ข้อ 2.1 (Lazy Spawning):
   * spawnQueue เก็บแค่ `MosquitoType[]` → สร้าง Mosquito instance
   * เฉพาะตัวที่ถึงเวลาจริง (ลดการสร้าง object ค้าง RAM ล่วงหน้า)
   */
  public update(delta: number): Mosquito | null {
    if (!this.isSpawning || this.spawnQueue.length === 0) {
      return null;
    }

    this.spawnTimer += delta;
    const interval = this.getSpawnInterval();

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.spawnedCount++;
      const type = this.spawnQueue.shift();
      if (!type) return null;
      return MosquitoFactory.create(
        type,
        SPAWN_POSITION.x,
        SPAWN_POSITION.y,
        this.currentPattern?.wave || 1,
      );
    }

    return null;
  }

  /**
   * คำนวณระยะห่างการปล่อยยุง (ms)
   *
   * 🎯 หมายเหตุ (ตาม Docs/suggestion01.md ข้อ 2.3):
   * เดิมคำนวณจาก wave อย่างเดียว → ทุกตัวใน wave ได้ interval เท่ากัน
   * ทำให้ TANK/BOSS (ตัวใหญ่) เกิดถี่พอๆ กับ SPEEDY/NORMAL (ตัวเล็ก)
   * → เกม pacing ไม่ตื่นเต้น
   *
   * วิธีแก้: ปรับตามประเภทของยุงตัวถัดไป (ตัวหน้าสุดของ spawnQueue)
   *   - ตัวเล็ก/เร็ว (NORMAL, SPEEDY, STEALTH, SPLITTER): interval ปกติ
   *   - ตัวใหญ่/เกราะหนา (TANK, ARMORED): interval ยาวขึ้น (เกิดช้าลง)
   *   - BOSS: interval ยาวที่สุด (บอสเกิดห่างมาก)
   */
  private getSpawnInterval(): number {
    const wave = this.currentPattern?.wave || 1;
    const base = Math.max(400, 800 - wave * 30);

    // ดูประเภทของยุงตัวถัดไปที่จะปล่อย (ตัวหน้าสุดของ queue)
    const next = this.spawnQueue[0];
    if (!next) return base;

    switch (next) {
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
    return this.spawnQueue.length === 0;
  }

  public get waveInfo(): WavePattern | null {
    return this.currentPattern;
  }

  public get remainingToSpawn(): number {
    return this.spawnQueue.length;
  }

  public reset(): void {
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.isSpawning = false;
    this.currentPattern = null;
  }
}
