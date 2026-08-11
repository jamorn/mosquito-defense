import React from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../game/constants/canvas";

interface GameCanvasProps {
  onCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove?: (
    x: number,
    y: number,
    e: React.MouseEvent<HTMLCanvasElement>,
  ) => void;
  onCanvasMouseLeave?: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function GameCanvas({
  onCanvasClick,
  onCanvasMouseMove,
  onCanvasMouseLeave,
  canvasRef,
}: GameCanvasProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCanvasMouseMove || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
    onCanvasMouseMove(x, y, e);
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={onCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onCanvasMouseLeave?.()}
      className="cursor-crosshair block w-full max-w-[800px] h-auto aspect-[4/3]"
    />
  );
}
