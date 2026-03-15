/**
 * KisaanMitra - Main Application Logic
 * FIXES: Permission prompts, offline prices/calendar, better dashboard, mic toggle.
 */
window.currentLanguage = 'hi';
let currentSpeechCode = 'hi-IN';
let currentFeature = 'ask';
let userLocation = null;
const $ = id => document.getElementById(id);

/* ============ LOCAL PRICE DATA (works offline!) ============ */
const LOCAL_PRICES = {
    hi: [
        { name: 'टमाटर', emoji: '🍅', price: 2800, unit: 'क्विंटल', trend: 'rising' },
        { name: 'प्याज', emoji: '🧅', price: 1500, unit: 'क्विंटल', trend: 'stable' },
        { name: 'आलू', emoji: '🥔', price: 1200, unit: 'क्विंटल', trend: 'falling' },
        { name: 'गेहूँ', emoji: '🌾', price: 2275, unit: 'क्विंटल', trend: 'stable' },
        { name: 'धान (चावल)', emoji: '🍚', price: 2183, unit: 'क्विंटल', trend: 'rising' },
        { name: 'सोयाबीन', emoji: '🫘', price: 4600, unit: 'क्विंटल', trend: 'falling' },
        { name: 'कपास', emoji: '☁️', price: 6620, unit: 'क्विंटल', trend: 'stable' },
        { name: 'मक्का', emoji: '🌽', price: 2090, unit: 'क्विंटल', trend: 'rising' }
    ],
    en: [
        { name: 'Tomato', emoji: '🍅', price: 2800, unit: 'Quintal', trend: 'rising' },
        { name: 'Onion', emoji: '🧅', price: 1500, unit: 'Quintal', trend: 'stable' },
        { name: 'Potato', emoji: '🥔', price: 1200, unit: 'Quintal', trend: 'falling' },
        { name: 'Wheat', emoji: '🌾', price: 2275, unit: 'Quintal', trend: 'stable' },
        { name: 'Rice (Paddy)', emoji: '🍚', price: 2183, unit: 'Quintal', trend: 'rising' },
        { name: 'Soybean', emoji: '🫘', price: 4600, unit: 'Quintal', trend: 'falling' },
        { name: 'Cotton', emoji: '☁️', price: 6620, unit: 'Quintal', trend: 'stable' },
        { name: 'Maize', emoji: '🌽', price: 2090, unit: 'Quintal', trend: 'rising' }
    ],
    kn: [
        { name: 'ಟೊಮೆಟೊ', emoji: '🍅', price: 2800, unit: 'ಕ್ವಿಂಟಲ್', trend: 'rising' },
        { name: 'ಈರುಳ್ಳಿ', emoji: '🧅', price: 1500, unit: 'ಕ್ವಿಂಟಲ್', trend: 'stable' },
        { name: 'ಆಲೂಗಡ್ಡೆ', emoji: '🥔', price: 1200, unit: 'ಕ್ವಿಂಟಲ್', trend: 'falling' },
        { name: 'ಗೋಧಿ', emoji: '🌾', price: 2275, unit: 'ಕ್ವಿಂಟಲ್', trend: 'stable' },
        { name: 'ಭತ್ತ', emoji: '🍚', price: 2183, unit: 'ಕ್ವಿಂಟಲ್', trend: 'rising' },
        { name: 'ಸೋಯಾಬೀನ್', emoji: '🫘', price: 4600, unit: 'ಕ್ವಿಂಟಲ್', trend: 'falling' },
        { name: 'ಹತ್ತಿ', emoji: '☁️', price: 6620, unit: 'ಕ್ವಿಂಟಲ್', trend: 'stable' },
        { name: 'ಮೆಕ್ಕೆ ಜೋಳ', emoji: '🌽', price: 2090, unit: 'ಕ್ವಿಂಟಲ್', trend: 'rising' }
    ],
    te: [
        { name: 'టమాటా', emoji: '🍅', price: 2800, unit: 'క్వింటాల్', trend: 'rising' },
        { name: 'ఉల్లిపాయ', emoji: '🧅', price: 1500, unit: 'క్వింటాల్', trend: 'stable' },
        { name: 'బంగాళదుంప', emoji: '🥔', price: 1200, unit: 'క్వింటాల్', trend: 'falling' },
        { name: 'గోధుమ', emoji: '🌾', price: 2275, unit: 'క్వింటాల్', trend: 'stable' },
        { name: 'వరి', emoji: '🍚', price: 2183, unit: 'క్వింటాల్', trend: 'rising' },
        { name: 'సోయాబీన్', emoji: '🫘', price: 4600, unit: 'క్వింటాల్', trend: 'falling' },
        { name: 'పత్తి', emoji: '☁️', price: 6620, unit: 'క్వింటాల్', trend: 'stable' },
        { name: 'మొక్కజొన్న', emoji: '🌽', price: 2090, unit: 'క్వింటాల్', trend: 'rising' }
    ],
    ta: [
        { name: 'தக்காளி', emoji: '🍅', price: 2800, unit: 'குவிண்டால்', trend: 'rising' },
        { name: 'வெங்காயம்', emoji: '🧅', price: 1500, unit: 'குவிண்டால்', trend: 'stable' },
        { name: 'உருளைக்கிழங்கு', emoji: '🥔', price: 1200, unit: 'குவிண்டால்', trend: 'falling' },
        { name: 'கோதுமை', emoji: '🌾', price: 2275, unit: 'குவிண்டால்', trend: 'stable' },
        { name: 'நெல்', emoji: '🍚', price: 2183, unit: 'குவிண்டால்', trend: 'rising' },
        { name: 'சோயாபீன்', emoji: '🫘', price: 4600, unit: 'குவிண்டால்', trend: 'falling' },
        { name: 'பருத்தி', emoji: '☁️', price: 6620, unit: 'குவிண்டால்', trend: 'stable' },
        { name: 'மக்காச்சோளம்', emoji: '🌽', price: 2090, unit: 'குவிண்டால்', trend: 'rising' }
    ]
};

