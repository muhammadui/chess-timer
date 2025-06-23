import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import Confetti from "react-confetti";
import PlayerTimer from "@/components/PlayerTimer";
import TimeSelector from "@/components/TimeSelector";
import FullscreenToggle from "@/components/FullscreenToggle";
import { Button } from "@/components/ui/button";

const ChessTimer = () => {
  const [selectedGameTime, setSelectedGameTime] = useState(600); // 10 minutes default
  const [player1Time, setPlayer1Time] = useState(600);
  const [player2Time, setPlayer2Time] = useState(600);
  const [activePlayer, setActivePlayer] = useState<1 | 2 | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameOver || activePlayer === null) return;

    const interval = setInterval(() => {
      if (activePlayer === 1) {
        setPlayer1Time((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setWinner(2);
            setShowConfetti(true);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setPlayer2Time((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setWinner(1);
            setShowConfetti(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePlayer, gameOver]);

  // Hide confetti after 5 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handlePlayerClick = useCallback(
    (player: 1 | 2) => {
      if (gameOver) return;

      if (activePlayer === null) {
        // First move
        setActivePlayer(player === 1 ? 2 : 1);
      } else if (activePlayer === player) {
        // Switch to other player
        setActivePlayer(player === 1 ? 2 : 1);
      }
    },
    [activePlayer, gameOver]
  );

  const startGame = () => {
    setActivePlayer(1);
  };

  const pauseGame = () => {
    setActivePlayer(null);
  };

  const resetGame = () => {
    setPlayer1Time(selectedGameTime);
    setPlayer2Time(selectedGameTime);
    setActivePlayer(null);
    setGameOver(false);
    setWinner(null);
    setShowConfetti(false);
  };

  const handleTimeChange = (newTime: number) => {
    setSelectedGameTime(newTime);
    setPlayer1Time(newTime);
    setPlayer2Time(newTime);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const congratulatoryMessages = [
    "Outstanding victory!",
    "Brilliant chess mastery!",
    "Checkmate champion!",
    "Strategic genius wins!",
    "Chess master supreme!",
  ];

  const randomMessage =
    congratulatoryMessages[
      Math.floor(Math.random() * congratulatoryMessages.length)
    ];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-50">
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.3}
          />
        )}

        {/* Game Over Modal in Fullscreen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
              <h2 className="text-4xl font-bold mb-4 text-green-600">
                🎉 {randomMessage}
              </h2>
              <p className="text-2xl mb-6 text-gray-800">
                Player {winner} Wins!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => {
                    setIsFullscreen(false);
                    resetGame();
                  }}
                  variant="outline"
                  className="text-lg px-6 py-3"
                >
                  Exit Fullscreen
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="h-full grid grid-rows-2">
          {/* Player 2 - Top half (rotated) */}
          <div className="transform rotate-180">
            <PlayerTimer
              playerNumber={2}
              time={formatTime(player2Time)}
              isActive={activePlayer === 2}
              onClick={() => handlePlayerClick(2)}
              disabled={gameOver}
              isFullscreen={true}
            />
          </div>

          {/* Player 1 - Bottom half */}
          <div>
            <PlayerTimer
              playerNumber={1}
              time={formatTime(player1Time)}
              isActive={activePlayer === 1}
              onClick={() => handlePlayerClick(1)}
              disabled={gameOver}
              isFullscreen={true}
            />
          </div>
        </div>

        {/* Exit fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-50"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-4 text-green-600">
              🎉 {randomMessage}
            </h2>
            <p className="text-xl mb-6 text-gray-800">Player {winner} Wins!</p>
            <Button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <TimeSelector
          selectedTime={selectedGameTime}
          onTimeChange={handleTimeChange}
          disabled={activePlayer !== null || gameOver}
        />
        <FullscreenToggle
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
        />
      </div>

      {/* Timer Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <PlayerTimer
          playerNumber={1}
          time={formatTime(player1Time)}
          isActive={activePlayer === 1}
          onClick={() => handlePlayerClick(1)}
          disabled={gameOver}
          isFullscreen={false}
        />
        <PlayerTimer
          playerNumber={2}
          time={formatTime(player2Time)}
          isActive={activePlayer === 2}
          onClick={() => handlePlayerClick(2)}
          disabled={gameOver}
          isFullscreen={false}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {activePlayer === null && !gameOver && (
          <Button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Game
          </Button>
        )}

        {activePlayer !== null && !gameOver && (
          <Button
            onClick={pauseGame}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3"
          >
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </Button>
        )}

        <Button
          onClick={resetGame}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-slate-300">
        <p className="mb-2">
          {activePlayer === null
            ? "Select your game time and click 'Start Game' to begin"
            : `Player ${activePlayer}'s turn - Click your timer when you make your move`}
        </p>
        <p className="text-sm">
          Each player starts with {Math.floor(selectedGameTime / 60)} minutes
        </p>
      </div>
    </div>
  );
};

export default ChessTimer;
