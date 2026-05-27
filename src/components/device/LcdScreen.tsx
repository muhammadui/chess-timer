import { memo } from "react";
import { cn } from "@/lib/utils";
import SevenSegment from "@/components/device/SevenSegment";
import { formatTime } from "@/lib/format";

type Side = "L" | "R";

type Props = {
  leftMs: number;
  rightMs: number;
  leftName: string;
  rightName: string;
  active: Side | null;
  paused: boolean;
  started: boolean;
  winner: Side | null;
  moveCount: number;
  incrementMs: number;
  lowL: boolean;
  lowR: boolean;
};

function statusLabel(p: Props): string {
  if (p.winner) return "END";
  if (p.active != null) return "LIVE";
  if (p.paused) return "PAUSE";
  if (p.started) return "HOLD";
  return "READY";
}

/**
 * The LCD glass: two large digit groups with a thin instrumentation strip
 * between them. The whole panel is wrapped by a brushed-metal bezel in the
 * parent (DeviceClock).
 */
const LcdScreen = memo(function LcdScreen({
  leftMs,
  rightMs,
  leftName,
  rightName,
  active,
  paused,
  started,
  winner,
  moveCount,
  incrementMs,
  lowL,
  lowR,
}: Props) {
  const status = statusLabel({
    leftMs,
    rightMs,
    leftName,
    rightName,
    active,
    paused,
    started,
    winner,
    moveCount,
    incrementMs,
    lowL,
    lowR,
  });

  const leftStr = formatTime(leftMs);
  const rightStr = formatTime(rightMs);
  const incSec = Math.round(incrementMs / 1000);

  return (
    <div
      className={cn(
        "relative w-full select-none",
        "rounded-[10px] overflow-hidden",
        "shadow-[inset_0_4px_14px_rgba(0,0,0,0.35),inset_0_-1px_2px_rgba(255,255,255,0.08)]"
      )}
      style={{
        // LCD glass: warm-ish olive-green like a real STN screen
        background:
          "linear-gradient(180deg, #b9c8b1 0%, #a5b79c 45%, #91a589 100%)",
      }}
    >
      {/* Sheen overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 28%, transparent 60%)",
        }}
      />
      {/* Very faint scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.7) 0 1px, transparent 1px 3px)",
        }}
      />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-stretch px-3 py-4 sm:px-5 sm:py-5">
        {/* LEFT side */}
        <Side
          name={leftName}
          timeStr={leftStr}
          active={active === "L"}
          flagged={!!winner && leftMs <= 0}
          low={lowL}
        />

        {/* Middle instrumentation column */}
        <div className="relative flex flex-col items-center justify-center px-2 sm:px-3">
          <div
            aria-hidden
            className="absolute inset-y-2 left-0 w-px bg-[rgba(20,30,18,0.25)]"
          />
          <div
            aria-hidden
            className="absolute inset-y-2 right-0 w-px bg-[rgba(20,30,18,0.25)]"
          />

          <div className="text-[#1a2018] flex flex-col items-center gap-1.5">
            <div className="text-[10px] tracking-[0.18em] font-bold opacity-70">
              MOVE
            </div>
            <SevenSegment
              value={String(moveCount).padStart(2, "0")}
              className="text-[clamp(1.2rem,5vw,1.6rem)] text-[#1a2018]"
            />

            <div className="mt-1 w-full border-t border-[rgba(20,30,18,0.22)]" />

            <div
              className={cn(
                "text-[10px] tracking-[0.22em] font-black",
                status === "LIVE" && active != null && "text-[#1a2018]",
                status === "END" && "text-[#7a0000]"
              )}
            >
              {status}
            </div>

            {incSec > 0 && (
              <div className="mt-1 text-[9px] tracking-[0.15em] font-bold opacity-70">
                +{incSec}s
              </div>
            )}
          </div>
        </div>

        {/* RIGHT side */}
        <Side
          name={rightName}
          timeStr={rightStr}
          active={active === "R"}
          flagged={!!winner && rightMs <= 0}
          low={lowR}
        />
      </div>
    </div>
  );
});

function Side({
  name,
  timeStr,
  active,
  flagged,
  low,
}: {
  name: string;
  timeStr: string;
  active: boolean;
  flagged: boolean;
  low: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="flex items-center gap-1.5 mb-1">
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            active ? "bg-[#10472a] shadow-[0_0_4px_#10472a]" : "bg-[#1a2018]/30"
          )}
        />
        <span className="text-[10px] tracking-[0.22em] font-black text-[#1a2018]/80 uppercase">
          {name}
        </span>
      </div>

      <SevenSegment
        value={timeStr}
        className={cn(
          "text-[clamp(2.4rem,11vw,4rem)]",
          flagged ? "text-[#8b0000] animate-pulse" : "text-[#101510]",
          !active && !flagged && "opacity-70",
          low && active && !flagged && "text-[#7a1010] animate-pulse"
        )}
      />
    </div>
  );
}

export default LcdScreen;
