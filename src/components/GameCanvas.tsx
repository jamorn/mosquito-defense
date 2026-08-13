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
  // 🆕 Touch Handlers (รองรับมือถือ/tablet — กด-ลาก-วาง เหมือน PC)
  onCanvasTouchStart?: (x: number, y: number) => void;
  onCanvasTouchMove?: (x: number, y: number) => void;
  onCanvasTouchEnd?: () => void;
}

export function GameCanvas({
  onCanvasClick,
  onCanvasMouseMove,
  onCanvasMouseLeave,
  onCanvasTouchStart,
  onCanvasTouchMove,
  onCanvasTouchEnd,
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

  /** แปลงพิกัดนิ้ว (client) → พิกัด canvas */
  const toCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };

  // 🆕 Touch: กดลง → เหมือน mousedown (เริ่ม ghost ตามนิ้ว)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const { x, y } = toCanvasPos(touch.clientX, touch.clientY);
    onCanvasTouchStart?.(x, y);
  };

  // 🆕 Touch: ลากนิ้ว → ย้าย ghost (เหมือน mousemove)
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const { x, y } = toCanvasPos(touch.clientX, touch.clientY);
    onCanvasTouchMove?.(x, y);
  };

  // 🆕 Touch: ปล่อยนิ้ว → วาง/เลือก (เหมือน click)
  const handleTouchEnd = () => {
    onCanvasTouchEnd?.();
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={onCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onCanvasMouseLeave?.()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="cursor-crosshair block w-full max-w-[800px] h-auto aspect-[4/3] touch-none"
      style={{ touchAction: "none" }}
    />
  );
}
