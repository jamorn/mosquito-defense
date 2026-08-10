# 🦟 Mosquito Defense

> *"เกมที่พ่อสร้างด้วยใจ เพื่อปกป้องเด็กๆ ทั่วโลก"*

[![Status](https://img.shields.io/badge/Status-Playable-success)]()
[![React](https://img.shields.io/badge/React-18.3-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)]()
[![Vite](https://img.shields.io/badge/Vite-7.3-purple)]()
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

เกม Tower Defense เพื่อการศึกษา ที่สอนเด็กๆ ทั่วโลกเรื่อง **"โรคที่มากับยุง"** ผ่านระบบ **Counter-Play** และปรัชญา **"ไม่มีอะไรไร้พ่าย ทุกอย่างมีทางแก้"** 🔥💧

---

## 📚 สารบัญ

- [✨ ฟีเจอร์เด่น](#-ฟีเจอร์เด่น)
- [💝 ปรัชญาของเกม](#-ปรัชญาของเกม)
- [🚀 Quick Start](#-quick-start)
- [🎮 วิธีเล่น](#-วิธีเล่น)
- [⚔️ ระบบ Counter-Play](#️-ระบบ-counter-play)
- [🏥 ระบบสุขภาพผู้เล่น](#-ระบบสุขภาพผู้เล่น)
- [💀 รายงานการเสียชีวิต](#-รายงานการเสียชีวิต)
- [💪 ข้อความให้กำลังใจ](#-ข้อความให้กำลังใจ)
- [🌐 รองรับ 7 ภาษา](#-รองรับ-7-ภาษา)
- [📁 Project Structure](#-project-structure)
- [🏗️ สถาปัตยกรรม](#️-สถาปัตยกรรม)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 Game Balance](#-game-balance)
- [📜 Scripts](#-scripts)
- [🚀 Deployment](#-deployment)
- [📄 License](#-license)

---

## ✨ ฟีเจอร์เด่น

### 🎮 Core Gameplay
- ✅ **10 Waves** พร้อม Boss และ Special Enemies
- ✅ **4 Towers** - Electric ⚡, Spray 💨, UV Trap ☀️, Tesla 💥
- ✅ **7 Enemy Types** - Normal, Speedy, Tank, Boss, Armored, Stealth, Splitter
- ✅ **3 Special Items** - Bomb 💣, Freeze ❄️, Repair 🛠️
- ✅ **Upgrade System** - อัพเกรดป้อมได้ 3 ระดับ
- ✅ **Retry Wave** - แพ้ Wave ไหน ลอง Wave นั้นใหม่

### 🏥 Health & Education System
- ✅ **Player Health System** - สุขภาพ 100% → ตาย
- ✅ **Disease Infection** - ติดเชื้อโรคจริงจากยุง
- ✅ **Death Report** - รายงานสถิติการตายครบถ้วน
- ✅ **Defeat Messages** - ข้อความให้กำลังใจสุ่ม 5 แบบ
- ✅ **Real Disease Data** - ข้อมูลโรคจาก WHO + กรมควบคุมโรค

### 🎨 Visual & Audio
- ✅ **2.5D Lite Graphics** - Parallax background, shadows, glow effects
- ✅ **Particle System** - เอฟเฟกต์ระเบิดและละอองแสง
- ✅ **Floating Text** - ตัวเลขความเสียหายลอย
- ✅ **Web Audio Synthesizer** - เสียงแบบ Real-time

### 🌐 Multi-language Support
- ✅ **7 ภาษา** - ไทย, English, Español, Français, Português, हिन्दी, Kiswahili
- ✅ **Auto-detect** ภาษาของ browser
- ✅ **Save preference** ใน localStorage

### 🧠 Smart Systems
- ✅ **Counter-Play System** - ระบบแก้ทาง (Rock-Paper-Scissors)
- ✅ **Wave Patterns** - แต่ละ Wave มี Pattern ชัดเจน
- ✅ **Save/Load** - บันทึกเกมลง LocalStorage
- ✅ **Hint System** - คำแนะนำตาม Wave ที่แพ้

---

## 💝 ปรัชญาของเกม

### "ไม่มีอะไรไร้พ่าย ทุกอย่างมีทางแก้"
🔥 ไฟแรงแค่ไหน → 💧 น้ำย่อมดับได้เสมอ
⚡ สายฟ้าเร็วแค่ไหน → 🌍 ดินย่อมดูดซับได้
🌪️ ลมแรงแค่ไหน → 🪨 หินย่อมต้านทานได้

### ปรัชญา "แพ้ในเกม ชนะในชีวิตจริง"

> *"เราแพ้ในเกมได้ แต่ในชีวิตจริง เราจะไม่ยอมแพ้ยุง!"*

ทุกครั้งที่ผู้เล่นแพ้ จะได้เรียนรู้วิธีป้องกันตัวเองและครอบครัว

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm หรือ yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/mosquito-defense.git
cd mosquito-defense

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Browser จะเปิดอัตโนมัติที่ http://localhost:3000

Game Flow
1. วางป้อมเตรียมพร้อม
   ↓
2. กด "ปล่อยยุง" เพื่อเริ่ม Wave
   ↓
3. ป้องกันบ้านจากยุง (HP 100%)
   ↓
4. ได้เงินจากฆ่ายุง + Wave Bonus
   ↓
5. อัพเกรดป้อม / ซื้อป้อมใหม่
   ↓
6. ทำซ้ำจนผ่าน Wave 10
   ↓
7. 🏆 VICTORY!

⚔️ ระบบ Counter-Play
💡 ปรัชญาของเกม: ไม่มีอะไรเหนือกว่ากัน ทุกอย่างมีทางแก้

Counter Matrix
Enemy
Icon
Weakness
Counter Tower
Strategy
Normal
🟢
-
⚡ Electric
ยิงเร็วจัดการง่าย
Speedy
🔵
Slow
💨 Spray
ชะลอแล้วยิงซ้ำ
Tank
🟠
High DMG
💥 Tesla
ต้องการดาเมจสูง
Boss
🔴
Freeze + Burst
💥 Tesla + ❄️
Freeze แล้ว Burst
Armored
🛡️
Armor Pierce
💥 Tesla
Tesla เท่านั้นที่ทะลุเกราะ
Stealth
👻
Detection
☀️ UV Trap
UV Trap เท่านั้นที่มองเห็น
Splitter
🔪
Splash
💨 Spray
ยิงกลุ่มป้องกันการแบ่งตัว

# Wave Patterns

Wave
Name
Main Threat
Counter
1-2
🌱 First Contact
Normal
Electric
3
⚡ SPEED RUSH
Speedy
Spray
5
🛡️ ARMORED BATTALION
Armored
Tesla
7
👻 STEALTH INVASION
Stealth
UV Trap
9
👑 MOSQUITO KING
Boss + Splitter
Freeze + Tesla
10
💀 ALL-OUT ASSAULT
Everything
All Towers

🏥 ระบบสุขภาพผู้เล่น
ผู้เล่นเริ่มด้วย HP 100% และลดลงเมื่อยุงถึงบ้าน
HP
Status
Emoji
อาการ
100-76%
HEALTHY
💚
รู้สึกปกติ
75-51%
MILD
🤒
ไข้ต่ำ, ปวดศีรษะ
50-26%
SICK
🤕
ไข้สูง, คลื่นไส้, ผื่น
25-1%
CRITICAL
🚑
เลือดออก, ชัก, หมดสติ
0%
DEAD
💀
เสียชีวิต

การติดเชื้อ
ยุงแต่ละชนิดมีความเสี่ยงติดเชื้อต่างกัน:
🟢 Normal: 10%
🔵 Speedy: 25%
🟠 Tank: 20%
🛡️ Armored: 30%
👻 Stealth: 35%
🔪 Splitter: 20%
🔴 Boss: 100%

💀 รายงานการเสียชีวิต
เมื่อ HP ลดเหลือ 0% ผู้เล่นจะเห็น:
┌─────────────────────────────────────────────────────────┐
│  💀 เสียชีวิต!                                         │
│  เสียชีวิตจาก ไข้เลือดออก, มาลาเรีย                   │
│                                                         │
│  📊 รายงานการถูกยุงกัด                                │
│  ┌─────────┬─────────┬─────────┐                       │
│  │   12    │    2    │  4:32   │                       │
│  │ถูกกัด   │ติดเชื้อ │เวลารอด  │                       │
│  └─────────┴─────────┴─────────┘                       │
│                                                         │
│  💪 เราแพ้ในเกมได้                                     │
│  แต่ในชีวิตจริง เราจะไม่ยอมแพ้ยุง!                    │
│                                                         │
│  🪣 คว่ำภาชนะที่มีน้ำขัง                              │
│  🛏️ นอนในมุ้งทุกคืน                                   │
│  🧴 ทายากันยุงก่อนออกจากบ้าน                          │
│  👕 สวมเสื้อแขนยาว กางเกงขายาว                       │
│                                                         │
│  [🔄 ลอง Wave 7 ใหม่]  [เริ่มเกมใหม่]                │
└─────────────────────────────────────────────────────────┘

💪 ข้อความให้กำลังใจ
เมื่อผู้เล่นแพ้ จะได้เห็นข้อความสุ่ม (7 ภาษา):
💪 "เราแพ้ในเกมได้ แต่ในชีวิตจริง เราจะไม่ยอมแพ้ยุง!
มาปกป้องตัวเองและคนที่เรารักกันเถอะ"
พร้อมคำแนะนำ 4 ข้อ:
🪣 คว่ำภาชนะที่มีน้ำขัง ไม่ให้ยุงวางไข่
🛏️ นอนในมุ้งทุกคืน ป้องกันยุงกัด
🧴 ทายากันยุงก่อนออกจากบ้าน
👕 สวมเสื้อแขนยาว กางเกงขายาว เมื่ออยู่ในที่มืด

📁 Project Structure
mosquito-defense/
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── App.tsx                              # 🏠 Main Component
│   ├── main.tsx                             # 🚀 Entry Point
│   ├── index.css                            # 🎨 Global Styles (Tailwind)
│   │
│   ├── types/                               # 📝 TypeScript Types (4 files)
│   │   ├── game.types.ts                    # Core types (Point, TowerType, etc.)
│   │   ├── tower.types.ts                   # Tower-related types
│   │   ├── mosquito.types.ts                # Mosquito-related types
│   │   └── health.types.ts                  # 🆕 Health system types
│   │
│   ├── config/                              # 📊 Game Balance (7 files)
│   │   ├── towers.config.ts                 # Tower stats
│   │   ├── mosquitoes.config.ts             # Mosquito stats
│   │   ├── items.config.ts                  # Item stats
│   │   ├── waves.config.ts                  # Wave patterns (หัวใจ!)
│   │   ├── counter-matrix.ts                # Counter rules
│   │   ├── health.config.ts                 # 🆕 Health system config
│   │   ├── diseases.config.ts               # 🆕 โรคจากยุง (WHO data)
│   │   └── defeat-messages.config.ts        # 🆕 ข้อความสุ่มตอนแพ้ (7 ภาษา)
│   │
│   ├── utils/                               # 🔧 Utilities (2 files)
│   │   ├── math.ts                          # Distance calculations
│   │   └── storage.ts                       # LocalStorage wrapper
│   │
│   ├── game/                                # 🎮 GAME ENGINE (Pure Logic)
│   │   │                                    # ⚠️ ไม่ขึ้นกับ React!
│   │   │
│   │   ├── constants/                       # 📐 Game Constants (2 files)
│   │   │   ├── canvas.ts                    # Canvas dimensions
│   │   │   └── path.ts                      # Path waypoints
│   │   │
│   │   ├── engine/                          # 🔧 Core Engine (8 files)
│   │   │   ├── Renderer.ts                  # 🎨 Main 2.5D renderer
│   │   │   ├── Background25D.ts             # 🌙 Parallax background
│   │   │   ├── ShadowEffect.ts              # 👤 2.5D shadows
│   │   │   ├── DepthEffect.ts               # 📏 Depth scaling
│   │   │   ├── ParallaxBackground.ts        # ☁️ Parallax layers
│   │   │   ├── Isometric.ts                 # 📐 Isometric utilities
│   │   │   ├── GameLoop.ts                  # 🔄 requestAnimationFrame
│   │   │   └── SoundSystem.ts               # 🔊 Web Audio synthesizer
│   │   │
│   │   ├── systems/                         # ⚙️ Game Systems (5 files)
│   │   │   ├── WaveSystem.ts                # 🌊 Wave patterns + spawning
│   │   │   ├── CombatSystem.ts              # ⚔️ Damage/Armor/Stealth calc
│   │   │   ├── TargetingSystem.ts           # 🎯 Target selection
│   │   │   ├── SaveLoadSystem.ts            # 💾 LocalStorage persistence
│   │   │   └── HealthSystem.ts              # 🆕 Player health + infection
│   │   │
│   │   └── entities/                        # 📦 Game Objects (24 files)
│   │       ├── GameObject.ts                # Abstract base class
│   │       ├── Particle.ts                  # Particle effects
│   │       ├── FloatingText.ts              # Floating damage numbers
│   │       ├── LaserBeam.ts                 # Laser effects
│   │       │
│   │       ├── mosquitoes/                  # 🦟 ENEMY ROSTER (9 files)
│   │       │   ├── Mosquito.ts              # Abstract base
│   │       │   ├── NormalMosquito.ts        # 🟢 Basic enemy
│   │       │   ├── SpeedyMosquito.ts        # 🔵 Fast enemy
│   │       │   ├── TankMosquito.ts          # 🟠 High HP enemy
│   │       │   ├── BossMosquito.ts          # 🔴 Boss (-15 HP)
│   │       │   ├── ArmoredMosquito.ts       # 🛡️ Armor (Counter: Tesla)
│   │       │   ├── StealthMosquito.ts       # 👻 Stealth (Counter: UV)
│   │       │   ├── SplitterMosquito.ts      # 🔪 Splits (Counter: Spray)
│   │       │   └── MosquitoFactory.ts       # Factory pattern
│   │       │
│   │       ├── towers/                      # 🛡️ TOWER ROSTER (6 files)
│   │       │   ├── BaseTower.ts             # Abstract base
│   │       │   ├── ElectricTower.ts         # ⚡ Fast attack
│   │       │   ├── SprayTower.ts            # 💨 AoE + Slow
│   │       │   ├── UVTrapTower.ts           # ☀️ Detection + Burn
│   │       │   ├── TeslaTower.ts            # 💥 Armor Pierce
│   │       │   └── TowerFactory.ts          # Factory pattern
│   │       │
│   │       └── items/                       # ✨ SPECIAL ITEMS (5 files)
│   │           ├── SpecialItem.ts           # Abstract base
│   │           ├── BombItem.ts              # 💣 AoE damage
│   │           ├── FreezeItem.ts            # ❄️ Freeze all
│   │           ├── RepairItem.ts            # 🛠️ Heal home
│   │           └── ItemFactory.ts           # Factory pattern
│   │
│   ├── components/                          # ⚛️ REACT UI (12 files)
│   │   ├── GameCanvas.tsx                   # 🖼️ Canvas element
│   │   ├── StartScreen.tsx                  # 🆕 หน้าเลือกภาษา
│   │   │
│   │   ├── HUD/                             # 📊 Heads-Up Display (4 files)
│   │   │   ├── TopBar.tsx                   # Coins, HP, Wave, Controls
│   │   │   ├── WaveIndicator.tsx            # 🌊 Wave type + hint
│   │   │   ├── ItemBar.tsx                  # ✨ Item quick bar
│   │   │   └── HealthBar.tsx                # 🆕 Player health bar
│   │   │
│   │   ├── Shop/                            # 🛒 Shop (2 files)
│   │   │   ├── TowerShop.tsx                # Tower selection
│   │   │   └── ItemGuide.tsx                # Item descriptions
│   │   │
│   │   ├── Inspector/                       # 🔍 Inspector (1 file)
│   │   │   └── TowerInspector.tsx           # Stats + Upgrade/Sell
│   │   │
│   │   └── Overlays/                        # 🎭 Overlays (4 files)
│   │       ├── GameOverOverlay.tsx          # 💀 Game Over + Retry
│   │       ├── VictoryOverlay.tsx           # 🏆 Victory
│   │       ├── DeathReportOverlay.tsx       # 🆕 Death statistics
│   │       └── DefeatMessageOverlay.tsx     # 🆕 Encouragement messages
│   │
│   ├── hooks/                               # 🪝 Custom React Hooks (3 files)
│   │   ├── useGameLoop.ts                   # requestAnimationFrame
│   │   ├── useSound.ts                      # Sound system
│   │   └── useSaveLoad.ts                   # Save/Load
│   │
│   └── i18n/                                # 🌐 Internationalization (11 files)
│       ├── types.ts                         # i18n types
│       ├── index.ts                         # Main i18n exports
│       ├── LanguageContext.tsx              # React Context
│       ├── LanguageSelector.tsx             # Language dropdown
│       │
│       └── languages/                       # 🌍 7 Language files
│           ├── th.ts                        # 🇹🇭 Thai
│           ├── en.ts                        # 🇬🇧 English
│           ├── es.ts                        # 🇪🇸 Spanish
│           ├── fr.ts                        # 🇫🇷 French
│           ├── pt.ts                        # 🇵🇹 Portuguese (Brazil)
│           ├── hi.ts                        # 🇮🇳 Hindi
│           └── sw.ts                        # 🌍 Swahili
│
├── Docs/                                    # 📚 Documentation
│   ├── 01-getting-started/                  # เริ่มต้นใช้งาน
│   ├── 02-game-design/                      # การออกแบบเกม
│   ├── 03-architecture/                     # สถาปัตยกรรม
│   ├── 04-game-balance/                     # สมดุลเกม
│   ├── 05-content/                          # เนื้อหาเกม
│   ├── 06-localization/                     # การแปลภาษา
│   ├── 07-deployment/                       # การ Deploy
│   ├── 08-education/                        # สำหรับการศึกษา
│   ├── 09-technical/                        # เอกสารเทคนิค
│   └── 10-contributing/                     # การมีส่วนร่วม
│
├── index.html                               # 🌐 HTML Entry
├── package.json                             # 📦 Dependencies
├── package-lock.json                        # 🔒 Locked versions
├── tsconfig.json                            # 🔧 TypeScript Config
├── tsconfig.node.json                       # 🔧 Node Config
├── vite.config.ts                           # ⚡ Vite Config
├── tailwind.config.js                       # 🎨 Tailwind Config
├── postcss.config.js                        # 🎨 PostCSS Config
├── .gitignore                               # 🚫 Git Ignore
└── README.md                                # 📖 This file

🏗️ สถาปัตยกรรม
Layer Diagram
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  GameCanvas │  │  HUD/Shop   │  │  Overlays               │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    REACT BRIDGE LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  App.tsx + Custom Hooks (useGameLoop, useSound, etc.)    │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    GAME ENGINE CORE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   Entities   │  │   Systems    │  │   Engine           │    │
│  │  - Towers    │  │  - Wave      │  │  - Renderer 2.5D   │    │
│  │  - Mosquitoes│  │  - Combat    │  │  - Sound           │    │
│  │  - Items     │  │  - Targeting │  │  - Background      │    │
│  │  - Health    │  │  - Health    │  │  - Parallax        │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    CONFIGURATION LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ towers.config│  │mosquitoes.   │  │  waves.config      │    │
│  │              │  │config        │  │  (Wave Patterns)   │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

# Design Patterns
Pattern
Usage
Files
Factory
Create Towers/Mosquitoes/Items
*Factory.ts
Abstract Class
Base entities
Mosquito.ts, BaseTower.ts, SpecialItem.ts
Observer
State sync (React)
App.tsx
Strategy
Counter-play rules
CombatSystem.ts
Context
i18n, Game state
LanguageContext.tsx

🛠️ Tech Stack
Technology
Version
Purpose
React
18.3
UI Framework
TypeScript
5.6
Type Safety
Vite
7.3
Build Tool
Tailwind CSS
3.4
Styling
Canvas 2D API
-
Game Rendering
Web Audio API
-
Sound Effects
LocalStorage
-
Save System
Lucide React
0.454
Icons

📊 Game Balance
Tower Stats
Tower
Cost
Damage
Fire Rate
Range
Special
⚡ Electric
100
25
600ms
120
Fast attack
💨 Spray
150
10
800ms
100
AoE + Slow
☀️ UV Trap
220
15
300ms
90
Detection
💥 Tesla
280
60
1200ms
160
Armor Pierce

Bite Damage (HP %)
Mosquito Type
Damage
Infection Chance
Normal
2%
10%
Speedy
3%
25%
Tank
5%
20%
Armored
5%
30%
Stealth
4%
35%
Splitter
3%
20%
Boss
15%
100%
Economy
Source
Amount
Starting coins
400
Normal kill
15
Speedy kill
20
Tank kill
35
Boss kill
250
Wave bonus
50 + (wave × 10)
📜 Scripts
Command
Description
npm run dev
Start development server (port 3000)
npm run build
Build for production
npm run preview
Preview production build
npm run lint
Run ESLint
npm run type-check
Check TypeScript types