/* ============ OFFLINE FAQ DATABASE ============ */
const OFFLINE_FAQ = {
    hi: [
        { q: ['कीड़े', 'कीट', 'पतंग', 'तेल', 'कीड़ा', 'हानि'], a: 'कीड़ों के लिए: 1) नीम तेल 5ml/लीटर पानी में छिड़कें। 2) पीले चिपचिपे जाल लगाएं। 3) कैल्सियम नाइट्रेट का छिड़काव करें।', type: 'disease', steps: ['नीम तेल का घोल बनाएं', 'शाम को छिड़कें', '3 दिन बाद दोहराएं'] },
        { q: ['पत्ते', 'पीले', 'पीलापन', 'पत्ता'], a: 'पत्तों का पीलापन: 1) आयरन सल्फेट 5 ग्राम/लीटर। 2) नाइट्रोजन खाद दें। 3) सिंचाई सुधारें।', type: 'disease', steps: ['जांच करें कि नाइट्रोजन कम है', 'यूरिया 20 किग्रा/एकड़', 'सिंचाई नियमित करें'] },
        { q: ['बुवाई', 'बीज', 'कब बोना', 'कब', 'बोना', 'बुवाई'], a: 'खरीफ बुवाई: जून-जुलाई में बारिश के बाद बोएं। रबी: अक्टूबर-नवंबर में बोएं।', type: 'crop_planning', steps: ['मौसम देखें', 'भूमि तैयार करें', 'सही समय पर बोएं'] },
        { q: ['सिंचाई', 'पानी', 'कितना', 'पानी देना'], a: 'सिंचाई: सुबह या शाम में करें। गर्मी में 3-4 दिन के अंतराल पर।', type: 'general', steps: ['सुबह सिंचाई करें', 'छिड़काव न करें', 'जल निकासी सुधारें'] },
        { q: ['खाद', 'उर्वरक', 'यूरिया', 'डीएपी', 'खाद देना'], a: 'खाद: गोबर की खाद 10-15 टन/हेक्टेयर। रसायनिक: यूरिया 120 किग्रा/हेक्टेयर।', type: 'general', steps: ['मिट्टी जांच करें', 'सही मात्रा में दें', 'बुवाई से पहले मिलाएं'] },
        { q: ['मौसम', 'बारिश', 'मॉनसून', 'वर्षा'], a: 'बारिश की संभावना है। फसल के लिए अच्छा है लेकिन सिंचाई रोकें।', type: 'weather', steps: ['बारिश का इंतजार करें', 'जल निकासी सुधारें', 'कीटनाशक छिड़काव टालें'] },
        { q: ['भाव', 'दाम', 'कीमत', 'मंडी', 'मूल्य', 'भाव क्या'], a: 'आज के भाव: टमाटर ₹2800/क्विंटल, प्याज ₹1500, आलू ₹1200, गेहूँ ₹2275। (ये औसत भाव हैं - आपकी मंडी में अलग हो सकते हैं। नियमित जांचें!)', type: 'price', steps: ['भाव नियमित देखें', 'सही समय पर बेचें', 'MSP जानें'] },
        { q: ['कोलार', 'बेंगलुरु', 'मैसूर', 'हुबली', 'दावणगेरे', 'कर्नाटक'], a: 'कर्नाटक में आज के भाव: टमाटर ₹2800/क्विंटल, प्याज ₹1500, आलू ₹1200। मंडी भाव जांचने के लिए "भाव" बटन दबाएं।', type: 'price', steps: ['भाव बटन दबाएं', 'अपनी मंडी चुनें', 'नियमित देखें'] },
        { q: ['टमाटर', 'tomato', 'tamatar'], a: 'टमाटर: कीड़ों के लिए नीम तेल छिड़कें। भाव: ₹2800/क्विंटल। बुवाई: अक्टूबर-नवंबर।', type: 'general', steps: ['नीम तेल छिड़कें', 'भाव देखें', 'सिंचाई नियमित करें'] },
        { q: ['धान', 'चावल', 'rice', 'dhan'], a: 'धान: खरीफ फसल, जून-जुलाई में बुवाई। MSP: ₹2183/क्विंटल।', type: 'general', steps: ['जून-जुलाई बोएं', 'MSP जानें', 'सिंचाई करें'] },
        { q: ['गेहूं', 'wheat', 'gehun'], a: 'गेहूं: रबी फसल, अक्टूबर-नवंबर में बुवाई। MSP: ₹2275/क्विंटल।', type: 'general', steps: ['अक्टूबर में बोएं', 'सिंचाई करें', 'एप्रिल में कटाई'] },
        { q: ['प्याज', 'onion', 'pyaj'], a: 'प्याज: रबी फसल, नवंबर-दिसंबर में बुवाई। भाव: ₹1500/क्विंटल।', type: 'general', steps: ['नवंबर में बोएं', 'सिंचाई नियमित', 'अप्रैल-मई कटाई'] },
        { q: ['आलू', 'potato', 'aloo'], a: 'आलू: तीन मौसम में उगाया जा सकता है। भाव: ₹1200/क्विंटल।', type: 'general', steps: ['बीज आलू लगाएं', 'सिंचाई नियमित', '90-120 दिन में कटाई'] },
        { q: ['मक्का', 'maize', 'makka'], a: 'मक्का: खरीफ फसल, जून-जुलाई में बुवाई। MSP: ₹2090/क्विंटल।', type: 'general', steps: ['जून-जुलाई बोएं', 'सिंचाई करें', 'सितंबर-अक्टूबर कटाई'] },
        { q: ['सोयाबीन', 'soybean', 'soyabean'], a: 'सोयाबीन: खरीफ फसल, जून-जुलाई में बुवाई। MSP: ₹4600/क्विंटल।', type: 'general', steps: ['जून में बोएं', 'नीम तेल छिड़कें', 'अक्टूबर में कटाई'] },
        { q: ['कपास', 'cotton', 'kapas'], a: 'कपास: खरीफ फसल, मई-जून में बुवाई। MSP: ₹6620/क्विंटल।', type: 'general', steps: ['मई-जून बोएं', 'कीटों से बचाएं', 'नवंबर-जनवरी कटाई'] },
        { q: ['dap', 'डीएपी', 'npk'], a: 'DAP (डाई अमोनियम फॉस्फेट): प्रति हेक्टेयर 100-120 किग्रा। नाइट्रोजन और फास्फोरस दोनों मिलता है।', type: 'general', steps: ['बुवाई से पहले डालें', 'मिट्टी में मिलाएं', 'सही मात्रा का इस्तेमाल करें'] },
        { q: ['नीम', 'neem', 'neem oil'], a: 'नीम तेल: कीड़ों से बचाव के लिए 5ml/लीटर पानी में मिलाएं। शाम को छिड़कें।', type: 'disease', steps: ['नीम तेल लें', 'पानी में मिलाएं', 'शाम को छिड़कें'] },
        { q: ['कैल्शियम', 'calcium', 'chuna'], a: 'कैल्शियम के लिए: चूना (चूना) 100-150 किग्रा/हेक्टेयर। फलों की गुणवत्ता बढ़ता है।', type: 'disease', steps: ['मिट्टी जांच करें', 'चूना डालें', '15 दिन बाद फसल लगाएं'] }
    ],
    en: [
        { q: ['pest', 'insect', 'bug', 'worm', 'attack'], a: 'For pests: Spray neem oil 5ml/liter water. Use yellow sticky traps. Apply calcium nitrate.', type: 'disease', steps: ['Make neem solution', 'Spray in evening', 'Repeat after 3 days'] },
        { q: ['yellow', 'leaves', 'pale', 'yellowing'], a: 'Leaf yellowing: Apply iron sulfate 5gm/liter. Add nitrogen fertilizer. Improve irrigation.', type: 'disease', steps: ['Check nitrogen deficiency', 'Apply urea 20kg/acre', 'Regular watering'] },
        { q: ['sowing', 'when to plant', 'season', 'plant'], a: 'Kharif sowing: June-July after monsoon. Rabi: October-November.', type: 'crop_planning', steps: ['Check weather', 'Prepare field', 'Plant at right time'] },
        { q: ['water', 'irrigation', 'how much', 'watering'], a: 'Irrigation: Water in morning or evening. In summer every 3-4 days. Stop during rain.', type: 'general', steps: ['Water in morning', 'Avoid sprinkling', 'Improve drainage'] },
        { q: ['fertilizer', 'manure', 'urea', 'dap', 'npk'], a: 'Fertilizer: Farmyard manure 10-15 tons/hectare. Chemical: Urea 120kg/hectare.', type: 'general', steps: ['Test soil', 'Apply correct amount', 'Mix before sowing'] },
        { q: ['weather', 'rain', 'monsoon', 'forecast'], a: 'Rain expected. Good for crops but stop irrigation. Avoid pesticide spraying.', type: 'weather', steps: ['Wait for rain', 'Improve drainage', 'Delay pesticide'] },
        { q: ['price', 'rate', 'cost', 'mandi', 'market', 'tomato', 'onion', 'potato', 'wheat'], a: "Today's prices: Tomato ₹2800/quintal, Onion ₹1500, Potato ₹1200, Wheat ₹2275. (These are average rates - your local mandi may differ. Check regularly!)", type: 'price', steps: ['Check prices regularly', 'Sell at right time', 'Know your MSP'] },
        { q: ['kolar', 'bangalore', 'mysore', 'hassan', 'hubli', 'dharwad', 'karnataka'], a: 'Karnataka prices today: Tomato ₹2800/qtl, Onion ₹1500, Potato ₹1200, Wheat ₹2275. Tap "Prices" button for your mandi rates!', type: 'price', steps: ['Tap Prices button', 'Select your mandi', 'Check regularly'] },
        { q: ['tomato', 'tamatar'], a: 'Tomato: For pests, spray neem oil. Price: ₹2800/quintal. Sowing: October-November.', type: 'general', steps: ['Spray neem oil', 'Check price', 'Regular irrigation'] },
        { q: ['wheat', 'gehun'], a: 'Wheat: Rabi crop, sow October-November. MSP: ₹2275/quintal.', type: 'general', steps: ['Sow in October', 'Irrigate regularly', 'Harvest in April'] },
        { q: ['onion', 'pyaj'], a: 'Onion: Rabi crop, sow November-December. Price: ₹1500/quintal.', type: 'general', steps: ['Sow in November', 'Regular irrigation', 'Harvest April-May'] },
        { q: ['potato', 'aloo'], a: 'Potato: Can be grown in 3 seasons. Price: ₹1200/quintal.', type: 'general', steps: ['Plant seed potatoes', 'Regular irrigation', 'Harvest in 90-120 days'] },
        { q: ['rice', 'paddy', 'dhan'], a: 'Rice/Paddy: Kharif crop, sow June-July. MSP: ₹2183/quintal.', type: 'general', steps: ['Sow in June-July', 'Keep water in field', 'Harvest Oct-Nov'] },
        { q: ['maize', 'makka', 'corn'], a: 'Maize: Kharif crop, sow June-July. MSP: ₹2090/quintal.', type: 'general', steps: ['Sow June-July', 'Irrigate regularly', 'Harvest Sep-Oct'] },
        { q: ['soybean', 'soyabean'], a: 'Soybean: Kharif crop, sow June-July. MSP: ₹4600/quintal.', type: 'general', steps: ['Sow in June', 'Spray neem oil', 'Harvest October'] },
        { q: ['cotton', 'kapas'], a: 'Cotton: Kharif crop, sow May-June. MSP: ₹6620/quintal.', type: 'general', steps: ['Sow May-June', 'Protect from pests', 'Harvest Nov-Jan'] },
        { q: ['neem', 'neem oil'], a: 'Neem oil: For pest control, mix 5ml/liter water. Spray in evening.', type: 'disease', steps: ['Take neem oil', 'Mix with water', 'Spray in evening'] },
        { q: ['calcium', 'lime', 'chuna'], a: 'Calcium: Apply lime 100-150kg/hectare. Improves fruit quality.', type: 'disease', steps: ['Test soil', 'Apply lime', 'Wait 15 days before planting'] }
    ],
    kn: [
        { q: ['keeti', 'huu', 'pattanga'], a: 'Keeti: Nimbe ennu 5ml/li. Haddu bele baas.', type: 'disease', steps: ['Nimbe drava', 'Sanje simpadi', '3 dina'] },
        { q: ['haddu', 'ele', 'koloru'], a: 'Ele haddu: Kabbina sulfath. Sarjanaka gobbara.', type: 'disease', steps: ['Sarjanaka korate', 'Urea', 'Nitya sinchane'] },
        { q: ['bitthane', 'beeju', 'yavaku'], a: 'Kharif bitthane: June-July. Rubi: October.', type: 'crop_planning', steps: ['Manasika', 'Bhumi siddha', 'Samaya'] },
        { q: ['neeru', 'sinchane', 'heggi'], a: 'Sinchane: Belage athava Sanje.', type: 'general', steps: ['Belage', 'Simpadabedi', 'Harivu'] },
        { q: ['gobbara', 'uravam', 'manure'], a: 'Gobbara: 10-15 ton. Urea 120kg.', type: 'general', steps: ['Mannu', 'Pramana', 'Mix'] },
        { q: ['manasika', 'male', 'varsha'], a: 'Male nireekshe. Bekku bagundi.', type: 'weather', steps: ['Male', 'Harivu', 'Keetinashaka'] },
        { q: ['bele', 'kivathu', 'dala', 'tomato', 'eerrulli', 'alugadde', 'gihi'], a: 'Bele: Tomato ₹2800, Eerulli ₹1500, Aloo ₹1200, Gohi ₹2275. (Idu mattu mandiyalli beku!)', type: 'price', steps: ['Bele noosi', 'Samaaya madalu Beku', 'MSP gyari'] },
        { q: ['kolar', 'bengaluru', 'mysuru', 'hassan', 'hubli', 'dharwad'], a: 'Karnataka bele: Tomato ₹2800, Eerulli ₹1500, Aloo ₹1200. "Bele" button y点击 cheyiri!', type: 'price', steps: ['Bele button click', 'Nodangi mathiri', 'Noosi'] },
        { q: ['tomato', 'tomato'], a: 'Tomato: Keeti ge nimbe ennu. Bele: ₹2800. Bitthane: Oct-Nov.', type: 'general', steps: ['Nimbe', 'Bele noosi', 'Sinchane'] }
    ],
    ta: [
        { q: ['katumai', 'poochi', 'pu'], a: 'Poochi: Veppu ennai 5ml/li. Manjal ottu pidippu.', type: 'disease', steps: ['Veppu', 'Malai', '3 naat'] },
        { q: ['manjal', 'ilai', 'pachai'], a: 'Ilai manjal: Irumbul salpaat. Naitrajan uram.', type: 'disease', steps: ['Naitrajan', 'Uriya', 'Neer'] },
        { q: ['vidai', 'natu', 'eppo'], a: 'Karif vidai: June-July. Rubi: October.', type: 'crop_planning', steps: ['Vanilai', 'Nilam', 'Neram'] },
        { q: ['neer', 'paaychal', 'than'], a: 'Paaychal: Kalavum allavu Malarum.', type: 'general', steps: ['Kalai', 'Thelithal', 'Vadikku'] },
        { q: ['uram', 'manjal', 'poo'], a: 'Uram: 10-15 ton. Uriya 120kg.', type: 'general', steps: ['Mann', 'Alavu', 'Kalakku'] },
        { q: ['vanam', 'malai', 'musam'], a: 'Malai varum. Paya-ruku nalladu.', type: 'weather', steps: ['Malai', 'Vadikku', 'Maruthu'] },
        { q: ['vilai', 'kool', 'kavuthal', 'takkali', 'venkaayam', 'urulaikilangu', 'poonachi'], a: 'Vilai: Tomato ₹2800, Venkaayam ₹1500, Urulaikilangu ₹1200, Poonachi ₹2275! (Idu muthal pol!)', type: 'price', steps: ['Vilai noa', 'Muthal pol', 'MSP oda'] },
        { q: ['coimbatore', 'madurai', 'chennai', 'salem', 'trichy'], a: 'Tamil Nadu vilai: Tomato ₹2800, Venkaayam ₹1500. "Vilai" button poi paaru!', type: 'price', steps: ['Vilai button', 'Mandhai select', 'Noa'] },
        { q: ['takkali', 'tomato'], a: 'Takkali: Poochi ku veppu. Vilai: ₹2800. Vidai: Oct-Nov.', type: 'general', steps: ['Veppu', 'Vilai', 'Neer'] }
    ],
    te: [
        { q: ['kru', 'parugu', 'pulu'], a: 'Kru: Nimm ellu 5ml/li. Gudi putti band.', type: 'disease', steps: ['Nimm', 'Sayam', '3 roju'] },
        { q: ['pasupu', 'akalu', 'pivu'], a: 'Akalu: Inna sulfat. Rajna bhyam.', type: 'disease', steps: ['Rajna', 'Urea', 'Neeru'] },
        { q: ['vithana', 'natu', 'ekkada'], a: 'Khareef: June-July. Rubi: October.', type: 'crop_planning', steps: ['Vathamu', 'Bhumi', 'Samay'] },
        { q: ['neeru', 'paaname', 'tagu'], a: 'Paaname: Roju or evening.', type: 'general', steps: ['Morning', 'Chippa ledu', 'Drainage'] },
        { q: ['phoolam', 'uravam', 'khura'], a: 'Phoolam: 10-15 tons. Urea 120kg.', type: 'general', steps: ['Bhoomi', 'Pramana', 'Mix'] },
        { q: ['vathamu', 'varsham', 'raatri'], a: 'Varsham ostundi. Paddyuku bagundi.', type: 'weather', steps: ['Varsham', 'Drainage', 'Kimthi'] },
        { q: ['dhara', 'koolu', 'kostam', 'tomato', 'ullipaya', 'bangladumpa', 'godhuma'], a: 'Dharalu: Tomato ₹2800, Ullipaya ₹1500, BangalaDumpa ₹1200, Godhuma ₹2275! (Ee dharalu mandiki varycabete ledu!)', type: 'price', steps: ['Dharalu choopu', 'Samayam lo ichchevu', 'MSP telusu'] },
        { q: ['hyderabad', 'warangal', 'karimnagar', 'khammam', 'nizamabad'], a: 'Telangana dharalu: Tomato ₹2800, Ullipaya ₹1500. "Dharalu" button click cheseyu!', type: 'price', steps: ['Dharalu click', 'Mandi select', 'Choopu'] },
        { q: ['tomato', 'tomato'], a: 'Tomato: Kru ki nimm ellu. Dharalu: ₹2800. Vithana: Oct-Nov.', type: 'general', steps: ['Nimm', 'Dharalu', 'Paaname'] }
    ]
};

