// ==========================================
// ข้อมูลโรคจากยุง
// อ้างอิง: กรมควบคุมโรค กระทรวงสาธารณสุข + WHO
// ==========================================
import { MosquitoType } from '../types/game.types';

export interface DiseaseInfo {
  id: string;
  nameTh: string;
  nameEn: string;
  vector: MosquitoType;
  dangerLevel: number;
  symptoms: string[];
  specialWarning?: string;
  isDomestic: boolean;
}

export const DISEASES: DiseaseInfo[] = [
  // ========== ยุงลาย (Aedes) ==========
  {
    id: 'dengue',
    nameTh: 'ไข้เลือดออก',
    nameEn: 'Dengue Fever',
    vector: 'SPEEDY',
    dangerLevel: 4,
    symptoms: [
      'ไข้สูง 39-40°C นาน 2-7 วัน',
      'ปวดศีรษะ ปวดกระบอกตา',
      'เลือดออกตามผิวหนัง',
      'ช็อก (กรณีรุนแรง)',
    ],
    isDomestic: true,
  },
  {
    id: 'chikungunya',
    nameTh: 'ไข้ปวดข้อยุงลาย (ชิกุนกุนยา)',
    nameEn: 'Chikungunya',
    vector: 'SPEEDY',
    dangerLevel: 3,
    symptoms: [
      'ไข้สูงฉับพลัน',
      'ปวดข้อต่ออย่างรุนแรง (ข้อมือ ข้อเท้า)',
      'ปวดข้อเรื้อรังเป็นเดือน',
      'ตัวงอจากความปวด',
    ],
    specialWarning: 'แม้ไข้ลด แต่ปวดข้ออาจเรื้อรังเป็นเดือน!',
    isDomestic: true,
  },
  {
    id: 'zika',
    nameTh: 'ไข้ซิกา',
    nameEn: 'Zika Virus',
    vector: 'SPEEDY',
    dangerLevel: 4,
    symptoms: [
      'ไข้ต่ำ มีผื่น',
      'ตาแดง ปวดข้อ',
      'อาการไม่รุนแรงในคนทั่วไป',
    ],
    specialWarning: '⚠️ อันตรายมากในหญิงตั้งครรภ์! ทารกอาจศีรษะเล็ก (Microcephaly)',
    isDomestic: true,
  },

  // ========== ยุงรำคาญ (Culex) ==========
  {
    id: 'japanese_encephalitis',
    nameTh: 'ไข้สมองอักเสบ เจอี',
    nameEn: 'Japanese Encephalitis (JE)',
    vector: 'NORMAL',
    dangerLevel: 5,
    symptoms: [
      'ไข้สูง ปวดศีรษะรุนแรง',
      'คอแข็ง ชัก สับสน',
      'พิการทางสมอง หรือเสียชีวิต',
    ],
    specialWarning: '💀 รุนแรงมาก! อาจทำให้พิการหรือเสียชีวิต',
    isDomestic: true,
  },

  // ========== ยุงก้นปล่อง (Anopheles) ==========
  {
    id: 'malaria',
    nameTh: 'ไข้มาลาเรีย (ไข้ป่า)',
    nameEn: 'Malaria',
    vector: 'STEALTH',
    dangerLevel: 4,
    symptoms: [
      'ไข้สูง หนาวสั่น เหงื่อออกมาก',
      'ปวดศีรษะ ปวดเมื่อยตัว',
      'ภาวะแทรกซ้อนรุนแรง (มาลาเรียขึ้นสมอง)',
    ],
    specialWarning: '⚠️ พบมากตามชายป่า ชายแดน',
    isDomestic: true,
  },

  // ========== ยุงลายเสือ (Mansonia) ==========
  {
    id: 'filariasis',
    nameTh: 'โรคเท้าช้าง',
    nameEn: 'Lymphatic Filariasis',
    vector: 'SPLITTER',
    dangerLevel: 3,
    symptoms: [
      'ต่อมน้ำเหลืองอักเสบ',
      'แขน ขา บวมโตผิดปกติ',
      'ผิวหนาคล้ายผิวช้าง',
    ],
    specialWarning: 'เกิดจากพยาธิตัวกลมอุดตันทางเดินน้ำเหลือง',
    isDomestic: true,
  },

  // ========== โรคในต่างประเทศ ==========
  {
    id: 'yellow_fever',
    nameTh: 'ไข้เหลือง',
    nameEn: 'Yellow Fever',
    vector: 'SPEEDY',
    dangerLevel: 5,
    symptoms: [
      'ไข้สูง หนาวสั่น',
      'ตับอักเสบ ตัวเหลืองตาเหลือง',
    ],
    specialWarning: 'พบในแอฟริกาและอเมริกาใต้',
    isDomestic: false,
  },
  {
    id: 'west_nile',
    nameTh: 'ไวรัสเวสต์ไนล์',
    nameEn: 'West Nile Virus',
    vector: 'NORMAL',
    dangerLevel: 4,
    symptoms: [
      'ไข้ ปวดหัว',
      'สมองหรือเยื่อหุ้มสมองอักเสบ (กรณีรุนแรง)',
    ],
    specialWarning: 'พบในอเมริกา ยุโรป แอฟริกา',
    isDomestic: false,
  },
];

