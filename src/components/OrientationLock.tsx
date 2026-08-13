// src/components/OrientationLock.tsx
// ==========================================
// OrientationLock — บังคับเล่นแบบแนวนอน (Landscape) บนจอเล็ก
// ==========================================
// 🎯 ตามที่พี่ต้องการ: หน้าจอขนาดเล็ก (มือถือ/tablet) ให้เล่นเป็นแนวนอนเสมอ
//   - ตราบใดที่หน้าจอยัง "ตั้ง" (portrait) → แสดง overlay บอกให้หมุนจอ
//   - เปิดเมื่อจอแนวนอน (landscape) → ซ่อน overlay เล่นได้ตามปกติ
//   - ใช้ JS (useDevice) ตรวจจับ device/orientation แม่นยำกว่าการพึ่ง CSS อย่างเดียว
import React from "react";
import { useDevice } from "../hooks/useDevice";
export function OrientationLock({ children }: { children: React.ReactNode }) {
  const { deviceType, orientation } = useDevice();

  // จอเล็ก (mobile/tablet) + แนวตั้ง → บังคับหมุนเป็นแนวนอน
  const isPortrait =
    (deviceType === "mobile" || deviceType === "tablet") &&
    orientation === "portrait";
  if (isPortrait) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-center p-8">
        <div className="text-7xl mb-6 animate-pulse">📱 ↻</div>
        <h1 className="text-2xl font-black text-cyan-400 mb-3">
          กรุณาหมุนจอเป็นแนวนอน
        </h1>
        <p className="text-slate-400 max-w-xs">
          เกมนี้เหมาะกับการเล่นแบบ Landscape (แนวนอน)
          <br />
          หมุนโทรศัพท์/แท็บเล็ตของคุณเพื่อเริ่มเล่น
        </p>
        <div className="mt-8 text-slate-600 text-sm">🔄 กำลังรอหมุนจอ...</div>
      </div>
    );
  }

  return <>{children}</>;
}