/* ============ WEATHER CACHE ============ */
document.addEventListener('DOMContentLoaded', () => {
    SpeechEngine.init();

    // Language selection
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.currentLanguage = btn.dataset.lang;
            currentSpeechCode = btn.dataset.speech;
            $('current-lang-flag').textContent = btn.querySelector('.lang-native').textContent.slice(0, 2);
            updatePageLanguage();
            requestPermissions(); // Ask for mic & location BEFORE showing main screen
        });
    });

    $('mic-button').addEventListener('click', handleMicClick);
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', () => switchFeature(card.dataset.feature));
    });
    $('lang-switch-btn').addEventListener('click', () => showScreen('splash-screen'));

    // Quick action buttons on dashboard
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            if (query) processVoiceQuery(query);
        });
    });

    // Skip permissions button
    $('skip-permissions')?.addEventListener('click', () => showScreen('main-screen'));

    // Text input handler for offline fallback
    $('text-submit-btn')?.addEventListener('click', handleTextSubmit);
    $('text-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTextSubmit();
    });

    // Online/offline detection with voice note processing
    window.addEventListener('online', () => { 
        $('online-status').className = 'status-dot online';
        processPendingVoiceNotes();
    });
    window.addEventListener('offline', () => { 
        $('online-status').className = 'status-dot offline';
        updateOfflineWelcome();
    });
    if (!navigator.onLine) {
        $('online-status').className = 'status-dot offline';
        updateOfflineWelcome();
    }
    
    // Check for pending voice notes on load
    setTimeout(processPendingVoiceNotes, 3000);
});

