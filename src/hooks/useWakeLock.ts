import { useEffect } from "react";

type WakeLockSentinel = {
  release: () => Promise<void>;
  addEventListener: (event: "release", cb: () => void) => void;
};

type NavigatorWakeLock = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
};

export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (typeof navigator === "undefined") return;
    const nav = navigator as NavigatorWakeLock;
    if (!nav.wakeLock) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        if (cancelled) return;
        sentinel = (await nav.wakeLock!.request("screen")) ?? null;
        sentinel?.addEventListener("release", () => {
          sentinel = null;
        });
      } catch {
        // user gesture missing, permission denied, etc. — silently ignore
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible" && !sentinel && !cancelled) {
        request();
      }
    };

    request();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      sentinel?.release().catch(() => {});
      sentinel = null;
    };
  }, [active]);
}
