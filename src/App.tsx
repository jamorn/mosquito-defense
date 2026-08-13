// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";

// Game Engine
import { Renderer } from "./game/engine/Renderer";
import { WaveSystem } from "./game/systems/WaveSystem";
import { SaveLoadSystem } from "./game/systems/SaveLoadSystem";
import { SprayCloudSystem } from "./game/systems/SprayCloudSystem";
import { SoundSystem } from "./game/engine/SoundSystem";

// Entities
import { TowerFactory } from "./game/entities/towers/TowerFactory";
import { ItemFactory } from "./game/entities/items/ItemFactory";
import { Particle } from "./game/entities/Particle";
import { FloatingTextEntity } from "./game/entities/FloatingText";
import { Mosquito } from "./game/entities/mosquitoes/Mosquito";
import { BaseTower } from "./game/entities/towers/BaseTower";
import { SprayTower } from "./game/entities/towers/SprayTower";
import { SpecialItem } from "./game/entities/items/SpecialItem";

// Config
import { TOWER_CONFIGS } from "./config/towers.config";
import { ITEM_CONFIGS } from "./config/items.config";
import { getWavePattern } from "./config/waves.config";

// Constants
import { GAME_PATH, SPAWN_POSITION } from "./game/constants/path";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./game/constants/canvas";

// Components
import { GameCanvas } from "./components/GameCanvas";
import { TopBar } from "./components/HUD/TopBar";
import { WaveIndicator } from "./components/HUD/WaveIndicator";
import { ItemBar } from "./components/HUD/ItemBar";
import { BuildBar } from "./components/Shop/BuildBar";
import { TowerInspector } from "./components/Inspector/TowerInspector";
import { GameOverOverlay } from "./components/Overlays/GameOverOverlay";
import { VictoryOverlay } from "./components/Overlays/VictoryOverlay";
import { PauseOverlay } from "./components/Overlays/PauseOverlay";
import { HowToPlayOverlay } from "./components/Overlays/HowToPlayOverlay";
import { OrientationLock } from "./components/OrientationLock";

// Utils
import { pointToSegmentDistance } from "./utils/math";

// Types
import { TowerType, ItemType, LaserBeam, Point } from "./types/game.types";

