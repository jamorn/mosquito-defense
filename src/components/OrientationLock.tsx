// src/components/OrientationLock.tsx
// ==========================================
// OrientationLock — บังคับเล่นแบบแนวนอน (Landscape) บนจอเล็ก
// ==========================================
// 🎯 ตามที่พี่ต้องการ: หน้าจอขนาดเล็ก (มือถือ/tablet) ให้เล่นเป็นแนวนอนเสมอ
//   - ตราบใดที่หน้าจอยัง "ตั้ง" (portrait) → แสดง overlay บอกให้หมุนจอ
//   - เปิดเมื่อจอแนวนอน (landscape) → ซ่อน overlay เล่นได้ตามปกติ
//   - ใช้ CSS media query ตอบสนองทันทีเมื่อหมุนจอ
import React, { useState, useEffect } from "react";

export function OrientationLock({ children }: { children: React.ReactNode }) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      // ถ้าหน้าจอเล็ก (มือถือ/tablet) และจอตั้ง (portrait) → ล็อกบังคับแนวนอน
      const smallScreen =
        window.matchMedia("(max-width: 1024px)").matches ||
        navigator.maxTouchPoints > 0;
      setIsPortrait(smallScreen && window.innerHeight > window.innerWidth);
    };

    check();
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", check);
    window.addEventListener("resize", check);

    return () => {
      mq.removeEventListener("change", check);
      window.removeEventListener("resize", check);
    };
  }, []);

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
