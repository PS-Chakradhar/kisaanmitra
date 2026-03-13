"""
KisaanMitra - Weather Service
Fetches weather data from OpenWeatherMap and provides farming-relevant advice.
"""

import requests
from config import Config

BASE_URL = "https://api.openweathermap.org/data/2.5"


def get_weather(lat: float, lon: float, language: str = 'hi') -> dict:
    """Get current weather and 3-day forecast for a location."""
    try:
        params = {
            'lat': lat, 'lon': lon,
            'appid': Config.WEATHER_API_KEY,
            'units': 'metric', 'lang': language
        }

        current_response = requests.get(f"{BASE_URL}/weather", params=params, timeout=10)
        current_data = current_response.json()

        forecast_response = requests.get(f"{BASE_URL}/forecast", params=params, timeout=10)
        forecast_data = forecast_response.json()

        weather = {
            'current': {
                'temperature': round(current_data['main']['temp']),
                'feels_like': round(current_data['main']['feels_like']),
                'humidity': current_data['main']['humidity'],
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon'],
                'wind_speed': round(current_data['wind']['speed'] * 3.6, 1),
                'city': current_data.get('name', 'Your Location')
            },
            'forecast': [],
            'farming_advice': []
        }

        seen_dates = set()
        for item in forecast_data.get('list', []):
            date = item['dt_txt'].split(' ')[0]
            if date not in seen_dates and '12:00:00' in item['dt_txt']:
                seen_dates.add(date)
                weather['forecast'].append({
                    'date': date,
                    'temperature': round(item['main']['temp']),
                    'humidity': item['main']['humidity'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'rain_chance': item.get('pop', 0) * 100
                })
            if len(weather['forecast']) >= 3:
                break

        weather['farming_advice'] = _generate_farming_advice(weather['current'], language)
        weather['success'] = True
        return weather

    except Exception as e:
        print(f"Weather API Error: {str(e)}")
        return {
            'success': False, 'error': 'Weather data unavailable',
            'current': {'temperature': '--', 'humidity': '--', 'description': 'Data unavailable', 'city': 'Unknown'},
            'forecast': [], 'farming_advice': []
        }


def _generate_farming_advice(current: dict, language: str) -> list:
    """Generate farming-relevant advice based on current weather conditions."""
    advice = []
    temp = current.get('temperature', 25)
    humidity = current.get('humidity', 50)

    if language == 'hi':
        if temp > 38:
            advice.append("🌡️ तापमान बहुत ज़्यादा है। फसलों को शाम को पानी दें।")
        elif temp > 30:
            advice.append("🌡️ गर्म मौसम है। फसलों की नमी जाँचें।")
        elif temp < 10:
            advice.append("❄️ ठंड ज़्यादा है। फसलों को पाले से बचाएं।")
        if humidity > 80:
            advice.append("💧 नमी बहुत ज़्यादा है। फंगल रोगों का ध्यान रखें।")
    elif language == 'kn':
        if temp > 38:
            advice.append("🌡️ ತಾಪಮಾನ ತುಂಬಾ ಹೆಚ್ಚಿದೆ. ಸಂಜೆ ನೀರು ಹಾಕಿ.")
        elif temp > 30:
            advice.append("🌡️ ಬಿಸಿ ಹವಾಮಾನ. ಬೆಳೆಗಳ ತೇವಾಂಶ ಪರೀಕ್ಷಿಸಿ.")
        if humidity > 80:
            advice.append("💧 ಶಿಲೀಂಧ್ರ ರೋಗಗಳ ಬಗ್ಗೆ ಜಾಗರೂಕರಾಗಿರಿ.")
    elif language == 'te':
        if temp > 38:
            advice.append("🌡️ ఉష్ణోగ్రత చాలా ఎక్కువగా ఉంది. సాయంత్రం నీరు పెట్టండి.")
        elif temp > 30:
            advice.append("🌡️ వేడి వాతావరణం. పంట తేమను తనిఖీ చేయండి.")
        elif temp < 10:
            advice.append("❄️ చాలా చలిగా ఉంది. పంటలను మంచు నుండి రక్షించండి.")
        if humidity > 80:
            advice.append("💧 ఫంగల్ వ్యాధుల పట్ల జాగ్రత్తగా ఉండండి.")
    else:
        if temp > 38:
            advice.append("🌡️ Very high temperature. Water crops in the evening.")
        elif temp > 30:
            advice.append("🌡️ Hot weather. Check crop moisture levels.")
        elif temp < 10:
            advice.append("❄️ Very cold. Protect crops from frost damage.")
        if humidity > 80:
            advice.append("💧 High humidity. Watch for fungal diseases.")

    if not advice:
        defaults = {
            'hi': '✅ मौसम खेती के लिए अनुकूल है।',
            'kn': '✅ ಹವಾಮಾನ ಕೃಷಿಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ.',
            'te': '✅ వాతావరణం వ్యవసాయానికి అనుకూలంగా ఉంది.',
            'en': '✅ Weather conditions are favorable for farming.'
        }
        advice.append(defaults.get(language, defaults['en']))

    return advice
