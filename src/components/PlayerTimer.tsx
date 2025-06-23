import React from "react";
import { Clock } from "lucide-react";

interface PlayerTimerProps {
  playerNumber: 1 | 2;
  time: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
  isFullscreen?: boolean;
}

const PlayerTimer: React.FC<PlayerTimerProps> = ({
  playerNumber,
  time,
  isActive,
  onClick,
  disabled,
  isFullscreen = false,
}) => {
  if (isFullscreen) {
    return (
      <div
        className={`
          h-full w-full cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
          ${
            isActive
              ? "bg-green-500 shadow-2xl shadow-green-500/50"
              : "bg-slate-700 hover:bg-slate-600"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
        onClick={!disabled ? onClick : undefined}
      >
        {/* Player Label */}
        <div className="flex items-center justify-center mb-8">
          <Clock
            className={`mr-4 h-12 w-12 ${
              isActive ? "text-white" : "text-slate-300"
            }`}
          />
          <h2
            className={`text-6xl font-bold ${
              isActive ? "text-white" : "text-slate-300"
            }`}
          >
            Player {playerNumber}
          </h2>
        </div>

        {/* Time Display */}
        <div
          className={`text-9xl md:text-[12rem] font-mono font-bold ${
            isActive ? "text-white" : "text-slate-300"
          }`}
        >
          {time}
        </div>

        {/* Tap Instruction */}
        {isActive && !disabled && (
          <div className="mt-8 text-white font-medium text-3xl">
            Tap when you move
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 rounded-xl p-8 text-center
        ${
          isActive
            ? "bg-green-500 shadow-2xl shadow-green-500/50 scale-105"
            : "bg-slate-700 hover:bg-slate-600"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Player Label */}
      <div className="flex items-center justify-center mb-4">
        <Clock
          className={`mr-2 h-6 w-6 ${
            isActive ? "text-white" : "text-slate-300"
          }`}
        />
        <h2
          className={`text-2xl font-bold ${
            isActive ? "text-white" : "text-slate-300"
          }`}
        >
          Player {playerNumber}
        </h2>
      </div>

      {/* Time Display */}
      <div
        className={`text-6xl md:text-7xl font-mono font-bold ${
          isActive ? "text-white" : "text-slate-300"
        }`}
      >
        {time}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-4 right-4">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Tap Instruction */}
      {isActive && !disabled && (
        <div className="mt-4 text-white font-medium">Tap when you move</div>
      )}
    </div>
  );
};

export default PlayerTimer;
