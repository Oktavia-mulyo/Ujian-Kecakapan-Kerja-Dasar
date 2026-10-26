// Audio Proctoring Alarm using Web Audio API

class AudioManager {
  private ctx: AudioContext | null = null;
  private intervalId: number | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initUserGesture(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  public playSingleBeep(frequency = 740, duration = 0.22, volume = 0.085): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted in current context
    }
  }

  public startAlarmLoop(): void {
    if (this.intervalId !== null || this.isMuted) return;
    this.playSingleBeep(880, 0.25, 0.1);
    this.intervalId = window.setInterval(() => {
      this.playSingleBeep(740, 0.22, 0.09);
    }, 600);
  }

  public stopAlarmLoop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopAlarmLoop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundManager = new AudioManager();
