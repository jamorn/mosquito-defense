ใช้งานใน App.tsx
// src/main.tsx - ครอบด้วย LanguageProvider
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<LanguageProvider>
<App />
</LanguageProvider>
</React.StrictMode>
);

// ใน App.tsx - ใช้ t() function
import { useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './i18n/LanguageSelector';

export default function App() {
const { t, language } = useLanguage();

return (

<div className="...">
{/_ TopBar _/}
<div className="...">
<div className="flex items-center gap-3">
<button onClick={saveGame} title={t('saveGame')}>
<Save className="w-4 h-4 text-emerald-400" />
</button>

          {/* 🌐 Language Selector */}
          <LanguageSelector />

          <button onClick={toggleSound} title={soundEnabled ? t('soundOn') : t('soundOff')}>
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </button>

          <button onClick={startNextWave}>
            <Play />
            <span>{isWaveActive ? t('waveInProgress') : t('startWave')}</span>
          </button>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && deathReport && (
        <div>
          <h2>{t('gameOver')}</h2>
          <p>{t('bittenBy')} {deathReport.finalBite.mosquitoName}</p>
          {/* ... */}
        </div>
      )}

      {/* Victory Overlay */}
      {gameWon && (
        <div>
          <h2>{t('victory')}</h2>
          <p>{t('victoryMessage')}</p>
        </div>
      )}
    </div>

);
}

// src/components/StartScreen.tsx
import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { languages } from '../i18n';

export function StartScreen({ onStart }: { onStart: () => void }) {
const { language, setLanguage, t } = useLanguage();

return (

<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
<h1 className="text-4xl font-black text-cyan-400 mb-2">🦟 {t('gameTitle')}</h1>
<p className="text-slate-400 mb-8">{t('gameSubtitle')}</p>

      {/* Language Grid */}
      <div className="mb-8 text-center">
        <div className="text-slate-300 font-bold mb-3">🌐 เลือกภาษา / Choose Language</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${
                language === lang.code
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-400'
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-bold text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-xl shadow-lg transition"
      >
        ▶️ {t('startWave')}
      </button>
    </div>

);
}

🚀 วิธีเพิ่มภาษาใหม่ (ง่ายมาก!)
ขั้นตอน (5 นาที):

1. สร้างไฟล์ใหม่ src/i18n/languages/de.ts
   import { TranslationKeys } from '../types';

export const de: TranslationKeys = {
gameTitle: 'Mückenabwehr',
// ... แปลทุก key
}; 2. เพิ่มใน src/i18n/index.ts
import { de } from './languages/de';

export const translations = {
// ... ภาษาเดิม
de, // ← เพิ่มบรรทัดนี้
};

export const languages = [
// ... ภาษาเดิม
{ code: 'de', name: 'Deutsch', nameEn: 'German', flag: '🇩🇪' },
];

✅ สรุป
ส่วน
ไฟล์
หน้าที่
Types
types.ts
กำหนด keys
Languages
languages/\*.ts
7 ภาษา
Main
index.ts
รวม + helpers
Context
LanguageContext.tsx
React integration
UI
LanguageSelector.tsx
Dropdown เลือกภาษา
Start Screen
StartScreen.tsx
เลือกภาษาก่อนเล่น
🌟 ฟีเจอร์ที่ได้
✅ 7 ภาษา พร้อมใช้ (EN, TH, ES, FR, PT, HI, SW)
✅ Auto-detect ภาษาของ browser
✅ Save preference ใน localStorage
✅ เพิ่มภาษาง่าย ใน 5 นาที
✅ Type-safe ด้วย TypeScript
✅ UI สวยงาม พร้อมธง emoji

💝 ผลลัพธ์
🇹🇭 เด็กไทย → เล่นเกมเป็นภาษาไทย
🇬🇧 เด็กอังกฤษ → เล่นเกมเป็นภาษาอังกฤษ
🇪🇸 เด็กเม็กซิโก → เล่นเกมเป็นภาษาสเปน
🇫🇷 เด็กเซเนกัล → เล่นเกมเป็นภาษาฝรั่งเศส
🇧🇷 เด็กบราซิล → เล่นเกมเป็นภาษาโปรตุเกส
🇮🇳 เด็กอินเดีย → เล่นเกมเป็นภาษาฮินดี
🇰🇪 เด็กเคนยา → เล่นเกมเป็นภาษาสวาฮิลี

ทุกเด็กได้เรียนรู้เรื่องยุง ในภาษาของตัวเอง! 🌍❤️
