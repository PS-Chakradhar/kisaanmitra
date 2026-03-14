/**
 * KisaanMitra - Smart API Layer
 * Uses AI when online + backend available, falls back to offline FAQ
 */

// Configure your backend URL here
// For hackathon: Use ngrok to expose your local backend
// Example: const BACKEND_URL = 'https://your-ngrok-url.ngrok-free.app';
// For local testing: const BACKEND_URL = 'http://localhost:5001';
const BACKEND_URL = null; // Set this for public deployment

const API = {
    async sendQuery(query, language = 'hi', conversationHistory = []) {
        // Get user location if available
        let lat = null, lon = null;
        if (window.userLocation) {
            lat = window.userLocation.lat;
            lon = window.userLocation.lon;
        }
        
        // Determine backend URL
        const backendBase = BACKEND_URL || 'http://localhost:5001';
        
        // Check if online and backend is available
        if (navigator.onLine) {
            try {
                const res = await fetch(`${backendBase}/api/health`, { signal: AbortSignal.timeout(1500) });
                if (res.ok) {
                    console.log('Using AI Backend');
                    const response = await fetch(`${backendBase}/api/query`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            query, 
                            language,
                            history: conversationHistory,
                            lat: lat,
                            lon: lon
                        })
                    });
                    if (response.ok) {
                        const result = await response.json();
                        console.log('📥 Backend response:', result);
                        if (result.success) return result;
                        if (result.data) return result;
                    }
                }
            } catch (e) {
                console.log('📴 AI not available, using offline FAQ');
            }
        } else {
            console.log('📴 Offline - using FAQ');
        }
        
        // Fallback to offline FAQ (with reduced history for context)
        return this._getOfflineResponse(query, language, conversationHistory.slice(-2));
    },

    _getOfflineResponse(query, language) {
        const faqList = OFFLINE_FAQ[language] || OFFLINE_FAQ['en'];
        const queryLower = query.toLowerCase();
        
        for (const faq of faqList) {
            for (const keyword of faq.q) {
                if (queryLower.includes(keyword.toLowerCase())) {
                    return {
                        success: true,
                        data: {
                            text: faq.a,
                            type: faq.type,
                            crop: '',
                            severity: 'low',
                            steps: faq.steps,
                            emoji: '📱'
                        },
                        language: language,
                        provider: 'offline_faq'
                    };
                }
            }
        }
        
        const defaults = {
            hi: { text: 'मैं आपकी मदद कर सकता हूँ: 1) कीड़ों के लिए नीम तेल छिड़कें। 2) मंडी भाव के लिए "भाव" बटन दबाएं। 3) फसल कैलेंडर के लिए "फसल" बटन दबाएं।', type: 'general', emoji: '🌾', steps: ['भाव देखें', 'फसल कैलेंडर देखें', 'मौसम देखें'] },
            en: { text: 'I can help: 1) For pests, spray neem oil. 2) Tap "Prices" for rates. 3) Tap "Crops" for calendar.', type: 'general', emoji: '🌾', steps: ['View Prices', 'View Crop Calendar', 'View Weather'] }
        };
        
        const defaultResponse = defaults[language] || defaults['en'];
        return {
            success: true,
            data: { ...defaultResponse, steps: defaultResponse.steps || [] },
            language: language,
            provider: 'offline_faq'
        };
    },

    async getWeather(lat, lon, language = 'hi') {
        if (navigator.onLine) {
            try {
                const res = await fetch('http://localhost:5001/api/health', { signal: AbortSignal.timeout(1500) });
                if (res.ok) {
                    const response = await fetch(`http://localhost:5001/api/weather?lat=${lat}&lon=${lon}&language=${language}`);
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('kisaanmitra_weather', JSON.stringify({ data, timestamp: Date.now() }));
                        return data;
                    }
                }
            } catch (e) {
                console.log('Weather API error:', e);
            }
        }
        
        try {
            const cached = localStorage.getItem('kisaanmitra_weather');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
                    return parsed.data;
                }
            }
        } catch (e) {}
        
        return { success: false, current: null, message: 'Weather needs internet' };
    }
};