export default function App() {
  // ==========================================
  // STATE
  // ==========================================
  const [coins, setCoins] = useState<number>(400);
  const [lives, setLives] = useState<number>(20);
  const [wave, setWave] = useState<number>(1);
  const [enemiesRemaining, setEnemiesRemaining] = useState<number>(0);
  const [isWaveActive, setIsWaveActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(
    "SWAT_ELECTRIC",
  );
  const [selectedTowerInstance, setSelectedTowerInstance] =
    useState<BaseTower | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(true); // 🆕 เปิดวิธีเล่นครั้งแรก
  const [currentTime, setCurrentTime] = useState<number>(performance.now());
  const [failedWave, setFailedWave] = useState<number | null>(null);

  // ==========================================
  // REFS
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const soundSystemRef = useRef<SoundSystem>(new SoundSystem());
  const waveSystemRef = useRef<WaveSystem>(new WaveSystem());
  const towersRef = useRef<BaseTower[]>([]);
  const mosquitoesRef = useRef<Mosquito[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const sprayCloudRef = useRef<SprayCloudSystem>(new SprayCloudSystem());
  const lasersRef = useRef<LaserBeam[]>([]);
  const floatingTextsRef = useRef<FloatingTextEntity[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Sync refs
  const selectedTowerRef = useRef(selectedTowerInstance);
  const isWaveActiveRef = useRef(isWaveActive);
  const waveRef = useRef(wave);
  const gameOverRef = useRef(gameOver);
  const gameWonRef = useRef(gameWon);
  const failedWaveRef = useRef(failedWave);
  // 🆕 Pause ref (sync กับ state สำหรับ game loop)
  const isPausedRef = useRef(isPaused);

  // 🆕 Ghost Preview refs (สำหรับวาดใน game loop)
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const selectedTowerTypeRef = useRef<TowerType | null>(selectedTowerType);
  const coinsRef = useRef<number>(coins);

  useEffect(() => {
    selectedTowerRef.current = selectedTowerInstance;
  }, [selectedTowerInstance]);
  useEffect(() => {
    isWaveActiveRef.current = isWaveActive;
  }, [isWaveActive]);
  useEffect(() => {
    waveRef.current = wave;
  }, [wave]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);
  useEffect(() => {
    gameWonRef.current = gameWon;
  }, [gameWon]);
  useEffect(() => {
    failedWaveRef.current = failedWave;
  }, [failedWave]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // 🆕 Sync refs ใหม่สำหรับ Ghost Preview
  useEffect(() => {
    selectedTowerTypeRef.current = selectedTowerType;
  }, [selectedTowerType]);
  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  // Items
  const itemsRef = useRef<Record<ItemType, SpecialItem>>({
    BOMB: ItemFactory.createItem("BOMB"),
    FREEZE: ItemFactory.createItem("FREEZE"),
    REPAIR: ItemFactory.createItem("REPAIR"),
  });

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  const addParticles = useCallback(
    (x: number, y: number, color: string, count: number = 8) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle(x, y, color));
      }
    },
    [],
  );

  const addFloatingText = useCallback(
    (x: number, y: number, text: string, color: string) => {
      floatingTextsRef.current.push(new FloatingTextEntity(x, y, text, color));
    },
    [],
  );

  const isValidPlacement = useCallback((x: number, y: number): boolean => {
    for (let i = 0; i < GAME_PATH.length - 1; i++) {
      if (pointToSegmentDistance({ x, y }, GAME_PATH[i], GAME_PATH[i + 1]) < 35)
        return false;
    }
    for (const t of towersRef.current) {
      if (Math.hypot(t.x - x, t.y - y) < 35) return false;
    }
    return (
      x >= 30 && x <= CANVAS_WIDTH - 30 && y >= 30 && y <= CANVAS_HEIGHT - 30
    );
  }, []);

  // ==========================================
  // GAME ACTIONS
  // ==========================================
  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundSystemRef.current.setEnabled(next);
  }, [soundEnabled]);

  // 🆕 Pause / Resume — หยุด/เล่นต่อเกม
  const togglePause = useCallback(() => {
    if (gameOver || gameWon) return; // ห้าม pause ถ้าเกมจบแล้ว
    setIsPaused((prev) => !prev);
  }, [gameOver, gameWon]);

  const handleUseItem = useCallback(
    (type: ItemType) => {
      // ⏸️ หยุดเกม → ใช้ไอเทมไม่ได้
      if (isPaused || gameOver || gameWon) return;
      const item = itemsRef.current[type];
      const now = performance.now();

      if (item.canUse(coins, now)) {
        setCoins((prev) => prev - item.cost);
        item.lastUsedTime = now;
        item.execute(
          mosquitoesRef.current,
          addParticles,
          soundSystemRef.current,
          setLives,
          addFloatingText,
        );
        setCurrentTime(now);
      }
    },
    [coins, gameOver, gameWon, addParticles, addFloatingText],
  );

  const startNextWave = useCallback(() => {
    if (isPaused || isWaveActive) return;
    setIsWaveActive(true);

    const pattern = waveSystemRef.current.startWave(wave);
    setEnemiesRemaining(
      pattern?.composition.reduce((sum, c) => sum + c.count, 0) || 0,
    );
  }, [isWaveActive, wave]);

  // 🆕 แยก "logic วางป้อม" ออกมาเป็น function กลาง
  //    ใช้ร่วมกันทั้ง mouse click และ touch (มือถือ/tablet) — กด-ลาก-วาง
  const tryPlaceAt = useCallback(
    (x: number, y: number) => {
      // ⏸️ หยุดเกม → วางป้อมไม่ได้
      if (isPausedRef.current || gameOverRef.current || gameWonRef.current)
        return;

      // แตะโดนป้อม → เลือกป้อมนั้น
      const clickedTower = towersRef.current.find(
        (t) => Math.hypot(t.x - x, t.y - y) < 25,
      );
      if (clickedTower) {
        setSelectedTowerInstance(clickedTower);
        return;
      }

      setSelectedTowerInstance(null);

      if (selectedTowerTypeRef.current) {
        const type = selectedTowerTypeRef.current;
        const cost = TOWER_CONFIGS[type].cost;
        if (coinsRef.current >= cost && isValidPlacement(x, y)) {
          setCoins((prev) => prev - cost);
          const newTower = TowerFactory.createTower(type, x, y);
          towersRef.current.push(newTower);
          addParticles(x, y, newTower.config.glowColor, 12);
          soundSystemRef.current.play("upgrade");
        }
      }
    },
    [isValidPlacement, addParticles],
  );

  // 🆕 ป้องกันวางซ้ำ: บนมือถือหลัง touchend จะเกิด synthetic click ตามมา
  //    เลยต้อง "ข้าม" click ถัดไป 1 ครั้งที่มาจาก touch (กันวางป้อมซ้ำ 2 อัน)
  const suppressNextClickRef = useRef(false);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // ข้าม click ที่เกิดจาก touch (เพื่อกันวางซ้ำ)
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false;
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
      tryPlaceAt(x, y);
    },
    [tryPlaceAt],
  );

  // ==========================================
  // 🆕 TOUCH SUPPORT (มือถือ/tablet — กด-ลาก-วาง เหมือน PC)
  // ==========================================
  // ใช้ ref เพื่อบอกว่ากำลัง "กดนิ้วค้างลาก" (ระหว่างนั้นไม่แหก ghost)
  const touchDraggingRef = useRef(false);

  const handleCanvasTouchStart = useCallback((x: number, y: number) => {
    touchDraggingRef.current = true;
    mousePosRef.current = { x, y };
  }, []);

  const handleCanvasTouchMove = useCallback((x: number, y: number) => {
    // ระหว่างลากนิ้ว → ย้าย ghost preview ตามนิ้ว
    if (touchDraggingRef.current) {
      mousePosRef.current = { x, y };
    }
  }, []);

  const handleCanvasTouchEnd = useCallback(() => {
    if (!touchDraggingRef.current) return;
    touchDraggingRef.current = false;

    // ปล่อยนิ้ว → วาง (ถ้า ghost ยังอยู่)
    if (mousePosRef.current) {
      const { x, y } = mousePosRef.current;
      tryPlaceAt(x, y);
      // ป้องกัน synthetic click ที่ตามมาบนมือถือ (ไม่ให้วางซ้ำ)
      suppressNextClickRef.current = true;
    }
  }, [tryPlaceAt]);

  // 🆕 ติดตามตำแหน่งเมาส์สำหรับ Ghost Preview
  const handleCanvasMouseMove = useCallback((x: number, y: number) => {
    mousePosRef.current = { x, y };
  }, []);

  const handleCanvasMouseLeave = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  const handleUpgradeTower = useCallback(() => {
    if (!selectedTowerInstance) return;
    const cost = selectedTowerInstance.getUpgradeCost();

    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      selectedTowerInstance.upgrade();
      addParticles(
        selectedTowerInstance.x,
        selectedTowerInstance.y,
        "#f59e0b",
        15,
      );
      soundSystemRef.current.play("upgrade");
    }
  }, [selectedTowerInstance, coins, addParticles]);

  const handleSellTower = useCallback(() => {
    if (!selectedTowerInstance) return;
    const refund = selectedTowerInstance.getSellRefund();
    setCoins((prev) => prev + refund);
    towersRef.current = towersRef.current.filter(
      (t) => t.id !== selectedTowerInstance.id,
    );
    addParticles(
      selectedTowerInstance.x,
      selectedTowerInstance.y,
      "#ef4444",
      10,
    );
    setSelectedTowerInstance(null);
    soundSystemRef.current.play("coin");
  }, [selectedTowerInstance, addParticles]);

  const saveGame = useCallback(() => {
    const success = SaveLoadSystem.save(
      coins,
      lives,
      wave,
      towersRef.current,
      itemsRef.current,
    );
    if (success) {
      addFloatingText(400, 300, "💾 GAME SAVED!", "#22c55e");
      soundSystemRef.current.play("coin");
    }
  }, [coins, lives, wave, addFloatingText]);

  const loadGame = useCallback(() => {
    const data = SaveLoadSystem.load();
    if (!data) {
      addFloatingText(400, 300, "❌ NO SAVE DATA", "#ef4444");
      return;
    }

    setCoins(data.coins);
    setLives(data.lives);
    setWave(data.wave);
    towersRef.current = data.towers;
    itemsRef.current = data.items;
    setIsWaveActive(false);
    setIsPaused(false); // 🆕 เลิก pause เมื่อโหลดเกม
    mosquitoesRef.current = [];
    waveSystemRef.current.reset();

    addFloatingText(400, 300, "📂 GAME LOADED!", "#38bdf8");
    soundSystemRef.current.play("upgrade");
  }, [addFloatingText]);

  // 🆕 NEW: Retry Wave Function
  const retryWave = useCallback(() => {
    if (failedWave === null) return;

    // Clear enemies and effects
    mosquitoesRef.current = [];
    particlesRef.current = [];
    lasersRef.current = [];
    floatingTextsRef.current = [];
    sprayCloudRef.current.reset();
    waveSystemRef.current.reset();

    // Reset wave state (keep wave number)
    setIsWaveActive(false);
    setIsPaused(false); // 🆕 เลิก pause เมื่อ Retry
    setGameOver(false);
    setEnemiesRemaining(0);

    // Reset HP to full (give player a fresh chance)
    setLives(20);

    // Reset item cooldowns
    Object.values(itemsRef.current).forEach((item) => {
      item.lastUsedTime = 0;
    });

    // Clear failed wave
    setFailedWave(null);

    addFloatingText(400, 300, `🔄 RETRY WAVE ${failedWave}`, "#f59e0b");
    soundSystemRef.current.play("upgrade");
  }, [failedWave, addFloatingText]);

  const resetGame = useCallback(() => {
    waveSystemRef.current.reset();
    setCoins(400);
    setLives(20);
    setWave(1);
    setEnemiesRemaining(0);
    setIsWaveActive(false);
    setGameOver(false);
    setGameWon(false);
    setFailedWave(null);
    setIsPaused(false); // 🆕 เริ่มเกมใหม่ → ไม่ pause ค้าง
    towersRef.current = [];
    mosquitoesRef.current = [];
    particlesRef.current = [];
    lasersRef.current = [];
    floatingTextsRef.current = [];
    sprayCloudRef.current.reset();
    setSelectedTowerInstance(null);
  }, []);

  // ==========================================
  // UI COOLDOWN TIMER
  // ==========================================
  useEffect(() => {
    const uiTimer = setInterval(() => {
      setCurrentTime(performance.now());
    }, 100);
    return () => clearInterval(uiTimer);
  }, []);

  // ==========================================
  // GAME LOOP
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderer = new Renderer(ctx);
    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Clear and draw background
      renderer.clear();
      renderer.drawGrid();
      renderer.drawPath();
      renderer.drawHome();

      // ⏸️ Skip game logic ถ้า game over / จบ / หรือ pause
      //    (พัก: ยังวาดฉากไว้ แต่ยุง-ป้อม-เวฟ หยุดทั้งหมด)
      if (!gameOverRef.current && !gameWonRef.current && !isPausedRef.current) {
        // Spawn mosquitoes
        if (isWaveActiveRef.current) {
          // ส่งยุงบนจอไป check "ประตูว่าง" (hold ปล่อยถ้าขวาง)
          const newMosquito = waveSystemRef.current.update(
            delta,
            mosquitoesRef.current,
          );
          if (newMosquito) {
            mosquitoesRef.current.push(newMosquito);
          }

          // 🆕 Spray cloud: cแจง/จางละอองทุก frame
          sprayCloudRef.current.decay(delta);
        }

        // Update mosquitoes
        for (let i = mosquitoesRef.current.length - 1; i >= 0; i--) {
          const m = mosquitoesRef.current[i];

          // 🆕 Poison: ยุงดูด density ละออง ณ ตำแหน่ง → เมา (แล้วจางใน Mosquito)
          const densityAt = sprayCloudRef.current.getDensity(m.x, m.y);
          m.updatePoison(densityAt, delta);

          // 🆕 Sending all mosquitoes for proximity (ต่อคิวอัตโนมัติ)
          const isStillMoving = m.update(
            delta,
            GAME_PATH,
            mosquitoesRef.current,
          );

          if (!isStillMoving) {
            setLives((prev) => {
              const next = prev - (m.bossDamage || 1);
              if (next <= 0) {
                setGameOver(true);
                setFailedWave(waveRef.current);
              }
              return Math.max(0, next);
            });
            setEnemiesRemaining((prev) => Math.max(0, prev - 1));
            mosquitoesRef.current.splice(i, 1);
            soundSystemRef.current.play("hit");
            continue;
          }
        }

        // Update towers
        const now = performance.now();
        towersRef.current.forEach((tower) => {
          if (tower.pulseTimer > 0) {
            tower.pulseTimer -= delta;
          }
          // 🆕 ให้ SprayTower ได้อ้างอิง cloud (ฉีดละออง)
          if (tower instanceof SprayTower) {
            tower.cloudSystem = sprayCloudRef.current;
          }
          tower.updateAndAttack(
            now,
            mosquitoesRef.current,
            lasersRef.current,
            addParticles,
            soundSystemRef.current,
            addFloatingText,
          );
        });

        // Remove dead mosquitoes
        mosquitoesRef.current = mosquitoesRef.current.filter((m) => {
          if (m.hp <= 0) {
            setCoins((prev) => prev + m.reward);
            setEnemiesRemaining((prev) => Math.max(0, prev - 1));
            addParticles(m.x, m.y, m.color, 15);
            addFloatingText(m.x, m.y, `+${m.reward}🪙`, "#fbbf24");
            soundSystemRef.current.play("coin");
            return false;
          }
          return true;
        });

        // Check wave end
        if (
          isWaveActiveRef.current &&
          waveSystemRef.current.allSpawned &&
          mosquitoesRef.current.length === 0
        ) {
          setIsWaveActive(false);
          setEnemiesRemaining(0);
          setWave((prev) => {
            if (prev >= 10) {
              setGameWon(true);
              return prev;
            }
            return prev + 1;
          });
          const pattern = waveSystemRef.current.waveInfo;
          setCoins((prev) => prev + (pattern?.reward || 50));
        }
      }

      // Draw entities
      renderer.drawMosquitoes(mosquitoesRef.current);
      renderer.drawTowers(towersRef.current);
      renderer.drawLasers(lasersRef.current);
      renderer.drawParticles(particlesRef.current, delta);
      // 🆕 วาดละออง (ก้อนเมฆ) — ผู้เล่นเห็นการพ่นของ Spray
      sprayCloudRef.current.draw(ctx);
      renderer.drawFloatingTexts(floatingTextsRef.current, delta);

      // Draw range highlight
      if (selectedTowerRef.current) {
        renderer.drawRangeHighlight(selectedTowerRef.current);
      }

      // 🆕 Ghost Preview: ครมบูรณ์ของป้อมที่กำลังจะวาง (ตามเมาส์)
      //    ซ่อนตอน pause (กันสับสนว่าวางได้)
      if (
        !gameOverRef.current &&
        !gameWonRef.current &&
        !isPausedRef.current &&
        selectedTowerTypeRef.current &&
        mousePosRef.current
      ) {
        const t = selectedTowerTypeRef.current;
        const { x, y } = mousePosRef.current;
        const cfg = TOWER_CONFIGS[t];
        const canPlace = coinsRef.current >= cfg.cost && isValidPlacement(x, y);
        renderer.drawTowerPreview(x, y, cfg, canPlace);
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [addParticles, addFloatingText]);

  // ==========================================
  // RENDER
  // ==========================================
  const currentWavePattern = getWavePattern(wave);

  return (
    <OrientationLock>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-white font-sans">
        {/* CANVAS AREA */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <TopBar
            coins={coins}
            lives={lives}
            wave={wave}
            enemiesRemaining={enemiesRemaining}
            isWaveActive={isWaveActive}
            gameOver={gameOver}
            gameWon={gameWon}
            soundEnabled={soundEnabled}
            isPaused={isPaused}
            onToggleSound={toggleSound}
            onTogglePause={togglePause}
            onStartWave={startNextWave}
            onSave={saveGame}
            onLoad={loadGame}
            onShowHelp={() => setShowHowTo(true)}
          />

          <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
            <GameCanvas
              canvasRef={canvasRef}
              onCanvasClick={handleCanvasClick}
              onCanvasMouseMove={handleCanvasMouseMove}
              onCanvasMouseLeave={handleCanvasMouseLeave}
              onCanvasTouchStart={handleCanvasTouchStart}
              onCanvasTouchMove={handleCanvasTouchMove}
              onCanvasTouchEnd={handleCanvasTouchEnd}
            />

            <WaveIndicator
              pattern={currentWavePattern}
              isWaveActive={isWaveActive}
            />

            <ItemBar
              items={itemsRef.current}
              coins={coins}
              currentTime={currentTime}
              gameOver={gameOver}
              gameWon={gameWon}
              onUseItem={handleUseItem}
            />

            {isPaused && !gameOver && !gameWon && (
              <PauseOverlay
                onResume={togglePause}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
              />
            )}

            {gameOver && (
              <GameOverOverlay
                failedWave={failedWave}
                onRetryWave={retryWave}
                onResetGame={resetGame}
              />
            )}

            {gameWon && <VictoryOverlay onResetGame={resetGame} />}
          </div>
        </div>

        {/* 🆕 RIGHT BUILD BAR — สไตล์ RTS (Red Alert) ทางขวามือ
           แสดง icon ป้อมล้วน วางซ้อนกัน ขนาดกะทัดรัด เหมาะ PC + Tablet/Mobile */}
        <aside className="flex flex-col items-center gap-4 lg:w-[88px] border-l border-slate-800 bg-slate-900 py-4 px-2 order-last lg:order-none">
          <BuildBar
            direction="col"
            selectedTowerType={selectedTowerType}
            selectedTowerInstance={selectedTowerInstance}
            coins={coins}
            onSelectTower={(type) => {
              setSelectedTowerType(type);
              setSelectedTowerInstance(null);
            }}
          />
        </aside>

        {/* 🆕 Bottom Bar — สำหรับมือถือ/tablet แนวตั้ง (build bar แบบแถว) */}
        <div className="lg:hidden w-full border-t border-slate-800 bg-slate-900 px-3 py-3">
          <div className="flex items-center gap-2 overflow-x-auto justify-center">
            <BuildBar
              direction="row"
              selectedTowerType={selectedTowerType}
              selectedTowerInstance={selectedTowerInstance}
              coins={coins}
              onSelectTower={(type) => {
                setSelectedTowerType(type);
                setSelectedTowerInstance(null);
              }}
            />
          </div>
        </div>
      </div>

      {/* 🆕 TowerInspector → Modal กลางจอ (ลอยเหนือทุกอย่าง, กดขาย/อัปเกรดง่าย) */}
      <TowerInspector
        selectedTowerInstance={selectedTowerInstance}
        coins={coins}
        onUpgrade={handleUpgradeTower}
        onSell={handleSellTower}
        onClose={() => setSelectedTowerInstance(null)}
      />

      {/* 🆕 HowToPlay — วิธีเล่น (เปิดครั้งแรก + ดูได้จากปุ่ม ❓) */}
      {showHowTo && <HowToPlayOverlay onClose={() => setShowHowTo(false)} />}
    </OrientationLock>
  );
}
