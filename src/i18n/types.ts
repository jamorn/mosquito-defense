// ==========================================
// i18n Types - กำหนด keys ทั้งหมด
// ==========================================

export interface TranslationKeys {
  // Game Title
  gameTitle: string;
  gameSubtitle: string;

  // Top Bar
  coins: string;
  wave: string;
  waveOf: string;
  hp: string;
  enemiesLeft: string;

  // Buttons
  startWave: string;
  waveInProgress: string;
  saveGame: string;
  loadGame: string;
  soundOn: string;
  soundOff: string;
  language: string;

  // Shop
  towerShop: string;
  itemGuide: string;
  selectTower: string;
  upgrade: string;
  sell: string;
  close: string;

  // Items
  useItem: string;
  cooldown: string;

  // Game Over
  gameOver: string;
  youDied: string;
  bittenBy: string;
  totalBites: string;
  infections: string;
  survivalTime: string;
  deathReport: string;
  prevention: string;
  retryWave: string;
  startNewGame: string;

  // Victory
  victory: string;
  victoryMessage: string;

  // Mosquito Types
  mosquitoNormal: string;
  mosquitoSpeedy: string;
  mosquitoTank: string;
  mosquitoArmored: string;
  mosquitoStealth: string;
  mosquitoSplitter: string;
  mosquitoBoss: string;

  // Tower Types
  towerElectric: string;
  towerSpray: string;
  towerUV: string;
  towerTesla: string;

  // Diseases
  diseaseDengue: string;
  diseaseMalaria: string;
  diseaseZika: string;
  diseaseChikungunya: string;
  diseaseJE: string;
  diseaseFilariasis: string;

  // Health Status
  healthHealthy: string;
  healthMild: string;
  healthSick: string;
  healthCritical: string;
  healthDead: string;

  // Prevention Tips
  preventionTip1: string;
  preventionTip2: string;
  preventionTip3: string;
  preventionTip4: string;
}

export type LanguageCode = "th" | "en" | "es" | "fr" | "pt" | "hi" | "sw";

export interface LanguageInfo {
  code: LanguageCode;
  name: string; // ชื่อภาษา (ในภาษานั้น)
  nameEn: string; // ชื่อภาษาอังกฤษ
  flag: string; // ธง emoji
  rtl?: boolean; // เขียนขวาไปซ้าย?
}