function updateOfflineWelcome() {
    if (!navigator.onLine) {
        const welcomeText = document.querySelector('.welcome-text');
        if (welcomeText) {
            const lang = window.currentLanguage || 'hi';
            welcomeText.textContent = lang === 'hi' 
                ? 'ऑफलाइन हैं। टाइप करें या नीचे बटन दबाएं।'
                : 'You are offline. Type or use buttons below.';
        }
        
        const tipText = document.querySelector('.tip-text');
        if (tipText) {
            const lang = window.currentLanguage || 'hi';
            tipText.textContent = lang === 'hi'
                ? 'टाइप बॉक्स में लिखें या नीचे बटन दबाएं। भाव और कैलेंडर ऑफलाइन काम करते हैं!'
                : 'Type in the box or tap buttons below. Prices and Calendar work offline!';
        }
    }
}

/* ============ PERMISSION FLOW ============ */
async function requestPermissions() {
    showScreen('permissions-screen');

    // Request microphone
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Release mic immediately
        $('mic-perm-status').textContent = '✅';
        $('mic-perm-status').classList.add('granted');
    } catch (e) {
        $('mic-perm-status').textContent = '❌';
    }

    // Request location
    try {
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });
        userLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        window.userLocation = userLocation; // Make available globally for API calls
        $('loc-perm-status').textContent = '✅';
        $('loc-perm-status').classList.add('granted');
    } catch (e) {
        userLocation = { lat: 28.6139, lon: 77.2090 }; // Default: Delhi
        window.userLocation = userLocation;
        $('loc-perm-status').textContent = '⚠️';
    }

    // Auto-proceed after a short delay
    setTimeout(() => showScreen('main-screen'), 2500);
}

