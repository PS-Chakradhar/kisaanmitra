/**
 * KisaanMitra - Internationalization (i18n) Module
 * Languages: Hindi (primary), English
 */
const I18N = {
    hi: {
        nav_ask: 'पूछें', nav_prices: 'भाव', nav_weather: 'मौसम', nav_calendar: 'फसल',
        welcome: 'नमस्ते! मैं किसानमित्र हूँ। नीचे माइक दबाकर अपना सवाल पूछें।',
        welcome_offline: 'ऑफलाइन हैं। टाइप करें या नीचे बटन दबाएं।',
        voice_tap: 'माइक दबाएं और बोलें', voice_listening: 'बोल रहे हैं... फिर से माइक दबाएं',
        voice_processing: 'समझ रहा हूँ...', loading: 'सोच रहा हूँ...',
        prices_title: 'आज के भाव', weather_title: 'आज का मौसम', calendar_title: 'फसल कैलेंडर',
        per: 'प्रति', speak_again: 'फिर से सुनें', steps_title: 'क्या करें:',
        error_no_speech: 'माफ़ कीजिए, आपकी आवाज़ नहीं सुनाई दी। कृपया दोबारा बोलें।',
        error_network: 'इंटरनेट कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।',
        humidity: 'नमी', wind: 'हवा', feels_like: 'महसूस',
        sowing: 'बुवाई', harvest: 'कटाई',
        trend_rising: 'बढ़ रहा', trend_falling: 'गिर रहा', trend_stable: 'स्थिर',
        offline_msg: 'AI सलाह के लिए इंटरनेट चाहिए। भाव और फसल कैलेंडर ऑफ़लाइन उपलब्ध हैं।',
        season_kharif: 'खरीफ (बरसात)', season_rabi: 'रबी (सर्दी)', season_zaid: 'ज़ायद (गर्मी)',
        price_source: 'स्रोत: MSP 2024-25 + मंडी अनुमान',
        try_asking: 'ये पूछकर देखें:', tip: 'माइक बटन दबाएं और धीरे-धीरे बोलें। किसानमित्र आपकी बात सुनकर जवाब देगा।',
        qa_pest: 'मेरे टमाटर में कीड़े लगे हैं', qa_sowing: 'गेहूँ की बुवाई कब करें?', qa_weather: 'आज मौसम कैसा रहेगा?',
        perm_title: 'अनुमतियाँ', perm_subtitle: 'बेहतर अनुभव के लिए कृपया अनुमति दें',
        perm_mic: 'माइक्रोफोन', perm_mic_why: 'आपकी आवाज़ सुनने के लिए',
        perm_loc: 'स्थान', perm_loc_why: 'आपके क्षेत्र का मौसम दिखाने के लिए', perm_skip: 'छोड़ें',
        type_placeholder: 'यहाँ लिखें...'
    },
    en: {
        nav_ask: 'Ask', nav_prices: 'Prices', nav_weather: 'Weather', nav_calendar: 'Crops',
        welcome: 'Hello! I am KisaanMitra. Tap the mic below and ask your question.',
        welcome_offline: 'You are offline. Type or use buttons below.',
        voice_tap: 'Tap mic and speak', voice_listening: 'Speaking... Tap mic again to stop',
        loading: 'Thinking...', prices_title: 'Today\'s Prices',
        per: 'per', speak_again: 'Listen Again', steps_title: 'Steps:',
        error_no_speech: 'Sorry, couldn\'t hear you. Please try again.',
        error_network: 'Network issue. Please try again.',
        humidity: 'Humidity', wind: 'Wind', feels_like: 'Feels',
        sowing: 'Sowing', harvest: 'Harvest',
        trend_rising: 'Rising', trend_falling: 'Falling', trend_stable: 'Stable',
        offline_msg: 'AI advice needs internet. Prices and crop calendar are available offline.',
        season_kharif: 'Kharif (Monsoon)', season_rabi: 'Rabi (Winter)', season_zaid: 'Zaid (Summer)',
        price_source: 'Source: MSP 2024-25 + Mandi Estimates',
        try_asking: 'Try asking:', tip: 'Tap the mic button and speak slowly. KisaanMitra will listen and respond.',
        qa_pest: 'My tomatoes have pest attack', qa_sowing: 'When to sow wheat?', qa_weather: 'How is the weather today?',
        perm_title: 'Permissions', perm_subtitle: 'Allow access for the best experience',
        perm_mic: 'Microphone', perm_mic_why: 'To hear your voice questions',
        perm_loc: 'Location', perm_loc_why: 'To show weather for your area', perm_skip: 'Skip',
        type_placeholder: 'Type here...'
    }
};

function t(key) {
    const lang = window.currentLanguage || 'hi';
    return (I18N[lang] && I18N[lang][key]) || (I18N.en[key]) || key;
}

function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
}