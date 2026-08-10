// ==========================================
// i18n Main - รวมทุกภาษา + Helpers
// ==========================================
import { TranslationKeys, LanguageCode, LanguageInfo } from "./types";
import { th } from "./languages/th";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { fr } from "./languages/fr";
import { pt } from "./languages/pt";
import { hi } from "./languages/hi";
import { sw } from "./languages/sw";

// รวมทุกภาษาในที่เดียว
export const translations: Record<LanguageCode, TranslationKeys> = {
  th,
  en,
  es,
  fr,
  pt,
  hi,
  sw,
};

// ข้อมูลภาษา (สำหรับ Language Selector)
export const languages: LanguageInfo[] = [
  { code: "en", name: "English", nameEn: "English", flag: "🇬🇧" },
  { code: "th", name: "ไทย", nameEn: "Thai", flag: "🇹🇭" },
  { code: "es", name: "Español", nameEn: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "Français", nameEn: "French", flag: "🇫🇷" },
  { code: "pt", name: "Português", nameEn: "Portuguese", flag: "🇧🇷" },
  { code: "hi", name: "हिन्दी", nameEn: "Hindi", flag: "🇮🇳" },
  { code: "sw", name: "Kiswahili", nameEn: "Swahili", flag: "🌍" },
];

// Default language
export const DEFAULT_LANGUAGE: LanguageCode = "en";

// LocalStorage key
const LANGUAGE_STORAGE_KEY = "mosquito_defense_language";

/**
 * ดึงภาษาจาก localStorage
 */
export const getSavedLanguage = (): LanguageCode => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && saved in translations) {
      return saved as LanguageCode;
    }
  } catch (e) {
    // localStorage not available
  }

  // ตรวจสอบภาษาของ browser
  const browserLang = navigator.language.split("-")[0];
  if (browserLang in translations) {
    return browserLang as LanguageCode;
  }

  return DEFAULT_LANGUAGE;
};

/**
 * บันทึกภาษาลง localStorage
 */
export const saveLanguage = (lang: LanguageCode): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (e) {
    // localStorage not available
  }
};

/**
 * Helper: แปลข้อความ
 */
export const translate = (
  lang: LanguageCode,
  key: keyof TranslationKeys,
): string => {
  return (
    translations[lang]?.[key] || translations[DEFAULT_LANGUAGE][key] || key
  );
};

/**
 * เพิ่มภาษาใหม่: แค่เพิ่มไฟล์ใน /languages แล้วเพิ่มบรรทัดนี้
 */
// 1. สร้างไฟล์ src/i18n/languages/xx.ts
// 2. import { xx } from './languages/xx';
// 3. เพิ่มใน translations: { ..., xx }
// 4. เพิ่มใน languages: [{ code: 'xx', name: '...', flag: '🏳️' }]
