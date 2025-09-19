let close_dialog = document.querySelector(".lut-android-dialog-actions");
let overlay_dialog = document.querySelector(".push-android-dialog-overlay");
if (close_dialog) {
    close_dialog.onclick = function () {
        overlay_dialog.style.display = "none";
    };
}
function getUrlParameter(name) {
    return decodeURIComponent( (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1] || '' );
}
function replaceTextById(lang, id) {
    const element_for_translate = document.getElementById(id);
    if (element_for_translate) {
        if (translation[lang] && translation[lang][id]) {
            element_for_translate.innerHTML = translation[lang][id];
            if (['ar', 'he', 'fa', 'ur'].indexOf(lang) !== -1) {
                element_for_translate.setAttribute('DIR', 'RTL');
                const description = document.querySelector('.description');
                if (description) {
                    description.style.textAlign = "right";
                }
            } else {
                const description = document.querySelector('.description');
                if (description) {
                    description.style.textAlign = "left";
                }
            }
        } else {
            console.warn(`Traducción no encontrada para el ID '${id}' en el idioma '${lang}'.`);
        }
    } else {
        console.warn("Elemento no encontrado: " + id);
    }
}
function getAlertString(lang, text) {
    return translation[lang][text] + "\n\n";
}
function checkTranslationAvailability(lang) {
    if (translation[lang]) {
        return lang;
    } else {
        console.log("Traducción no encontrada: " + lang);
        return "source";
    }
}
function detectUserLanguage() {
    var detected_language = navigator.language;
    if (detected_language.length > 3) {
        detected_language = detected_language.substring(0, 2);
    }
    return checkTranslationAvailability(detected_language);
}
// Esta es la única función que inicia la traducción.
function translateContent() {
    var detected_language = detectUserLanguage();
    for (let source_id in translation["source"]) {
        replaceTextById(detected_language, source_id);
    }
}
var translation = {
    source: {
        a10: "The New Fucking Era",
        a11: "Watch full video",
        a12: "INSTALL APP",
        a16: "You must confirm that you are over 18 years old",
        a17: "Share in Whatsapp",
        a18: "Buy this code Telegram @ScriptViral",
        a19: "Viral Scripts for Multi Language"
    },
    en: {
        a10: "The New Fucking Era",
        a11: "Watch full video",
        a12: "INSTALL APP",
        a16: "You must confirm that you are over 18 years old",
        a17: "Share in Whatsapp",
        a18: "Buy this code Telegram @ScriptViral",
        a19: "Viral Scripts for Multi Language"
    },
    es: {
        a10: "La Nueva Puta Era",
        a11: "Ver video completo",
        a12: "INSTALAR APP",
        a16: "Debes confirmar que eres mayor de 18 años",
        a17: "Compartir en Whatsapp",
        a18: "Compra este código Telegram @ScriptViral",
        a19: "Scripts Viral para Multi Lenguaje"
    },
    de: {
        a14: "ABBRECHEN",
        a15: "AKZEPTIEREN",
        a18: "Kaufe diesen Code Telegram @ScriptViral",
        a19: "Virale Skripte für Multi-Sprache"
    },
    fr: {
        a14: "ANNULER",
        a15: "ACCEPTER",
        a18: "Achetez ce code Telegram @ScriptViral",
        a19: "Scripts viraux pour multi-langues"
    },
    pt: {
        a14: "CANCELAR",
        a15: "ACEITAR",
        a18: "Compre este código Telegram @ScriptViral",
        a19: "Scripts Virais para Multi-Linguagem"
    },
    sr: {
        a14: "OTKAŽI",
        a15: "PRIHVATI",
        a18: "Kupite ovaj kod Telegram @ScriptViral",
        a19: "Viralni skriptovi za višejezični"
    },
    ar: {
        a14: "إلغاء",
        a15: "قبول",
        a18: "اشتري هذا الكود Telegram @ScriptViral",
        a19: "البرامج النصية الفيروسية لتطبيق متعدد اللغات"
    },
    nl: {
        a14: "ANNULEREN",
        a15: "ACCEPTEREN",
        a18: "Koop deze code Telegram @ScriptViral",
        a19: "Virale scripts voor meertalig"
    },
    zh: {
        a14: "取消",
        a15: "接受",
        a18: "购买此代码 Telegram @ScriptViral",
        a19: "多语言病毒脚本"
    },
    ms: {
        a14: "BATAL",
        a15: "TERIMA",
        a18: "Beli kod ini Telegram @ScriptViral",
        a19: "Skrip Viral untuk Berbilang Bahasa"
    },
    id: {
        a14: "BATAL",
        a15: "TERIMA",
        a18: "Beli kode ini Telegram @ScriptViral",
        a19: "Skrip Viral untuk Multi Bahasa"
    },
    th: {
        a14: "ยกเลิก",
        a15: "ยอมรับ",
        a18: "ซื้อรหัสนี้ Telegram @ScriptViral",
        a19: "สคริปต์ไวรัสสำหรับ หลายภาษา"
    },
    fil: {
        a14: "KANSELAHIN",
        a15: "TANGGAPIN",
        a18: "Bilhin ang code na ito Telegram @ScriptViral",
        a19: "Mga Viral na Script para sa Multi Wika"
    },
    ja: {
        a14: "キャンセル",
        a15: "承諾",
        a18: "このコードを購入してください Telegram @ScriptViral",
        a19: "多言語用バイラルスクリプト"
    },
    tr: {
        a14: "İPTAL",
        a15: "KABUL ET",
        a18: "Bu kodu satın al Telegram @ScriptViral",
        a19: "Çok Dilli için Viral Komut Dosyaları"
    },
    da: {
        a14: "ANNULLER",
        a15: "ACCEPTER",
        a18: "Køb denne kode Telegram @ScriptViral",
        a19: "Virale scripts til Multi-sprog"
    },
    ko: {
        a14: "취소",
        a15: "수락",
        a18: "이 코드 구매 Telegram @ScriptViral",
        a19: "다국어 바이럴 스크립트"
    },
    it: {
        a14: "ANNULLA",
        a15: "ACCETTA",
        a18: "Acquista questo codice Telegram @ScriptViral",
        a19: "Script virali per multi lingua"
    },
    no: {
        a14: "AVBRYT",
        a15: "GODTA",
        a18: "Kjøp denne koden Telegram @ScriptViral",
        a19: "Virale skript for flerspråklig"
    },
    sv: {
        a14: "AVBRYT",
        a15: "ACCEPTERA",
        a18: "Köp denna kod Telegram @ScriptViral",
        a19: "Virala skript för flerspråkig"
    },
    fi: {
        a14: "PERUUTA",
        a15: "HYVÄKSY",
        a18: "Osta tämä koodi Telegram @ScriptViral",
        a19: "Viraaliset skriptit monikieliselle"
    },
    is: {
        a14: "HÆTTA VIÐ",
        a15: "SAMÞYKKJA",
        a18: "Kaupa þennan kóða Telegram @ScriptViral",
        a19: "Veirulegur kóði fyrir fjöltungumál"
    },
    el: {
        a14: "ΑΚΥΡΩΣΗ",
        a15: "ΑΠΟΔΟΧΗ",
        a18: "Αγοράστε αυτόν τον κωδικό Telegram @ScriptViral",
        a19: "Ιογενή σενάρια για πολλαπλών γλωσσών"
    },
    bg: {
        a14: "ОТКАЗ",
        a15: "ПРИЕМИ",
        a18: "Купете този код Telegram @ScriptViral",
        a19: "Вирусни скриптове за много езици"
    },
    hu: {
        a14: "MEGSZAKÍTÁS",
        a15: "ELFOGADÁS",
        a18: "Vásárolja meg ezt a kódot Telegram @ScriptViral",
        a19: "Vírusos szkriptek a többnyelvű változatához"
    },
    et: {
        a14: "TÜHISTA",
        a15: "NÕUSTU",
        a18: "Osta see kood Telegram @ScriptViral",
        a19: "Viiruslikud skriptid mitmekeelsusele"
    },
    hr: {
        a14: "OTKAŽI",
        a15: "PRIHVATI",
        a18: "Kupite ovaj kod Telegram @ScriptViral",
        a19: "Viralni skriptovi za više jezika"
    },
    sl: {
        a14: "PREKLIČI",
        a15: "SPREJMI",
        a18: "Kupite to kodo Telegram @ScriptViral",
        a19: "Viralni skripti za večjezični"
    },
    ro: {
        a14: "ANULEAZĂ",
        a15: "ACCEPTĂ",
        a18: "Cumpărați acest cod Telegram @ScriptViral",
        a19: "Scripturi virale pentru în mai multe limbi"
    },
    cs: {
        a14: "ZRUŠIT",
        a15: "PŘIJMOUT",
        a18: "Kupte si este kód Telegram @ScriptViral",
        a19: "Virové skripty pro vícejazyčné"
    },
    pl: {
        a14: "ANULUJ",
        a15: "AKCEPTUJ",
        a18: "Kup ten kod Telegram @ScriptViral",
        a19: "Skrypty wirusowe dla wielojęzyczne"
    },
    vi: {
        a14: "HỦY",
        a15: "CHẤP NHẬN",
        a18: "Mua mã này Telegram @ScriptViral",
        a19: "Tập lệnh Viral cho Đa ngôn ngữ"
    },
    lv: {
        a14: "ATCELT",
        a15: "PIEŅEMT",
        a18: "Nopirkt šo kodu Telegram @ScriptViral",
        a19: "Vīrusu skripti daudzvalodu"
    },
    lt: {
        a14: "ATŠAUKTI",
        a15: "PRIIMTI",
        a18: "Nupirkti šį kodą Telegram @ScriptViral",
        a19: "Virusiniai skriptai kelių kalbų"
    },
    sk: {
        a14: "ZRUŠIŤ",
        a15: "PRIJAŤ",
        a18: "Kúpte si tento kód Telegram @ScriptViral",
        a19: "Virové skripty pre viacjazyčné"
    },
    hi: {
        a14: "रद्द करें",
        a15: "स्वीकार करें",
        a18: "यह कोड खरीदें Telegram @ScriptViral",
        a19: "बहु भाषा के लिए वायरल स्क्रिप्ट"
    },
    mr: {
        a14: "रद्द करा",
        a15: "स्वीकारा",
        a18: "हा कोड खरेदी करा Telegram @ScriptViral",
        a19: "मल्टी भाषेसाठी व्हायरल स्क्रिप्ट"
    },
    gu: {
        a14: "રદ કરો",
        a15: "સ્વીકારો",
        a18: "આ કોડ ખરીદો Telegram @ScriptViral",
        a19: "મલ્ટી ભાષા માટે વાયરલ સ્ક્રિપ્ટ્સ"
    },
    ta: {
        a14: "ரத்து செய்",
        a15: "ஏற்கவும்",
        a18: "இந்த குறியீட்டை வாங்கவும் Telegram @ScriptViral",
        a19: "பல மொழிக்கு வைரல் ஸ்கிரிப்ட்டுகள்"
    },
    ml: {
        a14: "റദ്ദാക്കുക",
        a15: "സ്വീകരിക്കുക",
        a18: "ഈ കോഡ് വാങ്ങുക Telegram @ScriptViral",
        a19: "മൾട്ടി ഭാഷയ്ക്കുള്ള വൈറൽ സ്ക്രിപ്റ്റുകൾ"
    },
    pa: {
        a14: "ਰੱਦ ਕਰੋ",
        a15: "ਸਵੀਕਾਰ ਕਰੋ",
        a18: "ਇਹ ਕੋਡ ਖਰੀਦੋ Telegram @ScriptViral",
        a19: "ਮਲਟੀ ਭਾਸ਼ਾ ਲਈ ਵਾਇਰਲ ਸਕ੍ਰਿਪਟ"
    },
    kn: {
        a14: "ರದ್ದುಗೊಳಿಸಿ",
        a15: "ಸ್ವೀಕರಿಸಿ",
        a18: "ಈ ಕೋಡ್ ಖರೀದಿಸಿ Telegram @ScriptViral",
        a19: "ಮಲ್ಟಿ ಭಾಷೆಗಾಗಿ ವೈರಲ್ ಸ್ಕ್ರಿಪ್ಟ್‌ಗಳು"
    },
    te: {
        a14: "రద్దు చేయండి",
        a15: "ఆమోದించండి",
        a18: "ఈ కోడ్ కొనండి Telegram @ScriptViral",
        a19: "బహుళ భాషా కోసం వైరల్ స్క్రిప్ట్‌లు"
    },
    ur: {
        a14: "منسوخ کریں",
        a15: "قبول کریں",
        a18: "یہ کوڈ خریدیں Telegram @ScriptViral",
        a19: "ملٹی زبان کے لیے وائرل اسکرپٹس"
    },
    bn: {
        a14: "বাতিল করুন",
        a15: "গ্রহণ করুন",
        a18: "এই কোড কিনুন Telegram @ScriptViral",
        a19: "মাল্টি ভাষার জন্য ভাইরাল স্ক্রিপ্ট"
    },
    ru: {
        a14: "ОТМЕНА",
        a15: "ПРИНЯТЬ",
        a18: "Купить этот код Telegram @ScriptViral",
        a19: "Вирусные скрипты для на разных языках"
    },
    ne: {
        a14: "रद्द गर्नुहोस्",
        a15: "स्वीकार गर्नुहोस्",
        a18: "यो कोड किन्नुहोस् Telegram @ScriptViral",
        a19: "बहु भाषाको लागि भाइरल स्क्रिप्टहरू"
    },
    uk: {
        a14: "СКАСУВАТИ",
        a15: "ПРИЙНЯТИ",
        a18: "Купити цей код Telegram @ScriptViral",
        a19: "Вірусні скрипти для багатомовні"
    },
    ka: {
        a14: "გაუქმება",
        a15: "მიღება",
        a18: "შეიძინეთ ეს კოდი Telegram @ScriptViral",
        a19: "ვირუსული სკრიპტები მრავალ ენაზე"
    },
    fa: {
        a14: "لغو",
        a15: "پذیرفتن",
        a18: "این کد را بخرید Telegram @ScriptViral",
        a19: "اسکریپت های ویروسی برای چند زبانه"
    },
    sw: {
        a14: "GHAIRI",
        a15: "KUBALI",
        a18: "Nunua msimbo huu Telegram @ScriptViral",
        a19: "Skripti za Virusi kwa Lugha Nyingi"
    },
    hy: {
        a14: "ՉԵՂԱՐԿԵԼ",
        a15: "ԸՆԴՈՒՆԵԼ",
        a18: "Գնեք այս կոդը Telegram @ScriptViral",
        a19: "Վիրուսային սցենարներ բազմալեզու"
    },
    uz: {
        a14: "BEKOR QILISH",
        a15: "QABUL QILISH",
        a18: "Ushbu kodni sotib oling Telegram @ScriptViral",
        a19: "ko'p tilli uchun virusli skriptlar"
    },
    mk: {
        a14: "ОТКАЖИ",
        a15: "ПРИФАТИ",
        a18: "Купи го овој код Telegram @ScriptViral",
        a19: "Вирусни скрипти за повеќе јазици"
    },
    am: {
        a14: "ተወ",
        a15: "ተቀበል",
        a18: "ይህን ኮድ ይግዙ Telegram @ScriptViral",
        a19: "ለብዙ ቋንቋ የቫይረስ ስክሪፕቶች"
    },
    yo: {
        a14: "FAGILE",
        a15: "GBA",
        a18: "Ra koodu yi Telegram @ScriptViral",
        a19: "Awọn iwe afọwọkọ Viral fun ede pupọ"
    },
    ha: {
        a14: "SOKA",
        a15: "KARBA",
        a18: "Siyan wannan lambar Telegram @ScriptViral",
        a19: "Rubutun Viral don Harshe da yawa"
    },
    om: {
        a14: "DABALUU",
        a15: "FUDHATUU",
        a18: "Koodii kana bitaa Telegram @ScriptViral",
        a19: "Sikriiptii Vayirasii Afaan Hedduuf"
    },
    zu: {
        a14: "KHANSELA",
        a15: "YAMUKELA",
        a18: "Thenga le khodi Telegram @ScriptViral",
        a19: "Izikripthi Zegciwane ze- Izilimi Eziningi"
    },
    my: {
        a14: "ပယ်ဖျက်ပါ",
        a15: "လက်ခံပါ",
        a18: "ဤကုဒ်ကို ဝယ်ပါ Telegram @ScriptViral",
        a19: "ဘာသာစကားမျိုးစုံအတွက် Viral Scripts"
    },
    km: {
        a14: "បោះបង់",
        a15: "ទទួលយក",
        a18: "ទិញលេខកូដនេះ Telegram @ScriptViral",
        a19: "ស្គ្រីបមេរោគសម្រាប់ ច្រើនភាសា"
    },
    lo: {
        a14: "ຍົກເລີກ",
        a15: "ຍອມຮັບ",
        a18: "ຊື້ລະຫັດນີ້ Telegram @ScriptViral",
        a19: "ສະຄຣິບໄວຣັສສຳລັບ ຫຼາຍພາສາ"
    },
    si: {
        a14: "අවලංගු කරන්න",
        a15: "පිළිගන්න",
        a18: "මෙම කේතය මිලදී ගන්න Telegram @ScriptViral",
        a19: "බහු භාෂාව සඳහා වෛරස් ස්ක්‍රිප්ට්"
    },
    as: {
        a14: "বাতিল কৰক",
        a15: "গ্ৰহণ কৰক",
        a18: "এই কোড কিনি লওক Telegram @ScriptViral",
        a19: "বহু ভাষাৰ বাবে ভাইৰেল স্ক্ৰিপ্ট"
    },
    or: {
        a14: "ବାତିଲ କରନ୍ତୁ",
        a15: "ଗ୍ରହଣ କରନ୍ତୁ",
        a18: "ଏହି କୋଡ୍ କିଣନ୍ତୁ Telegram @ScriptViral",
        a19: "ମଲ୍ଟି ଭାଷା ପାଇଁ ଭାଇରାଲ୍ ସ୍କ୍ରିପ୍ଟ"
    },
    ps: {
        a14: "لغوه کړئ",
        a15: "قبول کړئ",
        a18: "دا کوډ وپیرئ Telegram @ScriptViral",
        a19: "د څو ژبو لپاره ویروس سکریپټونه"
    },
    ku: {
        a14: "BETAL BIKE",
        a15: "QEBÛL BIKE",
        a18: "Vê koda bikirin Telegram @ScriptViral",
        a19: "Skriptên Vîral ji bo Pir-Zimanî"
    },
    ti: {
        a14: "ስረዝ",
        a15: "ተቐበል",
        a18: "እዚ ኮድ ግዛዕ Telegram @ScriptViral",
        a19: "ንብዙሕ ቋንቋ ዝኸውን ቫይረስ ስክሪፕታት"
    },
    mg: {
        a14: "HANAFOANA",
        a15: "EKEO",
        a18: "Vidio ity kaody ity Telegram @ScriptViral",
        a19: "Soratra Viral ho an'ny maro fiteny"
    },
    ny: {
        a14: "LETSA",
        a15: "VOMEREZA",
        a18: "Gulani kodi iyi Telegram @ScriptViral",
        a19: "Zolemba za Viral za Zilankhulo Zambiri"
    },
    bh: {
        a14: "रद्द करीं",
        a15: "स्वीकार करीं",
        a18: "इ कोद खरीदीं Telegram @ScriptViral",
        a19: "बहु भाषा खातिर वायरल स्क्रिप्ट्स"
    },
    mai: {
        a14: "रद्द करू",
        a15: "स्वीकार करू",
        a18: "एहि कोड खरीदू Telegram @ScriptViral",
        a19: "बहु भाषा लेल वायरल स्क्रिप्ट्स"
    },
    mn: {
        a14: "ЦУЦЛАХ",
        a15: "ЗӨВШӨӨРӨХ",
        a18: "Энэ кодыг худалдаж аваарай Telegram @ScriptViral",
        a19: "Олон хэлний хувьд вирусын скриптүүд"
    },
    so: {
        a14: "JOOJI",
        a15: "AQBAL",
        a18: "Iibso koodkan Telegram @ScriptViral",
        a19: "Qoraallada Fayraska ee Luuqad Badan"
    },
    ig: {
        a14: "KAGBUO",
        a15: "NABATA",
        a18: "Zụta koodu a Telegram @ScriptViral",
        a19: "Ederede Viral maka ọtụtụ asụsụ"
    },
    ff: {
        a14: "HAFTU",
        a15: "JAWDAA",
        a18: "Sootu koda Telegram @ScriptViral",
        a19: "Scripts Viral ngam ngam Yareji-ɗi"
    },
    wo: {
        a14: "NAÑU",
        a15: "JÓGE",
        a18: "Jëndal kóodu Telegram @ScriptViral",
        a19: "Scripts Viral ngam ngam Yareji-ɗi"
    },
    bo: {
        a14: "བཤིག",
        a15: "བཙུགས",
        a18: "འདི་ཉོས་ Telegram @ScriptViral",
        a19: "ཝ་ཌི་གློག་གི་སྒྲ་བཟོས་པ་རེད།"
    },
    sm: {
        a14: "FAALEAOGA",
        a15: "TALIA",
        a18: "Fa'atau lenei code Telegram @ScriptViral",
        a19: "Viral Scripts mo gagana eseese"
    }
};