// Helper: หาโรคตามชนิดยุง
export const getDiseasesByMosquito = (type: MosquitoType): DiseaseInfo[] => {
  return DISEASES.filter(d => d.vector === type);
};

// Helper: หาโรคตาม ID
export const getDiseaseById = (id: string): DiseaseInfo | undefined => {
  return DISEASES.find(d => d.id === id);
};

// ข้อมูลในชีวิตจริงตามชนิดยุง
export const getRealWorldInfo = (type: MosquitoType): string => {
  const info: Record<MosquitoType, string> = {
    NORMAL: 'ยุงรำคาญออกหากินตอนกลางคืน เพาะพันธุ์ในน้ำสกปรก น้ำครำ',
    SPEEDY: 'ยุงลายออกหากินตอนกลางวัน เพาะพันธุ์ในน้ำขังสะอาด เช่น ยางรถยนต์ จานรองกระถาง',
    TANK: 'ยุงตัวใหญ่ แข็งแรง ทนต่อยากันยุง - สมมติในเกม',
    STEALTH: 'ยุงก้นปล่องพบมากตามป่าเขา แหล่งน้ำธรรมชาติ ออกหากินตอนกลางคืน',
    SPLITTER: 'ยุงลายเสือพบในพื้นที่ลุ่มต่ำ หนองน้ำ พืชน้ำ',
    BOSS: 'ยุงก้นปล่องราชินี - สมมติในเกม แต่ในชีวิตจริง ยุงก้นปล่องอันตรายที่สุด!',
    ARMORED: 'ยุงลายที่พัฒนาความต้านทาน - สมมติในเกม',
  };
  return info[type] || '';
};

// วิธีป้องกันในชีวิตจริง
export const getPreventionTips = (type: MosquitoType): string[] => {
  const tips: Record<MosquitoType, string[]> = {
    NORMAL: [
      'กำจัดแหล่งน้ำขัง น้ำครำรอบบ้าน',
      'นอนในมุ้ง หรือติดมุ้งลวด',
      'ใช้ยากันยุงตอนกลางคืน',
    ],
    SPEEDY: [
      'ระวังน้ำขังในบ้าน (จานรองกระถาง, ยางรถยนต์)',
      'ใช้ยากันยุงตอนกลางวัน',
      'ใส่เสื้อแขนยาว กางเกงขายาว',
      'ฉีดยุงบริเวณมุมมืด',
    ],
    TANK: [
      'กำจัดแหล่งน้ำขังขนาดใหญ่ เช่น อ่างน้ำ บ่อ',
      'ใช้ยากันยุงที่มีประสิทธิภาพสูง',
      'ปิดฝาภาชนะเก็บน้ำให้มิดชิด',
    ],
    STEALTH: [
      'นอนในมุ้งทุกคืน (สำคัญมาก!)',
      'ใช้ยากันยุงที่มี DEET',
      'ระวังบริเวณป่า เขา แหล่งน้ำ',
      'ปรึกษาแพทย์หากมีไข้หลังกลับจากป่า',
    ],
    SPLITTER: [
      'หลีกเลี่ยงบริเวณหนองน้ำ พืชน้ำ',
      'ใส่เสื้อผ้ามิดชิด',
      'ใช้ยากันยุง',
    ],
    BOSS: [
      'ทำทุกข้อข้างต้น!',
      'ปรึกษาแพทย์ทันทีหากมีอาการไข้สูง',
    ],
    ARMORED: [
      'ระวังน้ำขังทุกชนิด',
      'ใช้ยากันยุงที่มีประสิทธิภาพสูง',
    ],
  };
  return tips[type] || ['ระวังน้ำขัง', 'นอนในมุ้ง', 'ใช้ยากันยุง'];
};