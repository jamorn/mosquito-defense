# เสริมอีกนิด ตอนที่ผู้เล่น แพ้ให้บอกว่าคุณเพราะ ถูกยุง xx กัด แล้วผู้เล่นสงสัยทำ info เพิ่มเติม การถูก อะไรเล่นงานถึงตาย

💀 Death Report: "คุณถูกยุง XX กัด!"
ไอเดียนี้ ทรงพลังมาก ครับ! เปลี่ยน Game Over จาก "แพ้แล้วจบ" เป็น "บทเรียนที่จดจำ" 🎓
🎯 Flow ที่เกิดขึ้น
ผู้เล่นแพ้
↓
💀 "คุณถูกยุงลาย (Aedes) กัด!"
↓
🤔 ผู้เล่นสงสัย: "ยุงลาย? มันอันตรายยังไง?"
↓
👆 กดปุ่ม "ดูรายละเอียด"
↓
📋 แสดง Info: โรค, อาการ, ทำไมถึงตาย
↓
💡 ผู้เล่นเรียนรู้: "อ๋อ! ไข้เลือดออกอันตรายแบบนี้เอง!"
↓
🔄 กด Retry → เล่นใหม่ด้วยความเข้าใจมากขึ้น

📋 Death Report Structure
// src/types/game.types.ts (เพิ่ม)
export interface DeathReport {
killerMosquito: {
type: MosquitoType;
name: string; // "ยุงลาย (Aedes)"
dangerLevel: number;
};
diseases: DiseaseInfo[]; // โรคที่นำพา
deathCause: string; // สาเหตุการตาย (ในเกม)
realWorldInfo: string; // ข้อมูลในชีวิตจริง
prevention: string[]; // วิธีป้องกัน
}

🔧 Implementation: บันทึกยุงตัวที่ฆ่าผู้เล่น
// ใน App.tsx (ส่วน Game Loop)
// แก้ไขส่วนที่ยุงถึงบ้าน:

if (!isStillMoving) {
const damage = m.bossDamage || 1;

setLives(prev => {
const next = prev - damage;
if (next <= 0) {
setGameOver(true);
setFailedWave(waveRef.current);

      // 🆕 บันทึก Death Report
      setDeathReport({
        killerMosquito: {
          type: m.type,
          name: MOSQUITO_CONFIGS[m.type].name,
          dangerLevel: MOSQUITO_CONFIGS[m.type].dangerLevel,
        },
        diseases: getDiseasesByMosquito(m.type),
        deathCause: `ถูก ${MOSQUITO_CONFIGS[m.type].name} กัดจน HP บ้านหมด`,
        realWorldInfo: getRealWorldInfo(m.type),
        prevention: getPreventionTips(m.type),
      });
    }
    return Math.max(0, next);

});

mosquitoesRef.current.splice(i, 1);
soundSystemRef.current.play('hit');
continue;
}

🖼️ Game Over Overlay (ปรับปรุง)
// src/components/Overlays/GameOverOverlay.tsx
import React, { useState } from 'react';
import { RotateCcw, Play, Skull, Info, Bug, ShieldAlert } from 'lucide-react';
import { DeathReport } from '../../types/game.types';
import { getWaveHint } from '../../config/waves.config';

interface GameOverOverlayProps {
failedWave: number | null;
deathReport: DeathReport | null;
onRetryWave: () => void;
onResetGame: () => void;
}

