Defeat Message System - "แพ้ในเกม แต่ชนะในชีวิตจริง"
เปลี่ยนความพ่ายแพ้เป็น "พลังบวก" และ "บทเรียน" 🌟

📁 ไฟล์ที่ 1: src/config/defeat-messages.config.ts

// ==========================================
// Defeat Messages - ข้อความสุ่มตอนแพ้
// ==========================================
import { LanguageCode } from '../i18n/types';

export interface DefeatMessage {
id: string;
encouragement: string; // คำให้กำลังใจ
tips: string[]; // คำแนะนำในการป้องกัน
emoji: string; // Emoji ประกอบ
}

export const DEFEAT_MESSAGES: Record<LanguageCode, DefeatMessage[]> = {
// 🇹🇭 ภาษาไทย
th: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: 'เราแพ้ในเกมได้ แต่ในชีวิตจริง เราจะไม่ยอมแพ้ยุง! มาปกป้องตัวเองและคนที่เรารักกันเถอะ ด้วยวิธีต่อไปนี้:',
tips: [
'🪣 คว่ำภาชนะที่มีน้ำขัง ไม่ให้ยุงวางไข่',
'🛏️ นอนในมุ้งทุกคืน ป้องกันยุงกัด',
'🧴 ทายากันยุงก่อนออกจากบ้าน',
'👕 สวมเสื้อแขนยาว กางเกงขายาว เมื่ออยู่ในที่มืด',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'เกมจบแล้ว แต่การปกป้องครอบครัวเพิ่งเริ่มต้น! ยุงร้ายกว่าในเกมเยอะ แต่เราชนะมันได้ ถ้าเรารู้วิธี:',
tips: [
'🚿 เปลี่ยนน้ำในแจกันทุก 7 วัน',
'🗑️ ทิ้งขยะที่อาจมีน้ำขัง เช่น ยางรถยนต์ กระป๋อง',
'🪟 ติดมุ้งลวดที่หน้าต่างและประตู',
'👨‍👩‍👧‍👦 บอกพ่อแม่และเพื่อนให้ระวังยุง',
],
},
{
id: 'defeat_3',
emoji: '🛡️',
encouragement: 'ในเกม ยุงชนะเรา แต่ในชีวิตจริง เราคือผู้ปกป้อง! มาทำให้บ้านของเราปลอดภัยจากยุงกัน:',
tips: [
'🔍 สำรวจรอบบ้านว่ามีน้ำขังหรือไม่',
'🌿 ตัดหญ้าและพุ่มไม้ให้โล่ง ไม่ให้ยุงซ่อนตัว',
'💡 เปิดไฟให้สว่าง ยุงไม่ชอบแสง',
'🏥 หากมีไข้สูงหลังถูกยุงกัด รีบพบแพทย์',
],
},
{
id: 'defeat_4',
emoji: '❤️',
encouragement: 'อย่าเสียใจที่แพ้ในเกม เพราะในชีวิตจริง เธอคือฮีโร่ของครอบครัว! มาปกป้องคนที่เรารักจากยุงกัน:',
tips: [
'👶 ดูแลน้องเล็กให้นอนในมุ้ง',
'👴 ช่วยผู้สูงอายุทากันยุง',
'🏠 ทำความสะอาดบ้านไม่ให้มีน้ำขัง',
'📢 บอกเพื่อนบ้านให้ระวังยุง',
],
},
{
id: 'defeat_5',
emoji: '🔥',
encouragement: 'ยุงในเกมอาจชนะวันนี้ แต่พรุ่งนี้เราจะเก่งขึ้น! และในชีวิตจริง เราชนะยุงได้ทุกวัน ด้วยวิธีง่ายๆ:',
tips: [
'⏰ ระวังยุงตอนเช้าและเย็น (ยุงลายออกหากิน)',
'🌙 ระวังยุงตอนกลางคืน (ยุงก้นปล่องออกหากิน)',
'🧹 กวาดบ้านให้สะอาด ไม่ให้ยุงซ่อน',
'💪 บอกตัวเองว่า "ฉันจะปกป้องครอบครัวจากยุง!"',
],
},
],

