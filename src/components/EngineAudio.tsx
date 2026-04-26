import { useEffect, useRef, useState } from "react";

/**
 * Synthesized engine audio using Web Audio API — no external assets.
 * - Idle hum: low sawtooth + lowpass filter, gently modulated.
 * - Rev burst: pitch envelope on the same oscillator on demand.
 * Off by default. Toggleable via top-right button.
 */

type EngineAudioHandle = {
  rev: () => void;
};

let globalHandle: EngineAudioHandle | null = null;

export function playRevBurst() {
  globalHandle?.rev();
}

export function EngineAudio() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    globalHandle = {
      rev: () => {
        if (!on || !ctxRef.current || !oscRef.current || !gainRef.current) return;
        const ctx = ctxRef.current;
        const osc = oscRef.current;
        const g = gainRef.current;
        const t = ctx.currentTime;
        osc.frequency.cancelScheduledValues(t);
        osc.frequency.setValueAtTime(60, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.9);
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.08);
        g.gain.linearRampToValueAtTime(0.06, t + 0.95);
      },
    };
    return () => {
      globalHandle = null;
    };
  }, [on]);

  const start = async () => {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    await ctx.resume();
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 60;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 4;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    // Slow LFO for breathing idle
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.6;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);

    ctxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;
    lfoRef.current = lfo;
    setOn(true);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    if (ctx && gainRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      setTimeout(() => {
        oscRef.current?.stop();
        lfoRef.current?.stop();
        ctx.close();
        ctxRef.current = null;
        oscRef.current = null;
        gainRef.current = null;
        lfoRef.current = null;
      }, 350);
    }
    setOn(false);
  };

  return (
    <button
      type="button"
      aria-label={on ? "Mute engine audio" : "Unmute engine audio"}
      aria-pressed={on}
      onClick={() => (on ? stop() : start())}
      className="fixed right-5 top-5 z-[9990] flex h-10 w-10 items-center justify-center rounded-full border border-ember/50 bg-black/60 text-ember-glow backdrop-blur-md transition hover:bg-ember/20"
      data-cursor-label={on ? "MUTE" : "UNMUTE"}
    >
      {on ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}