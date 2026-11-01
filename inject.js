document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('ws_user') || 'Player';
    const skinUrl = urlParams.get('ws_skin') || 'https://minotar.net/helm/Steve/100.png';

    // === 1. AUTO-OPTIMIZER (Maksa Game Jadi Ringan) ===
    // Script ini nunggu game-nya bener-bener siap, lalu nembak settingan ringan
    let optimizerTries = 0;
    const applyOptimization = setInterval(() => {
        optimizerTries++;
        // Eaglercraft menyimpan konfigurasi di localStorage atau window object
        try {
            // Trik paksa render distance pendek & matiin efek berat
            if (window.eaglercraftXOpts) {
                window.eaglercraftXOpts.renderDistance = 4; // 4 Chunk aja
                window.eaglercraftXOpts.enableClouds = false;
                window.eaglercraftXOpts.enableParticles = false;
                window.eaglercraftXOpts.smoothLighting = false;
                window.eaglercraftXOpts.fancyGraphics = false;
            }
            
            // Kalau udah jalan 5 detik, stop intervalnya
            if (optimizerTries > 10) clearInterval(applyOptimization);
        } catch(e) {}
    }, 500);

    // === 2. UI JOYSTICK & MENU MODERN ===
    const uiHTML = `
        <style>
            .ws-ui-layer { font-family: 'Inter', sans-serif; position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99999; }
            
            /* Joystick Kiri */
            .ws-joy-area { position: absolute; bottom: 30px; left: 20px; width: 130px; height: 130px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.2); border-radius: 50%; pointer-events: auto; touch-action: none; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
            .ws-joy-knob { width: 50px; height: 50px; background: rgba(99, 102, 241, 0.9); border: 2px solid rgba(255,255,255,0.6); border-radius: 50%; position: absolute; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
            
            /* Tombol Kanan */
            .ws-btn-group { position: absolute; bottom: 30px; right: 20px; display: flex; flex-direction: column; gap: 15px; pointer-events: auto; align-items: center; }
            .ws-btn { width: 65px; height: 65px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 700; color: white; font-size: 16px; backdrop-filter: blur(4px); user-select: none; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
            .ws-btn:active { background: rgba(99, 102, 241, 0.6); transform: scale(0.95); }
            .ws-btn-jump { width: 80px; height: 80px; font-size: 14px; margin-bottom: 10px;}
            
            /* Menu Button */
            #ws-menu-toggle { position: absolute; top: 15px; right: 15px; pointer-events: auto; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 8px; color: white; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; backdrop-filter: blur(10px); transition: 0.2s; }
            #ws-menu-toggle:hover { background: rgba(99, 102, 241, 0.8); }

            /* Overlay Menu */
            #ws-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); z-index: 100000; display: none; justify-content: center; align-items: center; pointer-events: auto; }
            .ws-modal { background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; width: 90%; max-width: 350px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
            .ws-modal img { width: 80px; height: 80px; border-radius: 16px; border: 3px solid #6366f1; margin-bottom: 15px; image-rendering: pixelated; }
            .ws-modal h2 { color: white; font-size: 22px; margin-bottom: 5px; font-weight: 600; }
            .ws-modal p { color: #94a3b8; font-size: 13px; margin-bottom: 25px; }
            
            .ws-menu-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; margin-bottom: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; }
            .ws-menu-btn:hover { background: rgba(255,255,255,0.1); }
            .ws-menu-btn.close-btn { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); color: #fca5a5; margin-top: 15px; }
        </style>

        <div class="ws-ui-layer">
            <div id="ws-joy" class="ws-joy-area"><div class="ws-joy-knob" id="ws-knob"></div></div>
            
            <div class="ws-btn-group">
                <div class="ws-btn" onclick="wsPress('e')">E</div>
                <div class="ws-btn ws-btn-jump" onclick="wsPress(' ')">JUMP</div>
            </div>

            <div id="ws-menu-toggle" onclick="document.getElementById('ws-overlay').style.display='flex'">
                MENU
            </div>

            <div id="ws-overlay">
                <div class="ws-modal">
                    <img src="${skinUrl}" alt="Skin">
                    <h2>${username}</h2>
                    <p>WsLauncher Optimized Mode</p>
                    
                    <button class="ws-menu-btn" onclick="wsOptimizeGame()">Optimasi Grafis (Lag Fix)</button>
                    <button class="ws-menu-btn">Buka Mod Client</button>
                    <button class="ws-menu-btn close-btn" onclick="document.getElementById('ws-overlay').style.display='none'">Tutup Menu</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', uiHTML);

    // === 3. LOGIKA JOYSTICK MULTI-TOUCH ===
    const joy = document.getElementById('ws-joy');
    const knob = document.getElementById('ws-knob');
    let active = false;

    joy.addEventListener('touchstart', (e) => { active = true; e.preventDefault(); }, {passive: false});
    joy.addEventListener('touchend', (e) => { 
        active = false; knob.style.transform = `translate(0px, 0px)`; 
        ['w','a','s','d'].forEach(k => wsSimulate(k, 'keyup'));
    });
    joy.addEventListener('touchmove', (e) => {
        if(!active) return;
        e.preventDefault();
        const rect = joy.getBoundingClientRect();
        const touch = e.targetTouches[0];
        let x = touch.clientX - rect.left - (rect.width / 2);
        let y = touch.clientY - rect.top - (rect.height / 2);
        
        const maxDist = 40;
        const dist = Math.sqrt(x*x + y*y);
        if(dist > maxDist) { x = (x/dist)*maxDist; y = (y/dist)*maxDist; }
        knob.style.transform = `translate(${x}px, ${y}px)`;

        // Sensitivitas Joystick
        if(y < -15) wsSimulate('w', 'keydown'); else wsSimulate('w', 'keyup');
        if(y > 15) wsSimulate('s', 'keydown'); else wsSimulate('s', 'keyup');
        if(x < -15) wsSimulate('a', 'keydown'); else wsSimulate('a', 'keyup');
        if(x > 15) wsSimulate('d', 'keydown'); else wsSimulate('d', 'keyup');
    }, {passive: false});

    // === 4. SIMULASI KEYBOARD (Biar Karakter Jalan) ===
    window.wsPress = function(key) {
        wsSimulate(key, 'keydown');
        setTimeout(() => wsSimulate(key, 'keyup'), 100);
    };

    function wsSimulate(key, type) {
        let code = 'Key' + key.toUpperCase();
        if(key === ' ') code = 'Space';
        const event = new KeyboardEvent(type, { key: key, code: code, bubbles: true });
        document.dispatchEvent(event);
        const canvas = document.querySelector('canvas');
        if(canvas) canvas.dispatchEvent(event);
    }

    // === 5. FUNGSI TOMBOL OPTIMASI DI MENU ===
    window.wsOptimizeGame = function() {
        try {
            // Trik nembak settingan di game biar maksa turun kualitas
            if (window.minecraft) {
                window.minecraft.settings.renderDistance = 4;
                window.minecraft.settings.enableClouds = false;
                window.minecraft.settings.smoothLighting = false;
                window.minecraft.settings.fancyGraphics = false;
            }
            // Trik manipulasi lokal storage
            let opts = JSON.parse(localStorage.getItem('eaglercraftXOpts') || '{}');
            opts.renderDistance = 4;
            opts.enableClouds = false;
            localStorage.setItem('eaglercraftXOpts', JSON.stringify(opts));
            
            alert("Grafis berhasil diturunkan ke mode super ringan! Jika masih patah-patah, silakan refresh halaman.");
        } catch(e) {
            alert("Gagal optimasi otomatis. Tolong atur Render Distance ke 4 secara manual di dalam game.");
        }
    };
});