import React from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface FullscreenToggleProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  isFullscreen,
  onToggle,
}) => {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="sm"
      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
    >
      {isFullscreen ? (
        <>
          <Minimize className="mr-2 h-4 w-4" />
          Exit Fullscreen
        </>
      ) : (
        <>
          <Maximize className="mr-2 h-4 w-4" />
          Fullscreen
        </>
      )}
    </Button>
  );
};

export default FullscreenToggle;
