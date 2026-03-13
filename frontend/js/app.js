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

/* ============ INITIALIZATION ============ */
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

    // Online/offline detection
    window.addEventListener('online', () => { $('online-status').className = 'status-dot online'; });
    window.addEventListener('offline', () => { $('online-status').className = 'status-dot offline'; });
    if (!navigator.onLine) $('online-status').className = 'status-dot offline';
});

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
        $('loc-perm-status').textContent = '✅';
        $('loc-perm-status').classList.add('granted');
    } catch (e) {
        userLocation = { lat: 12.97, lon: 77.59 }; // Default: Bangalore
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
async function handleMicClick() {
    if (SpeechEngine.isListening) {
        SpeechEngine.stop(); // Tap again = stop and process
        return;
    }
    try {
        const transcript = await SpeechEngine.listen(currentSpeechCode);
        await processVoiceQuery(transcript);
    } catch (error) {
        if (error.message !== 'no_speech') console.error('Speech error:', error);
        showToast(t('error_no_speech'));
    }
}

async function processVoiceQuery(query) {
    switchFeature('ask');
    $('welcome-section').classList.remove('active');
    $('response-section').classList.add('active');
    addQueryBubble(query);

    if (!navigator.onLine) {
        addResponseCard({
            text: t('offline_msg'),
            type: 'error',
            emoji: '📡',
            steps: []
        });
        return;
    }

    showLoading(true);
    const result = await API.sendQuery(query, window.currentLanguage);
    showLoading(false);
    if (result && result.data) {
        addResponseCard(result.data);
        SpeechEngine.speak(result.data.text, currentSpeechCode);
    }
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
        <div class="response-emoji">${data.emoji || '🌾'}</div>
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

/* ============ WEATHER ============ */
async function loadWeather() {
    if (!navigator.onLine) {
        $('weather-content').innerHTML = `<div class="welcome-card"><p>📡 ${t('offline_msg')}</p></div>`;
        return;
    }
    showLoading(true);
    const loc = userLocation || { lat: 12.97, lon: 77.59 };
    const data = await API.getWeather(loc.lat, loc.lon, window.currentLanguage);
    showLoading(false);
    renderWeather(data);
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
