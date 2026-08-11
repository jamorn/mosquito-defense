# 🧹 Code Improvement — แนวทางปรับปรุงโค้ดตามเวอร์ชัน

> เป็น Doc เสริม ของ `Implementation-Roadmap.md`
> รวบรวม "สิ่งที่ควรปรับปรุง" ในแต่ละเวอร์ชัน โดยอ้างอิงจากการ review โค้ด
>
> คะแนนรวมจาก review: **8.2/10**
> จุดที่ดึงคะแนน: Type Safety, duplicated logic, ยังไม่มี automated test

---

## 📌 สรุปจุดที่ควรปรับปรุง (เรียงตามความสำคัญ)

| #   | ประเด็น                                        | ความสำคัญ | ทำในเวอร์ชัน             |
| --- | ---------------------------------------------- | --------- | ------------------------ |
| 1   | ยังไม่มี automated test                        | 🔥 สูง    | v1.x (คู่ Health System) |
| 2   | Type Safety ผ่อน (`noUnused=false` + `as any`) | 🔥 สูง    | v1.x                     |
| 3   | Logic หาเป้าหมาย duplicate 2 แห่ง              | 🟡 กลาง   | v1.x / v2.0              |
| 4   | Magic number กระจัดกระจาย                      | 🟡 กลาง   | v1.x                     |
| 5   | Docker การตั้งชื่อ docs / note                 | 🟢 ต่ำ    | ตลอดเวลา                 |
| 6   | ระบบที่เชื่อมแผนงาน (Health/i18n/Pause ฯลฯ)    | —         | ดู Roadmap               |

---

## 🔥 1. Automated Test (ไม่มี) — สำคัญที่สุดก่อน refactor ใหญ่

**ปัญหาปัจจุบัน**: ไม่มี vitest/jest ตั้งไว้ ไม่มีไฟล์ test เลย

**ทำไมต้องทำ**: เราจะ refactor ใหญ่ (Health/Pause/Mobile/PlanningMode) ความเสี่ยง regression สูง ถ้าไม่มี test กัน

**แนะนำ**: เพิ่ม vitest + test เฉพาะ **pure logic** (ไม่ต้องทด Canvas/DOM):

- `HealthSystem` (takeBite, ติดเชื้อ, death report, heal, reset)
- `CombatSystem.calculateDamage` (counter-play: armored/stealth/splash)
- `WaveSystem` (buildQueue, fallback, allSpawned, shuffle)
- `TargetingSystem.prioritizeTargets`
- เศรษฐศาสตร์ (getUpgradeCost, getSellRefund, damage/range สเกลเลเวล)

**ขั้นตอน**:

```
npm i -D vitest
package.json: "test": "vitest run"
เขียน src/*.test.ts (logic ล้วน)
```

> แนะนำทำ **คู่กับก้อน 4 (Health System)** ที่เรากำลังจะเชื่อมอยู่ → ทดสอบ HealthSystem ที่เขียนไว้เลย

---

## 🔥 2. Type Safety — ผ่อนเยอะไป

**หลักฐานที่พบ**:

- `tsconfig.json`: `"noUnusedLocals": false`, `"noUnusedParameters": false`
- `SoundSystem.ts`: `(window as any).webkitAudioContext`

**ทำไมต้องแก้**:

- `noUnused=false` ทำให้โค้ด unused เงียบผ่าน ไม่โดนจับ → หายาก, เก็บไม่หมด (ที่จริง commit ก่อนๆ มีdead code ถูกทิ้งไว้)
- `as any` ขยายตัวได้ ถ้าไม่ดูแล

**แนะนำ**:

- ตั้ง `noUnusedLocals/Parameters` กลับเป็น `true` (หรือใช้ `_` prefix สำหรับพารามิเตอร์ที่ตั้งใจไม่ใช้)
- ลด `as any` โดยเฉพาะ WebKit prefix: ทำ type guard / interface ให้ถูกต้อง
  ```ts
  const AudioCtx =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  ```
- ตั้ง `noImplicitAny` (strict ปกติมีอยู่) + ระวังอย่าเผลอใช้ `any`

---

## 🟡 3. Duplicated logic — หาเป้าหมาย 2 แห่ง (DRY พร่อง)

**หลักฐานที่พบ**:

- `BaseTower.getFirstTarget()` — วนหา "ใกล้บ้านที่สุด (pathIndex สูงสุด) ในรัศมี" (logic เฉพาะ tower)
- `CombatSystem.findBestTarget()` — หา "ใกล้บ้านที่สุด" เหมือนกัน + ตรวจ counter-play (stealth detection)

