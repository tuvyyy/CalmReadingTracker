// src/services/audioService.ts

class AudioService {
  private ctx: AudioContext | null = null;
  
  // Ambient nodes
  private oscL: OscillatorNode | null = null;
  private oscR: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  
  private isAmbientPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleAmbient(): boolean {
    this.initCtx();
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  private startAmbient() {
    if (!this.ctx) return;
    this.initCtx();

    // 1. Gain Node for overall ambient
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    // 2. Binaural Oscillators (432 Hz & 442 Hz)
    this.oscL = this.ctx.createOscillator();
    this.oscL.type = 'sine';
    this.oscL.frequency.setValueAtTime(432, this.ctx.currentTime);

    const pannerL = this.ctx.createStereoPanner();
    pannerL.pan.setValueAtTime(-1, this.ctx.currentTime);

    this.oscR = this.ctx.createOscillator();
    this.oscR.type = 'sine';
    this.oscR.frequency.setValueAtTime(442, this.ctx.currentTime);

    const pannerR = this.ctx.createStereoPanner();
    pannerR.pan.setValueAtTime(1, this.ctx.currentTime);

    const beatGain = this.ctx.createGain();
    beatGain.gain.setValueAtTime(0.008, this.ctx.currentTime); // extremely soft hum

    this.oscL.connect(pannerL);
    pannerL.connect(beatGain);

    this.oscR.connect(pannerR);
    pannerR.connect(beatGain);

    beatGain.connect(this.ambientGain);

    // 3. Pink Noise / Water Waves
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = 2 * sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate pink-like noise (1/f approximation)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // normalise
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Filter to modulate wave sweeps
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // LFO for filter frequency modulation (slow breathing rate)
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.07, this.ctx.currentTime); // 14s sweep

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime); // swing between 170Hz and 330Hz

    this.lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waterGain = this.ctx.createGain();
    waterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // smooth ambient water volume

    this.noiseNode.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(this.ambientGain);

    // Start audio sources
    this.oscL.start(0);
    this.oscR.start(0);
    this.noiseNode.start(0);
    this.lfo.start(0);

    // Fade in ambient sound smoothly to prevent pops
    this.ambientGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 1.2);
    
    this.isAmbientPlaying = true;
  }

  private stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    const currentGain = this.ambientGain.gain;
    // Smoothly fade out ambient sound
    currentGain.setValueAtTime(currentGain.value, this.ctx.currentTime);
    currentGain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);

    const targetOscL = this.oscL;
    const targetOscR = this.oscR;
    const targetNoiseNode = this.noiseNode;
    const targetLfo = this.lfo;
    const targetAmbientGain = this.ambientGain;

    setTimeout(() => {
      try {
        if (targetOscL) { targetOscL.stop(); targetOscL.disconnect(); }
        if (targetOscR) { targetOscR.stop(); targetOscR.disconnect(); }
        if (targetNoiseNode) { targetNoiseNode.stop(); targetNoiseNode.disconnect(); }
        if (targetLfo) { targetLfo.stop(); targetLfo.disconnect(); }
        if (targetAmbientGain) { targetAmbientGain.disconnect(); }
      } catch (e) {
        // Source already stopped
      }
    }, 600);

    this.oscL = null;
    this.oscR = null;
    this.noiseNode = null;
    this.lfo = null;
    this.ambientGain = null;

    this.isAmbientPlaying = false;
  }

  public playFeedbackSound(correct: boolean) {
    // Check if muted in LocalStorage settings
    try {
      const stored = localStorage.getItem('pref_sound');
      if (stored === '0') return; // Muted by user preferences
    } catch {
      // ignore
    }

    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dest = this.ctx.destination;

    if (correct) {
      // Correct: Premium Zen chime (bubble/crystal chime at 432 Hz carrier + harmonics)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const gain2 = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, now); // Natural Carrier Focus
      osc1.frequency.exponentialRampToValueAtTime(864, now + 0.15); // Pitch bend up like a bubbly drop

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1296, now); // Harmonic chime

      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      gain2.gain.setValueAtTime(0.04, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain1);
      gain1.connect(dest);
      osc2.connect(gain2);
      gain2.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.3);
    } else {
      // Incorrect: Calm deep drop tone (simulates a heavy water drop ripples sinking into deep water)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3); // Sinking pitch bend

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.5);
    }
  }

  public playTapSound() {
    // Check if muted in LocalStorage settings
    try {
      const stored = localStorage.getItem('pref_sound');
      if (stored === '0') return; // Muted by user preferences
    } catch {
      // ignore
    }

    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

    gain.gain.setValueAtTime(0.015, now); // extremely soft droplet tap
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const audioService = new AudioService();
