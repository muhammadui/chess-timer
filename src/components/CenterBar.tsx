import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "running" | "paused" | "over";

type Props = {
  phase: Phase;
  isFullscreen: boolean;
  onPrimary: () => void;
  onSettings: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
};

export default function CenterBar({
  phase,
  isFullscreen,
  onPrimary,
  onSettings,
  onReset,
  onToggleFullscreen,
}: Props) {
  const primaryIcon =
    phase === "running" ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />;
  const primaryLabel =
    phase === "running" ? "Pause" : phase === "paused" ? "Resume" : phase === "over" ? "New game" : "Start";

  return (
    <div
      className={cn(
        "shrink-0 w-full bg-slate-950 border-y border-white/5",
        "flex items-center justify-between px-4 py-2 gap-2"
      )}
    >
      <button
        type="button"
        onClick={onSettings}
        aria-label="Settings"
        className="h-11 w-11 rounded-full text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors"
      >
        <Settings className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset"
          className="h-11 w-11 rounded-full text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onPrimary}
          aria-label={primaryLabel}
          className={cn(
            "h-14 min-w-[140px] px-6 rounded-full flex items-center justify-center gap-2",
            "font-semibold text-white shadow-lg shadow-black/30",
            "transition-transform active:scale-95",
            phase === "running"
              ? "bg-amber-600 hover:bg-amber-500"
              : "bg-emerald-600 hover:bg-emerald-500"
          )}
        >
          {primaryIcon}
          <span className="tracking-wide">{primaryLabel}</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="h-11 w-11 rounded-full text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>

      <div className="h-11 w-11" aria-hidden />
    </div>
  );
}