/* ============ SCREENS & NAVIGATION ============ */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(screenId)?.classList.add('active');
}

function switchFeature(feature) {
    currentFeature = feature;
    document.querySelectorAll('.nav-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-feature="${feature}"]`)?.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    switch (feature) {
        case 'ask':
            ($('response-section').children.length > 0 ? $('response-section') : $('welcome-section')).classList.add('active');
            break;
        case 'prices': $('prices-section').classList.add('active'); loadPrices(); break;
        case 'weather': $('weather-section').classList.add('active'); loadWeather(); break;
        case 'calendar': $('calendar-section').classList.add('active'); loadCalendar(); break;
    }
}

/* ============ VOICE INPUT ============ */
async function handleTextSubmit() {
    const input = $('text-input');
    const query = input?.value?.trim();
    if (!query) return;
    input.value = '';
    await processVoiceQuery(query);
}

async function handleMicClick() {
    if (SpeechEngine.isListening || SpeechEngine.isRecordingAudio) {
        SpeechEngine.stop();
        return;
    }
    
    const status = $('voice-status');
    const lang = window.currentLanguage || 'hi';
    
    try {
        const transcript = await SpeechEngine.listen(currentSpeechCode);
        
        if (transcript === 'Voice note recorded - processing when online') {
            showToast(lang === 'hi' ? 'आवाज़ सेव हो गई! जब इंटरनेट आएगा तब प्रोसेस होगी।' : 'Voice saved! Will process when online.');
            return;
        }
        
        await processVoiceQuery(transcript);
    } catch (error) {
        console.error('Speech error:', error);
        
        const errorMsg = error.message || '';
        
        if (errorMsg === 'no_speech' || errorMsg === 'no-speech') {
            showToast(t('error_no_speech'));
        } else if (errorMsg.includes('network') || errorMsg.includes('service') || errorMsg.includes('not-allowed')) {
            const offlineMsg = lang === 'hi' 
                ? 'इंटरनेट के बिना वॉइस काम नहीं करता। टाइप करें या बटन दबाएं।'
                : 'Voice needs internet. Type your question or use buttons.';
            showToast(offlineMsg);
            
            if (status) {
                status.textContent = lang === 'hi' 
                    ? 'टाइप करें या नीचे बटन दबाएं'
                    : 'Type or use buttons below';
            }
        } else if (errorMsg === 'voice_not_available' || errorMsg.includes('not supported')) {
            showToast(lang === 'hi' 
                ? 'माइक उपलब्ध नहीं है। टाइप करें।'
                : 'Mic not available. Please type.');
        } else {
            showToast(t('error_no_speech'));
        }
    }
}

