// src/config/towers.config.ts
import { TowerConfig } from "../types/tower.types";
import { TowerType } from "../types/game.types";

export const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
  SWAT_ELECTRIC: {
    name: "ไม้ช็อตยุงไฟฟ้า",
    cost: 100,
    icon: "⚡",
    description: "ช็อตยุงเป้าหมายเดียวรวดเร็ว",
    range: 120,
    damage: 25,
    fireRate: 600,
    color: "#3b82f6",
    glowColor: "#60a5fa",
  },
  SPRAY_SLOW: {
    name: "สเปรย์ยากันยุง",
    cost: 150,
    icon: "💨",
    description: "พ่นแก๊สชะลอยุงเป็นวงกว้าง",
    range: 100,
    damage: 10,
    fireRate: 800,
    color: "#10b981",
    glowColor: "#34d399",
    splashDamage: true,
  },
  UV_TRAP: {
    name: "ตะเกียงดักยุง UV",
    cost: 220,
    icon: "☀️",
    description: "ปล่อยแสง UV ล่อยุงและเผาทำลาย",
    range: 90,
    damage: 15,
    fireRate: 300,
    color: "#a855f7",
    glowColor: "#c084fc",
    stealthDetection: true,
    splashDamage: true,
  },
  TESLA_COIL: {
    name: "คอยล์สายฟ้าพิฆาต",
    cost: 280,
    icon: "💥",
    description: "ปล่อยสายฟ้าแรงสูงใส่ยุง",
    range: 160,
    damage: 60,
    fireRate: 1200,
    color: "#f59e0b",
    glowColor: "#fbbf24",
    armorPiercing: true,
  },
};
