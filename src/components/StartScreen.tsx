// ==========================================
// Start Screen - หน้าเลือกภาษาก่อนเล่น
// ==========================================
import React from 'react';
import { Play, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { languages } from '../i18n';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Game Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🦟</div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          {t('gameTitle')}
        </h1>
        <p className="text-slate-400 text-lg">{t('gameSubtitle')}</p>
      </div>
      
      {/* Language Selection */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-300 font-bold mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>🌐 {t('language')}</span>
        </div>
        
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
              <div className="text-left">
                <div className="font-bold text-sm">{lang.name}</div>
                <div className="text-xs text-slate-500">{lang.nameEn}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Start Button */}
      <button
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
      >
        <Play className="w-6 h-6 fill-current" />
        <span>{t('startWave')}</span>
      </button>
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-600">
        <p>🦟 Mosquito Defense - Educational Game</p>
        <p>ปกป้องครอบครัวจากโรคที่มากับยุง</p>
      </div>
    </div>
  );
}