async function processVoiceQuery(query) {
    switchFeature('ask');
    $('welcome-section').classList.remove('active');
    $('response-section').classList.add('active');
    addQueryBubble(query);

    // Check for offline - try fetch to be sure
    let isOnline = navigator.onLine;
    if (!isOnline) {
        console.log('Working offline');
    }
    
    // Use offline FAQ if no network
    if (!isOnline) {
        const offlineAnswer = getOfflineAnswer(query);
        addResponseCard({
            text: offlineAnswer.text,
            type: offlineAnswer.type,
            emoji: offlineAnswer.emoji,
            steps: offlineAnswer.steps
        });
        SpeechEngine.speak(offlineAnswer.text, currentSpeechCode);
        return;
    }

    showLoading(true);
    console.log('📤 Sending query:', query);
    console.log('📤 History length:', conversationHistory.length);
    console.log('📤 History:', conversationHistory);
    const result = await API.sendQuery(query, window.currentLanguage, conversationHistory);
    showLoading(false);
    console.log('📬 App received result:', result);
    if (result && result.data) {
        addResponseCard(result.data);
        conversationHistory.push({ role: 'user', content: query });
        conversationHistory.push({ role: 'assistant', content: result.data.text });
        console.log('📥 Updated history:', conversationHistory);
        SpeechEngine.speak(result.data.text, currentSpeechCode);
    }
}

/* ============ PENDING VOICE NOTES ============ */
async function processPendingVoiceNotes() {
    if (!navigator.onLine) return;
    
    try {
        const pending = localStorage.getItem('pendingVoiceQueries');
        if (!pending) return;
        
        const queries = JSON.parse(pending);
        if (!queries || queries.length === 0) return;
        
        console.log('Processing pending voice notes:', queries.length);
        
        const lang = window.currentLanguage || 'hi';
        
        // Show notification
        showToast(lang === 'hi' 
            ? `वॉइस नोट प्रोसेस हो रहे हैं...`
            : `Processing ${queries.length} voice notes...`);
        
        // Clear pending (processed)
        localStorage.removeItem('pendingVoiceQueries');
        
    } catch (e) {
        console.warn('Could not process pending notes:', e);
    }
}