**ปัญหา**: มี logic ซ้ำ 2 ที่ → แก้ทีละที่ อาจไม่ตรงกัน, เสี่ยง bug

**แนะนำ**: ให้ tower ใช้ `CombatSystem` อันเดียวเป็น central targeting

- แต่ละ tower เรียก `CombatSystem.findBestTarget(tower, mosquitoes)` แทน `getFirstTarget()`
- ลบ `getFirstTarget()` ออกจาก BaseTower (หรือ ให้ BaseTower ใช้ CombatSystem ข้างใน)
- จัดการ splash (Electric/Spray) ผ่าน `findAllTargets` ที่มีอยู่แล้ว

---

## 🟡 3.1 ความแม่นยำการเปรียบเทียบตำแหน่งยุง — `pathIndex` vs `distanceTraveled`

> 📝 **สถานะ: รับทราบแล้ว ยังไม่แก้ไข** — รู้วิธีแก้แล้ว แต่ปัญหายังไม่คุกคามการเล่นเกมปัจจุบัน จึงเลื่อนไปก่อน

### ปัญหาที่รับทราบ

การตัดสิน "ยุงตัวไหนใกล้บ้านกว่า" ในโค้ดปัจจุบันใช้ **`pathIndex`** (เลข index ของจุด route) เป็นหลัก ทำงานได้ดีและไว (O(n) ลูปเดียว) แต่มีข้อจำกัด 2 ข้อ:

1. **Tie-breaker เมื่อค่าเท่ากัน** — หากยุง 2 ตัวอยู่ใน Segment เดียวกัน (`pathIndex` เท่ากัน) ป้อมจะไม่ทราบว่าตัวไหนอยู่ "หน้า/หลัง" ภายใน segment นั้น
2. **pathIndex ไม่ได้แทนระยะทางจริงเสมอไป** — แต่ละ segment ความยาวไม่เท่ากัน ดังนั้นยุง `pathIndex` มากกว่า อาจ "จริงๆ อยู่ข้างหลัง" ยุง `pathIndex` น้อยกว่าได้

### ทางออกที่รู้แล้ว (เมื่อจะแก้ในอนาคต)

ใช้ **`distanceTraveled`** (ระยะทางสะสมที่ยุงเดินมาแล้วตามเส้นทางจริง) มาแทน `pathIndex` ในจุด Tie-breaker:

```ts
// 1. เพิ่ม field ใน Mosquito
public distanceTraveled: number = 0;

// 2. สะสมระยะจริงใน Mosquito.update() ทุก frame
this.distanceTraveled += moveAmount;

// 3. เปลี่ยนจุดเปรียบเทียบจาก pathIndex → distanceTraveled
//    ใน CombatSystem.findBestTarget(), BaseTower.getFirstTarget(),
//    TargetingSystem.prioritizeTargets() (ส่วน tie-breaker)
```

### เหตุผลที่ยังไม่แก้ตอนนี้

- **path ปัจจุบันสั้น** → กรณียุง 2 ตัวเหลื่อมใน segment เดียวกันพร้อมกันเกิดยาก
- **ประสิทธิภาพไม่ใช่ประเด็น** — ทั้งคู่เป็น O(n) เท่ากัน (เพราะ `distanceTraveled` เป็นค่าที่คำนวณสะสมไว้ล่วงหน้า ไม่ได้คิดใหม่ตอนเปรียบเทียบ)
- ต้องการให้โค้ดเรียบง่ายก่อน โฟกัส refactor ใหญ่ (Health / i18n / Pause) ตาม roadmap

**ไฟล์ที่เกี่ยวข้อง:** `src/game/systems/CombatSystem.ts`, `src/game/entities/towers/BaseTower.ts`, `src/game/systems/TargetingSystem.ts`, `src/game/entities/mosquitoes/Mosquito.ts`

---

## 🟡 4. Magic number กระจัดกระจาย

**หลักฐานที่พบ**: `setLives(20)`, `setCoins(400)`, `400/300` (floating text coords), `0` หลายจุด

**แนะนำ**: รวมค่าเริ่มต้นเป็น config เดียว (เช่น `game.config.ts` / `PlayerConfig`)

```
initialCoins: 400
initialLives: 20 (รอเปลี่ยนเป็น HP จาก HealthSystem)
freezeDuration: 4000ms ฯลฯ
```

ทำให้อ่าน/แก้ไขได้จุดเดียว

---

