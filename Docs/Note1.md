# refactor 01

Logic นี้มีอยู่ในเกมแล้วครับ! Spray Tower คือ "น้ำ" ที่ทำให้ยุงปีกเปียกนั่นเอง 💨💧
Counter-Play ที่สมบูรณ์แบบ
ไฟ 🔥 (ยุงเยอะ, เร็ว, ดาเมจแรง)
↓
น้ำ 💧 (Spray ชะลอ, Freeze หยุด)
↓
ผู้เล่นมี "เวลา" มากขึ้น
↓
Tesla / Electric ยิงได้หลายชุด
↓
ไฟดับ 🔥→💧→✅ ชนะ

┌─────────────────────────────────────────────────────────┐
│ 🔖 TODO: Water/Slow Mechanic Enhancement │
├─────────────────────────────────────────────────────────┤
│ │
│ ✅ มีอยู่แล้ว: │
│ - Spray Tower (slow 50%, 1.5s) │
│ - Freeze Item (freeze 4s) │
│ │
│ 💡 เพิ่มได้ตอน Refactor: │
│ - Ice Tower (ป้อมน้ำแข็ง, slow + damage) │
│ - Water Mosquito (ยุงน้ำ, แพ้ Electric/สายฟ้า) │
│ - "Wet" status (ยุงเปียก → Tesla damage x1.5) │
│ - Fire Mosquito (ยุงไฟ, แพ้ Water/Ice) │
│ │
│ 🎯 Philosophy: │
│ - น้ำไม่ได้ฆ่าไฟ แต่ "ซื้อเวลา" ให้ชนะ │
│ - ยุงเปียก = บินช้า = ผู้เล่นมีเวลา │
│ │
└─────────────────────────────────────────────────────────┘

# ไอเดียเพิ่มเติม สีของยุง แบ่งตามความอันคราย

🚨 Danger Level System (ระดับความอันตราย)

# สีตามระดับความอันตราย

Level
สี
ความหมาย
ยุงในเกม
โรคที่นำพา
1
🟢 เขียว
อันตรายต่ำ
Normal
ระคายเคือง, ผื่น
2
🟡 เหลือง
ปานกลาง
Speedy
ไข้หวัด, ผื่นแพ้
3
🟠 ส้ม
สูง
Tank, Splitter
ไข้ป่า, ไข้หวัดใหญ่
4
🔴 แดง
ร้ายแรง
Armored, Stealth
ไข้เลือดออก
5
🟣 ม่วง
วิกฤต
BOSS
มาลาเรีย + ไข้เลือดออก

# ข้อมูลยุง (Mosquito Info Card)

┌─────────────────────────────────────────────────────────┐
│ │
│ 💀 BOSS: ยุงก้นปล่อง (Anopheles) │
│ ───────────────────────────────── │
│ ⚠️ Danger Level: 🔴🔴🔴🔴🔴 (5/5) │
│ │
│ 🩸 นำพาโรค: │
│ • มาลาเรีย (Malaria) │
│ • ไข้เลือดออก (Dengue Fever) │
│ │
│ 🏥 อาการ: │
│ • ไข้สูง 40°C+ │
│ • เลือดออกภายใน │
│ • เสียชีวิตได้หากไม่รักษา │
│ │
│ ⚔️ ในเกม: │
│ • ถึงบ้าน = -5 HP │
│ • ต้องฆ่าก่อนตัวอื่น! │
│ │
│ 💬 "ข้าคือยุงก้นปล่อง! │
│ ข้าพาไข้เลือดออก + มาลาเรีย │
│ ข้าอันตรายที่สุด ระวังให้ดี!" │
│ │
└─────────────────────────────────────────────────────────┘
🎨 Visual: Danger Indicator ในเกม

