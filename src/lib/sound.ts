let ctx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
};

export const primeAudio = () => {
  const ac = getCtx();
  if (ac && ac.state === "suspended") ac.resume().catch(() => {});
};

const beep = (freq: number, durationMs: number, gain = 0.08) => {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(ac.destination);
  const now = ac.currentTime;
  osc.start(now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.stop(now + durationMs / 1000 + 0.02);
};

export const sound = {
  tap: () => beep(880, 35, 0.06),
  lowTick: () => beep(1100, 80, 0.08),
  flagFall: () => {
    beep(220, 180, 0.12);
    setTimeout(() => beep(180, 260, 0.12), 200);
    setTimeout(() => beep(140, 360, 0.12), 460);
  },
};
