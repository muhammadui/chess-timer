import { useCallback, useEffect, useReducer, useState } from "react";

export type Player = 1 | 2;

export type ClockConfig = {
  baseMs: number;
  incrementMs: number;
  p1Name: string;
  p2Name: string;
  soundOn: boolean;
  hapticsOn: boolean;
};

export type ClockState = {
  config: ClockConfig;
  remaining: Record<Player, number>;
  active: Player | null;
  segmentStart: number | null;
  started: boolean;
  paused: boolean;
  pausedActive: Player | null;
  winner: Player | null;
  moves: Record<Player, number>;
};

type Action =
  | { type: "TAP"; player: Player; now: number }
  | { type: "START"; now: number }
  | { type: "PAUSE"; now: number }
  | { type: "RESUME"; now: number }
  | { type: "RESET" }
  | { type: "FLAG"; player: Player }
  | { type: "SET_CONFIG"; config: Partial<ClockConfig> };

const STORAGE_KEY = "chess-timer-state-v2";

const DEFAULT_CONFIG: ClockConfig = {
  baseMs: 10 * 60 * 1000,
  incrementMs: 0,
  p1Name: "White",
  p2Name: "Black",
  soundOn: true,
  hapticsOn: true,
};

const other = (p: Player): Player => (p === 1 ? 2 : 1);

function initialState(config: ClockConfig): ClockState {
  return {
    config,
    remaining: { 1: config.baseMs, 2: config.baseMs },
    active: null,
    segmentStart: null,
    started: false,
    paused: false,
    pausedActive: null,
    winner: null,
    moves: { 1: 0, 2: 0 },
  };
}

function reducer(state: ClockState, action: Action): ClockState {
  switch (action.type) {
    case "TAP": {
      if (state.winner) return state;
      const { player, now } = action;

      // Pre-game: tapping any tile starts the OPPONENT's clock
      // (chess convention: the player about to move has their clock started by the opponent)
      if (!state.started) {
        return {
          ...state,
          started: true,
          paused: false,
          pausedActive: null,
          active: other(player),
          segmentStart: now,
        };
      }

      if (state.paused) return state;

      // Only the player whose clock is running can press their own tile
      if (state.active === player && state.segmentStart != null) {
        const elapsed = now - state.segmentStart;
        let next = Math.max(0, state.remaining[player] - elapsed);
        if (next > 0) next += state.config.incrementMs;
        return {
          ...state,
          remaining: { ...state.remaining, [player]: next },
          active: other(player),
          segmentStart: now,
          moves: { ...state.moves, [player]: state.moves[player] + 1 },
        };
      }
      return state;
    }

    case "START": {
      if (state.started || state.winner) return state;
      return {
        ...state,
        started: true,
        active: 1,
        segmentStart: action.now,
      };
    }

    case "PAUSE": {
      if (state.winner || state.active == null || state.segmentStart == null)
        return state;
      const p = state.active;
      const elapsed = action.now - state.segmentStart;
      return {
        ...state,
        remaining: {
          ...state.remaining,
          [p]: Math.max(0, state.remaining[p] - elapsed),
        },
        active: null,
        segmentStart: null,
        paused: true,
        pausedActive: p,
      };
    }

    case "RESUME": {
      if (!state.paused || state.pausedActive == null) return state;
      return {
        ...state,
        active: state.pausedActive,
        pausedActive: null,
        paused: false,
        segmentStart: action.now,
      };
    }

    case "RESET":
      return initialState(state.config);

    case "FLAG": {
      const flagged = action.player;
      return {
        ...state,
        remaining: { ...state.remaining, [flagged]: 0 },
        active: null,
        segmentStart: null,
        paused: false,
        pausedActive: null,
        winner: other(flagged),
      };
    }

    case "SET_CONFIG": {
      const config = { ...state.config, ...action.config };
      // If the game hasn't started, also propagate time changes to the visible clocks
      if (!state.started) {
        return {
          ...state,
          config,
          remaining: { 1: config.baseMs, 2: config.baseMs },
        };
      }
      return { ...state, config };
    }
  }
}

function loadInitial(): ClockState {
  if (typeof window === "undefined") return initialState(DEFAULT_CONFIG);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState(DEFAULT_CONFIG);
    const parsed = JSON.parse(raw) as ClockState;
    if (!parsed?.config || !parsed.remaining) return initialState(DEFAULT_CONFIG);
    // Abandon games older than 24h to avoid surprises after a long absence
    if (parsed.active != null && parsed.segmentStart != null) {
      const idleMs = Date.now() - parsed.segmentStart;
      if (idleMs > 24 * 60 * 60 * 1000) return initialState(parsed.config);
    }
    return parsed;
  } catch {
    return initialState(DEFAULT_CONFIG);
  }
}

export type ChessClock = ReturnType<typeof useChessClock>;

export function useChessClock() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [, setTick] = useState(0);

  // Tick + flag detection while a player is on the move
  useEffect(() => {
    if (state.active == null || state.segmentStart == null) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - (state.segmentStart as number);
      const remaining = state.remaining[state.active as Player] - elapsed;
      if (remaining <= 0) {
        dispatch({ type: "FLAG", player: state.active as Player });
      } else {
        setTick((t) => (t + 1) % 1_000_000);
      }
    }, 100);
    return () => clearInterval(id);
  }, [state.active, state.segmentStart, state.remaining]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota / private mode — ignore
    }
  }, [state]);

  // Derived live display
  const now = Date.now();
  const display: Record<Player, number> = {
    1: state.remaining[1],
    2: state.remaining[2],
  };
  if (state.active != null && state.segmentStart != null) {
    display[state.active] = Math.max(
      0,
      state.remaining[state.active] - (now - state.segmentStart)
    );
  }

  const tap = useCallback(
    (player: Player) => dispatch({ type: "TAP", player, now: Date.now() }),
    []
  );
  const start = useCallback(
    () => dispatch({ type: "START", now: Date.now() }),
    []
  );
  const pause = useCallback(
    () => dispatch({ type: "PAUSE", now: Date.now() }),
    []
  );
  const resume = useCallback(
    () => dispatch({ type: "RESUME", now: Date.now() }),
    []
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const setConfig = useCallback(
    (config: Partial<ClockConfig>) => dispatch({ type: "SET_CONFIG", config }),
    []
  );

  return { state, display, tap, start, pause, resume, reset, setConfig };
}
