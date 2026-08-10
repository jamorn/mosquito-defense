สำหรับ 2.5D Lite แยกเป็น 3 ไฟล์เพื่อให้ Clean และบำรุงรักษาง่าย
📁 ไฟล์ที่ 1: src/game/engine/Background25D.ts
📁 ไฟล์ที่ 2: src/game/engine/ShadowEffect.ts
📁 ไฟล์ที่ 3: src/game/engine/Renderer.ts
# วิธีใช้งานใน App.tsx
// ใน gameLoop
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const renderer = new Renderer(ctx);
  let lastTime = performance.now();

  const gameLoop = (time: number) => {
    const delta = time - lastTime;
    lastTime = time;

    // Update Background Animation
    renderer.update(delta);

    // ... game logic เดิม ...

    // Draw Scene (2.5D Lite)
    renderer.drawScene(
      mosquitoesRef.current,
      towersRef.current,
      lasersRef.current,
      particlesRef.current,
      floatingTextsRef.current,
      delta
    );

    animationFrameId.current = requestAnimationFrame(gameLoop);
  };

  animationFrameId.current = requestAnimationFrame(gameLoop);

  return () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };
}, []);