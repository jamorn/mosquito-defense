
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Info } from 'lucide-react';

// ==========================================
// GAME ENGINE
// ==========================================
import { Renderer } from './game/engine/Renderer';
import { SoundSystem } from './game/engine/SoundSystem';
import { WaveSystem } from './game/systems/WaveSystem';
import { SaveLoadSystem } from './game/systems/SaveLoadSystem';

// ==========================================
// ENTITIES
// ==========================================
import { TowerFactory } from './game/entities/towers/TowerFactory';
import { ItemFactory } from './game/entities/items/ItemFactory';
import { Particle } from './game/entities/Particle';
import { FloatingTextEntity } from './game/entities/FloatingText';
import { Mosquito } from './game/entities/mosquitoes/Mosquito';
import { BaseTower } from './game/entities/towers/BaseTower';
import { SpecialItem } from './game/entities/items/SpecialItem';

// ==========================================
// CONFIG
// ==========================================
import { TOWER_CONFIGS } from './config/towers.config';
import { ITEM_CONFIGS } from './config/items.config';
import { getWavePattern } from './config/waves.config';

// ==========================================
// CONSTANTS
// ==========================================
import { GAME_PATH, SPAWN_POSITION } from './game/constants/path';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './game/constants/canvas';

// ==========================================
// COMPONENTS
// ==========================================
import { GameCanvas } from './components/GameCanvas';
import { TopBar } from './components/HUD/TopBar';
import { WaveIndicator } from './components/HUD/WaveIndicator';
import { ItemBar } from './components/HUD/ItemBar';
import { TowerShop } from './components/Shop/TowerShop';
import { ItemGuide } from './components/Shop/ItemGuide';
import { TowerInspector } from './components/Inspector/TowerInspector';
import { GameOverOverlay } from './components/Overlays/GameOverOverlay';
import { VictoryOverlay } from './components/Overlays/VictoryOverlay';

// ==========================================
// UTILS
// ==========================================
import { pointToSegmentDistance } from './utils/math';

// ==========================================
// TYPES
// ==========================================
import { TowerType, ItemType, LaserBeam } from './types/game.types';

