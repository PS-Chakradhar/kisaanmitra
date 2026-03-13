/**
 * KisaanMitra - API Communication Layer
 */
const API = {
    // Live Cloud Backend! 🚀
    BASE_URL: 'https://PSC03.pythonanywhere.com/api',

    async sendQuery(query, language = 'hi') {
        try {
            const response = await fetch(`${this.BASE_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, language })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Query API Error:', error);
            return { success: false, data: { text: t('error_network'), type: 'error', emoji: '⚠️', steps: [] }, language };
        }
    },

    async getPrices(language = 'hi') {
        try {
            const response = await fetch(`${this.BASE_URL}/prices?language=${language}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            localStorage.setItem('cached_prices', JSON.stringify(data));
            return data;
        } catch (error) {
            const cached = localStorage.getItem('cached_prices');
            return cached ? JSON.parse(cached) : { success: false, commodities: [] };
        }
    },

    async getWeather(lat, lon, language = 'hi') {
        try {
            const response = await fetch(`${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&language=${language}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            localStorage.setItem('cached_weather', JSON.stringify(data));
            return data;
        } catch (error) {
            const cached = localStorage.getItem('cached_weather');
            return cached ? JSON.parse(cached) : { success: false };
        }
    }
};
