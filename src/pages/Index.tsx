import { Helmet } from "react-helmet-async";
import ChessTimer from "@/components/ChessTimer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Chess Timer - Professional Chess Clock for Physical Games</title>
        <meta
          name="description"
          content="Professional chess timer for physical chess games. Track time, switch turns, and manage your chess matches with our easy-to-use digital chess clock. Perfect for tournaments and casual games."
        />
        <meta
          name="keywords"
          content="chess timer, chess clock, digital chess clock, chess tournament timer, physical chess games, chess time management, chess game timer"
        />
        <meta name="author" content="Chess Timer Pro" />
        <meta
          property="og:title"
          content="Chess Timer - Professional Chess Clock"
        />
        <meta
          property="og:description"
          content="Professional chess timer for physical chess games. Easy-to-use digital chess clock for tournaments and casual games."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/chess-timer-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Chess Timer - Professional Chess Clock"
        />
        <meta
          name="twitter:description"
          content="Professional chess timer for physical chess games. Track time and manage your matches easily."
        />
        <link rel="canonical" href="https://yourchesstimerapp.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1e293b" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Chess Timer</h1>
            <p className="text-slate-300">
              Professional chess clock for physical games
            </p>
          </div>
          <ChessTimer />
        </div>
      </div>
    </>
  );
};

export default Index;
