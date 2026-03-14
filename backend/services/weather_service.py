"""
KisaanMitra - Enhanced Weather Service
Provides current weather, 3-day forecast, and farming advice.
"""

import requests
from datetime import datetime
from config import Config

BASE_URL = "https://api.openweathermap.org/data/2.5"

# Weather cache
weather_cache = {
    'data': None,
    'timestamp': None,
    'cache_duration': 30 * 60
}


def get_weather(lat: float, lon: float, language: str = 'hi') -> dict:
    """Get current weather and 3-day forecast for a location."""
    
    # Check cache
    if weather_cache['data'] and weather_cache['timestamp']:
        cache_age = (datetime.now() - weather_cache['timestamp']).total_seconds()
        if cache_age < weather_cache['cache_duration']:
            return weather_cache['data']
    
    try:
        params = {
            'lat': lat, 'lon': lon,
            'appid': Config.WEATHER_API_KEY,
            'units': 'metric', 
            'lang': 'en'
        }

        current_response = requests.get(f"{BASE_URL}/weather", params=params, timeout=10)
        current_data = current_response.json()

        forecast_response = requests.get(f"{BASE_URL}/forecast", params=params, timeout=10)
        forecast_data = forecast_response.json()

        if current_response.status_code != 200:
            return _get_offline_weather(language)

        weather = {
            'success': True,
            'current': {
                'temperature': round(current_data['main']['temp']),
                'feels_like': round(current_data['main']['feels_like']),
                'humidity': current_data['main']['humidity'],
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon'],
                'wind_speed': round(current_data['wind']['speed'] * 3.6, 1),
                'city': current_data.get('name', 'Your Location'),
                'condition': current_data['weather'][0]['main']
            },
            'forecast': [],
            'farming_advice': []
        }

        # Get 3-day forecast
        seen_dates = set()
        for item in forecast_data.get('list', []):
            date = item['dt_txt'].split(' ')[0]
            if date not in seen_dates and '12:00:00' in item['dt_txt']:
                seen_dates.add(date)
                weather['forecast'].append({
                    'date': date,
                    'day': _get_day_name(date, language),
                    'temperature': round(item['main']['temp']),
                    'min_temp': round(item['main']['temp_min']),
                    'max_temp': round(item['main']['temp_max']),
                    'humidity': item['main']['humidity'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'rain_chance': int(item.get('pop', 0) * 100),
                    'condition': item['weather'][0]['main']
                })
            if len(weather['forecast']) >= 3:
                break

        weather['farming_advice'] = _generate_farming_advice(weather['current'], weather['forecast'], language)
        
        weather_cache['data'] = weather
        weather_cache['timestamp'] = datetime.now()
        
        return weather

    except Exception as e:
        print(f"Weather API Error: {str(e)}")
        return _get_offline_weather(language)


def _get_day_name(date_str: str, language: str) -> str:
    """Get day name from date string."""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        days_hi = ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार']
        days_en = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        if language == 'hi':
            return days_hi[date.weekday()]
        return days_en[date.weekday()]
    except:
        return ''


def _translate_weather_desc(desc: str) -> str:
    """Translate weather description to Hindi."""
    translations = {
        'clear sky': 'साफ आसमान',
        'few clouds': 'कुछ बादल',
        'scattered clouds': 'बिखरे बादल',
        'broken clouds': 'टूटे बादल',
        'overcast clouds': 'घने बादल',
        'light rain': 'हल्की बारिश',
        'moderate rain': 'मध्यम बारिश',
        'heavy rain': 'भारी बारिश',
        'shower rain': 'झीली बारिश',
        'thunderstorm': 'तूफान',
        'mist': 'कोहरा',
        'fog': 'धुंध',
        'sunny': 'धूप',
        'partly cloudy': 'आंशिक रूप से बादलवाला'
    }
    return translations.get(desc.lower(), desc)


def _get_offline_weather(language: str) -> dict:
    """Return offline weather data."""
    return {
        'success': False,
        'error': 'Weather data unavailable',
        'current': {
            'temperature': 28, 'feels_like': 30, 'humidity': 65,
            'description': 'Partly cloudy', 'icon': '02d', 'wind_speed': 12,
            'city': 'Your Location', 'condition': 'Clouds'
        },
        'forecast': [
            {'date': '2026-03-15', 'day': 'Sunday' if language == 'en' else 'रविवार',
             'temperature': 30, 'min_temp': 22, 'max_temp': 32, 'humidity': 60,
             'description': 'Sunny', 'icon': '01d', 'rain_chance': 10, 'condition': 'Clear'},
            {'date': '2026-03-16', 'day': 'Monday' if language == 'en' else 'सोमवार',
             'temperature': 28, 'min_temp': 20, 'max_temp': 31, 'humidity': 70,
             'description': 'Cloudy', 'icon': '03d', 'rain_chance': 30, 'condition': 'Clouds'},
            {'date': '2026-03-17', 'day': 'Tuesday' if language == 'en' else 'मंगलवार',
             'temperature': 25, 'min_temp': 18, 'max_temp': 28, 'humidity': 80,
             'description': 'Light rain', 'icon': '10d', 'rain_chance': 60, 'condition': 'Rain'}
        ],
        'farming_advice': ['मौसम डेटा के लिए इंटरनेट चाहिए' if language == 'hi' else 'Internet needed for weather'],
        'is_offline': True
    }


def _generate_farming_advice(current: dict, forecast: list, language: str) -> list:
    """Generate detailed farming advice based on weather."""
    advice = []
    temp = current.get('temperature', 25)
    humidity = current.get('humidity', 50)
    condition = current.get('condition', 'Clear')
    
    if language == 'hi':
        if temp > 38:
            advice.append("तापमान बहुत ज़्यादा है। फसलों को शाम को पानी दें।")
        elif temp > 32:
            advice.append("गर्म मौसम है। पौधों की नमी जाँचें।")
        elif temp < 5:
            advice.append("ठंड ज़्यादा है। सब्जियों को पाले से बचाएं।")
        
        if humidity > 85:
            advice.append("नमी बहुत ज़्यादा है। फफूंद रोग का खतरा।")
        elif humidity < 30:
            advice.append("हवा में नमी कम है। सिंचाई बढ़ाएं।")
        
        if condition == 'Rain':
            advice.append("बारिश हो रही है। सिंचाई रोकें।")
        
        if not advice:
            advice.append("मौसम खेती के लिए अनुकूल है।")
            
    else:
        if temp > 38:
            advice.append("Very high temperature. Water crops in evening.")
        elif temp > 32:
            advice.append("Hot weather. Check plant moisture.")
        elif temp < 5:
            advice.append("Very cold. Protect crops from frost.")
        
        if humidity > 85:
            advice.append("High humidity. Risk of fungal diseases.")
        elif humidity < 30:
            advice.append("Low humidity. Increase irrigation.")
        
        if condition == 'Rain':
            advice.append("Raining now. Stop irrigation.")
        
        if not advice:
            advice.append("Weather is favorable for farming.")
    
    return advice


def get_weather_for_ai(lat: float, lon: float, language: str = 'hi') -> str:
    """Format weather data for AI to use in responses."""
    
    weather = get_weather(lat, lon, language)
    current = weather.get('current', {})
    forecast = weather.get('forecast', [])
    
    if not weather.get('success') and not weather.get('is_offline'):
        return None
    
    # Build forecast text - clean format for TTS - NO English mixed
    forecast_parts = []
    for f in forecast[:3]:
        day = f.get('day', '')
        desc = f.get('description', '')
        min_t = f.get('min_temp', 0)
        max_t = f.get('max_temp', 0)
        rain = f.get('rain_chance', 0)
        
        # Translate weather description to Hindi if needed
        if language == 'hi':
            desc = _translate_weather_desc(desc)
            rain_text = f"{rain} प्रतिशत बारिश की संभावना"
        else:
            rain_text = f"{rain} percent rain chance"
        
        if language == 'hi':
            forecast_parts.append(f"{day}: {desc}, {min_t} से {max_t} डिग्री, {rain_text}")
        else:
            forecast_parts.append(f"{day}: {desc}, {min_t} to {max_t} degree, {rain_text}")
    
    forecast_text = " . ".join(forecast_parts)
    
    if language == 'hi':
        return f"""आज का मौसम आपके क्षेत्र में: तापमान {current.get('temperature', 'NA')} डिग्री सेल्सियस, महसूस होता है {current.get('feels_like', 'NA')} डिग्री, नमी {current.get('humidity', 'NA')} प्रतिशत, हवा {current.get('wind_speed', 'NA')} किलोमीटर प्रति घंटा। अगले तीन दिन का पूर्वानुमान: {forecast_text}। कृषि सलाह: {'। '.join(weather.get('farming_advice', []))}।"""
    else:
        return f"""Current weather in your area: Temperature {current.get('temperature', 'NA')} degree Celsius, feels like {current.get('feels_like', 'NA')} degree, humidity {current.get('humidity', 'NA')} percent, wind {current.get('wind_speed', 'NA')} km per hour. Three day forecast: {forecast_text}. Farming advice: {'. '.join(weather.get('farming_advice', []))}."""


def get_planting_advice(crop: str, weather_data: dict, language: str = 'hi') -> str:
    """Give planting advice based on weather conditions."""
    
    current = weather_data.get('current', {})
    forecast = weather_data.get('forecast', [])
    temp = current.get('temperature', 25)
    rain_expected = any(f.get('rain_chance', 0) > 50 for f in forecast[:3])
    
    crop_requirements = {
        'tomato': {'min_temp': 15, 'max_temp': 35, 'rain_ok': False},
        'onion': {'min_temp': 10, 'max_temp': 30, 'rain_ok': False},
        'potato': {'min_temp': 10, 'max_temp': 25, 'rain_ok': True},
        'wheat': {'min_temp': 10, 'max_temp': 25, 'rain_ok': True},
        'rice': {'min_temp': 20, 'max_temp': 35, 'rain_ok': True},
        'cotton': {'min_temp': 20, 'max_temp': 40, 'rain_ok': False},
    }
    
    crop_lower = crop.lower()
    req = crop_requirements.get(crop_lower)
    
    if not req:
        return None
    
    can_plant = True
    reasons = []
    
    if temp < req['min_temp']:
        can_plant = False
        reasons.append(f"तापमान कम (अभी {temp}C, जरूरी {req['min_temp']}C)")
    
    if temp > req['max_temp']:
        can_plant = False
        reasons.append(f"तापमान ज्यादा (अभी {temp}C, ज्यादा से ज्यादा {req['max_temp']}C)")
    
    if rain_expected and not req['rain_ok']:
        reasons.append("बारिश expected - रोपण टालें")
    
    if can_plant:
        return "मौसम अनुकूल है! रोपण कर सकते हैं।"
    else:
        return f"मौसम अनुकूल नहीं: {' | '.join(reasons)}"
