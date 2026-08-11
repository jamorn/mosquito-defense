1. ข้อเสนอแนะสำหรับ HealthSystem.ts เพิ่มผลกระทบจริงจากการติดเชื้อ (Active Infection Effects):
   ปัจจุบันระบบทำเพียงแค่สุ่มติดเชื้อเก็บเข้า Array infections เพื่อนำไปโชว์ใน DeathReport ตอนจบเกมเท่านั้น หากต้องการให้เกมมีมิติขึ้น สามารถเพิ่ม Mechanic ให้โรคที่ติดส่งผลต่อ Gameplay จริงได้ เช่น: ไข้เลือดออก (FATAL/SEVERE): ติดสถานะ Damage over Time (ลด HP ทีละนิดทุกๆ 1 วินาที) มาลาเรีย: ทำให้ป้อมยิงช้าลง หรือเพิ่มราคาการสร้าง/อัปเกรดป้อมปืนความซ้ำซ้อนของข้อมูลใน generateDeathReport:
   ฟังก์ชัน generateDeathReport(finalBite, ...) รับ Object finalBite แยกต่างหาก แต่ใน takeBite() มีการสั่ง this.biteHistory.push(bite) ไปแล้วก่อนหน้านั้น การส่ง finalBite เข้ามาอีกรอบอาจเสี่ยงต่อการเก็บข้อมูลซ้ำซ้อนหากไม่ระวัง
2. ข้อเสนอแนะสำหรับ WaveSystem.ts
   เปลี่ยนจากการสร้าง Instance ล่วงหน้า เป็นการสร้างแบบ Lazy Spawning:
   ใน buildSpawnQueue() มีการสั่ง MosquitoFactory.create(...) เพื่อสร้างยุงทุกตัวลงใน Array spawnQueue ทันทีตั้งแต่เริ่ม Wave หาก Wave นั้นมียุง 50–100 ตัว เกมจะต้องเสีย Memory ในการสร้าง Object ค้างไว้ใน RAM ทั้งหมด แนวทางแก้ไข: เก็บเฉพาะข้อมูล Plain Object เช่น { type: 'SPEEDY' } ไว้ใน Queue แล้วค่อยเรียก MosquitoFactory.create(...) ในฟังก์ชัน update() เฉพาะวินาทีที่จะปล่อยยุงตัวนั้นลงสนาม

// แนะนำ: เก็บเฉพาะ Type ใน Queue แทนการสร้าง Instance ล่วงหน้า
private spawnQueue: MosquitoType[] = [];

public update(delta: number): Mosquito | null {
// ... คำนวณ spawnTimer ...
if (this.spawnTimer >= interval) {
this.spawnTimer = 0;
const type = this.spawnQueue.shift();
if (!type) return null;

    // ค่อยสร้าง Object ยุงตรงนี้เมื่อถึงเวลาปล่อยจริง
    return MosquitoFactory.create(type, SPAWN_POSITION.x, SPAWN_POSITION.y, this.currentPattern?.wave || 1);

}
return null;
}

เพิ่มประเภทยุง Counter-Play ใน generateFallbackWave:
ในฟังก์ชันสร้าง Wave อัตโนมัติ (generateFallbackWave) มีการสุ่มยุงแค่ประเภท NORMAL, SPEEDY, TANK, BOSS เท่านั้น ทำให้ยุงประเภทพิเศษอย่าง ARMORED, STEALTH, หรือ SPLITTER หายไปจาก Wave ถัดๆ ไปเมื่อผู้เล่นเล่นเลย Config ปรับระยะห่างการปล่อยยุง (Spawn Interval) ตามประเภท:
ปัจจุบัน getSpawnInterval() ใช้สูตรคำนวณเวลาปล่อยยุงเท่ากันทุกตัวใน Wave นั้นๆ หากปรับให้ยุงตัวใหญ่/เกราะหนา (เช่น TANK, BOSS) มีระยะห่างในการเกิดมากกว่ายุงตัวเล็ก (SPEEDY, NORMAL) จะช่วยให้การเว้นจังหวะ (Pacing) ของเกมน่าตื่นเต้นยิ่งขึ้นครับ
