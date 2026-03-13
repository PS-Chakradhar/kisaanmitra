/**
 * KisaanMitra - Internationalization (i18n) Module
 */
const I18N = {
    hi: {
        nav_ask: 'पूछें', nav_prices: 'भाव', nav_weather: 'मौसम', nav_calendar: 'फसल',
        welcome: 'नमस्ते! मैं किसानमित्र हूँ। नीचे माइक दबाकर अपना सवाल पूछें।',
        voice_tap: 'माइक दबाएं और बोलें', voice_listening: '🎤 सुन रहा हूँ... बोलिए',
        voice_processing: 'समझ रहा हूँ...', loading: 'सोच रहा हूँ...',
        prices_title: '📊 आज के भाव', weather_title: '🌦️ आज का मौसम', calendar_title: '📅 फसल कैलेंडर',
        per: 'प्रति', speak_again: '🔊 फिर से सुनें', steps_title: 'क्या करें:',
        error_no_speech: 'माफ़ कीजिए, आपकी आवाज़ नहीं सुनाई दी। कृपया दोबारा बोलें।',
        error_network: 'इंटरनेट कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।',
        humidity: 'नमी', wind: 'हवा', feels_like: 'महसूस',
        sowing: 'बुवाई', harvest: 'कटाई',
        trend_rising: '📈 बढ़ रहा', trend_falling: '📉 गिर रहा', trend_stable: '📊 स्थिर',
        offline_msg: 'आप ऑफ़लाइन हैं।',
        season_kharif: 'खरीफ (बरसात)', season_rabi: 'रबी (सर्दी)', season_zaid: 'ज़ायद (गर्मी)'
    },
    kn: {
        nav_ask: 'ಕೇಳಿ', nav_prices: 'ಬೆಲೆ', nav_weather: 'ಹವಾಮಾನ', nav_calendar: 'ಬೆಳೆ',
        welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್\u200cಮಿತ್ರ. ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
        voice_tap: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ', voice_listening: '🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಹೇಳಿ',
        loading: 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...', prices_title: '📊 ಇಂದಿನ ಬೆಲೆ',
        per: 'ಪ್ರತಿ', speak_again: '🔊 ಮತ್ತೆ ಕೇಳಿ', steps_title: 'ಏನು ಮಾಡಬೇಕು:',
        error_no_speech: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಲಿಲ್ಲ. ಮತ್ತೆ ಹೇಳಿ.',
        error_network: 'ಇಂಟರ್ನೆಟ್ ಸಮಸ್ಯೆ.',
        humidity: 'ಆರ್ದ್ರತೆ', wind: 'ಗಾಳಿ', sowing: 'ಬಿತ್ತನೆ', harvest: 'ಕೊಯ್ಲು',
        trend_rising: '📈 ಏರುತ್ತಿದೆ', trend_falling: '📉 ಇಳಿಯುತ್ತಿದೆ', trend_stable: '📊 ಸ್ಥಿರ',
        season_kharif: 'ಖಾರಿಫ್', season_rabi: 'ರಬಿ', season_zaid: 'ಝೈದ್'
    },
    en: {
        nav_ask: 'Ask', nav_prices: 'Prices', nav_weather: 'Weather', nav_calendar: 'Crops',
        welcome: 'Hello! I am KisaanMitra. Tap the mic below and ask your question.',
        voice_tap: 'Tap mic and speak', voice_listening: '🎤 Listening... speak now',
        loading: 'Thinking...', prices_title: '📊 Today\'s Prices',
        per: 'per', speak_again: '🔊 Listen Again', steps_title: 'Steps:',
        error_no_speech: 'Sorry, couldn\'t hear you. Please try again.',
        error_network: 'Network issue. Please try again.',
        humidity: 'Humidity', wind: 'Wind', feels_like: 'Feels',
        sowing: 'Sowing', harvest: 'Harvest',
        trend_rising: '📈 Rising', trend_falling: '📉 Falling', trend_stable: '📊 Stable',
        offline_msg: 'You are offline.',
        season_kharif: 'Kharif (Monsoon)', season_rabi: 'Rabi (Winter)', season_zaid: 'Zaid (Summer)'
    },
    ta: {
        nav_ask: 'கேளுங்கள்', nav_prices: 'விலை', nav_weather: 'வானிலை', nav_calendar: 'பயிர்',
        welcome: 'வணக்கம்! நான் கிசான்மித்ரா. மைக் அழுத்தி கேளுங்கள்.',
        voice_tap: 'மைக் அழுத்தி பேசுங்கள்', voice_listening: '🎤 கேட்கிறேன்... பேசுங்கள்',
        loading: 'யோசிக்கிறேன்...', per: 'ஒரு', speak_again: '🔊 மீண்டும் கேளுங்கள்',
        steps_title: 'என்ன செய்வது:', error_no_speech: 'மன்னிக்கவும், உங்கள் குரல் கேட்கவில்லை.',
        error_network: 'இணைய சிக்கல்.',
        trend_rising: '📈 உயர்கிறது', trend_falling: '📉 குறைகிறது', trend_stable: '📊 நிலையான'
    },
    te: {
        nav_ask: 'అడగండి', nav_prices: 'ధరలు', nav_weather: 'వాతావరణం', nav_calendar: 'పంటలు',
        welcome: 'నమస్కారం! నేను కిసాన్‌మిత్ర. మైక్ నొక్కి మీ ప్రశ్న అడగండి.',
        voice_tap: 'మైక్ నొక్కి మాట్లాడండి', voice_listening: '🎤 వింటున్నాను... మాట్లాడండి',
        voice_processing: 'అర్థం చేసుకుంటున్నాను...', loading: 'ఆలోచిస్తున్నాను...',
        prices_title: '📊 నేటి ధరలు', weather_title: '🌦️ నేటి వాతావరణం', calendar_title: '📅 పంట క్యాలెండర్',
        per: 'కి', speak_again: '🔊 మళ్ళీ వినండి', steps_title: 'ఏమి చేయాలి:',
        error_no_speech: 'క్షమించండి, మీ వాయిస్ వినబడలేదు. మళ్ళీ ప్రయత్నించండి.',
        error_network: 'ఇంటర్నెట్ సమస్య. మళ్లీ ప్రయత్నించండి.',
        humidity: 'తేమ', wind: 'గాలి', feels_like: 'అనిపిస్తుంది',
        sowing: 'విత్తడం', harvest: 'కోత',
        trend_rising: '📈 పెరుగుతోంది', trend_falling: '📉 పడిపోతోంది', trend_stable: '📊 స్థిరంగా',
        offline_msg: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు.',
        season_kharif: 'ఖరీఫ్ (వానకాలం)', season_rabi: 'రబీ (శీతాకాలం)', season_zaid: 'జైద్ (వేసవి)'
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
}
