import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClockConfig } from "@/hooks/useChessClock";

type Props = {
  open: boolean;
  onClose: () => void;
  config: ClockConfig;
  onChange: (patch: Partial<ClockConfig>) => void;
  onReset: () => void;
  gameStarted: boolean;
};

const TIME_PRESETS_MIN = [1, 3, 5, 10, 15, 30, 60] as const;
const INCREMENT_PRESETS_S = [0, 2, 3, 5, 10, 30] as const;

export default function SettingsSheet({
  open,
  onClose,
  config,
  onChange,
  onReset,
  gameStarted,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!open) setConfirmReset(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 pointer-events-none",
        open && "pointer-events-auto"
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black transition-opacity duration-200",
          open ? "opacity-60" : "opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className={cn(
          "absolute left-0 right-0 bottom-0 bg-slate-900 text-slate-100",
          "rounded-t-3xl shadow-2xl shadow-black/50",
          "transition-transform duration-300 ease-out",
          "max-h-[90vh] overflow-y-auto",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      >
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">
          <h2 className="text-lg font-semibold tracking-wide">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="h-10 w-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto -mt-1 mb-2 h-1.5 w-12 rounded-full bg-white/10" />

        <div className="px-5 pb-6 space-y-7">
          <section>
            <SectionLabel>Time per player</SectionLabel>
            <ChipRow>
              {TIME_PRESETS_MIN.map((m) => {
                const ms = m * 60 * 1000;
                const selected = config.baseMs === ms;
                return (
                  <Chip
                    key={m}
                    selected={selected}
                    disabled={gameStarted}
                    onClick={() => onChange({ baseMs: ms })}
                  >
                    {m < 60 ? `${m} min` : "1 h"}
                  </Chip>
                );
              })}
            </ChipRow>
            {gameStarted && (
              <p className="mt-2 text-xs text-slate-400">
                Reset the game to change the time control.
              </p>
            )}
          </section>

          <section>
            <SectionLabel>Increment (Fischer)</SectionLabel>
            <ChipRow>
              {INCREMENT_PRESETS_S.map((s) => {
                const ms = s * 1000;
                const selected = config.incrementMs === ms;
                return (
                  <Chip
                    key={s}
                    selected={selected}
                    disabled={gameStarted}
                    onClick={() => onChange({ incrementMs: ms })}
                  >
                    +{s}s
                  </Chip>
                );
              })}
            </ChipRow>
          </section>

          <section>
            <SectionLabel>Player names</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <NameInput
                label="Bottom"
                value={config.p1Name}
                onChange={(v) => onChange({ p1Name: v })}
              />
              <NameInput
                label="Top"
                value={config.p2Name}
                onChange={(v) => onChange({ p2Name: v })}
              />
            </div>
          </section>

          <section>
            <SectionLabel>Feedback</SectionLabel>
            <div className="space-y-2">
              <ToggleRow
                label="Sound"
                description="Tap, low-time tick, flag-fall"
                checked={config.soundOn}
                onChange={(v) => onChange({ soundOn: v })}
              />
              <ToggleRow
                label="Haptics"
                description="Vibration on tap and flag-fall"
                checked={config.hapticsOn}
                onChange={(v) => onChange({ hapticsOn: v })}
              />
            </div>
          </section>

          <section>
            <SectionLabel>Danger zone</SectionLabel>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full h-12 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 active:bg-rose-900/80 text-rose-200 font-medium transition-colors"
              >
                Reset game
              </button>
            ) : (
              <div className="rounded-xl border border-rose-800/50 bg-rose-950/40 p-3 space-y-3">
                <p className="text-sm text-rose-200">
                  Reset both clocks and clear the current game?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 h-11 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 h-11 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-10 px-4 rounded-full font-medium text-sm transition-colors",
        "border",
        selected
          ? "bg-emerald-600 border-emerald-500 text-white"
          : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function NameInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400 mb-1.5">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 16))}
        maxLength={16}
        className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
      />
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="text-left">
        <div className="text-sm font-medium text-slate-100">{label}</div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
      <div
        className={cn(
          "w-11 h-6 rounded-full relative transition-colors",
          checked ? "bg-emerald-600" : "bg-white/15"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </div>
    </button>
  );
}
