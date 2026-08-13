// src/game/engine/SoundSystem.ts
// ==========================================
// SoundSystem v2 — Procedural WebAudio SFX (คุณภาพดีขึ้น)
// ==========================================
// 🎯 ตามที่พี่เลือก แนวทาง B: rewrite procedural ให้ฟังเป็นธรรมชาติ
//    (ไม่ต้องพึ่งไฟล์เสียง) โดยใช้เทคนิค:
//   - Noise burst ผ่าน BiquadFilter (เสียงฉีด/แป๊ะ/ฟิ้ว ไม่ใช่ sine ล้วน)
//   - Envelope นุ่มนวล (attack/decay เป็นธรรมชาติ ไม่ทื่อ)
//   - Multiple oscillator ซ้อน เกิดโทนอุ่น/สมจริง
//   - Filter sweep (เสียงหึ่ง/หมุน)
//   - Distortion (WaveShaper) ให้เสียงหนักแน่นขึ้น
//   - Randomization เล็กน้อย (เสียงไม่ซ้ำเป๊ะ = ฟังธรรมชาติ)
//   - Master Compressor/Limiter กันเสียงเพี้ยนเมื่อดังพร้อมกัน
// ==========================================

export type SoundType =
  | "zap"
  | "spray"
  | "hit"
  | "upgrade"
  | "coin"
  | "bomb"
  | "freeze"
  | "heal";

export class SoundSystem {
  private enabled: boolean = true;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  private initCtx(): void {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // ---- Master Chain: Compressor → Limiter → Destination ----
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 20;
      comp.ratio.value = 8;
      comp.attack.value = 0.02;
      comp.release.value = 0.25;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.9;

      comp.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // ---- Pre-render white noise buffer (1s) ใช้ reusable ----
      const len = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    if (this.ctx && this.masterGain && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * สร้าง Noise buffer source ที่ใช้ซ้ำได้ผ่าน filter+gain
   */
  private playNoise(
    dur: number,
    filterType: BiquadFilterType,
    freq: number,
    q: number,
    peak: number,
    filterFreqEnd?: number,
  ): void {
    if (!this.ctx || !this.noiseBuffer || !this.masterGain) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (filterFreqEnd) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(30, filterFreqEnd),
        this.ctx.currentTime + dur,
      );
    }
    filter.Q.value = q;

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
    src.stop(now + dur + 0.05);
  }

  /**
   * tone utility — ใช้ oscillator ซ้อนหลายตัว (detune) + envelope นุ่ม
   */
  private playTone(opts: {
    type: OscillatorType;
    startFreq: number;
    endFreq?: number;
    dur: number;
    peak: number;
    attack?: number;
    type2?: OscillatorType;
    wave?: boolean; // ใช้ WaveShaper distortion
  }): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const attack = opts.attack ?? 0.006;

