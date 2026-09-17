/**
 * Tiny synthesized sound effects (Web Audio API). No audio files to download:
 * every sound is a few oscillator notes generated on the fly.
 */
export type SoundName = "pop" | "click" | "toggleOn" | "toggleOff" | "whoosh" | "sparkle" | "beep" | "send";

type Note = { freq: number; endFreq?: number; start: number; duration: number; type?: OscillatorType; gain?: number };

const SOUNDS: Record<SoundName, Note[]> = {
  pop: [{ freq: 520, endFreq: 880, start: 0, duration: 0.07, type: "sine", gain: 0.18 }],
  click: [{ freq: 1400, endFreq: 900, start: 0, duration: 0.03, type: "square", gain: 0.05 }],
  toggleOn: [
    { freq: 440, start: 0, duration: 0.06, type: "triangle", gain: 0.14 },
    { freq: 660, start: 0.06, duration: 0.08, type: "triangle", gain: 0.14 },
  ],
  toggleOff: [
    { freq: 660, start: 0, duration: 0.06, type: "triangle", gain: 0.14 },
    { freq: 440, start: 0.06, duration: 0.08, type: "triangle", gain: 0.14 },
  ],
  whoosh: [{ freq: 200, endFreq: 900, start: 0, duration: 0.18, type: "sawtooth", gain: 0.03 }],
  sparkle: [
    { freq: 1318, start: 0, duration: 0.05, type: "sine", gain: 0.09 },
    { freq: 1760, start: 0.05, duration: 0.05, type: "sine", gain: 0.08 },
    { freq: 2349, start: 0.1, duration: 0.08, type: "sine", gain: 0.06 },
  ],
  beep: [
    { freq: 880, start: 0, duration: 0.08, type: "square", gain: 0.05 },
    { freq: 587, start: 0.1, duration: 0.1, type: "square", gain: 0.05 },
  ],
  send: [{ freq: 330, endFreq: 990, start: 0, duration: 0.12, type: "sine", gain: 0.12 }],
};

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playSound(name: SoundName) {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  for (const note of SOUNDS[name]) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = note.type ?? "sine";
    const t0 = now + note.start;
    const t1 = t0 + note.duration;
    osc.frequency.setValueAtTime(note.freq, t0);
    if (note.endFreq) osc.frequency.exponentialRampToValueAtTime(note.endFreq, t1);
    const peak = note.gain ?? 0.1;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.01, note.duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t1);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t1 + 0.02);
  }
}
