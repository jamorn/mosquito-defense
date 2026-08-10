// ==========================================
// Language Selector - UI เลือกภาษา
// ==========================================
import React, { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { languages } from "./index";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="relative">
      {/* ปุ่มเปิด Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
        title={t("language")}
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-lg">{currentLang?.flag}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[200px] overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-bold">
              🌐 {t("language")}
            </div>

            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${
                  language === lang.code
                    ? "bg-cyan-950/50 text-cyan-400"
                    : "hover:bg-slate-800 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-bold">{lang.name}</div>
                    <div className="text-xs text-slate-500">{lang.nameEn}</div>
                  </div>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