## 🟢 5. การตั้งชื่อ Doc / note

**ปัญหา**: ไฟล์ใน `Docs/` มีชื่อปนหลายสไตล์:

- `Note1.md`, `Note02.md`, `Note03.md`, `note05.md` (เลข 1, 02, 03, 05 ไม่สม่ำเสมอ, ไทย-อังกฤษปน)
- บางไฟล์เป็น "ไอเดีย" บางไฟล์เป็น "spec สำเร็จ"

**แนะนำ**: จัดระเบียบ prefix ให้ชัด (minor, ค่อยๆ ทำ)

- `docs-structure.md` มีแผนโครงสร้างอยู่แล้ว → ปรับให้ตรงตามจริง

---

## 📏 6. (อ้างอิง) เชื่อมระบบที่เขียนไว้แล้วกับเกม

ไม่ใช่ "ปรับปรุงโค้ด" แต่เป็นงานตาม Roadmap — ระบบเขียนไว้แล้วยังไม่เชื่อมกับ App.tsx:

- Health System / HealthBar / DeathReport (ก้อน 4)
- i18n / LanguageSelector / StartScreen (ก้อน 5)
- Death/Defeat Message overlay

ดูรายละเอียดใน `Implementation-Roadmap.md`

---

## 🗺️ ตารางผูกกับเวอร์ชัน

| เวอร์ชัน / ก้อน (จาก Roadmap) | ควรปรับปรุงโค้ดอะไรรวมด้วย                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| **ก้อน 0 (Mobile-First)**     | (ใหม่) Pointer events, Ghost preview — ใช้ type ละเอียด ตั้งแต่ต้น                       |
| **ก้อน 2 (Pause)**            | Centralize constant (magic number) สำหรับ initial state                                  |
| **ก้อน 4 (Health)**           | ✅ **ติดตั้ง vitest + test HealthSystem/CombatSystem** + ลบ `getFirstTarget` (duplicate) |
| **ก้อน 5 (i18n)**             | ใช้ type of translation ละเอียด (key) — ตอนนี้มี types.ts อยู่แล้ว                       |
| **ทุกก้อน**                   | ตั้ง `noUnused` true กลับ + ลด `as any`                                                  |

---

## 🎯 ข้อเสนอสรุป

**ถ้าให้เลือก "ทำทันที" สุด**:

1. **ติดตั้ง vitest + เขียน test** HealthSystem/CombatSystem (เพราะกำลังจะ refactor Health)
2. **ตั้ง `noUnusedLocals/Parameters` = true** + แก้ `as any` (type safety กลับมา)
3. **รวม `getFirstTarget`** เข้ากับ `CombatSystem` (DRY)

ทั้ง 3 นี้ทำให้โค้ด "รับมือการ refactor ใหญ่" ได้อย่างปลอดภัย และ**ไม่โต้แย้งการออกแบบเกมที่ทำได้ดีอยู่แล้ว** 👍

---

## 🗂️ ไฟล์ที่ต้องแก้ไข (ตามเวอร์ชัน) + ปัญหาแต่ละไฟล์

> ใช้ร่วมกับ `Implementation-Roadmap.md` — เป็น "checklist" เจาะจงว่าไฟล์ไหนต้องแก้เรื่องอะไร

### 🔴 กลุ่มที่ต้องแก้ "ก่อน refactor ใหญ่" (สำคัญสุด)

#### 📄 `src/game/entities/towers/TeslaTower.ts`

- **ปัญหา**: เขียน logic armor-piercing (×1.5) เองในไฟล์ แทนที่จะใช้ `CombatSystem.calculateDamage()` ที่มีอยู่แล้ว (DRY แตก)
- **ผล**: logic ซ้ำกับ CombatSystem → แก้ทีละที่ ไม่ตรงกัน เสี่ยง bug
- **แก้**: เรียก `CombatSystem.calculateDamage(this, target)` แทน hardcode

#### 📄 `src/game/entities/towers/BaseTower.ts`

- **ปัญหา**: มี `getFirstTarget()` (หาเป้าหมายใกล้บ้านสุด) ซ้ำกับ `CombatSystem.findBestTarget()` — โดยที่ CombatSystem ยังตรวจ counter-play (stealth) ด้วย
- **ผล**: tower บางตัวใช้ตัวนี้ ยังไม่ filter stealth → ยิงยุงล่องหนที่ควรเล็งไม่ได้? (ถ้าใช้ getFirstTarget ล้วน แต่ละ tower ต้อง filter เอง -> ผิดพลาด)
- **แก้**: ให้ BaseTower/ทุก tower ใช้ `CombatSystem.findBestTarget()` เป็น central; ลบ `getFirstTarget` (หรือ delegate)

