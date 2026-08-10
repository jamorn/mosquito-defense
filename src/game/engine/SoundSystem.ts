// src/game/engine/SoundSystem.ts
export type SoundType = 'zap' | 'spray' | 'hit' | 'upgrade' | 'coin' | 'bomb' | 'freeze' | 'heal';

export class SoundSystem {
  private enabled: boolean = true;
  private ctx: AudioContext | null = null;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initCtx(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: SoundType): void {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      switch (type) {
        case 'zap':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.1);
          osc.start();
          osc.stop(now + 0.1);
          break;
        case 'spray':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(150, now + 0.2);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.2);
          osc.start();
          osc.stop(now + 0.2);
          break;
        case 'coin':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(900, now + 0.08);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.2);
          osc.start();
          osc.stop(now + 0.2);
          break;
        case 'hit':
          osc.type = 'square';
          osc.frequency.setValueAtTime(150, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.05);
          osc.start();
          osc.stop(now + 0.05);
          break;
        case 'upgrade':
        case 'heal':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.25);
          osc.start();
          osc.stop(now + 0.25);
          break;
        case 'bomb':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(30, now + 0.5);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.5);
          osc.start();
          osc.stop(now + 0.5);
          break;
        case 'freeze':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.4);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start();
          osc.stop(now + 0.4);
          break;
      }
    } catch (e) {
      // Audio fallback
    }
  }
}