/* ============ CONVERSATION HISTORY ============ */
let conversationHistory = [];

function clearConversation() {
    conversationHistory = [];
    $('response-section').innerHTML = '';
    $('welcome-section').classList.add('active');
    $('response-section').classList.remove('active');
}

function getOfflineAnswer(query) {
    const lang = window.currentLanguage;
    const faqList = OFFLINE_FAQ[lang] || OFFLINE_FAQ['en'];
    const queryLower = query.toLowerCase();
    
    for (const faq of faqList) {
        for (const keyword of faq.q) {
            if (queryLower.includes(keyword.toLowerCase())) {
                return {
                    text: faq.a,
                    type: faq.type,
                    emoji: '',
                    steps: faq.steps
                };
            }
        }
    }
    
    const defaultOffline = {
        hi: { text: 'इंटरनेट नहीं है। आप मंडी भाव और फसल कैलेंडर ऑफलाइन देख सकते हैं। माइक दबाकर "टमाटर भाव" या "गेहूँ बुवाई" जैसे सवाल पूछें।', type: 'offline', emoji: '', steps: ['मंडी भाव देखें', 'फसल कैलेंडर देखें', 'ऑफलाइन सवाल पूछें'] },
        en: { text: 'No internet. You can view market prices and crop calendar offline. Try asking "tomato price" or "wheat sowing" with voice.', type: 'offline', emoji: '', steps: ['View Prices', 'View Calendar', 'Ask Offline Questions'] },
        kn: { text: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲ. ಮಂಡಿ ಬೆಲೆ ಮತ್ತು ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್ ನೋಡಿ.', type: 'offline', emoji: '', steps: ['ಬೆಲೆ ನೋಡಿ', 'ಕ್ಯಾಲೆಂಡರ್', 'ಆಫ್‌ಲೈನ್ ಪ್ರಶ್ನೆ'] },
        ta: { text: 'இணையம் இல்லை. சந்தை விலை பார்க்கவும்.', type: 'offline', emoji: '', steps: ['விளைக்கு', 'calendar', 'ஆஃப்லைன்'] },
        te: { text: 'ఇంటర్‌नेట్ లేదు. మార్కెట్ ధరలు చూడు.', type: 'offline', emoji: '', steps: ['ధరలు', 'calendar', 'ofline'] }
    };
    
    return defaultOffline[lang] || defaultOffline['en'];
}

/* ============ UI COMPONENTS ============ */
function addQueryBubble(text) {
    const div = document.createElement('div');
    div.className = 'query-echo';
    div.innerHTML = `<span class="query-icon">🎤</span> "${text}"`;
    $('response-section').appendChild(div);
    div.scrollIntoView({ behavior: 'smooth' });
}

function addResponseCard(data) {
    const card = document.createElement('div');
    card.className = 'response-card animate-in';
    let stepsHTML = '';
    if (data.steps && data.steps.length > 0) {
        stepsHTML = `<p><strong>${t('steps_title')}</strong></p>
            <ul class="steps-list">${data.steps.map(s => `<li>${s}</li>`).join('')}</ul>`;
    }
    const safeText = (data.text || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
    card.innerHTML = `
        <div class="response-emoji">${data.emoji || ''}</div>
        <div class="response-text">${data.text}</div>
        ${data.type !== 'general' && data.type !== 'error' ? `<span class="response-type">${data.type}</span>` : ''}
        ${stepsHTML}
        <button class="speak-btn" onclick="SpeechEngine.speak('${safeText}', '${currentSpeechCode}')">${t('speak_again')}</button>`;
    $('response-section').appendChild(card);
    card.scrollIntoView({ behavior: 'smooth' });
}

/* ============ PRICES (WORKS OFFLINE!) ============ */
function loadPrices() {
    const lang = window.currentLanguage;
    const prices = LOCAL_PRICES[lang] || LOCAL_PRICES['en'];
    const container = $('prices-list');
    container.innerHTML = '';

    // Add MSP disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'price-disclaimer';
    disclaimer.innerHTML = `<small>📋 ${t('price_source')}</small>`;
    container.appendChild(disclaimer);

    prices.forEach(item => {
        const trendClass = item.trend === 'rising' ? 'trend-up' : item.trend === 'falling' ? 'trend-down' : 'trend-stable';
        const card = document.createElement('div');
        card.className = 'price-card animate-in';
        card.innerHTML = `
            <div class="crop-emoji">${item.emoji}</div>
            <div class="crop-info"><div class="crop-name">${item.name}</div><div class="crop-unit">${t('per')} ${item.unit}</div></div>
            <div><div class="crop-price">₹${item.price.toLocaleString()}</div><div class="${trendClass}">${t('trend_' + item.trend)}</div></div>`;
        container.appendChild(card);
    });
}

/* ============ WEATHER CACHE ============ */
let weatherCache = { data: null, timestamp: 0 };
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCachedWeather() {
    try {
        const cached = localStorage.getItem('kisaanmitra_weather');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < WEATHER_CACHE_DURATION) {
                return parsed.data;
            }
        }
    } catch (e) {}
    return null;
}

