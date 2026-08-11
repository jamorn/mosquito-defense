// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Info } from "lucide-react";

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
import { TowerShop } from "./components/Shop/TowerShop";
import { ItemGuide } from "./components/Shop/ItemGuide";
import { TowerInspector } from "./components/Inspector/TowerInspector";
import { GameOverOverlay } from "./components/Overlays/GameOverOverlay";
import { VictoryOverlay } from "./components/Overlays/VictoryOverlay";

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

  const handleUseItem = useCallback(
    (type: ItemType) => {
      if (gameOver || gameWon) return;
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
    if (isWaveActive) return;
    setIsWaveActive(true);

    const pattern = waveSystemRef.current.startWave(wave);
    setEnemiesRemaining(
      pattern?.composition.reduce((sum, c) => sum + c.count, 0) || 0,
    );
  }, [isWaveActive, wave]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (gameOverRef.current || gameWonRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

      const clickedTower = towersRef.current.find(
        (t) => Math.hypot(t.x - x, t.y - y) < 25,
      );
      if (clickedTower) {
        setSelectedTowerInstance(clickedTower);
        return;
      }

      setSelectedTowerInstance(null);

      if (selectedTowerType) {
        const cost = TOWER_CONFIGS[selectedTowerType].cost;
        if (coins >= cost && isValidPlacement(x, y)) {
          setCoins((prev) => prev - cost);
          const newTower = TowerFactory.createTower(selectedTowerType, x, y);
          towersRef.current.push(newTower);
          addParticles(x, y, newTower.config.glowColor, 12);
          soundSystemRef.current.play("upgrade");
        }
      }
    },
    [selectedTowerType, coins, isValidPlacement, addParticles],
  );

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

      // Skip game logic if game over
      if (!gameOverRef.current && !gameWonRef.current) {
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
      if (
        !gameOverRef.current &&
        !gameWonRef.current &&
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
          onToggleSound={toggleSound}
          onStartWave={startNextWave}
          onSave={saveGame}
          onLoad={loadGame}
        />

        <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
          <GameCanvas
            canvasRef={canvasRef}
            onCanvasClick={handleCanvasClick}
            onCanvasMouseMove={handleCanvasMouseMove}
            onCanvasMouseLeave={handleCanvasMouseLeave}
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

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
            MOSQUITO DEFENSE
          </h1>
          <p className="text-xs text-slate-400">
            สถาปัตยกรรม OOP + Retry Wave System
          </p>
        </div>

        <TowerShop
          selectedTowerType={selectedTowerType}
          selectedTowerInstance={selectedTowerInstance}
          coins={coins}
          onSelectTower={(type) => {
            setSelectedTowerType(type);
            setSelectedTowerInstance(null);
          }}
        />

        <ItemGuide />

        <TowerInspector
          selectedTowerInstance={selectedTowerInstance}
          coins={coins}
          onUpgrade={handleUpgradeTower}
          onSell={handleSellTower}
          onClose={() => setSelectedTowerInstance(null)}
        />

        <div className="mt-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Info className="w-4 h-4 text-cyan-400" /> ฟีเจอร์เด่น
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>
              รองรับ <code className="text-emerald-400">Retry Wave</code>{" "}
              ที่แพ้โดยไม่ต้องเริ่มใหม่
            </li>
            <li>
              รองรับ <code className="text-emerald-400">Save / Load</code> ผ่าน
              LocalStorage
            </li>
            <li>
              ระบบ <code className="text-amber-400">Counter-Play</code>{" "}
              แก้ทางกัน
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
