/**
 * KisaanMitra - Smart API Layer
 * Uses AI when online + backend available, falls back to offline FAQ
 */

const API = {
    // Backend URL (cloudflare tunnel - works on all devices)
    BACKEND_URL: 'https://rest-typical-threatened-beaches.trycloudflare.com',
    _activeUrl: null,

    // Get backend URL
    async _getBaseUrl() {
        if (this._activeUrl) return this._activeUrl;
        
        try {
            const res = await fetch(`${this.BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
            if (res.ok) { 
                this._activeUrl = this.BACKEND_URL; 
                console.log('🟢 Using backend:', this.BACKEND_URL); 
                return this.BACKEND_URL; 
            }
        } catch (e) {
            console.log('❌ Backend not available:', e.message);
        }
        return null;
    },

    async sendQuery(query, language = 'hi', conversationHistory = []) {
        // Get user location if available
        let lat = null, lon = null;
        if (window.userLocation) {
            lat = window.userLocation.lat;
            lon = window.userLocation.lon;
        }
        
        if (navigator.onLine) {
            const backendBase = await this._getBaseUrl();
            if (backendBase) {
                try {
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
                        // If cloud returned an error string, it might be the Gemini block on free PythonAnywhere
                        if (result.success || result.data) return result;
                    }
                } catch (e) {
                    console.log('AI Query failed, falling back to offline FAQ');
                }
            }
        }
        
        // Fallback to offline FAQ
        return this._getOfflineResponse(query, language, conversationHistory.slice(-2));
    },

    _getOfflineResponse(query, language) {
        const faqList = typeof OFFLINE_FAQ !== "undefined" ? (OFFLINE_FAQ[language] || OFFLINE_FAQ['en']) : [];
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
            const backendBase = await this._getBaseUrl();
            if (backendBase) {
                try {
                    const response = await fetch(`${backendBase}/api/weather?lat=${lat}&lon=${lon}&language=${language}`);
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('kisaanmitra_weather', JSON.stringify({ data, timestamp: Date.now() }));
                        return data;
                    }
                } catch (e) {
                    console.log('Weather API error:', e);
                }
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