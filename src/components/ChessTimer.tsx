import { useCallback, useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import PlayerTile from "@/components/PlayerTile";
import CenterBar from "@/components/CenterBar";
import SettingsSheet from "@/components/SettingsSheet";
import GameOverOverlay from "@/components/GameOverOverlay";
import { useChessClock, type Player } from "@/hooks/useChessClock";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useFullscreen } from "@/hooks/useFullscreen";
import { primeAudio, sound } from "@/lib/sound";

const LOW_TIME_MS = 10_000;

type Phase = "idle" | "running" | "paused" | "over";

export default function ChessTimer() {
  const { state, display, tap, start, pause, resume, reset, setConfig } =
    useChessClock();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [overlayDismissed, setOverlayDismissed] = useState(false);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const { trigger: hapticTrigger } = useWebHaptics();

  // Keep the trigger fn fresh inside effects without forcing them to re-run
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

  // Keep screen on while a player is on the move
  useWakeLock(phase === "running");

  // Reset dismissal flag whenever a fresh game-over event arrives
  useEffect(() => {
    if (!state.winner) setOverlayDismissed(false);
  }, [state.winner]);

  // Sound + haptic on game-over
  const winnerRef = useRef<Player | null>(null);
  useEffect(() => {
    if (state.winner && winnerRef.current !== state.winner) {
      winnerRef.current = state.winner;
      if (state.config.soundOn) sound.flagFall();
      if (state.config.hapticsOn) triggerRef.current("error");
    }
    if (!state.winner) winnerRef.current = null;
  }, [state.winner, state.config.soundOn, state.config.hapticsOn]);

  // Low-time tick beeps — fire on each whole-second crossing under 10s
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

  const handleTap = useCallback(
    (player: Player) => {
      primeAudio();
      if (state.winner) return;
      // Only fire effects when the tap will actually change clock state:
      // either the very first move, or the active player ending their turn.
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

  const handlePrimary = useCallback(() => {
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

  const handleResetFromBar = useCallback(() => {
    if (!state.started || phase === "over") {
      reset();
      return;
    }
    // Funnel mid-game resets through the settings sheet's confirmation
    setSettingsOpen(true);
  }, [reset, state.started, phase]);

  const lowTime = (p: Player) => state.active === p && display[p] < LOW_TIME_MS;

  const tileState = useCallback(
    (p: Player): React.ComponentProps<typeof PlayerTile>["state"] => {
      if (state.winner) return state.winner === p ? "winner" : "loser";
      if (state.paused) return "paused";
      if (state.active === p) return "active";
      if (state.active != null) return "waiting";
      return state.started ? "ready" : "idle";
    },
    [state.winner, state.paused, state.active, state.started]
  );

  const tileHint = (p: Player): string | undefined => {
    if (state.winner || state.active != null) return undefined;
    if (!state.started) return "Tap to start opponent";
    if (state.paused && state.pausedActive === p) return "Paused — tap Resume";
    return undefined;
  };

  const showOverlay = phase === "over" && !overlayDismissed;
  const names = { 1: state.config.p1Name, 2: state.config.p2Name } as const;

  return (
    <div
      className="fixed inset-0 flex flex-col bg-slate-950 overscroll-none"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div className="flex-1 min-h-0">
        <PlayerTile
          name={names[2]}
          ms={display[2]}
          state={tileState(2)}
          lowTime={lowTime(2)}
          onTap={() => handleTap(2)}
          rotated
          hint={tileHint(2)}
          moves={state.moves[2]}
        />
      </div>

      <CenterBar
        phase={phase}
        isFullscreen={isFullscreen}
        onPrimary={handlePrimary}
        onSettings={() => setSettingsOpen(true)}
        onReset={handleResetFromBar}
        onToggleFullscreen={toggleFullscreen}
      />

      <div className="flex-1 min-h-0">
        <PlayerTile
          name={names[1]}
          ms={display[1]}
          state={tileState(1)}
          lowTime={lowTime(1)}
          onTap={() => handleTap(1)}
          hint={tileHint(1)}
          moves={state.moves[1]}
        />
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
          winnerName={names[state.winner as Player]}
          loserName={names[(state.winner === 1 ? 2 : 1) as Player]}
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
