// src/game/systems/WaveSystem.ts 
import { WAVE_PATTERNS, WavePattern, getWavePattern } from '../../config/waves.config';
import { MosquitoFactory } from '../entities/mosquitoes/MosquitoFactory';
import { Mosquito } from '../entities/mosquitoes/Mosquito';
import { Point } from '../../types/game.types';
import { SPAWN_POSITION } from '../constants/path';

export class WaveSystem {
  private currentPattern: WavePattern | null = null;
  private spawnQueue: Mosquito[] = [];
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
        const mosquito = MosquitoFactory.create(
          comp.type,
          SPAWN_POSITION.x,
          SPAWN_POSITION.y,
          this.currentPattern.wave
        );
        this.spawnQueue.push(mosquito);
      }
    }
    
    // Shuffle queue for variety
    this.shuffleQueue();
  }
  
  /**
   * Fallback wave สำหรับ wave ที่ไม่มีใน config
   */
  private generateFallbackWave(waveNumber: number): void {
    this.spawnQueue = [];
    const count = 8 + waveNumber * 4;
    
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let type: 'NORMAL' | 'SPEEDY' | 'TANK' | 'BOSS' = 'NORMAL';
      
      if (waveNumber % 3 === 0 && i === count - 1) {
        type = 'BOSS';
      } else if (waveNumber >= 5 && rand > 0.8) {
        type = 'TANK';
      } else if (waveNumber >= 3 && rand > 0.6) {
        type = 'SPEEDY';
      }
      
      const mosquito = MosquitoFactory.create(
        type,
        SPAWN_POSITION.x,
        SPAWN_POSITION.y,
        waveNumber
      );
      this.spawnQueue.push(mosquito);
    }
    
    this.currentPattern = {
      wave: waveNumber,
      name: `🌊 Wave ${waveNumber}`,
      description: 'Wave พิเศษ',
      hint: '💡 ใช้ป้อมให้หลากหลาย',
      composition: [],
      recommendedCounters: [],
      reward: 50 + waveNumber * 10,
    };
  }
  
  private shuffleQueue(): void {
    for (let i = this.spawnQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.spawnQueue[i], this.spawnQueue[j]] = [this.spawnQueue[j], this.spawnQueue[i]];
    }
  }
  
  /**
   * เรียกทุก frame เพื่อ spawn ตัวถัดไป
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
      return this.spawnQueue.shift() || null;
    }
    
    return null;
  }
  
  private getSpawnInterval(): number {
    const wave = this.currentPattern?.wave || 1;
    return Math.max(400, 800 - wave * 30);
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