// ==========================================
// MAIN APP COMPONENT
// ==========================================
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
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>('SWAT_ELECTRIC');
  const [selectedTowerInstance, setSelectedTowerInstance] = useState<BaseTower | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(performance.now());
  
  // 🆕 Retry Wave State
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
  const lasersRef = useRef<LaserBeam[]>([]);
  const floatingTextsRef = useRef<FloatingTextEntity[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Sync refs for Game Loop
  const selectedTowerRef = useRef<BaseTower | null>(selectedTowerInstance);
  const isWaveActiveRef = useRef<boolean>(isWaveActive);
  const waveRef = useRef<number>(wave);
  const gameOverRef = useRef<boolean>(gameOver);
  const gameWonRef = useRef<boolean>(gameWon);
  const failedWaveRef = useRef<number | null>(failedWave);
  const coinsRef = useRef<number>(coins);

  useEffect(() => { selectedTowerRef.current = selectedTowerInstance; }, [selectedTowerInstance]);
  useEffect(() => { isWaveActiveRef.current = isWaveActive; }, [isWaveActive]);
  useEffect(() => { waveRef.current = wave; }, [wave]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { gameWonRef.current = gameWon; }, [gameWon]);
  useEffect(() => { failedWaveRef.current = failedWave; }, [failedWave]);
  useEffect(() => { coinsRef.current = coins; }, [coins]);

  // Items Instances
  const itemsRef = useRef<Record<ItemType, SpecialItem>>({
    BOMB: ItemFactory.createItem('BOMB'),
    FREEZE: ItemFactory.createItem('FREEZE'),
    REPAIR: ItemFactory.createItem('REPAIR'),
  });

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  const addParticles = useCallback((x: number, y: number, color: string, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(x, y, color));
    }
  }, []);

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    floatingTextsRef.current.push(new FloatingTextEntity(x, y, text, color));
  }, []);

  const isValidPlacement = useCallback((x: number, y: number): boolean => {
    // Check path distance
    for (let i = 0; i < GAME_PATH.length - 1; i++) {
      if (pointToSegmentDistance({ x, y }, GAME_PATH[i], GAME_PATH[i + 1]) < 35) {
        return false;
      }
    }
    
    // Check tower overlap
    for (const t of towersRef.current) {
      if (Math.hypot(t.x - x, t.y - y) < 35) {
        return false;
      }
    }
    
    // Check boundaries
    return x >= 30 && x <= CANVAS_WIDTH - 30 && y >= 30 && y <= CANVAS_HEIGHT - 30;
  }, []);

  // ==========================================
  // GAME ACTIONS
  // ==========================================
  
  /**
   * Toggle Sound
   */
  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundSystemRef.current.setEnabled(next);
  }, [soundEnabled]);

  /**
   * Use Special Item
   */
  const handleUseItem = useCallback((type: ItemType) => {
    if (gameOver || gameWon) return;
    
    const item = itemsRef.current[type];
    const now = performance.now();

    if (item.canUse(coins, now)) {
      setCoins(prev => prev - item.cost);
      item.lastUsedTime = now;
      item.execute(
        mosquitoesRef.current,
        addParticles,
        soundSystemRef.current,
        setLives,
        addFloatingText
      );
      setCurrentTime(now);
    }
  }, [coins, gameOver, gameWon, addParticles, addFloatingText]);

  /**
   * Start Next Wave
   */
  const startNextWave = useCallback(() => {
    if (isWaveActive) return;
    
    setIsWaveActive(true);
    const pattern = waveSystemRef.current.startWave(wave);
    
    if (pattern) {
      const totalEnemies = pattern.composition.reduce((sum, c) => sum + c.count, 0);
      setEnemiesRemaining(totalEnemies);
    }
  }, [isWaveActive, wave]);

  /**
   * Handle Canvas Click
   */
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOverRef.current || gameWonRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    // Check if clicked on existing tower
    const clickedTower = towersRef.current.find(t => Math.hypot(t.x - x, t.y - y) < 25);
    if (clickedTower) {
      setSelectedTowerInstance(clickedTower);
      return;
    }

    // Deselect tower
    setSelectedTowerInstance(null);

    // Place new tower
    if (selectedTowerType) {
      const cost = TOWER_CONFIGS[selectedTowerType].cost;
      if (coins >= cost && isValidPlacement(x, y)) {
        setCoins(prev => prev - cost);
        const newTower = TowerFactory.createTower(selectedTowerType, x, y);
        towersRef.current.push(newTower);
        addParticles(x, y, newTower.config.glowColor, 12);
        soundSystemRef.current.play('upgrade');
      }
    }
  }, [selectedTowerType, coins, isValidPlacement, addParticles]);

  /**
   * Upgrade Tower
   */
  const handleUpgradeTower = useCallback(() => {
    if (!selectedTowerInstance) return;
    
    const cost = selectedTowerInstance.getUpgradeCost();
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      selectedTowerInstance.upgrade();
      addParticles(selectedTowerInstance.x, selectedTowerInstance.y, '#f59e0b', 15);
      soundSystemRef.current.play('upgrade');
    }
  }, [selectedTowerInstance, coins, addParticles]);

  /**
   * Sell Tower
   */
  const handleSellTower = useCallback(() => {
    if (!selectedTowerInstance) return;
    
    const refund = selectedTowerInstance.getSellRefund();
    setCoins(prev => prev + refund);
    towersRef.current = towersRef.current.filter(t => t.id !== selectedTowerInstance.id);
    addParticles(selectedTowerInstance.x, selectedTowerInstance.y, '#ef4444', 10);
    setSelectedTowerInstance(null);
    soundSystemRef.current.play('coin');
  }, [selectedTowerInstance, addParticles]);

  /**
   * Save Game
   */
  const saveGame = useCallback(() => {
    const success = SaveLoadSystem.save(
      coins,
      lives,
      wave,
      towersRef.current,
      itemsRef.current
    );
    
    if (success) {
      addFloatingText(400, 300, '💾 GAME SAVED!', '#22c55e');
      soundSystemRef.current.play('coin');
    } else {
      addFloatingText(400, 300, '❌ SAVE FAILED', '#ef4444');
    }
  }, [coins, lives, wave, addFloatingText]);

  /**
   * Load Game
   */
  const loadGame = useCallback(() => {
    const data = SaveLoadSystem.load();
    
    if (!data) {
      addFloatingText(400, 300, '❌ NO SAVE DATA', '#ef4444');
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
    setFailedWave(null);
    setGameOver(false);
    setGameWon(false);

    addFloatingText(400, 300, '📂 GAME LOADED!', '#38bdf8');
    soundSystemRef.current.play('upgrade');
  }, [addFloatingText]);

  /**
   * 🆕 Retry Wave (Keep towers/coins, reset wave)
   */
  const retryWave = useCallback(() => {
    if (failedWave === null) return;
    
    // Clear enemies and effects
    mosquitoesRef.current = [];
    particlesRef.current = [];
    lasersRef.current = [];
    floatingTextsRef.current = [];
    waveSystemRef.current.reset();
    
    // Reset wave state (keep wave number)
    setIsWaveActive(false);
    setGameOver(false);
    setEnemiesRemaining(0);
    
    // Reset HP to full (give player a fresh chance)
    setLives(20);
    
    // Reset item cooldowns
    Object.values(itemsRef.current).forEach(item => {
      item.lastUsedTime = 0;
    });
    
    // Clear failed wave
    setFailedWave(null);
    
    addFloatingText(400, 300, `🔄 RETRY WAVE ${failedWave}`, '#f59e0b');
    soundSystemRef.current.play('upgrade');
  }, [failedWave, addFloatingText]);

  /**
   * Reset Game (Full restart)
   */
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
  // GAME LOOP (2.5D Lite)
  // ==========================================
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

      // Skip game logic if game over
      if (!gameOverRef.current && !gameWonRef.current) {
        // Spawn mosquitoes
        if (isWaveActiveRef.current) {
          const newMosquito = waveSystemRef.current.update(delta);
          if (newMosquito) {
            mosquitoesRef.current.push(newMosquito);
          }
        }

        // Update mosquitoes
        for (let i = mosquitoesRef.current.length - 1; i >= 0; i--) {
          const m = mosquitoesRef.current[i];
          const isStillMoving = m.update(delta, GAME_PATH);

          if (!isStillMoving) {
            // Mosquito reached home
            const damage = m.bossDamage || 1;
            setLives(prev => {
              const next = prev - damage;
              if (next <= 0) {
                setGameOver(true);
                setFailedWave(waveRef.current);
              }
              return Math.max(0, next);
            });
            setEnemiesRemaining(prev => Math.max(0, prev - 1));
            mosquitoesRef.current.splice(i, 1);
            soundSystemRef.current.play('hit');
            continue;
          }
        }

        // Update towers
        const now = performance.now();
        towersRef.current.forEach(tower => {
          if (tower.pulseTimer > 0) {
            tower.pulseTimer -= delta;
          }
          tower.updateAndAttack(
            now,
            mosquitoesRef.current,
            lasersRef.current,
            addParticles,
            soundSystemRef.current,
            addFloatingText
          );
        });

        // Remove dead mosquitoes
        mosquitoesRef.current = mosquitoesRef.current.filter(m => {
          if (m.hp <= 0) {
            setCoins(prev => prev + m.reward);
            setEnemiesRemaining(prev => Math.max(0, prev - 1));
            addParticles(m.x, m.y, m.color, 15);
            addFloatingText(m.x, m.y, `+${m.reward}🪙`, '#fbbf24');
            soundSystemRef.current.play('coin');
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
          
          const pattern = waveSystemRef.current.waveInfo;
          const waveReward = pattern?.reward || 50;
          setCoins(prev => prev + waveReward);
          
          setWave(prev => {
            if (prev >= 10) {
              setGameWon(true);
              return prev;
            }
            return prev + 1;
          });
        }
      }

      // Draw Scene (2.5D Lite)
      renderer.drawScene(
        mosquitoesRef.current,
        towersRef.current,
        lasersRef.current,
        particlesRef.current,
        floatingTextsRef.current,
        delta
      );

      // Draw range highlight for selected tower
      if (selectedTowerRef.current) {
        renderer.drawRangeHighlight(selectedTowerRef.current);
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
      {/* ========================================== */}
      {/* CANVAS AREA */}
      {/* ========================================== */}
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

          {gameWon && (
            <VictoryOverlay onResetGame={resetGame} />
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDEBAR */}
      {/* ========================================== */}
      <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
            🦟 MOSQUITO DEFENSE
          </h1>
          <p className="text-xs text-slate-400">
            2.5D Lite + Counter-Play + Retry Wave System
          </p>
        </div>

        {/* Tower Shop */}
        <TowerShop
          selectedTowerType={selectedTowerType}
          selectedTowerInstance={selectedTowerInstance}
          coins={coins}
          onSelectTower={(type) => {
            setSelectedTowerType(type);
            setSelectedTowerInstance(null);
          }}
        />

        {/* Item Guide */}
        <ItemGuide />

        {/* Tower Inspector */}
        <TowerInspector
          selectedTowerInstance={selectedTowerInstance}
          coins={coins}
          onUpgrade={handleUpgradeTower}
          onSell={handleSellTower}
          onClose={() => setSelectedTowerInstance(null)}
        />

        {/* Features Info */}
        <div className="mt-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Info className="w-4 h-4 text-cyan-400" /> ฟีเจอร์เด่น
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <code className="text-emerald-400">2.5D Lite</code> - พื้นหลัง Parallax + เงา + Glow
            </li>
            <li>
              <code className="text-emerald-400">Retry Wave</code> - แพ้ Wave ไหน ลอง Wave นั้นใหม่
            </li>
            <li>
              <code className="text-emerald-400">Save / Load</code> - บันทึกเกมลง LocalStorage
            </li>
            <li>
              <code className="text-amber-400">Counter-Play</code> - ระบบแก้ทางยุง
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}