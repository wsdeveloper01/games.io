document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('ws_user') || 'Player';
    const skinUrl = urlParams.get('ws_skin') || 'https://minotar.net/helm/Steve/100.png';

    const uiHTML = `
        <style>
            /* Styling Joystick & Menu Tanpa Emoji */
            .ws-ui-layer { font-family: 'Inter', sans-serif; position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99999; }
            .ws-joy-area { position: absolute; bottom: 30px; left: 30px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.2); border-radius: 50%; pointer-events: auto; touch-action: none; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
            .ws-joy-knob { width: 50px; height: 50px; background: rgba(99, 102, 241, 0.8); border: 2px solid rgba(255,255,255,0.5); border-radius: 50%; position: absolute; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
            
            .ws-btn-group { position: absolute; bottom: 30px; right: 30px; display: flex; flex-direction: column; gap: 15px; pointer-events: auto; }
            .ws-btn { width: 65px; height: 65px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 700; color: white; font-size: 16px; backdrop-filter: blur(4px); user-select: none; }
            .ws-btn:active { background: rgba(99, 102, 241, 0.6); transform: scale(0.95); }
            .ws-btn-jump { width: 75px; height: 75px; font-size: 14px; }
            
            #ws-menu-toggle { position: absolute; top: 20px; right: 20px; pointer-events: auto; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 8px; color: white; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; backdrop-filter: blur(10px); transition: 0.2s; }
            #ws-menu-toggle:hover { background: rgba(99, 102, 241, 0.8); }
            #ws-menu-toggle svg { width: 18px; height: 18px; fill: white; }

            #ws-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); z-index: 100000; display: none; justify-content: center; align-items: center; pointer-events: auto; }
            .ws-modal { background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; width: 90%; max-width: 350px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
            .ws-modal img { width: 80px; height: 80px; border-radius: 16px; border: 3px solid #6366f1; margin-bottom: 15px; image-rendering: pixelated; }
            .ws-modal h2 { color: white; font-size: 22px; margin-bottom: 5px; font-weight: 600; }
            .ws-modal p { color: #94a3b8; font-size: 13px; margin-bottom: 25px; }
            
            .ws-menu-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; margin-bottom: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; }
            .ws-menu-btn:hover { background: rgba(255,255,255,0.1); }
            .ws-menu-btn.close-btn { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); color: #fca5a5; margin-top: 15px; }
            .ws-menu-btn.close-btn:hover { background: rgba(239, 68, 68, 0.3); }
        </style>

        <div class="ws-ui-layer">
            <!-- Joystick -->
            <div id="ws-joy" class="ws-joy-area"><div class="ws-joy-knob" id="ws-knob"></div></div>
            
            <!-- Tombol Kanan -->
            <div class="ws-btn-group">
                <div class="ws-btn" onclick="wsPress('e')">E</div>
                <div class="ws-btn ws-btn-jump" onclick="wsPress(' ')">JUMP</div>
            </div>

            <!-- Tombol Menu -->
            <div id="ws-menu-toggle" onclick="document.getElementById('ws-overlay').style.display='flex'">
                <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg> MENU
            </div>

            <!-- Overlay Menu -->
            <div id="ws-overlay">
                <div class="ws-modal">
                    <img src="${skinUrl}" alt="Skin">
                    <h2>${username}</h2>
                    <p>WsLauncher Client v1.0</p>
                    
                    <button class="ws-menu-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Toggle Shader Ringan
                    </button>
                    <button class="ws-menu-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
                        Buka Mod Client
                    </button>
                    <button class="ws-menu-btn close-btn" onclick="document.getElementById('ws-overlay').style.display='none'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        Tutup Menu
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', uiHTML);

    // Logika Joystick
    const joy = document.getElementById('ws-joy');
    const knob = document.getElementById('ws-knob');
    let active = false;

    joy.addEventListener('touchstart', (e) => { active = true; e.preventDefault(); });
    joy.addEventListener('touchend', (e) => { 
        active = false; knob.style.transform = `translate(0px, 0px)`; 
        ['w','a','s','d'].forEach(k => wsSimulate(k, 'keyup'));
    });
    joy.addEventListener('touchmove', (e) => {
        if(!active) return;
        const rect = joy.getBoundingClientRect();
        const touch = e.targetTouches[0];
        let x = touch.clientX - rect.left - (rect.width / 2);
        let y = touch.clientY - rect.top - (rect.height / 2);
        
        const maxDist = 35;
        const dist = Math.sqrt(x*x + y*y);
        if(dist > maxDist) { x = (x/dist)*maxDist; y = (y/dist)*maxDist; }
        knob.style.transform = `translate(${x}px, ${y}px)`;

        if(y < -15) wsSimulate('w', 'keydown'); else wsSimulate('w', 'keyup');
        if(y > 15) wsSimulate('s', 'keydown'); else wsSimulate('s', 'keyup');
        if(x < -15) wsSimulate('a', 'keydown'); else wsSimulate('a', 'keyup');
        if(x > 15) wsSimulate('d', 'keydown'); else wsSimulate('d', 'keyup');
    });

    // Fungsi Simulasi Keyboard (WASD, E, Space)
    window.wsPress = function(key) {
        wsSimulate(key, 'keydown');
        setTimeout(() => wsSimulate(key, 'keyup'), 100);
    };

    function wsSimulate(key, type) {
        const event = new KeyboardEvent(type, { key: key, code: 'Key' + key.toUpperCase(), bubbles: true });
        document.dispatchEvent(event);
        const canvas = document.querySelector('canvas');
        if(canvas) canvas.dispatchEvent(event);
    }
});