1. วงแหวนสีรอบตัวยุง
   // ใน Mosquito.draw()
   public drawDangerRing(ctx: CanvasRenderingContext2D): void {
   const dangerColors: Record<number, string> = {
   1: '#22c55e', // เขียว
   2: '#eab308', // เหลือง
   3: '#f97316', // ส้ม
   4: '#ef4444', // แดง
   5: '#a855f7', // ม่วง
   };

const color = dangerColors[this.dangerLevel] || '#22c55e';

ctx.save();
ctx.strokeStyle = color;
ctx.lineWidth = 2;
ctx.globalAlpha = 0.6;
ctx.setLineDash([4, 4]); // เส้นประ
ctx.beginPath();
ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI _ 2);
ctx.stroke();
ctx.restore();
} 2. ไอคอน 💀 หรือ ⚠️ เหนือหัว
// ยุง Danger 4-5 มีไอคอนเตือน
if (this.dangerLevel >= 4) {
ctx.font = '12px sans-serif';
ctx.textAlign = 'center';
ctx.fillText(this.dangerLevel === 5 ? '💀' : '⚠️', this.x, this.y - this.size - 15);
} 3. Pulse Effect สำหรับ Boss
// Boss มีวงแหวนกระพริบ
if (this.dangerLevel === 5) {
const pulse = Math.sin(Date.now() _ 0.005) _ 0.3 + 0.7;
ctx.globalAlpha = pulse;
ctx.strokeStyle = '#a855f7';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(this.x, this.y, this.size + 8, 0, Math.PI _ 2);
ctx.stroke();
}
📋 Config: Danger Level + Disease Info
// src/config/mosquitoes.config.ts (เพิ่ม field)
export const MOSQUITO_CONFIGS: Record<MosquitoType, MosquitoConfig> = {
NORMAL: {
name: 'ยุงรำคาญ',
dangerLevel: 1,
diseases: ['ผื่นคัน', 'ระคายเคือง'],
threatQuote: 'ข้าแค่ก่อกวน... แต่อย่าประมาท!',
// ... stats เดิม
},

SPEEDY: {
name: 'ยุงลาย (Aedes)',
dangerLevel: 2,
diseases: ['ไข้เลือดออก (เบา)', 'ผื่นแพ้'],
threatQuote: 'ข้าเร็ว! จับข้าไม่ทันหรอก!',
// ... stats เดิม
},

TANK: {
name: 'ยุงก้นปล่อง (Anopheles)',
dangerLevel: 3,
diseases: ['ไข้ป่า', 'ไข้หวัดใหญ่'],
threatQuote: 'ข้าทนทาน ยิงข้าไม่ตายง่ายๆ!',
// ... stats เดิม
},

ARMORED: {
name: 'ยุงลาย (Aedes aegypti)',
dangerLevel: 4,
diseases: ['ไข้เลือดออก (Dengue)', 'ไวรัสซิกา'],
threatQuote: '⚠️ ข้าพาไข้เลือดออก! เกราะข้าหนา ยิงไม่เข้า!',
// ... stats เดิม
},

STEALTH: {
name: 'ยุงก้นปล่อง (Anopheles)',
dangerLevel: 4,
diseases: ['มาลาเรีย', 'ไข้เลือดออก'],
threatQuote: '⚠️ ข้าล่องหน... เจ้าไม่เห็นข้า แต่ข้ากัดเจ้า!',
// ... stats เดิม
},

SPLITTER: {
name: 'ยุงพาหะ (Vector)',
dangerLevel: 3,
diseases: ['ไข้ป่า', 'ไข้เลือดออก'],
threatQuote: 'ฆ่าข้าสิ... แล้วข้าจะแบ่งตัวเพิ่ม!',
// ... stats เดิม
},

BOSS: {
name: '💀 ยุงก้นปล่องราชินี (Queen Anopheles)',
dangerLevel: 5,
diseases: ['มาลาเรีย', 'ไข้เลือดออก', 'ไวรัสซิกา', 'ไข้เหลือง'],
threatQuote: '💀 ข้าคือราชินี! ข้าพาทุกโรค! ถ้าข้าถึงบ้าน... เจ้าตาย!',
// ... stats เดิม
},
};

🖱️ UI: Info Card เมื่อคลิก/ชี้ที่ยุง
// src/components/HUD/MosquitoInfoCard.tsx
interface MosquitoInfoProps {
mosquito: MosquitoConfig | null;
position: { x: number; y: number };
}

export function MosquitoInfoCard({ mosquito, position }: MosquitoInfoProps) {
if (!mosquito) return null;

const dangerColors = ['🟢', '🟡', '🟠', '🔴', '🟣'];
const dangerColor = dangerColors[mosquito.dangerLevel - 1];

return (

<div
className="absolute bg-slate-900/95 border border-red-500/50 rounded-xl p-4 max-w-xs shadow-2xl"
style={{ left: position.x, top: position.y }} >
{/_ Header _/}
<div className="flex items-center gap-2 mb-2">
<span className="text-lg">{dangerColor}</span>
<span className="font-bold text-red-400 text-sm">
Danger Level: {mosquito.dangerLevel}/5
</span>
</div>

      {/* Name */}
      <div className="font-black text-white mb-1">{mosquito.name}</div>

      {/* Diseases */}
      <div className="text-xs text-slate-300 mb-2">
        <div className="text-red-400 font-bold mb-1">🩸 นำพาโรค:</div>
        <ul className="list-disc list-inside space-y-0.5">
          {mosquito.diseases.map(d => <li key={d}>{d}</li>)}
        </ul>
      </div>

      {/* Threat Quote */}
      <div className="text-xs italic text-amber-400 bg-amber-900/20 rounded-lg p-2">
        💬 "{mosquito.threatQuote}"
      </div>
    </div>

);
}

📊 เชื่อมกับ Gameplay
┌─────────────────────────────────────────────────────────┐
│ │
│ Danger Level สูง = ต้องฆ่าก่อน! │
│ │
│ 🟢 Level 1: ถึงบ้าน -1 HP (ไม่เป็นไร) │
│ 🟡 Level 2: ถึงบ้าน -1 HP │
│ 🟠 Level 3: ถึงบ้าน -2 HP │
│ 🔴 Level 4: ถึงบ้าน -3 HP ⚠️ │
│ 🟣 Level 5: ถึงบ้าน -5 HP 💀 (อันตรายสูงสุด!) │
│ │
│ TargetingSystem: │
│ ป้อมจะเลือกยิง Danger Level สูงก่อน (ถ้า pathIndex เท่ากัน)│
│ │
└─────────────────────────────────────────────────────────┘
// ใน TargetingSystem.ts (ปรับปรุง)
public static prioritizeTargets(mosquitoes: Mosquito[]): Mosquito[] {
return [...mosquitoes].sort((a, b) => {
// Priority 1: pathIndex (ใกล้บ้านก่อน)
if (b.pathIndex !== a.pathIndex) {
return b.pathIndex - a.pathIndex;
}
// Priority 2: dangerLevel (อันตรายกว่าก่อน)
return b.dangerLevel - a.dangerLevel;
});
}
✅ สรุป
สิ่งที่จะเพิ่ม
รายละเอียด
dangerLevel
ระดับ 1-5 (เขียว→ม่วง)
diseases[]
รายชื่อโรคที่นำพา
threatQuote
คำขู่ของยุง ("ข้าอันตราย!")
Danger Ring
วงแหวนสีรอบตัวยุง
Info Card
คลิกดูข้อมูลยุง
Priority
ป้อมยิง Danger สูงก่อน
