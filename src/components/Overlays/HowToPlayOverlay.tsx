// src/components/Overlays/HowToPlayOverlay.tsx
// ==========================================
// HowToPlayOverlay — คำแนะนำวิธีเล่นขั้นพื้นฐาน
// ==========================================
// 🎯 ตามที่พี่ต้องการ: ควรเพิ่มคำแนะนำ ว่าจะเล่นยังไง
//    - tab ป้อม (เลือกจากแถบ Build) → แล้ววางยังไง
//    - plus พื้นฐานอื่นๆ (Start wave, ไอเทม, pause, ขาย/อัปเกรด)
import React from "react";
import { X } from "lucide-react";

interface HowToPlayOverlayProps {
  onClose: () => void;
}

export function HowToPlayOverlay({ onClose }: HowToPlayOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
            🦟 วิธีเล่น Mosquito Defense
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          {/* Step 1 - เลือกป้อม */}
          <div className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-4">
            <span className="text-2xl flex-shrink-0">1️⃣</span>
            <div>
              <div className="font-bold text-slate-200 mb-1">เลือกป้อม (Tab / Build)</div>
              <p className="text-sm text-slate-400">
                แตะ/คลิกที่ปุ่มป้อมใน{" "}
                <span className="text-cyan-400 font-semibold">
                  แถบ Build (ด้านขวา / แถวล่าง)
                </span>{" "}
                เพื่อเลือกชนิดป้อมที่อยากสร้าง เช่น เลเซอร์, สเปรย์ หรือระเบิด
              </p>
            </div>
          </div>

          {/* Step 2 - วาง */}
          <div className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-4">
            <span className="text-2xl flex-shrink-0">2️⃣</span>
            <div>
              <div className="font-bold text-slate-200 mb-1">วางป้อมบนแผนที่</div>
              <p className="text-sm text-slate-400">
                เลื่อนเมาส์/นิ้วไปที่ตำแหน่ง แล้ว{" "}
                <span className="text-emerald-400 font-semibold">
                  คลิก/แตะเพื่อวาง
                </span>
                . ต้องวางบนพื้นที่ว่างห่างจาก<span className="text-slate-200">เส้นทางยุง</span>ป้อมจะ
                ยิงยุงที่บันทึกเข้ามาโดยอัตโนมัติ
              </p>
            </div>
          </div>

          {/* Step 3 - เริ่มเวฟ */}
          <div className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-4">
            <span className="text-2xl flex-shrink-0">3️⃣</span>
            <div>
              <div className="font-bold text-slate-200 mb-1">เริ่มคลื่นยุง</div>
              <p className="text-sm text-slate-400">
                กดปุ่ม{" "}
                <span className="text-emerald-400 font-semibold">
                  ▶️ ปล่อยยุง (Start)
                </span>{" "}
                ที่แถบบน เพื่อเริ่มคลื่นศัตรู. ป้องกันบ้านให้รอด 10 คลื่น
              </p>
            </div>
          </div>

          {/* Step 4 - ขาย/อัปเกรด */}
          <div className="flex gap-3 items-start bg-slate-800/50 rounded-xl p-4">
            <span className="text-2xl flex-shrink-0">4️⃣</span>
            <div>
              <div className="font-bold text-slate-200 mb-1">ขาย / อัปเกรด</div>
              <p className="text-sm text-slate-400">
                แตะที่ป้อมที่สร้างแล้ว จะมี{" "}
                <span className="text-amber-400 font-semibold">
                  ⬆️ อัปเกรด
                </span>{" "}
                (แรงขึ้น) หรือ{" "}
                <span className="text-red-400 font-semibold">🗑️ ขาย</span>{" "}
                (ได้เงินคืน)
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-4">
            <div className="font-bold text-cyan-300 mb-2">💡 เคล็ดลับ</div>
            <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
              <li>ใช้ไอเทม (💣⚡❄️) ที่แถวล่างเพื่อช่วยเคลียร์ยุงเมื่อฉุกเฉิน</li>
              <li>เก็บเงินจากยุงที่โดนยิง เพื่อสร้าง/อัปเกรดป้อมเพิ่ม</li>
              <li>ถ้าบ้านไม่รอดครบคลื่น ➡️ กด <span className="text-amber-400">Retry Wave</span> เก็บเงินป้อมเดิมไว้ ลองใหม่</li>
              <li>
                สเปรย์มี <span className="text-purple-400 font-semibold">พิษ</span>{" "}
                ที่ออกฤทธิ์ ทำให้ยุงช้าลง — เหมาะกับกับดัก
              </li>
            </ul>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95"
        >
          เข้าใจแล้ว เล่นเลย! 🎮
        </button>
      </div>
    </div>
  );
}