// 🇬🇧 English
en: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: 'We may lose in the game, but in real life, we will NEVER give up to mosquitoes! Let\'s protect ourselves and our loved ones with these tips:',
tips: [
'🪣 Empty containers with standing water to stop mosquito breeding',
'🛏️ Sleep under a mosquito net every night',
'🧴 Apply mosquito repellent before going outside',
'👕 Wear long sleeves and pants in dark areas',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'The game is over, but protecting our family has just begun! Real mosquitoes are scarier than in the game, but we can beat them if we know how:',
tips: [
'🚿 Change water in vases every 7 days',
'🗑️ Throw away trash that can hold water, like tires and cans',
'🪟 Install screens on windows and doors',
'👨‍👩‍👧‍👦 Tell your parents and friends to be careful of mosquitoes',
],
},
{
id: 'defeat_3',
emoji: '🛡️',
encouragement: 'In the game, mosquitoes won. But in real life, WE are the protectors! Let\'s make our home safe from mosquitoes:',
tips: [
'🔍 Check around your house for standing water',
'🌿 Cut grass and bushes so mosquitoes can\'t hide',
'💡 Turn on lights - mosquitoes don\'t like light',
'🏥 If you have high fever after a bite, see a doctor immediately',
],
},
{
id: 'defeat_4',
emoji: '❤️',
encouragement: 'Don\'t be sad about losing the game, because in real life, YOU are your family\'s hero! Let\'s protect our loved ones from mosquitoes:',
tips: [
'👶 Make sure little siblings sleep under nets',
'👴 Help elderly family members apply repellent',
'🏠 Clean the house so there\'s no standing water',
'📢 Tell your neighbors to watch out for mosquitoes',
],
},
{
id: 'defeat_5',
emoji: '🔥',
encouragement: 'Mosquitoes may have won today, but tomorrow we\'ll be stronger! And in real life, we can beat mosquitoes every day with simple tips:',
tips: [
'⏰ Be careful in the morning and evening (Tiger mosquitoes)',
'🌙 Be careful at night (Malaria mosquitoes)',
'🧹 Keep your house clean so mosquitoes can\'t hide',
'💪 Tell yourself: "I will protect my family from mosquitoes!"',
],
},
],

// 🇪🇸 Español
es: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: '¡Podemos perder en el juego, pero en la vida real NUNCA nos rendiremos ante los mosquitos! Protejamos a nuestra familia con estos consejos:',
tips: [
'🪣 Vacía los recipientes con agua estancada',
'🛏️ Duerme bajo un mosquitero cada noche',
'🧴 Usa repelente antes de salir',
'👕 Usa manga larga y pantalones largos',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'El juego terminó, ¡pero proteger a nuestra familia acaba de empezar! Los mosquitos reales son más peligrosos, pero podemos vencerlos:',
tips: [
'🚿 Cambia el agua de los jarrones cada 7 días',
'🗑️ Tira la basura que pueda acumular agua',
'🪟 Instala mosquiteros en ventanas y puertas',
'👨‍👩‍👧‍👦 Dile a tus padres y amigos que tengan cuidado',
],
},
],

// 🇫🇷 Français
fr: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: 'On peut perdre dans le jeu, mais dans la vraie vie, on ne se rendra JAMAIS aux moustiques! Protégeons notre famille avec ces conseils:',
tips: [
'🪣 Videz les récipients d\'eau stagnante',
'🛏️ Dormez sous une moustiquaire chaque nuit',
'🧴 Utilisez du répulsif avant de sortir',
'👕 Portez des manches longues et des pantalons longs',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'Le jeu est fini, mais protéger notre famille commence maintenant! Les vrais moustiques sont dangereux, mais on peut les vaincre:',
tips: [
'🚿 Changez l\'eau des vases tous les 7 jours',
'🗑️ Jetez les déchets qui peuvent contenir de l\'eau',
'🪟 Installez des moustiquaires aux fenêtres',
'👨‍👩‍👧‍👦 Dites à vos parents et amis de faire attention',
],
},
],

