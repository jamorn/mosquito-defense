<!DOCTYPE html>
<html lang="th" class="h-full bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2.5D Cloud & Spray Particle Simulator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Kanit', sans-serif;
    }
    canvas {
      touch-action: none;
    }
    .font-mono-code {
      font-family: 'JetBrains Mono', monospace;
    }
    /* Custom scrollbar for settings panel */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.6);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(51, 65, 85, 0.8);
      border-radius: 9999px;
    }
  </style>
</head>
<body class="h-full flex flex-col md:flex-row overflow-hidden select-none">

  <aside class="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-10 shrink-0 shadow-2xl h-auto max-h-[45vh] md:max-h-full overflow-y-auto">
    <!-- Header -->
    <div class="p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 backdrop-blur-md">
      <div class="flex items-center gap-2">
        <div class="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 001.09-.124 4 4 0 003.882-3.882 4.5 4.5 0 00-2.316-8.232 4.002 4.002 0 00-7.854 0.16A4.992 4.992 0 003 15z"></path></svg>
        </div>
        <div>
          <h1 class="text-base font-semibold text-white">2.5D Cloud & Spray Lab</h1>
          <p class="text-xs text-slate-400">จำลองเมฆและละอองสเปรย์ 2.5D Canvas</p>
        </div>
      </div>
    </div>

    <div class="p-4 space-y-5 flex-1">
      <!-- Preset Selection -->
      <div class="space-y-2">
        <label class="text-xs font-medium text-slate-300 uppercase tracking-wider">รูปแบบพรีเซ็ต (Presets)</label>
        <div class="grid grid-cols-2 gap-2">
          <button id="presetCloud" class="preset-btn px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all border-indigo-500 bg-indigo-500/10 text-indigo-300">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-200"></span> ก้อนเมฆปุยนุ่ม
          </button>
          <button id="presetSpray" class="preset-btn px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> สีสเปรย์นีออน
          </button>
          <button id="presetSmoke" class="preset-btn px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> ควันไฟ / ควันเข้ม
          </button>
          <button id="presetVapor" class="preset-btn px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700">
            <span class="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span> ไอหมอกเวทมนตร์
          </button>
        </div>
      </div>

      <hr class="border-slate-800">

      <!-- Customization Controls -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-xs font-medium text-slate-300 uppercase tracking-wider">การปรับแต่งเอฟเฟกต์</label>
          <span class="text-[10px] text-slate-500">2.5D Particle Physics</span>
        </div>

        <!-- Expansion Speed (2.5D Depth simulation) -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">อัตราขยายตัว 2.5D (Expansion)</span>
            <span id="valGrowth" class="text-indigo-400 font-mono-code">0.4</span>
          </div>
          <input type="range" id="paramGrowth" min="0" max="1.5" step="0.05" value="0.4" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
          <p class="text-[10px] text-slate-500">ทำให้ละอองสเปรย์ดูขยายใหญ่ขึ้นเมื่อลอยเข้าหากล้อง</p>
        </div>

        <!-- Density / Emission Rate -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">ความหนาแน่น (Emission Count)</span>
            <span id="valDensity" class="text-indigo-400 font-mono-code">5</span>
          </div>
          <input type="range" id="paramDensity" min="1" max="20" step="1" value="5" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
        </div>

        <!-- Particle Base Size -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">ขนาดละอองเริ่มต้น (Base Size)</span>
            <span id="valSize" class="text-indigo-400 font-mono-code">12</span>
          </div>
          <input type="range" id="paramSize" min="3" max="40" step="1" value="12" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
        </div>

        <!-- Life Span / Decay -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">ระยะเวลาคงอยู่ (Lifetime)</span>
            <span id="valDecay" class="text-indigo-400 font-mono-code">ปกติ</span>
          </div>
          <input type="range" id="paramDecay" min="0.002" max="0.03" step="0.001" value="0.008" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
        </div>

        <!-- Wind Drift (X axis) -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">แรงลมพัด (Wind Speed X)</span>
            <span id="valWind" class="text-indigo-400 font-mono-code">0.0</span>
          </div>
          <input type="range" id="paramWind" min="-2" max="2" step="0.1" value="0" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
        </div>
      </div>

      <hr class="border-slate-800">

      <!-- Environment Settings -->
      <div class="space-y-2">
        <label class="text-xs font-medium text-slate-300 uppercase tracking-wider">พื้นหลัง (Canvas Background)</label>
        <select id="bgSelect" class="w-full bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500">
          <option value="sky" selected>ท้องฟ้าสดใส (Sky Blue)</option>
          <option value="dark">ห้องมืดดิบ (Dark Studio)</option>
          <option value="sunset">พระอาทิตย์ตก (Sunset Gradient)</option>
          <option value="grid">กระดานกริด (Blueprint Grid)</option>
        </select>
      </div>

      <!-- Action Toggles -->
      <div class="pt-2 flex flex-col gap-2">
        <button id="btnAutoEmit" class="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2">
          <span id="autoEmitDot" class="w-2 h-2 rounded-full bg-slate-500"></span>
          <span id="autoEmitText">เปิดโหมดพ่นอัตโนมัติ (Auto Spray)</span>
        </button>
        <button id="btnClear" class="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition">
          ล้างหน้าจอ Canvas (Clear)
        </button>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
      <div>Particles: <span id="statCount" class="text-indigo-400">0</span></div>
      <div>FPS: <span id="statFPS" class="text-emerald-400">60</span></div>
    </div>
  </aside>

  <!-- Canvas Interactive Display -->
  <main class="flex-1 relative bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
    <!-- Interactive Canvas -->
    <canvas id="sprayCanvas" class="w-full h-full cursor-crosshair"></canvas>

    <!-- Floating Overlay Tips -->
    <div class="absolute top-4 right-4 pointer-events-none bg-slate-900/80 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-2 shadow-lg">
      <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
      <span>ลากเมาส์ หรือแตะสัมผัสบนจอเพื่อพ่นสเปรย์/สร้างก้อนเมฆ</span>
    </div>

    <!-- 2.5D Tech Explanation Footer Badge -->
    <div class="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 pointer-events-none bg-slate-900/80 border border-slate-800 backdrop-blur-md px-4 py-2.5 rounded-xl text-[11px] text-slate-400 max-w-md shadow-lg hidden sm:block">
      <div class="font-medium text-slate-200 mb-0.5 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> เทคนิค 2.5D Cloud Radial Gradient
      </div>
      ใช้การซ้อนทับ Particle ความโปร่งแสงสูง (Alpha Blending) ร่วมกับ Radial Gradient ซ้อนขอบนุ่มเพื่อจำลองมิติความหนาแน่นและปริมาตร (Volume) แบบ 2.5D
    </div>
  </main>

  <!-- JavaScript Application Logic -->
  <script>
    const canvas = document.getElementById('sprayCanvas');
    const ctx = canvas.getContext('2d');

    // UI Elements
    const statCount = document.getElementById('statCount');
    const statFPS = document.getElementById('statFPS');
    const bgSelect = document.getElementById('bgSelect');
    
    // Control Sliders
    const paramGrowth = document.getElementById('paramGrowth');
    const paramDensity = document.getElementById('paramDensity');
    const paramSize = document.getElementById('paramSize');
    const paramDecay = document.getElementById('paramDecay');
    const paramWind = document.getElementById('paramWind');

    const valGrowth = document.getElementById('valGrowth');
    const valDensity = document.getElementById('valDensity');
    const valSize = document.getElementById('valSize');
    const valDecay = document.getElementById('valDecay');
    const valWind = document.getElementById('valWind');

    // Presets Buttons
    const presetCloud = document.getElementById('presetCloud');
    const presetSpray = document.getElementById('presetSpray');
    const presetSmoke = document.getElementById('presetSmoke');
    const presetVapor = document.getElementById('presetVapor');
    const presetBtns = [presetCloud, presetSpray, presetSmoke, presetVapor];

    const btnAutoEmit = document.getElementById('btnAutoEmit');
    const autoEmitDot = document.getElementById('autoEmitDot');
    const autoEmitText = document.getElementById('autoEmitText');
    const btnClear = document.getElementById('btnClear');

    // App State Configuration
    const config = {
      growthRate: 0.4,
      density: 5,
      baseSize: 12,
      decayRate: 0.008,
      windX: 0.0,
      colorRGB: '235, 240, 255', // Default Cloud White
      compositeMode: 'source-over',
      bgType: 'sky',
      autoEmit: false
    };

    let particles = [];
    let isSpraying = false;
    let mousePos = { x: 0, y: 0 };
    let autoEmitAngle = 0;

    // Performance Monitoring
    let lastTime = performance.now();
    let frameCount = 0;
    let currentFPS = 60;

    class SprayParticle {
      constructor(x, y, angle, speed, options) {
        this.x = x;
        this.y = y;
        
        // Random spread angle
        const spread = angle + (Math.random() - 0.5) * 0.75;
        const actualSpeed = speed * (0.6 + Math.random() * 0.8);
        
        this.vx = Math.cos(spread) * actualSpeed;
        this.vy = Math.sin(spread) * actualSpeed;

        this.radius = options.baseSize * (0.6 + Math.random() * 0.8);
        this.maxRadius = this.radius + (options.baseSize * 2.5) + (Math.random() * 20);
        
        this.alpha = 0.25 + Math.random() * 0.35; // Soft opacity for cloud depth stacking
        this.decay = options.decayRate * (0.8 + Math.random() * 0.4);
        this.growth = options.growthRate;
        this.color = options.colorRGB;

        // Subtle 3D rotation and offset variation
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
      }

      update(wind) {
        // Apply friction to slow down particles as they expand in air
        this.vx *= 0.94;
        this.vy *= 0.94;

        // Apply external forces (Wind)
        this.x += this.vx + wind;
        this.y += this.vy;

        // 2.5D Expansion: Particle grows as it dissipates into the air
        if (this.radius < this.maxRadius) {
          this.radius += this.growth;
        }

        // Fade out
        this.alpha -= this.decay;
        this.rotation += this.spin;

        return this.alpha > 0;
      }

      draw(ctx) {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        /* 
          2.5D Soft Radial Gradient Trick:
          Creating inner highlight and soft feathered outer halo to form volumetric depth
        */
        const gradient = ctx.createRadialGradient(
          0, 0, 0,
          0, 0, this.radius
        );

        // Core dense cloud center
        gradient.addColorStop(0, `rgba(${this.color}, ${Math.min(1, this.alpha * 1.2)})`);
        // Mid cloud volume transition
        gradient.addColorStop(0.4, `rgba(${this.color}, ${this.alpha * 0.6})`);
        // Soft feather border fading to zero
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawBackground() {
      const w = canvas.width;
      const h = canvas.height;

      if (config.bgType === 'sky') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#38bdf8'); // Bright Sky Blue
        bgGrad.addColorStop(1, '#818cf8'); // Soft Horizon Indigo
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Draw distant horizon sun
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.25, 80, 0, Math.PI * 2);
        ctx.fill();
      } else if (config.bgType === 'dark') {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);
      } else if (config.bgType === 'sunset') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.5, '#c026d3');
        bgGrad.addColorStop(1, '#f97316');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (config.bgType === 'grid') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        
        for (let x = 0; x < w; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }
    }

    function emitSpray(x, y, angle = 0, speed = 4) {
      for (let i = 0; i < config.density; i++) {
        particles.push(new SprayParticle(x, y, angle, speed, config));
      }
    }

    function updateMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    }

    canvas.addEventListener('mousedown', (e) => {
      isSpraying = true;
      updateMousePos(e);
    });

    canvas.addEventListener('mousemove', (e) => {
      updateMousePos(e);
    });

    window.addEventListener('mouseup', () => {
      isSpraying = false;
    });

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
      isSpraying = true;
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = e.touches[0].clientX - rect.left;
        mousePos.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = e.touches[0].clientX - rect.left;
        mousePos.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      isSpraying = false;
    });

    paramGrowth.addEventListener('input', (e) => {
      config.growthRate = parseFloat(e.target.value);
      valGrowth.textContent = config.growthRate.toFixed(2);
    });

    paramDensity.addEventListener('input', (e) => {
      config.density = parseInt(e.target.value);
      valDensity.textContent = config.density;
    });

    paramSize.addEventListener('input', (e) => {
      config.baseSize = parseInt(e.target.value);
      valSize.textContent = config.baseSize;
    });

    paramDecay.addEventListener('input', (e) => {
      config.decayRate = parseFloat(e.target.value);
      const val = config.decayRate;
      valDecay.textContent = val < 0.005 ? 'ช้ามาก' : val < 0.012 ? 'ปกติ' : 'เร็วมาก';
    });

    paramWind.addEventListener('input', (e) => {
      config.windX = parseFloat(e.target.value);
      valWind.textContent = config.windX > 0 ? `+${config.windX.toFixed(1)}` : config.windX.toFixed(1);
    });

    bgSelect.addEventListener('change', (e) => {
      config.bgType = e.target.value;
    });

    btnClear.addEventListener('click', () => {
      particles = [];
    });

    btnAutoEmit.addEventListener('click', () => {
      config.autoEmit = !config.autoEmit;
      if (config.autoEmit) {
        autoEmitDot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
        autoEmitText.textContent = "กำลังพ่นอัตโนมัติ (คลิกเพื่อหยุด)";
        btnAutoEmit.classList.add('border-emerald-500/50', 'bg-emerald-500/10');
      } else {
        autoEmitDot.className = "w-2 h-2 rounded-full bg-slate-500";
        autoEmitText.textContent = "เปิดโหมดพ่นอัตโนมัติ (Auto Spray)";
        btnAutoEmit.classList.remove('border-emerald-500/50', 'bg-emerald-500/10');
      }
    });

    // Preset Selectors
    function setActivePresetBtn(selectedBtn) {
      presetBtns.forEach(btn => {
        btn.className = "preset-btn px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700";
      });
      selectedBtn.className = "preset-btn px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all border-indigo-500 bg-indigo-500/10 text-indigo-300";
    }

    presetCloud.addEventListener('click', () => {
      setActivePresetBtn(presetCloud);
      config.colorRGB = '245, 247, 255';
      config.growthRate = 0.45;
      config.baseSize = 16;
      config.decayRate = 0.006;
      config.compositeMode = 'source-over';
      config.bgType = 'sky';
      bgSelect.value = 'sky';
      
      paramGrowth.value = 0.45; valGrowth.textContent = "0.45";
      paramSize.value = 16; valSize.textContent = "16";
      paramDecay.value = 0.006; valDecay.textContent = "ปกติ";
    });

    presetSpray.addEventListener('click', () => {
      setActivePresetBtn(presetSpray);
      config.colorRGB = '6, 182, 212'; // Neon Cyan
      config.growthRate = 0.15;
      config.baseSize = 8;
      config.decayRate = 0.012;
      config.compositeMode = 'source-over';
      config.bgType = 'dark';
      bgSelect.value = 'dark';

      paramGrowth.value = 0.15; valGrowth.textContent = "0.15";
      paramSize.value = 8; valSize.textContent = "8";
      paramDecay.value = 0.012; valDecay.textContent = "เร็วมาก";
    });

    presetSmoke.addEventListener('click', () => {
      setActivePresetBtn(presetSmoke);
      config.colorRGB = '40, 45, 55'; // Dark Charcoal
      config.growthRate = 0.6;
      config.baseSize = 14;
      config.decayRate = 0.007;
      config.compositeMode = 'source-over';
      config.bgType = 'sunset';
      bgSelect.value = 'sunset';

      paramGrowth.value = 0.6; valGrowth.textContent = "0.60";
      paramSize.value = 14; valSize.textContent = "14";
      paramDecay.value = 0.007; valDecay.textContent = "ปกติ";
    });

    presetVapor.addEventListener('click', () => {
      setActivePresetBtn(presetVapor);
      config.colorRGB = '232, 121, 249'; // Neon Pink Vapor
      config.growthRate = 0.35;
      config.baseSize = 12;
      config.decayRate = 0.009;
      config.compositeMode = 'screen';
      config.bgType = 'dark';
      bgSelect.value = 'dark';

      paramGrowth.value = 0.35; valGrowth.textContent = "0.35";
      paramSize.value = 12; valSize.textContent = "12";
      paramDecay.value = 0.009; valDecay.textContent = "ปกติ";
    });

    function animate(now) {
      // Calculate FPS
      frameCount++;
      if (now - lastTime >= 1000) {
        currentFPS = Math.round((frameCount * 1000) / (now - lastTime));
        statFPS.textContent = currentFPS;
        frameCount = 0;
        lastTime = now;
      }

      // Draw background environment
      drawBackground();

      // Handle Manual Spraying
      if (isSpraying) {
        emitSpray(mousePos.x, mousePos.y, Math.random() * Math.PI * 2, 2.5);
      }

      // Handle Auto Emitter (Orbital rotation around center)
      if (config.autoEmit) {
        autoEmitAngle += 0.03;
        const centerX = canvas.width / 2 + Math.cos(autoEmitAngle) * (canvas.width * 0.2);
        const centerY = canvas.height / 2 + Math.sin(autoEmitAngle * 1.5) * (canvas.height * 0.15);
        emitSpray(centerX, centerY, autoEmitAngle, 3);
      }

      // Render Particles with Blend Modes
      ctx.globalCompositeOperation = config.compositeMode;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const isAlive = p.update(config.windX);

        if (!isAlive) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      // Reset composite mode
      ctx.globalCompositeOperation = 'source-over';

      // Update particle count stats
      statCount.textContent = particles.length;

      requestAnimationFrame(animate);
    }

    // Start animation loop on window load
    window.onload = () => {
      requestAnimationFrame(animate);
    };
  </script>
</body>
</html>