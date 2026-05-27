export const vibrate = (pattern: number | number[]) => {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // ignore — not all devices honor this
  }
};

export const haptics = {
  tap: () => vibrate(15),
  lowTick: () => vibrate(8),
  flagFall: () => vibrate([120, 80, 120, 80, 240]),
};