// 🇵🇹 Português (Brasil)
pt: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: 'Podemos perder no jogo, mas na vida real NUNCA vamos desistir para os mosquitos! Vamos proteger nossa família com estas dicas:',
tips: [
'🪣 Esvazie recipientes com água parada',
'🛏️ Durma sob um mosquiteiro todas as noites',
'🧴 Use repelente antes de sair',
'👕 Use mangas compridas e calças compridas',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'O jogo acabou, mas proteger nossa família acabou de começar! Mosquitos reais são perigosos, mas podemos vencê-los:',
tips: [
'🚿 Troque a água dos vasos a cada 7 dias',
'🗑️ Jogue fora lixo que possa acumular água',
'🪟 Instale telas nas janelas e portas',
'👨‍👩‍👧‍👦 Diga aos seus pais e amigos para terem cuidado',
],
},
],

// 🇮🇳 हिन्दी (Hindi)
hi: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: 'हम गेम में हार सकते हैं, लेकिन असली जिंदगी में हम मच्छरों के सामने कभी हार नहीं मानेंगे! इन सुझावों से अपने परिवार की रक्षा करें:',
tips: [
'🪣 खड़े पानी वाले बर्तनों को खाली करें',
'🛏️ हर रात मच्छरदानी के नीचे सोएं',
'🧴 बाहर जाने से पहले मच्छर भगाने वाली क्रीम लगाएं',
'👕 पूरी बाजू और पैंट पहनें',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'गेम खत्म हो गया, लेकिन परिवार की सुरक्षा अभी शुरू हुई है! असली मच्छर खतरनाक हैं, लेकिन हम उन्हें हरा सकते हैं:',
tips: [
'🚿 फूलदान का पानी हर 7 दिन में बदलें',
'🗑️ कचरा फेंकें जिसमें पानी जमा हो सकता है',
'🪟 खिड़कियों और दरवाजों पर जाली लगाएं',
'👨‍👩‍👧‍👦 माता-पिता और दोस्तों को सावधान रहने को कहें',
],
},
],

// 🌍 Kiswahili
sw: [
{
id: 'defeat_1',
emoji: '💪',
encouragement: 'Tunaweza kushindwa katika mchezo, lakini katika maisha halisi, HATUTAKAA kamwe kwa mbawakawa! Tulinde familia yetu na vidokezo hivi:',
tips: [
'🪣 Mwaga maji yaliyotuama katika vyombo',
'🛏️ Lala chini ya chandarua kila usiku',
'🧴 Tumia dawa ya mbawakawa kabla ya kutoka nje',
'👕 Vaa mavazi ya mikono mirefu na suruali ndefu',
],
},
{
id: 'defeat_2',
emoji: '🌟',
encouragement: 'Mchezo umekwisha, lakini kulinda familia yetu kumeanza tu! Mbawakawa wa kweli ni hatari, lakini tunaweza kuwashinda:',
tips: [
'🚿 Badilisha maji katika maua kila siku 7',
'🗑️ Tupa takataka zinazoweza kushikilia maji',
'🪟 Weka wavu kwenye madirisha na milango',
'👨‍👩‍👧‍👦 Waambie wazazi na marafiku wawe makini',
],
},
],
};

/\*\*

- สุ่มเลือกข้อความตามภาษา
  _/
  export const getRandomDefeatMessage = (lang: LanguageCode): DefeatMessage => {
  const messages = DEFEAT_MESSAGES[lang] || DEFEAT_MESSAGES['en'];
  const randomIndex = Math.floor(Math.random() _ messages.length);
  return messages[randomIndex];
  };

  📁 ไฟล์ที่ 2: src/components/Overlays/DefeatMessageOverlay.tsx
  // ==========================================
  // Defeat Message - แสดงข้อความสุ่มตอนแพ้
  // ==========================================
  import React from 'react';
  import { DefeatMessage } from '../../config/defeat-messages.config';

