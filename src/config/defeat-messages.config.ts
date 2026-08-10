// src/game/config/defeat-messages.config
// ==========================================
// Defeat Messages - ข้อความสุ่มตอนแพ้
// ==========================================
import { LanguageCode } from '../i18n/types';

export interface DefeatMessage {
  id: string;
  encouragement: string;
  tips: string[];
  emoji: string;
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

/**
 * สุ่มเลือกข้อความตามภาษา
 */
export const getRandomDefeatMessage = (lang: LanguageCode): DefeatMessage => {
  const messages = DEFEAT_MESSAGES[lang] || DEFEAT_MESSAGES['en'];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};