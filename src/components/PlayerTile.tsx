import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/format";

type State = "idle" | "ready" | "active" | "waiting" | "paused" | "loser" | "winner";

type Props = {
  name: string;
  ms: number;
  state: State;
  lowTime: boolean;
  onTap: () => void;
  rotated?: boolean;
  hint?: string;
  moves?: number;
};

const stateBg: Record<State, string> = {
  idle: "bg-slate-800",
  ready: "bg-slate-800",
  active: "bg-emerald-600",
  waiting: "bg-slate-800/90",
  paused: "bg-amber-700/70",
  loser: "bg-rose-900",
  winner: "bg-emerald-700",
};

const PlayerTile = memo(function PlayerTile({
  name,
  ms,
  state,
  lowTime,
  onTap,
  rotated = false,
  hint,
  moves,
}: Props) {
  const time = formatTime(ms);
  const isActive = state === "active";
  const showPulse = isActive && lowTime;
  const bg = lowTime && isActive ? "bg-rose-600" : stateBg[state];

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${name} — ${time}`}
      aria-pressed={isActive}
      className={cn(
        "relative w-full h-full flex flex-col items-center justify-center select-none",
        "transition-colors duration-200 outline-none",
        "focus-visible:ring-4 focus-visible:ring-white/30",
        "active:brightness-110",
        bg,
        rotated && "[transform:rotate(180deg)]",
        showPulse && "animate-pulse"
      )}
      style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase",
          isActive ? "text-white/90" : "text-slate-300/70"
        )}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isActive ? "bg-white" : "bg-slate-500"
          )}
        />
        {name}
      </div>

      <div
        className={cn(
          "font-mono font-bold tabular-nums leading-none",
          "text-[18vw] sm:text-[14vw] md:text-[10vw]",
          isActive ? "text-white" : "text-slate-200",
          state === "loser" && "text-rose-200",
          state === "winner" && "text-white"
        )}
      >
        {time}
      </div>

      {moves !== undefined && (
        <div
          className={cn(
            "absolute bottom-4 left-4 text-[10px] font-medium tracking-wider uppercase",
            isActive ? "text-white/70" : "text-slate-400/70"
          )}
        >
          {moves} {moves === 1 ? "move" : "moves"}
        </div>
      )}

      {hint && (
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium",
            isActive ? "text-white/80" : "text-slate-400"
          )}
        >
          {hint}
        </div>
      )}
    </button>
  );
});

export default PlayerTile;