export function GameOverOverlay({
failedWave,
deathReport,
onRetryWave,
onResetGame,
}: GameOverOverlayProps) {
const [showDiseaseInfo, setShowDiseaseInfo] = useState(false);

const dangerColors = ['🟢', '🟡', '🟠', '🔴', '🟣'];
const dangerColor = deathReport
? dangerColors[deathReport.killerMosquito.dangerLevel - 1]
: '🔴';

return (

<div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
<Skull className="w-16 h-16 text-red-500 mb-3 animate-pulse" />
<h2 className="text-4xl font-black text-red-500 mb-2 tracking-wider">GAME OVER!</h2>

      {/* 💀 Death Report */}
      {deathReport && (
        <div className="bg-red-900/20 border-2 border-red-500/40 rounded-xl p-4 mb-4 max-w-md w-full">
          <div className="text-red-400 font-black text-lg mb-2">
            💀 คุณถูก {deathReport.killerMosquito.name} กัด!
          </div>
          <div className="text-slate-300 text-sm mb-3">
            {dangerColor} Danger Level: {deathReport.killerMosquito.dangerLevel}/5
          </div>

          {/* Diseases */}
          <div className="text-left mb-3">
            <div className="text-red-400 font-bold text-sm mb-1">🩸 นำพาโรค:</div>
            <ul className="text-slate-300 text-xs space-y-1">
              {deathReport.diseases.map(d => (
                <li key={d.id} className="flex items-start gap-1">
                  <span className="text-red-400">•</span>
                  <span>
                    <strong>{d.nameTh}</strong> ({d.nameEn})
                    {d.specialWarning && (
                      <div className="text-amber-400 text-[10px] ml-3">⚠️ {d.specialWarning}</div>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ดูรายละเอียดเพิ่มเติม */}
          <button
            onClick={() => setShowDiseaseInfo(!showDiseaseInfo)}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            {showDiseaseInfo ? 'ซ่อนรายละเอียด' : 'ถูกอะไรเล่นงานถึงตาย? 🤔'}
          </button>
        </div>
      )}

      {/* 📋 Disease Info Detail (แสดงเมื่อกดดู) */}
      {showDiseaseInfo && deathReport && (
        <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-4 mb-4 max-w-md w-full text-left max-h-60 overflow-y-auto">
          <div className="font-bold text-amber-400 mb-2 flex items-center gap-2">
            <Bug className="w-4 h-4" /> ทำไมถึงอันตราย?
          </div>

          {deathReport.diseases.map(d => (
            <div key={d.id} className="mb-3 pb-3 border-b border-slate-700 last:border-0">
              <div className="font-bold text-white text-sm">{d.nameTh}</div>
              <div className="text-slate-400 text-xs mb-1">อาการเด่น:</div>
              <ul className="text-slate-300 text-xs space-y-0.5 ml-3">
                {d.symptoms.map(s => <li key={s}>• {s}</li>)}
              </ul>
              {d.specialWarning && (
                <div className="text-red-400 text-xs mt-1 font-bold">⚠️ {d.specialWarning}</div>
              )}
            </div>
          ))}

          {/* วิธีป้องกันในชีวิตจริง */}
          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> ป้องกันในชีวิตจริง:
            </div>
            <ul className="text-slate-300 text-xs space-y-0.5 ml-3">
              {deathReport.prevention.map(p => <li key={p}>✅ {p}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Wave Hint */}
      {failedWave && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 mb-4 max-w-md">
          <div className="text-amber-400 font-bold text-sm">💡 เคล็ดลับสำหรับ Wave {failedWave}:</div>
          <div className="text-slate-300 text-xs mt-1">{getWaveHint(failedWave)}</div>
        </div>
      )}

      {/* Action Buttons */}
      <button
        onClick={onRetryWave}
        className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg transition mb-3 transform active:scale-95"
      >
        <RotateCcw className="w-6 h-6" />
        🔄 ลอง Wave {failedWave} ใหม่
      </button>

      <button
        onClick={onResetGame}
        className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg transition text-sm"
      >
        <Play className="w-4 h-4" />
        เริ่มเกมใหม่ (Wave 1)
      </button>
    </div>

);
}
📝 Helper Functions
// src/config/diseases.config.ts (เพิ่ม)

// ข้อมูลในชีวิตจริงตามชนิดยุง
export const getRealWorldInfo = (type: MosquitoType): string => {
const info: Record<MosquitoType, string> = {
NORMAL: 'ยุงรำคาญออกหากินตอนกลางคืน เพาะพันธุ์ในน้ำสกปรก น้ำครำ',
SPEEDY: 'ยุงลายออกหากินตอนกลางวัน เพาะพันธุ์ในน้ำขังสะอาด เช่น ยางรถยนต์ จานรองกระถาง',
STEALTH: 'ยุงก้นปล่องพบมากตามป่าเขา แหล่งน้ำธรรมชาติ ออกหากินตอนกลางคืน',
SPLITTER: 'ยุงลายเสือพบในพื้นที่ลุ่มต่ำ หนองน้ำ พืชน้ำ',
BOSS: 'ยุงก้นปล่องราชินี - สมมติในเกม แต่ในชีวิตจริง ยุงก้นปล่องอันตรายที่สุด!',
ARMORED: 'ยุงลายที่พัฒนาความต้านทาน - สมมติในเกม',
};
return info[type] || '';
};

// วิธีป้องกันในชีวิตจริง
export const getPreventionTips = (type: MosquitoType): string[] => {
const tips: Record<MosquitoType, string[]> = {
NORMAL: [
'กำจัดแหล่งน้ำขัง น้ำครำรอบบ้าน',
'นอนในมุ้ง หรือติดมุ้งลวด',
'ใช้ยากันยุงตอนกลางคืน',
],
SPEEDY: [
'ระวังน้ำขังในบ้าน (จานรองกระถาง, ยางรถยนต์)',
'ใช้ยากันยุงตอนกลางวัน',
'ใส่เสื้อแขนยาว กางเกงขายาว',
'ฉีดยุงบริเวณมุมมืด',
],
STEALTH: [
'นอนในมุ้งทุกคืน (สำคัญมาก!)',
'ใช้ยากันยุงที่มี DEET',
'ระวังบริเวณป่า เขา แหล่งน้ำ',
'ปรึกษาแพทย์หากมีไข้หลังกลับจากป่า',
],
SPLITTER: [
'หลีกเลี่ยงบริเวณหนองน้ำ พืชน้ำ',
'ใส่เสื้อผ้ามิดชิด',
'ใช้ยากันยุง',
],
BOSS: [
'ทำทุกข้อข้างต้น!',
'ปรึกษาแพทย์ทันทีหากมีอาการไข้สูง',
],
ARMORED: [
'ระวังน้ำขังทุกชนิด',
'ใช้ยากันยุงที่มีประสิทธิภาพสูง',
],
};
return tips[type] || ['ระวังน้ำขัง', 'นอนในมุ้ง', 'ใช้ยากันยุง'];
};

🎬 ตัวอย่าง: ผู้เล่นแพ้ Wave 7 (Stealth)
┌─────────────────────────────────────────────────────────┐
│ │
│ 💀 GAME OVER! │
│ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 💀 คุณถูก ยุงก้นปล่อง (Anopheles) กัด! │ │
│ │ 🔴 Danger Level: 4/5 │ │
│ │ │ │
│ │ 🩸 นำพาโรค: │ │
│ │ • ไข้มาลาเรีย (Malaria) │ │
│ │ ⚠️ พบมากตามชายป่า ชายแดน │ │
│ │ │ │
│ │ [🤔 ถูกอะไรเล่นงานถึงตาย?] │ │
│ └─────────────────────────────────────────────────┘ │
│ │
│ (กดดูรายละเอียด) │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🐛 ทำไมถึงอันตราย? │ │
│ │ │ │
│ │ ไข้มาลาเรีย │ │
│ │ อาการเด่น: │ │
│ │ • ไข้สูง หนาวสั่น เหงื่อออกมาก │ │
│ │ • ปวดศีรษะ ปวดเมื่อยตัว │ │
│ │ • ภาวะแทรกซ้อนรุนแรง (มาลาเรียขึ้นสมอง) │ │
│ │ ⚠️ พบมากตามชายป่า ชายแดน │ │
│ │ │ │
│ │ 🛡️ ป้องกันในชีวิตจริง: │ │
│ │ ✅ นอนในมุ้งทุกคืน (สำคัญมาก!) │ │
│ │ ✅ ใช้ยากันยุงที่มี DEET │ │
│ │ ✅ ระวังบริเวณป่า เขา แหล่งน้ำ │ │
│ │ ✅ ปรึกษาแพทย์หากมีไข้หลังกลับจากป่า │ │
│ └─────────────────────────────────────────────────┘ │
│ │
│ 💡 เคล็ดลับสำหรับ Wave 7: │
│ ☀️ UV Trap เท่านั้นที่ตรวจจับยุงล่องหนได้! │
│ │
│ [🔄 ลอง Wave 7 ใหม่] [เริ่มเกมใหม่] │
│ │
└─────────────────────────────────────────────────────────┘

🎓 สิ่งที่ผู้เล่นได้เรียนรู้
┌─────────────────────────────────────────────────────────┐
│ │
│ ก่อนเล่น: "ยุงก็แค่แมลง น่ารำคาญ" │
│ │
│ หลังแพ้ Wave 7: │
│ "อ๋อ! ยุงก้นปล่องพามาลาเรีย │
│ ต้องนอนในมุ้ง ระวังตอนไปป่า │
│ ถ้ามีไข้ต้องรีบหาหมอ!" │
│ │
│ → เกมสอนเรื่องสุขภาพ โดยไม่ต้อง "บรรยาย" │
│ → ผู้เล่น "เรียนรู้เอง" ผ่านประสบการณ์ │
│ │
└─────────────────────────────────────────────────────────┘
💝 ปรัชญาของเกมนี้
"เกมนี้ไม่ได้แค่ให้ผู้เล่น 'ชนะ' หรือ 'แพ้'
แต่ให้ผู้เล่น 'เข้าใจ' ว่า
ยุงคือพาหะนำโรคที่คร่าชีวิตคนจริง
และ 'การป้องกัน' ดีกว่า 'การรักษา'"
