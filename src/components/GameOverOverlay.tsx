import { useMemo } from "react";
import { Trophy } from "lucide-react";

type Props = {
  winnerName: string;
  loserName: string;
  onPlayAgain: () => void;
  onDismiss: () => void;
};

const messages = [
  "Time's up!",
  "Flag fall — game over.",
  "Out of time.",
  "Clock decides this one.",
];

export default function GameOverOverlay({
  winnerName,
  loserName,
  onPlayAgain,
  onDismiss,
}: Props) {
  const message = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    []
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/10 shadow-2xl shadow-black/50 p-6 text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
          <Trophy className="h-7 w-7" />
        </div>
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-400">
          {message}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {winnerName} wins
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {loserName} ran out of time
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold transition-all"
          >
            Play again
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
