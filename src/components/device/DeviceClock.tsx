import { useCallback, useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LcdScreen from "@/components/device/LcdScreen";
import RockerBar from "@/components/device/RockerBar";
import ControlPanel from "@/components/device/ControlPanel";
import SettingsSheet from "@/components/SettingsSheet";
import GameOverOverlay from "@/components/GameOverOverlay";
import { useChessClock, type Player } from "@/hooks/useChessClock";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useFullscreen } from "@/hooks/useFullscreen";
import { primeAudio, sound } from "@/lib/sound";

const LOW_TIME_MS = 10_000;
const MIN_BASE_MS = 30_000;
const MAX_BASE_MS = 3 * 60 * 60_000;

type Phase = "idle" | "running" | "paused" | "over";
type Side = "L" | "R";

const sideToPlayer = (s: Side): Player => (s === "L" ? 1 : 2);

export default function DeviceClock() {
  const { state, display, tap, start, pause, resume, reset, setConfig } =
    useChessClock();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [overlayDismissed, setOverlayDismissed] = useState(false);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const { trigger: hapticTrigger } = useWebHaptics();
  const triggerRef = useRef(hapticTrigger);
  useEffect(() => {
    triggerRef.current = hapticTrigger;
  }, [hapticTrigger]);

  const fireHaptic = useCallback(
    (...args: Parameters<typeof hapticTrigger>) => {
      if (!state.config.hapticsOn) return;
      triggerRef.current(...args);
    },
    [state.config.hapticsOn]
  );

  const phase: Phase = state.winner
    ? "over"
    : state.active != null
      ? "running"
      : state.paused
        ? "paused"
        : "idle";

  useWakeLock(phase === "running");

  useEffect(() => {
    if (!state.winner) setOverlayDismissed(false);
  }, [state.winner]);

  // Flag-fall sound + haptic
  const winnerRef = useRef<Player | null>(null);
  useEffect(() => {
    if (state.winner && winnerRef.current !== state.winner) {
      winnerRef.current = state.winner;
      if (state.config.soundOn) sound.flagFall();
      if (state.config.hapticsOn) triggerRef.current("error");
    }
    if (!state.winner) winnerRef.current = null;
  }, [state.winner, state.config.soundOn, state.config.hapticsOn]);

  // Low-time tick beeps
  const lastTickSecondRef = useRef<number | null>(null);
  useEffect(() => {
    if (state.active == null || state.winner) {
      lastTickSecondRef.current = null;
      return;
    }
    const ms = display[state.active];
    if (ms > LOW_TIME_MS) {
      lastTickSecondRef.current = null;
      return;
    }
    const sec = Math.ceil(ms / 1000);
    if (lastTickSecondRef.current !== sec && sec > 0) {
      lastTickSecondRef.current = sec;
      if (state.config.soundOn) sound.lowTick();
      if (state.config.hapticsOn) triggerRef.current(25);
    }
  }, [
    display,
    state.active,
    state.winner,
    state.config.soundOn,
    state.config.hapticsOn,
  ]);

  const handleRocker = useCallback(
    (side: Side) => {
      primeAudio();
      const player = sideToPlayer(side);
      if (state.winner) return;
      const willAct =
        !state.started || (!state.paused && state.active === player);
      if (willAct) {
        if (state.config.soundOn) sound.tap();
        fireHaptic("success");
      }
      tap(player);
    },
    [
      tap,
      fireHaptic,
      state.winner,
      state.started,
      state.paused,
      state.active,
      state.config.soundOn,
    ]
  );

  const handlePlayPause = useCallback(() => {
    primeAudio();
    fireHaptic("nudge");
    if (phase === "running") {
      pause();
    } else if (phase === "paused") {
      resume();
    } else if (phase === "over") {
      reset();
    } else {
      start();
    }
  }, [phase, pause, resume, reset, start, fireHaptic]);

  const handleResetRequest = useCallback(() => {
    fireHaptic("nudge");
    if (!state.started || phase === "over") {
      reset();
      return;
    }
    setSettingsOpen(true);
  }, [reset, state.started, phase, fireHaptic]);

  const canAdjustTime = !state.started;

  const handleIncMinute = useCallback(() => {
    if (!canAdjustTime) return;
    fireHaptic(20);
    const next = Math.min(MAX_BASE_MS, state.config.baseMs + 60_000);
    setConfig({ baseMs: next });
  }, [canAdjustTime, fireHaptic, state.config.baseMs, setConfig]);

  const handleDecMinute = useCallback(() => {
    if (!canAdjustTime) return;
    fireHaptic(20);
    const next = Math.max(MIN_BASE_MS, state.config.baseMs - 60_000);
    setConfig({ baseMs: next });
  }, [canAdjustTime, fireHaptic, state.config.baseMs, setConfig]);

  const handleOpenSettings = useCallback(() => {
    fireHaptic(15);
    setSettingsOpen(true);
  }, [fireHaptic]);

  const handleToggleFullscreen = useCallback(() => {
    fireHaptic(15);
    toggleFullscreen();
  }, [fireHaptic, toggleFullscreen]);

  // Map clock state to device-side semantics
  const active: Side | null =
    state.active === 1 ? "L" : state.active === 2 ? "R" : null;
  const pausedSide: Side | null =
    state.pausedActive === 1 ? "L" : state.pausedActive === 2 ? "R" : null;

  // The side that is currently DEPRESSED on the rocker = the player NOT to move
  const pressedSide: Side | null = state.winner
    ? null
    : state.paused
      ? pausedSide === "L"
        ? "R"
        : pausedSide === "R"
          ? "L"
          : null
      : active === "L"
        ? "R"
        : active === "R"
          ? "L"
          : null;

  const lowL = state.active === 1 && display[1] < LOW_TIME_MS;
  const lowR = state.active === 2 && display[2] < LOW_TIME_MS;

  const showOverlay = phase === "over" && !overlayDismissed;
  const winnerSide: Side | null =
    state.winner === 1 ? "L" : state.winner === 2 ? "R" : null;
  const winnerName =
    winnerSide === "L"
      ? state.config.p1Name
      : winnerSide === "R"
        ? state.config.p2Name
        : "";
  const loserName =
    winnerSide === "L"
      ? state.config.p2Name
      : winnerSide === "R"
        ? state.config.p1Name
        : "";

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #0d1626 0%, #050810 55%, #020306 100%)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Floating fullscreen toggle */}
      <button
        type="button"
        onClick={handleToggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/10 active:bg-white/15 flex items-center justify-center transition-colors"
        style={{
          top: "calc(env(safe-area-inset-top) + 12px)",
          right: "calc(env(safe-area-inset-right) + 12px)",
        }}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </button>

      <div
        className={cn(
          "relative w-[clamp(320px,94vw,560px)] mx-auto",
          "rounded-[28px] sm:rounded-[36px]",
          // Chassis: matte graphite with subtle vertical gradient
          "bg-[linear-gradient(180deg,#1a1a1a_0%,#0e0e0e_60%,#070707_100%)]",
          "border border-black/80",
          // Multi-layer shadow for ambient glow + depth
          "shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8),0_10px_25px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]",
          "px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-7",
          "flex flex-col gap-4 sm:gap-5"
        )}
      >
        {/* Power LED + brand mark */}
        <div className="flex items-center justify-between px-1 sm:px-2 -mb-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-300",
                phase === "running"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                  : phase === "paused"
                    ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                    : phase === "over"
                      ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]"
                      : "bg-slate-700"
              )}
            />
            <span className="text-[9px] tracking-[0.32em] font-bold text-slate-500 uppercase">
              Power
            </span>
          </div>
          <span className="text-[10px] tracking-[0.32em] font-black text-slate-500">
            CHESS · TIMER
          </span>
        </div>

        {/* Rocker */}
        <RockerBar
          pressedSide={pressedSide}
          onPress={handleRocker}
          disabled={phase === "over"}
        />

        {/* LCD bezel */}
        <div
          className={cn(
            "relative p-[6px] sm:p-[8px] rounded-[14px]",
            "bg-[linear-gradient(180deg,#3a3a3a_0%,#1f1f1f_50%,#2c2c2c_100%)]",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]"
          )}
        >
          {/* Brushed-metal texture overlay on bezel */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[14px] pointer-events-none opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 3px)",
            }}
          />
          <LcdScreen
            leftMs={display[1]}
            rightMs={display[2]}
            leftName={state.config.p1Name}
            rightName={state.config.p2Name}
            active={active}
            paused={state.paused}
            started={state.started}
            winner={winnerSide}
            moveCount={state.moves[1] + state.moves[2]}
            incrementMs={state.config.incrementMs}
            lowL={lowL}
            lowR={lowR}
          />
        </div>

        {/* Controls */}
        <ControlPanel
          phase={phase}
          canAdjustTime={canAdjustTime}
          onIncMinute={handleIncMinute}
          onDecMinute={handleDecMinute}
          onPlayPause={handlePlayPause}
          onReset={handleResetRequest}
          onSettings={handleOpenSettings}
        />

        {/* Footer with current time control summary */}
        <div className="pt-1 text-center text-[10px] tracking-[0.28em] font-bold text-slate-600 uppercase">
          {formatTimeControlLabel(state.config.baseMs, state.config.incrementMs)}
        </div>
      </div>

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={state.config}
        onChange={setConfig}
        onReset={reset}
        gameStarted={state.started && !state.winner}
      />

      {showOverlay && (
        <GameOverOverlay
          winnerName={winnerName}
          loserName={loserName}
          onPlayAgain={() => {
            reset();
            setOverlayDismissed(true);
          }}
          onDismiss={() => setOverlayDismissed(true)}
        />
      )}
    </div>
  );
}

function formatTimeControlLabel(baseMs: number, incMs: number): string {
  const mins = Math.round(baseMs / 60_000);
  const inc = Math.round(incMs / 1000);
  const base = mins >= 60 ? `${(mins / 60).toFixed(0)}h` : `${mins}m`;
  return inc > 0 ? `${base} + ${inc}s` : base;
}
