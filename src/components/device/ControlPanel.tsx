import { memo } from "react";
import { Minus, Pause, Play, Plus, RotateCcw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "running" | "paused" | "over";

type Props = {
  phase: Phase;
  canAdjustTime: boolean;
  onIncMinute: () => void;
  onDecMinute: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onSettings: () => void;
};

const ControlPanel = memo(function ControlPanel({
  phase,
  canAdjustTime,
  onIncMinute,
  onDecMinute,
  onPlayPause,
  onReset,
  onSettings,
}: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full">
      <PhysicalButton
        onClick={onIncMinute}
        disabled={!canAdjustTime}
        ariaLabel="Add one minute"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </PhysicalButton>

      <PhysicalButton onClick={onReset} ariaLabel="Reset clock">
        <RotateCcw className="h-5 w-5" strokeWidth={2.25} />
      </PhysicalButton>

      <PhysicalButton
        onClick={onPlayPause}
        ariaLabel={phase === "running" ? "Pause" : "Play"}
        accent={
          phase === "running"
            ? "amber"
            : phase === "over"
              ? "neutral"
              : "emerald"
        }
      >
        {phase === "running" ? (
          <Pause className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <Play className="h-5 w-5" strokeWidth={2.5} />
        )}
      </PhysicalButton>

      <PhysicalButton
        onClick={onDecMinute}
        disabled={!canAdjustTime}
        ariaLabel="Subtract one minute"
      >
        <Minus className="h-5 w-5" strokeWidth={2.5} />
      </PhysicalButton>

      <PhysicalButton onClick={onSettings} ariaLabel="Settings">
        <Settings className="h-5 w-5" strokeWidth={2.25} />
      </PhysicalButton>
    </div>
  );
});

type AccentColor = "neutral" | "emerald" | "amber";

function PhysicalButton({
  onClick,
  disabled,
  ariaLabel,
  accent = "neutral",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  accent?: AccentColor;
  children: React.ReactNode;
}) {
  const colors: Record<AccentColor, { face: string; rim: string; text: string }> = {
    neutral: {
      face: "from-[#eceff1] via-[#dde2e6] to-[#c5ccd1]",
      rim: "#9aa3a9",
      text: "text-[#1f242a]",
    },
    emerald: {
      face: "from-[#5fd699] via-[#3cbd7d] to-[#1f9a5e]",
      rim: "#13633b",
      text: "text-white",
    },
    amber: {
      face: "from-[#ffd680] via-[#f1b65a] to-[#c98a2c]",
      rim: "#7a4f0f",
      text: "text-[#2a1a02]",
    },
  };
  const c = colors[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "group relative isolate h-12 sm:h-14 rounded-xl",
        "flex items-center justify-center",
        "active:translate-y-[3px] transition-[transform,box-shadow] duration-75",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        disabled && "opacity-40 cursor-not-allowed active:translate-y-0"
      )}
      style={{
        // The "rim" shadow gives the button a physical depth
        boxShadow: disabled
          ? "0 1px 0 rgba(0,0,0,0.4)"
          : `0 3px 0 ${c.rim}, 0 5px 8px rgba(0,0,0,0.4)`,
        touchAction: "manipulation",
      }}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-b",
          c.face,
          c.text,
          "flex items-center justify-center",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.12)]",
          "group-active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.18)]"
        )}
      >
        {children}
      </span>
    </button>
  );
}

export default ControlPanel;
