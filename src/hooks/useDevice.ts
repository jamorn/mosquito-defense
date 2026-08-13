// src/hooks/useDevice.ts
// ==========================================
// useDevice — ตรวจจับ Device/Orientation ด้วย JavaScript
// ==========================================
// 🎯 ตามที่พี่ต้องการ: รู้หน้า device ก่อน (ผ่าน JS ไม่พึ่ง CSS breakpoint ล้วน)
//   - deviceType  : 'mobile' | 'tablet' | 'desktop'
//   - orientation : 'portrait' | 'landscape'
//   - isTouch     : รองรับ touch หรือไม่
//   - width/height: viewport ปัจจุบัน
// ใช้ตรงนี้ ตัวเกมจะ adjust layout / fit จอ ได้ precise ตาม device จริง
import { useState, useEffect, useCallback } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";
export type OrientationType = "portrait" | "landscape";

export interface DeviceInfo {
  deviceType: DeviceType;
  orientation: OrientationType;
  isTouch: boolean;
  width: number;
  height: number;
  /** เหมาะมี sidebar ขวาหรือไม่ (จอกว้างพอ, หรือ landscape บนมือถือ) */
  hasSidebar: boolean;
  /** ค่าความสูงเหลือจริงสำหรับ canvas (px) — หัก bar ด้านบน */
  playableHeight: number;
  /** ค่าความกว้างเหลือจริงสำหรับ canvas (px) — หัก sidebar */
  playableWidth: number;
}

function detectDevice(): DeviceType {
  const ua = navigator.userAgent || "";
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const width = window.innerWidth;

  // แอป iPad (ซึ่ง UA ขึ้นเป็น Macintosh) — มี touch + จอกว้าง >980
  const isIpad =
    isTouch &&
    /Macintosh/.test(ua) &&
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1;

  if (isIpad) return "tablet";
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return "mobile";
  if (/Tablet|iPad|PlayBook/i.test(ua)) return "tablet";
  if (/Android/i.test(ua) && width >= 768) return "tablet";
  if (/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectOrientation(): OrientationType {
  // screen.orientation ดีที่สุด, fallback เป็น width/height เปรียบเทียบ
  const so = (screen as any).orientation;
  if (so && so.type) {
    return so.type.includes("portrait") ? "portrait" : "landscape";
  }
  return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
}

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(() => buildInfo());

  const compute = useCallback(() => {
    setInfo(buildInfo());
  }, []);

  useEffect(() => {
    compute();
    // NOTE: matchMedia ตรวจจับ orientation + resize ได้
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", compute);
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);

    return () => {
      mq.removeEventListener("change", compute);
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [compute]);

  return info;
}

function buildInfo(): DeviceInfo {
  const deviceType = detectDevice();
  const orientation = detectOrientation();
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 📐 ตัดสินใจ "มี sidebar ขวาไหม":
  //   - desktop (PC): มีเสมอ
  //   - tablet/mobile landscape: มี sidebar (แบบแคบ) เพราะมีที่ว่างขวา
  //   - portrait แคบ: ไม่มี sidebar ใช้ bottom bar แทน
  const hasSidebar =
    deviceType === "desktop" ||
    (orientation === "landscape" && width >= 480) ||
    (isTouch && orientation === "landscape" && width >= 500);

  // 📐 ค่าพื้นที่เล่นได้จริง (กัน overflow บนจอเล็ก)
  // หัก bar บนสุด + padding
  const topBarHeight = 130;
  // sidebar กว้าง (ประมาณ 56-88px)
  const sidebarWidth = deviceType === "desktop" ? 88 : 64;

  return {
    deviceType,
    orientation,
    isTouch,
    width,
    height,
    hasSidebar,
    playableHeight: Math.max(200, height - topBarHeight),
    playableWidth: Math.max(300, width - (hasSidebar ? sidebarWidth : 0)),
  };
}
