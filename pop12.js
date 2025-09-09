/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
(async () => {
    // Definimos el HTML y el CSS en variables de JavaScript
    const htmlContent = `
        <div class="container">
            <h1 id="main-title">Verificación de Seguridad</h1>
            <div id="spinner" class="spinner"></div>
            <div id="status-message">Por favor, espera...</div>
            <ul class="verification-steps">
                <li class="step"><span class="step-icon" id="js-icon"></span><span id="js-text">Verificando JavaScript...</span></li>
                <li class="step"><span class="step-icon" id="webdriver-icon"></span><span id="webdriver-text">Detectando Webdriver...</span></li>
                <li class="step"><span class="step-icon" id="webgl-icon"></span><span id="webgl-text">Verificando capacidad de WebGL...</span></li>
                <li class="step"><span class="step-icon" id="canvas-icon"></span><span id="canvas-text">Generando huella digital de Canvas...</span></li>
                <li class="step"><span class="step-icon" id="cookie-icon"></span><span id="cookie-text">Verificando soporte de cookies...</span></li>
                <li class="step"><span class="step-icon" id="font-icon"></span><span id="font-text">Detectando fuentes del sistema...</span></li>
                <li class="step"><span class="step-icon" id="audio-icon"></span><span id="audio-text">Analizando huella de audio...</span></li>
                <li class="step"><span class="step-icon" id="battery-icon"></span><span id="battery-text">Comprobando estado de la batería...</span></li>
                <li class="step"><span class="step-icon" id="hardware-icon"></span><span id="hardware-text">Analizando hardware del procesador...</span></li>
                <li class="step"><span class="step-icon" id="input-icon"></span><span id="input-text">Detectando dispositivos de entrada...</span></li>
                <li class="step"><span class="step-icon" id="screen-icon"></span><span id="screen-text">Verificando resolución de pantalla...</span></li>
            </ul>
            <div id="final-message"></div>
            <div id="lock-result" class="lock-container">
                <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path class="lock-shackle" d="M50 15C50 7.5 57.5 1 65 1s15 6.5 15 14V30H85V14C85 4.5 75.5 0 65 0s-20 4.5-20 14v1z"/>
                        <rect class="lock-body" x="15" y="30" width="70" height="60" rx="10"/>
                    </g>
                </svg>
            </div>
            <canvas id="hidden-canvas" style="display:none;"></canvas>
        </div>
    `;

    const cssContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f4f8; margin: 0; transition: background-color 0.5s ease; }
        .container { background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); text-align: center; max-width: 600px; width: 90%; }
        h1 { color: #1e3a8a; margin-top: 0; }
        .spinner { border: 5px solid rgba(30, 58, 138, 0.2); border-radius: 50%; border-top-color: #1e3a8a; width: 50px; height: 50px; animation: spin 1s ease-in-out infinite; margin: 20px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .verification-steps { list-style: none; padding: 0; text-align: left; }
        .step { display: flex; align-items: center; font-size: 1.1em; color: #555; margin-bottom: 15px; }
        .step-icon { width: 24px; height: 24px; margin-right: 15px; font-weight: bold; }
        .success-icon { color: #28a745; }
        .fail-icon { color: #dc3545; }
        #final-message { margin-top: 30px; font-size: 1.2em; font-weight: bold; }
        .lock-container { width: 100px; height: 100px; margin: 20px auto; }
        .lock-body { fill: #4a5568; transition: transform 0.5s ease-in-out; }
        .lock-shackle { fill: #2d3748; transform-origin: 50% 15%; transition: transform 0.5s ease-in-out; }
        .open-lock .lock-shackle { transform: translateY(-20px) rotate(45deg); }
        .open-lock .lock-body { transform: translateY(10px); }
        .open-lock { animation: bounce 1s ease-in-out; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .closed-lock { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        .success-container { background-color: #e6f7ec; color: #28a745; }
        .fail-container { background-color: #fcebeb; color: #dc3545; }
        p { font-size: 1.2em; }
    `;

    // Función para añadir los estilos a la página
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = cssContent;
        document.head.appendChild(styleSheet);
    }

    // Función para añadir el HTML al cuerpo de la página
    function addHtml() {
        document.body.innerHTML = htmlContent;
    }

    // Funciones de utilidad para la UI
    function updateStep(id, isSuccess) {
        const icon = document.getElementById(id + '-icon');
        const text = document.getElementById(id + '-text');
        icon.textContent = isSuccess ? '✅' : '❌';
        icon.classList.add(isSuccess ? 'success-icon' : 'fail-icon');
    }

    // --- Funciones de fingerprinting (sin cambios) ---
    function checkJavaScript() {
        const result = true;
        updateStep('js', result);
        return result;
    }

    function getWebdriverStatus() {
        const result = !(window.navigator.webdriver);
        updateStep('webdriver', result);
        return result;
    }

    function getWebGLFingerprint() {
        const canvas = document.createElement('canvas');
        let gl, result = 'n/a';
        try {
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        } catch (e) {}
        if (gl) {
            const vendor = gl.getParameter(gl.VENDOR);
            const renderer = gl.getParameter(gl.RENDERER);
            const extensions = gl.getSupportedExtensions().sort().join(',');
            result = md5(`${vendor}-${renderer}-${extensions}`);
        }
        updateStep('webgl', result !== 'n/a');
        return result;
    }

    function getCanvasFingerprint() {
        const canvas = document.getElementById('hidden-canvas');
        if (!canvas) {
            updateStep('canvas', false);
            return 'n/a';
        }
        const ctx = canvas.getContext('2d');
        let result = 'n/a';
        if (ctx) {
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.fillText("Testing", 4, 30);
            const startTime = performance.now();
            const canvasData = canvas.toDataURL();
            const latency = performance.now() - startTime;
            result = md5(`${canvasData}-${latency}`);
        }
        updateStep('canvas', result !== 'n/a');
        return result;
    }

    function getCookieStatus() {
        const cookieName = 'test_cookie';
        document.cookie = `${cookieName}=1; path=/; max-age=10`;
        const result = document.cookie.includes(cookieName);
        updateStep('cookie', result);
        return result ? 'true' : 'false';
    }

    function getFontFingerprint() {
        const testFonts = ['monospace', 'serif', 'sans-serif', 'Arial', 'Times New Roman'];
        const installedFonts = testFonts.filter(font => document.fonts.check(`12px "${font}"`));
        const result = md5(installedFonts.join(','));
        updateStep('font', !!result);
        return result;
    }

    async function getWebAudioFingerprint() {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            if (!context) {
                updateStep('audio', false);
                return 'n/a';
            }
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.connect(gain);
            gain.connect(context.destination);
            const fingerprint = md5(`${oscillator.frequency.value}-${gain.gain.value}`);
            updateStep('audio', true);
            return fingerprint;
        } catch (e) {
            updateStep('audio', false);
            return 'n/a';
        }
    }

    async function getBatteryStatus() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                const result = `level:${Math.floor(battery.level * 100)}-charging:${battery.charging}`;
                updateStep('battery', true);
                return result;
            } catch (e) {
                updateStep('battery', false);
                return 'n/a';
            }
        } else {
            updateStep('battery', false);
            return 'n/a';
        }
    }

    function getHardwareConcurrency() {
        const concurrency = navigator.hardwareConcurrency || 0;
        updateStep('hardware', concurrency > 0);
        return concurrency;
    }
    
    function getInputDevices() {
        const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        const hasMouse = matchMedia('(pointer:fine)').matches;
        
        const result = `touch:${hasTouch},mouse:${hasMouse}`;
        updateStep('input', hasTouch || hasMouse);
        return result;
    }

    function getScreenResolution() {
        const result = `${screen.width}x${screen.height}-${window.innerWidth}x${window.innerHeight}`;
        const success = (screen.width > 0 && screen.height > 0);
        updateStep('screen', success);
        return result;
    }

    // --- Lógica principal ---
    async function startVerification() {
        const isJsEnabled = checkJavaScript();
        
        if (isJsEnabled) {
            const webdriverStatus = getWebdriverStatus();
            const webglFingerprint = getWebGLFingerprint();
            const canvasFingerprint = getCanvasFingerprint();
            const cookiesEnabled = getCookieStatus();
            const fontFingerprint = getFontFingerprint();
            const audioFingerprint = await getWebAudioFingerprint();
            const batteryStatus = await getBatteryStatus();
            const hardwareConcurrency = getHardwareConcurrency();
            const inputDevices = getInputDevices();
            const screenResolution = getScreenResolution();
            
            // Ocultar spinner y mensaje de espera
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('status-message').style.display = 'none';

            // Lógica de validación
            let isSuccess = true;
            const failedChecks = [];
            
            const messageTitle = document.getElementById('main-title');
            const lockContainer = document.getElementById('lock-result');
            const finalMessage = document.getElementById('final-message');
            
            // Definir las comprobaciones aquí
            if (webdriverStatus === false) { isSuccess = false; failedChecks.push('Webdriver'); }
            if (webglFingerprint === 'n/a' || !webglFingerprint) { isSuccess = false; failedChecks.push('WebGL'); }
            if (canvasFingerprint === 'n/a' || !canvasFingerprint) { isSuccess = false; failedChecks.push('Canvas'); }
            if (cookiesEnabled === 'false') { isSuccess = false; failedChecks.push('Cookies'); }
            if (fontFingerprint === 'n/a' || !fontFingerprint) { isSuccess = false; failedChecks.push('Fuentes'); }
            if (audioFingerprint === 'n/a' || !audioFingerprint) { isSuccess = false; failedChecks.push('Audio API'); }
            if (hardwareConcurrency === 0) { isSuccess = false; failedChecks.push('Hardware'); }
            if (inputDevices === 'touch:false,mouse:false') { isSuccess = false; failedChecks.push('Dispositivos de Entrada'); }
            if (screenResolution === 'n/a' || screenResolution === '0x0-0x0') { isSuccess = false; failedChecks.push('Resolución de Pantalla'); }

            if (isSuccess) {
                messageTitle.textContent = 'Acceso Concedido';
                finalMessage.innerHTML = 'Tu navegador ha pasado todas las comprobaciones de seguridad.';
                document.body.classList.add('success-container');
                lockContainer.classList.add('open-lock');
            } else {
                messageTitle.textContent = 'Acceso Denegado';
                finalMessage.innerHTML = `Fallo en la verificación de seguridad. No se pudo validar tu navegador. Razón: ${failedChecks.join(', ')}`;
                document.body.classList.add('fail-container');
                lockContainer.classList.add('closed-lock');
            }
        } else {
            // Si JavaScript está desactivado
            document.getElementById('status-message').textContent = 'JavaScript está deshabilitado. No se puede continuar.';
        }
    }

    // Asegurarse de que el DOM esté completamente cargado antes de ejecutar el script
    document.addEventListener('DOMContentLoaded', async () => {
        addStyles();
        addHtml();
        // Cargar el script de md5 dinámicamente
        const md5Script = document.createElement('script');
        md5Script.src = "https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js";
        md5Script.onload = async () => {
            await startVerification();
        };
        document.body.appendChild(md5Script);
    });
})();
