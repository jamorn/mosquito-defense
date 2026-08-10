import React, { useRef, useEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants/canvas';

interface GameCanvasProps {
  onCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function GameCanvas({ onCanvasClick, canvasRef }: GameCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={onCanvasClick}
      className="cursor-crosshair block w-full max-w-[800px] h-auto aspect-[4/3]"
    />
  );
}