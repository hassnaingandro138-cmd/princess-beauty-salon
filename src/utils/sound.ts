// Cute synthesized Web Audio API sound effects for Princess Beauty Salon

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastPlayedAt: Record<string, number> = {};

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private canPlay(key: string, cooldownMs: number): boolean {
    const now = performance.now();
    const prev = this.lastPlayedAt[key] || 0;
    if (now - prev < cooldownMs) return false;
    this.lastPlayedAt[key] = now;
    return true;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.08,
    delay: number = 0,
    slideToFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideToFreq, startTime + duration);
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  public playTap() {
    if (!this.canPlay('tap', 40)) return;
    this.tone(660, 0.08, 'triangle', 0.06, 0, 880);
  }

  public playBubble() {
    if (!this.canPlay('bubble', 90)) return;
    const base = 420 + Math.random() * 240;
    this.tone(base, 0.1, 'sine', 0.06, 0, base * 1.45);
  }

  public playMist() {
    if (!this.canPlay('mist', 140)) return;
    this.tone(920, 0.09, 'sine', 0.035, 0, 1280);
    this.tone(1180, 0.11, 'triangle', 0.03, 0.04, 1520);
  }

  public playBrush() {
    if (!this.canPlay('brush', 110)) return;
    this.tone(540, 0.12, 'triangle', 0.045, 0, 720);
    this.tone(780, 0.1, 'sine', 0.04, 0.05, 960);
  }

  public playPolish() {
    if (!this.canPlay('polish', 70)) return;
    this.tone(784, 0.12, 'sine', 0.06, 0);
    this.tone(1046.5, 0.15, 'triangle', 0.05, 0.05);
  }

  public playSparkle() {
    if (!this.canPlay('sparkle', 150)) return;
    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((n, idx) => {
      this.tone(n, 0.16, 'sine', 0.055, idx * 0.045);
    });
  }

  public playDressUp() {
    if (!this.canPlay('dressup', 90)) return;
    this.tone(523.25, 0.12, 'triangle', 0.06, 0);
    this.tone(659.25, 0.14, 'triangle', 0.055, 0.06);
    this.tone(783.99, 0.18, 'sine', 0.05, 0.12);
  }

  public playRevealFanfare() {
    if (!this.canPlay('fanfare', 400)) return;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chord.forEach((freq, idx) => {
      this.tone(freq, 0.35, idx % 2 === 0 ? 'triangle' : 'sine', 0.065, idx * 0.075);
    });
  }
}

export const soundFX = new SoundEngine();
