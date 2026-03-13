/**
 * KisaanMitra - Internationalization (i18n) Module
 * All 5 languages: Hindi, Kannada, English, Tamil, Telugu
 */
const I18N = {
    hi: {
        nav_ask: 'पूछें', nav_prices: 'भाव', nav_weather: 'मौसम', nav_calendar: 'फसल',
        welcome: 'नमस्ते! मैं किसानमित्र हूँ। नीचे माइक दबाकर अपना सवाल पूछें।',
        voice_tap: 'माइक दबाएं और बोलें', voice_listening: '🎤 सुन रहा हूँ... बोलते रहें',
        voice_processing: 'समझ रहा हूँ...', loading: 'सोच रहा हूँ...',
        prices_title: '📊 आज के भाव', weather_title: '🌦️ आज का मौसम', calendar_title: '📅 फसल कैलेंडर',
        per: 'प्रति', speak_again: '🔊 फिर से सुनें', steps_title: 'क्या करें:',
        error_no_speech: 'माफ़ कीजिए, आपकी आवाज़ नहीं सुनाई दी। कृपया दोबारा बोलें।',
        error_network: 'इंटरनेट कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।',
        humidity: 'नमी', wind: 'हवा', feels_like: 'महसूस',
        sowing: 'बुवाई', harvest: 'कटाई',
        trend_rising: '📈 बढ़ रहा', trend_falling: '📉 गिर रहा', trend_stable: '📊 स्थिर',
        offline_msg: 'AI सलाह के लिए इंटरनेट चाहिए। भाव और फसल कैलेंडर ऑफ़लाइन उपलब्ध हैं।',
        season_kharif: 'खरीफ (बरसात)', season_rabi: 'रबी (सर्दी)', season_zaid: 'ज़ायद (गर्मी)',
        price_source: 'स्रोत: MSP 2024-25 + मंडी अनुमान (संदर्भ हेतु)',
        try_asking: 'ये पूछकर देखें:', tip: '💡 माइक बटन दबाएं और धीरे-धीरे बोलें। किसानमित्र आपकी बात सुनकर जवाब देगा।',
        qa_pest: 'मेरे टमाटर में कीड़े लगे हैं', qa_sowing: 'गेहूँ की बुवाई कब करें?', qa_weather: 'आज मौसम कैसा रहेगा?',
        perm_title: 'अनुमतियाँ', perm_subtitle: 'बेहतर अनुभव के लिए कृपया अनुमति दें',
        perm_mic: 'माइक्रोफोन', perm_mic_why: 'आपकी आवाज़ सुनने के लिए',
        perm_loc: 'स्थान', perm_loc_why: 'आपके क्षेत्र का मौसम दिखाने के लिए', perm_skip: 'छोड़ें →'
    },
    kn: {
        nav_ask: 'ಕೇಳಿ', nav_prices: 'ಬೆಲೆ', nav_weather: 'ಹವಾಮಾನ', nav_calendar: 'ಬೆಳೆ',
        welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್\u200cಮಿತ್ರ. ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
        voice_tap: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ', voice_listening: '🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡುತ್ತಿರಿ',
        loading: 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...', prices_title: '📊 ಇಂದಿನ ಬೆಲೆ',
        per: 'ಪ್ರತಿ', speak_again: '🔊 ಮತ್ತೆ ಕೇಳಿ', steps_title: 'ಏನು ಮಾಡಬೇಕು:',
        error_no_speech: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಲಿಲ್ಲ. ಮತ್ತೆ ಹೇಳಿ.',
        error_network: 'ಇಂಟರ್ನೆಟ್ ಸಮಸ್ಯೆ.',
        humidity: 'ಆರ್ದ್ರತೆ', wind: 'ಗಾಳಿ', sowing: 'ಬಿತ್ತನೆ', harvest: 'ಕೊಯ್ಲು',
        trend_rising: '📈 ಏರುತ್ತಿದೆ', trend_falling: '📉 ಇಳಿಯುತ್ತಿದೆ', trend_stable: '📊 ಸ್ಥಿರ',
        offline_msg: 'AI ಸಲಹೆಗೆ ಇಂಟರ್ನೆಟ್ ಬೇಕು. ಬೆಲೆ ಮತ್ತು ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯ.',
        season_kharif: 'ಖಾರಿಫ್', season_rabi: 'ರಬಿ', season_zaid: 'ಝೈದ್',
        price_source: 'ಮೂಲ: MSP 2024-25 + ಮಂಡಿ ಅಂದಾಜು',
        try_asking: 'ಇವುಗಳನ್ನು ಕೇಳಿ ನೋಡಿ:', tip: '💡 ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.',
        qa_pest: 'ನನ್ನ ಟೊಮೆಟೊಗೆ ಕೀಟ ಬಂದಿದೆ', qa_sowing: 'ಗೋಧಿ ಬಿತ್ತನೆ ಯಾವಾಗ?', qa_weather: 'ಇಂದು ಹವಾಮಾನ ಹೇಗಿದೆ?',
        perm_title: 'ಅನುಮತಿಗಳು', perm_subtitle: 'ಉತ್ತಮ ಅನುಭವಕ್ಕಾಗಿ ಅನುಮತಿ ನೀಡಿ',
        perm_mic: 'ಮೈಕ್ರೋಫೋನ್', perm_mic_why: 'ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಲು',
        perm_loc: 'ಸ್ಥಳ', perm_loc_why: 'ನಿಮ್ಮ ಪ್ರದೇಶದ ಹವಾಮಾನ ತೋರಿಸಲು', perm_skip: 'ಹೋಗಿ →'
    },
    en: {
        nav_ask: 'Ask', nav_prices: 'Prices', nav_weather: 'Weather', nav_calendar: 'Crops',
        welcome: 'Hello! I am KisaanMitra. Tap the mic below and ask your question.',
        voice_tap: 'Tap mic and speak', voice_listening: '🎤 Listening... keep speaking',
        loading: 'Thinking...', prices_title: '📊 Today\'s Prices',
        per: 'per', speak_again: '🔊 Listen Again', steps_title: 'Steps:',
        error_no_speech: 'Sorry, couldn\'t hear you. Please try again.',
        error_network: 'Network issue. Please try again.',
        humidity: 'Humidity', wind: 'Wind', feels_like: 'Feels',
        sowing: 'Sowing', harvest: 'Harvest',
        trend_rising: '📈 Rising', trend_falling: '📉 Falling', trend_stable: '📊 Stable',
        offline_msg: 'AI advice needs internet. Prices & crop calendar are available offline.',
        season_kharif: 'Kharif (Monsoon)', season_rabi: 'Rabi (Winter)', season_zaid: 'Zaid (Summer)',
        price_source: 'Source: MSP 2024-25 + Mandi Estimates (for reference)',
        try_asking: 'Try asking:', tip: '💡 Tap the mic button and speak slowly. KisaanMitra will listen and respond.',
        qa_pest: 'My tomatoes have pest attack', qa_sowing: 'When to sow wheat?', qa_weather: 'How is the weather today?',
        perm_title: 'Permissions', perm_subtitle: 'Allow access for the best experience',
        perm_mic: 'Microphone', perm_mic_why: 'To hear your voice questions',
        perm_loc: 'Location', perm_loc_why: 'To show weather for your area', perm_skip: 'Skip →'
    },
    ta: {
        nav_ask: 'கேளுங்கள்', nav_prices: 'விலை', nav_weather: 'வானிலை', nav_calendar: 'பயிர்',
        welcome: 'வணக்கம்! நான் கிசான்மித்ரா. மைக் அழுத்தி கேளுங்கள்.',
        voice_tap: 'மைக் அழுத்தி பேசுங்கள்', voice_listening: '🎤 கேட்கிறேன்... பேசுங்கள்',
        loading: 'யோசிக்கிறேன்...', per: 'ஒரு', speak_again: '🔊 மீண்டும் கேளுங்கள்',
        steps_title: 'என்ன செய்வது:', error_no_speech: 'மன்னிக்கவும், உங்கள் குரல் கேட்கவில்லை.',
        error_network: 'இணைய சிக்கல்.',
        trend_rising: '📈 உயர்கிறது', trend_falling: '📉 குறைகிறது', trend_stable: '📊 நிலையான',
        offline_msg: 'AI ஆலோசனைக்கு இணையம் தேவை.',
        price_source: 'ஆதாரம்: MSP 2024-25 + மண்டி மதிப்பீடுகள்',
        try_asking: 'கேட்டு பாருங்கள்:', tip: '💡 மைக் பட்டனை அழுத்தி மெதுவாக பேசுங்கள்.',
        qa_pest: 'எனது தக்காளியில் பூச்சி', qa_sowing: 'கோதுமை எப்போது விதைக்க வேண்டும்?', qa_weather: 'இன்று வானிலை எப்படி?',
        perm_title: 'அனுமதிகள்', perm_subtitle: 'சிறந்த அனுபவத்திற்கு அனுமதி அளிக்கவும்',
        perm_mic: 'மைக்ரோஃபோன்', perm_mic_why: 'உங்கள் குரலைக் கேட்க',
        perm_loc: 'இடம்', perm_loc_why: 'உங்கள் பகுதி வானிலை காட்ட', perm_skip: 'தவிர் →'
    },
    te: {
        nav_ask: 'అడగండి', nav_prices: 'ధరలు', nav_weather: 'వాతావరణం', nav_calendar: 'పంటలు',
        welcome: 'నమస్కారం! నేను కిసాన్‌మిత్ర. మైక్ నొక్కి మీ ప్రశ్న అడగండి.',
        voice_tap: 'మైక్ నొక్కి మాట్లాడండి', voice_listening: '🎤 వింటున్నాను... మాట్లాడుతూ ఉండండి',
        voice_processing: 'అర్థం చేసుకుంటున్నాను...', loading: 'ఆలోచిస్తున్నాను...',
        prices_title: '📊 నేటి ధరలు', weather_title: '🌦️ నేటి వాతావరణం', calendar_title: '📅 పంట క్యాలెండర్',
        per: 'కి', speak_again: '🔊 మళ్ళీ వినండి', steps_title: 'ఏమి చేయాలి:',
        error_no_speech: 'క్షమించండి, మీ వాయిస్ వినబడలేదు. మళ్ళీ ప్రయత్నించండి.',
        error_network: 'ఇంటర్నెట్ సమస్య. మళ్లీ ప్రయత్నించండి.',
        humidity: 'తేమ', wind: 'గాలి', feels_like: 'అనిపిస్తుంది',
        sowing: 'విత్తడం', harvest: 'కోత',
        trend_rising: '📈 పెరుగుతోంది', trend_falling: '📉 పడిపోతోంది', trend_stable: '📊 స్థిరంగా',
        offline_msg: 'AI సలహా కోసం ఇంటర్నెట్ అవసరం. ధరలు & పంట క్యాలెండర్ ఆఫ్‌లైన్‌లో అందుబాటులో ఉన్నాయి.',
        season_kharif: 'ఖరీఫ్ (వానకాలం)', season_rabi: 'రబీ (శీతాకాలం)', season_zaid: 'జైద్ (వేసవి)',
        price_source: 'మూలం: MSP 2024-25 + మండీ అంచనాలు',
        try_asking: 'ఇవి అడగండి:', tip: '💡 మైక్ బటన్ నొక్కి నెమ్మదిగా మాట్లాడండి.',
        qa_pest: 'నా టమాటాకు పురుగు పట్టింది', qa_sowing: 'గోధుమ ఎప్పుడు విత్తాలి?', qa_weather: 'ఈరోజు వాతావరణం ఎలా?',
        perm_title: 'అనుమతులు', perm_subtitle: 'మెరుగైన అనుభవం కోసం అనుమతి ఇవ్వండి',
        perm_mic: 'మైక్రోఫోన్', perm_mic_why: 'మీ వాయిస్ వినడానికి',
        perm_loc: 'లొకేషన్', perm_loc_why: 'మీ ప్రాంత వాతావరణం చూపించడానికి', perm_skip: 'స్కిప్ →'
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