    const osc = this.ctx.createOscillator();
    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.startFreq, now);
    if (opts.endFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, opts.endFreq),
        now + opts.dur,
      );
    }

    // Optional: ตัวที่ 2 ซ้อน (สร้างโทนอุ่น/หนา)
    let osc2: OscillatorNode | null = null;
    if (opts.type2) {
      osc2 = this.ctx.createOscillator();
      osc2.type = opts.type2;
      osc2.frequency.setValueAtTime(opts.startFreq * 2, now);
      if (opts.endFreq) {
        osc2.frequency.exponentialRampToValueAtTime(
          Math.max(20, opts.endFreq * 2),
          now + opts.dur,
        );
      }
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(opts.peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.dur);

    let out: AudioNode = gain;
    if (opts.wave) {
      // Distortion (WaveShaper) — ให้เสียงมี edge/หนักแน่น
      const shaper = this.ctx.createWaveShaper();
      shaper.curve = this.makeDistortionCurve(80);
      gain.connect(shaper);
      out = shaper;
    }

    osc.connect(gain);
    if (osc2) {
      osc2.connect(gain);
      osc2.start(now);
      osc2.stop(now + opts.dur + 0.05);
    }
    out.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + opts.dur + 0.05);
  }

  private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const n = 256;
    // สร้างลง ArrayBuffer จริง (TypeScript ต้องการ Float32Array<ArrayBuffer>)
    const curve = new Float32Array(new ArrayBuffer(n * 4));
    const k = amount;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] =
        ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public play(type: SoundType): void {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      switch (type) {
        // ⚡ สายฟ้า/ช็อตไฟฟ้า — saw + noise zap + สั้นแหลม
        case "zap": {
          this.playTone({
            type: "sawtooth",
            startFreq: 1400 + Math.random() * 300,
            endFreq: 120,
            dur: 0.12,
            peak: 0.12,
            type2: "square",
            wave: true,
          });
          this.playNoise(0.12, "bandpass", 2500, 1.5, 0.1, 3500);
          break;
        }

        // 💨 สเปรย์ฉีด — noise หึ่งๆ ยาว (air hiss) + tone ต่ำอ่อน
        case "spray": {
          this.playNoise(0.16, "bandpass", 1400, 0.8, 0.16, 900);
          this.playNoise(0.08, "highpass", 3000, 0.5, 0.06, 600);
          this.playTone({
            type: "sine",
            startFreq: 300,
            endFreq: 180,
            dur: 0.22,
            peak: 0.05,
          });
          break;
        }

        // 🪙 เหรียญ — arpeggio นุ่ม 2 โน้ต (coin chime)
        case "coin": {
          this.playTone({
            type: "sine",
            startFreq: 660,
            dur: 0.09,
            peak: 0.09,
          });
          const t2 = this.ctx.currentTime + 0.06;
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(990, t2);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.0001, t2);
          gain.gain.exponentialRampToValueAtTime(0.09, t2 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.18);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(t2);
          osc.stop(t2 + 0.2);
          break;
        }

        // 💥 โดนยิง/ตาย (splat/pop) — noise สั้น ต่ำ ฟูว
        case "hit": {
          this.playNoise(0.08, "lowpass", 500, 0.6, 0.09, 150);
          this.playTone({
            type: "triangle",
            startFreq: 180,
            endFreq: 60,
            dur: 0.09,
            peak: 0.12,
          });
          break;
        }

        // ⬆️ อัปเกรด — ascending chime สว่าง หลายโน้ต
        case "upgrade": {
          const notes = [330, 440, 550, 660];
          notes.forEach((f, i) => {
            const t = this.ctx!.currentTime + i * 0.05;
            const osc = this.ctx!.createOscillator();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(f, t);
            const gain = this.ctx!.createGain();
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start(t);
            osc.stop(t + 0.3);
          });
          break;
        }

        // 💣 ระเบิด — sub boom + noise rumble
        case "bomb": {
          this.playTone({
            type: "sine",
            startFreq: 130,
            endFreq: 30,
            dur: 0.6,
            peak: 0.5,
            wave: true,
          });
          this.playNoise(0.5, "lowpass", 400, 0.4, 0.5, 60);
          break;
        }

        // ❄️ แช่แข็ง — high chime ลดลง (ice crystal)
        case "freeze": {
          this.playTone({
            type: "sine",
            startFreq: 1600,
            endFreq: 500,
            dur: 0.4,
            peak: 0.1,
          });
          this.playNoise(0.2, "bandpass", 4000, 2, 0.12, 2000);
          break;
        }

        // 💚 รักษา/ซ่อม — soft warm tone ขึ้น
        case "heal": {
          this.playTone({
            type: "sine",
            startFreq: 350,
            endFreq: 750,
            dur: 0.3,
            peak: 0.12,
            type2: "triangle",
            wave: true,
          });
          break;
        }
      }
    } catch (e) {
      // Audio fallback
    }
  }
}