interface DefeatMessageOverlayProps {
message: DefeatMessage;
}

export function DefeatMessageOverlay({ message }: DefeatMessageOverlayProps) {
return (

<div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-amber-500/30 rounded-2xl p-6 max-w-md mx-auto shadow-2xl">
{/_ Emoji + Encouragement _/}
<div className="text-center mb-4">
<div className="text-5xl mb-3">{message.emoji}</div>
<p className="text-slate-200 font-bold text-lg leading-relaxed">
{message.encouragement}
</p>
</div>

      {/* Tips */}
      <div className="bg-slate-950/50 rounded-xl p-4 space-y-3">
        <div className="text-amber-400 font-bold text-sm text-center mb-3">
          🛡️ วิธีปกป้องครอบครัวจากยุง
        </div>
        {message.tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 text-slate-300 text-sm"
          >
            <span className="text-lg">{tip.split(' ')[0]}</span>
            <span className="flex-1">{tip.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      <div className="text-center mt-4 text-xs text-slate-500 italic">
        "แพ้ในเกมได้ แต่ชนะในชีวิตจริง" 💪
      </div>
    </div>

);
}

📁 ไฟล์ที่ 3: ใช้งานใน GameOverOverlay.tsx
// src/components/Overlays/GameOverOverlay.tsx (ปรับปรุง)
import React, { useState, useEffect } from 'react';
import { RotateCcw, Play, Skull, Bug, FileText } from 'lucide-react';
import { DeathReport } from '../../types/health.types';
import { DefeatMessage, getRandomDefeatMessage } from '../../config/defeat-messages.config';
import { DefeatMessageOverlay } from './DefeatMessageOverlay';
import { useLanguage } from '../../i18n/LanguageContext';
import { MOSQUITO_CONFIGS } from '../../config/mosquitoes.config';

interface GameOverOverlayProps {
report: DeathReport;
failedWave: number | null;
onRetryWave: () => void;
onResetGame: () => void;
}

export function GameOverOverlay({
report,
failedWave,
onRetryWave,
onResetGame,
}: GameOverOverlayProps) {
const { language } = useLanguage();
const [showDiseaseInfo, setShowDiseaseInfo] = useState(false);
const [defeatMessage, setDefeatMessage] = useState<DefeatMessage | null>(null);

// สุ่มข้อความตอนแพ้ (แค่ครั้งเดียวตอนเปิด)
useEffect(() => {
setDefeatMessage(getRandomDefeatMessage(language));
}, [language]);

const dangerColors = ['🟢', '🟡', '🟠', '🔴', '🟣'];
const dangerColor = report
? dangerColors[report.finalBite.mosquitoType ?
MOSQUITO_CONFIGS[report.finalBite.mosquitoType].dangerLevel - 1 : 3]
: '🔴';

return (

<div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto">
<div className="max-w-lg w-full space-y-4">

        {/* Header */}
        <div className="text-center">
          <Skull className="w-14 h-14 text-red-500 mx-auto mb-2 animate-pulse" />
          <h2 className="text-3xl font-black text-red-500 mb-1">เสียชีวิต!</h2>
          <p className="text-slate-400 text-sm">{report.causeOfDeath}</p>
        </div>

        {/* 💪 Defeat Message (สุ่ม) */}
        {defeatMessage && (
          <DefeatMessageOverlay message={defeatMessage} />
        )}

        {/* 📊 Death Report */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 text-sm">📊 รายงานการถูกยุงกัด</span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              <div className="text-2xl font-black text-red-400">{report.totalBites}</div>
              <div className="text-[10px] text-slate-400">ถูกกัดทั้งหมด</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              <div className="text-2xl font-black text-amber-400">{report.infections.length}</div>
              <div className="text-[10px] text-slate-400">โรคที่ติดเชื้อ</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              <div className="text-2xl font-black text-cyan-400">
                {Math.floor(report.survivalTime / 60000)}:{String(Math.floor((report.survivalTime % 60000) / 1000)).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-400">เวลาที่รอด</div>
            </div>
          </div>

          {/* Final Bite */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-3">
            <div className="text-red-400 font-bold text-sm mb-1">
              💀 กัดสุดท้ายโดย: {report.finalBite.mosquitoName}
            </div>
            <div className="text-slate-300 text-xs">
              🩸 นำพาโรค: {report.finalBite.diseases.join(', ')}
            </div>
          </div>

          {/* ดูรายละเอียด */}
          <button
            onClick={() => setShowDiseaseInfo(!showDiseaseInfo)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition"
          >
            <Bug className="w-4 h-4 text-cyan-400" />
            {showDiseaseInfo ? 'ซ่อนรายละเอียด' : 'ถูกอะไรเล่นงานถึงตาย? 🤔'}
          </button>

          {/* Disease Details */}
          {showDiseaseInfo && (
            <div className="bg-slate-900/80 border border-slate-600 rounded-xl p-3 mt-3 max-h-40 overflow-y-auto text-xs">
              {report.infections.length > 0 ? (
                report.infections.map(inf => (
                  <div key={inf.diseaseId} className="mb-2 pb-2 border-b border-slate-700 last:border-0">
                    <div className="font-bold text-white">{inf.diseaseName}</div>
                    <div className="text-slate-400">
                      ติดเชื้อจาก: {MOSQUITO_CONFIGS[inf.infectedBy]?.name || 'ไม่ทราบ'}
                    </div>
                    <div className="text-slate-400">
                      ความรุนแรง: <span className="text-red-400">{inf.severity}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-center">
                  ไม่มีการติดเชื้อ (เสียชีวิตจากการเสียเลือด)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRetryWave}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            🔄 ลอง Wave {failedWave} ใหม่
          </button>

          <button
            onClick={onResetGame}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg transition text-sm"
          >
            <Play className="w-4 h-4" />
            เริ่มเกมใหม่ (Wave 1)
          </button>
        </div>
      </div>
    </div>

);
}

🎬 ตัวอย่างการแสดงผล
┌─────────────────────────────────────────────────────────┐
│ │
│ 💀 เสียชีวิต! │
│ เสียชีวิตจาก ไข้เลือดออก │
│ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 💪 │ │
│ │ เราแพ้ในเกมได้ │ │
│ │ แต่ในชีวิตจริง │ │
│ │ เราจะไม่ยอมแพ้ยุง! │ │
│ │ มาปกป้องตัวเองและคนที่เรารักกันเถอะ │ │
│ │ ด้วยวิธีต่อไปนี้: │ │
│ │ │ │
│ │ 🪣 คว่ำภาชนะที่มีน้ำขัง ไม่ให้ยุงวางไข่ │ │
│ │ 🛏️ นอนในมุ้งทุกคืน ป้องกันยุงกัด │ │
│ │ 🧴 ทายากันยุงก่อนออกจากบ้าน │ │
│ │ 👕 สวมเสื้อแขนยาว กางเกงขายาว │ │
│ │ │ │
│ │ "แพ้ในเกมได้ แต่ชนะในชีวิตจริง" 💪 │ │
│ └─────────────────────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📊 รายงานการถูกยุงกัด │ │
│ │ ┌─────────┬─────────┬─────────┐ │ │
│ │ │ 12 │ 2 │ 4:32 │ │ │
│ │ │ถูกกัด │ติดเชื้อ │เวลารอด │ │ │
│ │ └─────────┴─────────┴─────────┘ │ │
│ │ │ │
│ │ 💀 กัดสุดท้ายโดย: ยุงลาย (Aedes) │ │
│ │ 🩸 นำพาโรค: ไข้เลือดออก │ │
│ │ │ │
│ │ [🤔 ถูกอะไรเล่นงานถึงตาย?] │ │
│ └─────────────────────────────────────────────────┘ │
│ │
│ [🔄 ลอง Wave 7 ใหม่] [เริ่มเกมใหม่] │
│ │
└─────────────────────────────────────────────────────────┘