function setCachedWeather(data) {
    try {
        localStorage.setItem('kisaanmitra_weather', JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
    } catch (e) {}
}

/* ============ WEATHER ============ */
async function loadWeather() {
    // Try cache first
    const cached = getCachedWeather();
    if (cached) {
        renderWeather(cached);
    }
    
    if (!navigator.onLine) {
        if (!cached) {
            $('weather-content').innerHTML = `<div class="welcome-card"><p>📡 ${t('offline_msg')}</p></div>`;
        }
        return;
    }
    
    showLoading(true);
    const loc = userLocation || { lat: 12.97, lon: 77.59 };
    const data = await API.getWeather(loc.lat, loc.lon, window.currentLanguage);
    showLoading(false);
    
    if (data) {
        setCachedWeather(data);
        renderWeather(data);
    }
}

function renderWeather(data) {
    const container = $('weather-content');
    if (!data.success && !data.current) {
        container.innerHTML = `<div class="welcome-card"><p>${t('error_network')}</p></div>`;
        return;
    }
    const c = data.current;
    let adviceHTML = '';
    if (data.farming_advice && data.farming_advice.length > 0) {
        adviceHTML = `<div class="farming-advice"><h3>🌾 ${t('steps_title')}</h3>${data.farming_advice.map(a => `<p>• ${a}</p>`).join('')}</div>`;
    }
    container.innerHTML = `
        <div class="weather-card animate-in">
            <div class="weather-main"><div><div class="weather-temp">${c.temperature}°C</div>
                <div class="weather-desc">${c.description}</div><div class="weather-city">📍 ${c.city}</div></div></div>
            <div class="weather-details">
                <div class="weather-detail-item"><div class="label">${t('humidity')}</div><div class="value">${c.humidity}%</div></div>
                <div class="weather-detail-item"><div class="label">${t('wind')}</div><div class="value">${c.wind_speed || '--'} km/h</div></div>
            </div>
            ${adviceHTML}
        </div>`;
}

/* ============ CROP CALENDAR (WORKS OFFLINE!) ============ */
function loadCalendar() {
    const seasons = {
        kharif: { crops: [
            { emoji: '🌾', en: 'Rice', hi: 'धान', kn: 'ಭತ್ತ', te: 'వరి', ta: 'நெல்', sow: 'Jun-Jul', harv: 'Oct-Nov' },
            { emoji: '☁️', en: 'Cotton', hi: 'कपास', kn: 'ಹತ್ತಿ', te: 'పత్తి', ta: 'பருத்தி', sow: 'May-Jun', harv: 'Nov-Jan' },
            { emoji: '🌽', en: 'Maize', hi: 'मक्का', kn: 'ಮೆಕ್ಕೆ ಜೋಳ', te: 'మొక్కజొన్న', ta: 'மக்காச்சோளம்', sow: 'Jun-Jul', harv: 'Sep-Oct' },
            { emoji: '🥜', en: 'Groundnut', hi: 'मूंगफली', kn: 'ಕಡಲೆಕಾಯಿ', te: 'వేరుశెనగ', ta: 'நிலக்கடலை', sow: 'Jun-Jul', harv: 'Oct-Nov' }
        ]},
        rabi: { crops: [
            { emoji: '🌾', en: 'Wheat', hi: 'गेहूँ', kn: 'ಗೋಧಿ', te: 'గోధుమ', ta: 'கோதுமை', sow: 'Oct-Nov', harv: 'Mar-Apr' },
            { emoji: '🥔', en: 'Potato', hi: 'आलू', kn: 'ಆಲೂಗಡ್ಡೆ', te: 'బంగాళదుంప', ta: 'உருளைக்கிழங்கு', sow: 'Oct-Nov', harv: 'Jan-Mar' },
            { emoji: '🧅', en: 'Onion', hi: 'प्याज', kn: 'ಈರುಳ್ಳಿ', te: 'ఉల్లిపాయ', ta: 'வெங்காயம்', sow: 'Nov-Dec', harv: 'Apr-May' },
            { emoji: '🌼', en: 'Mustard', hi: 'सरसों', kn: 'ಸಾಸಿವೆ', te: 'ఆవాలు', ta: 'கடுகு', sow: 'Oct-Nov', harv: 'Feb-Mar' }
        ]},
        zaid: { crops: [
            { emoji: '🍉', en: 'Watermelon', hi: 'तरबूज़', kn: 'ಕಲ್ಲಂಗಡಿ', te: 'పుచ్చకాయ', ta: 'தர்பூசணி', sow: 'Feb-Mar', harv: 'May-Jun' },
            { emoji: '🥒', en: 'Cucumber', hi: 'खीरा', kn: 'ಸೌತೆಕಾಯಿ', te: 'దోసకాయ', ta: 'வெள்ளரிக்காய்', sow: 'Feb-Mar', harv: 'Apr-Jun' }
        ]}
    };
    const container = $('calendar-content');
    const lang = window.currentLanguage;
    container.innerHTML = '';
    Object.entries(seasons).forEach(([key, season]) => {
        let html = `<div class="section-header"><h2>🌱 ${t('season_' + key)}</h2></div>`;
        season.crops.forEach(crop => {
            const name = crop[lang] || crop.en;
            html += `<div class="price-card animate-in"><div class="crop-emoji">${crop.emoji}</div>
                <div class="crop-info"><div class="crop-name">${name}</div><div class="crop-unit">${t('sowing')}: ${crop.sow}</div></div>
                <div><div class="crop-price" style="font-size:0.85rem">${t('harvest')}</div>
                <div style="color:var(--text-muted);font-size:0.8rem">${crop.harv}</div></div></div>`;
        });
        container.innerHTML += html;
    });
}

/* ============ UTILITIES ============ */
function showLoading(show) { $('loading-overlay')?.classList.toggle('hidden', !show); }
function showToast(message) {
    const el = $('voice-status');
    if (el) { el.textContent = message; setTimeout(() => { el.textContent = t('voice_tap'); }, 3000); }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(err => console.log('SW failed:', err));
    });
}
