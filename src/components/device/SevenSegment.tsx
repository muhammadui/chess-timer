import { memo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  /** Number of digit slots to reserve; pads with leading ghosts */
  pad?: number;
  className?: string;
  dim?: boolean;
};

const DIGIT_RE = /\d/;

function ghostFor(char: string): string {
  if (DIGIT_RE.test(char)) return "8";
  return char;
}

/**
 * Renders an LCD-style numeric string with a faint "all segments on" ghost
 * behind every visible character — the classic 7-segment LCD feel.
 */
const SevenSegment = memo(function SevenSegment({
  value,
  pad,
  className,
  dim = false,
}: Props) {
  const chars = pad
    ? value.padStart(pad, " ").split("")
    : value.split("");

  return (
    <span
      className={cn(
        "inline-flex font-mono font-bold tracking-[0.05em] tabular-nums",
        "leading-none whitespace-pre",
        dim && "opacity-60",
        className
      )}
      style={{
        textShadow: "0 0 1px rgba(0,0,0,0.35)",
      }}
      aria-label={value}
    >
      {chars.map((c, i) => {
        if (c === " ") {
          return (
            <span key={i} className="inline-grid place-items-center">
              <span className="invisible">8</span>
            </span>
          );
        }
        return (
          <span key={i} className="relative inline-grid place-items-center">
            <span
              aria-hidden
              className="col-start-1 row-start-1 opacity-[0.12]"
            >
              {ghostFor(c)}
            </span>
            <span className="col-start-1 row-start-1">{c}</span>
          </span>
        );
      })}
    </span>
  );
});

export default SevenSegment;