#### 📄 `tsconfig.json`

- **ปัญหา**: `noUnusedLocals` และ `noUnusedParameters` ตั้งเป็น `false` (ผ่อน) → unused code เงียบ ไม่ออก error
- **ผล**: มี dead code หลง, หายาก
- **แก้**: ตั้งกลับเป็น `true` (ใช้ `_` prefix สำหรับ param ที่ไม่ใช้)

#### 📄 `src/game/engine/SoundSystem.ts`

- **ปัญหา**: `(window as any).webkitAudioContext` — ใช้ `as any`
- **ผล**: type safety หลุด; ขยาย `any` ได้
- **แก้**: ใช้ type guard / optional interface แทน `as any`

#### ➕ ใหม่: `vitest` (ยังไม่มีไฟล์)

- **ปัญหา**: ไม่มี automated test เลย → refactor ใหญ่เสี่ยง regression
- **แก้**: ติดตั้ง vitest + เขียน test (HealthSystem, CombatSystem, WaveSystem, TargetingSystem, เศรษฐศาสตร์) ทำคู่กับก้อน 4

---

### 🟡 กลุ่มที่ปรับปรุงระหว่างทำก้อนตาม roadmap

#### 📄 `src/App.tsx` (ก้อน 2/3/4: Pause, Planning, Health)

- **ปัญหา**:
  - magic number กระจัดกระจาย: `setLives(20)`, `setCoins(400)`, coords `400,300`
  - ใช้ `lives` ระบบเดิม (ต้องยกให้ HealthSystem เมื่อทำก้อน 4)
- **แก้**: centralize constant; ต่อ HealthSystem

#### 📄 `src/game/systems/SaveLoadSystem.ts` (ก้อน 2/4)

- **ปัญหา**: ตอนนี้ serialize ก็น่าจะมี `lives` (แล้ว `loadGame` ใน App ใช้ `data.lives`) — เมื่อเปลี่ยนเป็น HealthSystem ต้องจัดการ hp
- **แก้**: เปลี่ยน interface ให้เก็บ hp / state ตามระบบใหม่ + backward compat

#### 📄 `src/components/HUD/TopBar.tsx` + `GameCanvas.tsx` (ก้อน 0/2/4)

- **ปัญหา**: TopBar รับ prop `lives` (ต้องเปลี่ยนเป็น HP/HealthBar); GameCanvas ใช้ `onClick` อย่างเดียว (ต้องเป็น Pointer/touch สำหรับมือถือ)
- **แก้**: ปรับ prop + event → pointer

#### 📄 `src/components/Shop/TowerShop.tsx` + `ItemBar.tsx` (ก้อน 0)

- **ปัญหา**: icon ป้อม/ไอเทมเล็ก (ตามไอเดีย 0.5) — touch target อาจ < 44px
- **แก้**: enlarge icon + ป้ายราคา

#### 📄 `src/game/entities/mosquitoes/Mosquito.ts` (ก้อน Disease/Danger Level ตาม roadmap)

- **ปัญหา**: ยังไม่มี `dangerLevel` / drawDangerRing (ตาม Note1) — แต่ถ้าไม่ทำ Danger Level ก่อน Health ก็ข้ามได้
- **แก้**: (เมื่อทำ Note1) เพิ่ม field + draw

#### 📄 `src/config/health.config.ts` / `diseases.config.ts` / `HealthSystem.ts` (ก้อน 4)

- **ปัญหา**: เขียนไว้แล้ว แต่ยังไม่เชื่อมกับ App — ต้องตรวจว่ามี BITE_DAMAGE/INFECTION ชัด + todo test
- **แก้**: เชื่อม App + แห่งทดสอบ vitest

#### 📄 `src/i18n/**` + `src/components/StartScreen.tsx` (ก้อน 5 — ทำท้ายสุด)

- **ปัญหา**: เขียนไว้แล้ว แต่ยังไม่ได้เชื่อม — App ยังใช้ string ไทยล้วน
- **แก้**: แทนที่ string ด้วย `t()`; ใช้ type ของ translation (มี `types.ts`)

---

### 🟢 กลุ่มเอกสาร / minor

- `Docs/*` — ชื่อไฟล์/เลขไม่สม่ำเสมอ (Note1 vs Note02, ไทย-อังกฤษปน) → จัด prefix ให้ชัด
