import { useEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return size;
}
