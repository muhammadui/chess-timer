import { memo } from "react";
import { cn } from "@/lib/utils";

type Side = "L" | "R";

type Props = {
  /** Which side is currently depressed (the player who last pressed) */
  pressedSide: Side | null;
  onPress: (side: Side) => void;
  disabled?: boolean;
};

/**
 * Two-half rocker switch. Each side is its own tap target; pressing tilts
 * the rocker in 3D and the side stays depressed until the opponent presses.
 */
const RockerBar = memo(function RockerBar({
  pressedSide,
  onPress,
  disabled,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full",
        // Allow 3D children to tilt
        "[perspective:900px]"
      )}
    >
      {/* Recessed track that the rocker sits inside */}
      <div
        className={cn(
          "relative w-full h-[clamp(56px,12vw,76px)]",
          "rounded-t-[18px]",
          "bg-[#0a0a0a]",
          "border border-black/60",
          "shadow-[inset_0_4px_10px_rgba(0,0,0,0.7),inset_0_-1px_0_rgba(255,255,255,0.04)]",
          "overflow-hidden"
        )}
      >
        {/* The rocker pad — a single visual piece, but tappable as two halves */}
        <div
          className={cn(
            "absolute inset-0",
            "transition-transform duration-150 ease-out",
            "[transform-style:preserve-3d]"
          )}
          style={{
            transform:
              pressedSide === "L"
                ? "rotateX(6deg) rotateY(-6deg)"
                : pressedSide === "R"
                  ? "rotateX(6deg) rotateY(6deg)"
                  : "rotateX(0) rotateY(0)",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-t-[16px]",
              "bg-gradient-to-b from-[#f3f3f3] via-[#e8e8e8] to-[#cdcdcd]",
              "shadow-[inset_0_6px_10px_rgba(0,0,0,0.18),inset_0_-2px_4px_rgba(0,0,0,0.08)]"
            )}
          >
            {/* Center seam */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[rgba(0,0,0,0.22)]"
            />
            {/* Subtle finger-grip ridges on each side */}
            <div
              aria-hidden
              className="absolute left-[14%] top-1/2 -translate-y-1/2 w-[14%] h-[40%] opacity-[0.18] rounded-sm"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 5px)",
              }}
            />
            <div
              aria-hidden
              className="absolute right-[14%] top-1/2 -translate-y-1/2 w-[14%] h-[40%] opacity-[0.18] rounded-sm"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 5px)",
              }}
            />
          </div>
        </div>

        {/* Tap targets — two transparent halves above the rocker pad */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onPress("L")}
          aria-label="Left player pressed"
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1/2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
            "active:brightness-110",
            disabled && "cursor-not-allowed"
          )}
          style={{ touchAction: "manipulation" }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onPress("R")}
          aria-label="Right player pressed"
          className={cn(
            "absolute right-0 top-0 bottom-0 w-1/2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
            "active:brightness-110",
            disabled && "cursor-not-allowed"
          )}
          style={{ touchAction: "manipulation" }}
        />
      </div>
    </div>
  );
});

export default RockerBar;
