"""
KisaanMitra - Market Price Service
Provides market (mandi) price data for agricultural commodities.
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')


def load_price_data():
    """Load market price data from JSON file."""
    try:
        with open(os.path.join(DATA_DIR, 'market_prices.json'), 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {'commodities': []}


def get_price(crop_name: str, language: str = 'hi') -> dict:
    """Get market price for a specific crop."""
    data = load_price_data()
    crop_lower = crop_name.lower().strip()

    matched = None
    for commodity in data.get('commodities', []):
        names = [
            commodity.get('name_en', '').lower(),
            commodity.get('name_hi', '').lower(),
            commodity.get('name_kn', '').lower()
        ]
        if crop_lower in names or any(crop_lower in name for name in names):
            matched = commodity
            break

    if not matched:
        for commodity in data.get('commodities', []):
            all_names = ' '.join([
                commodity.get('name_en', ''),
                commodity.get('name_hi', ''),
                commodity.get('name_kn', '')
            ]).lower()
            if crop_lower in all_names:
                matched = commodity
                break

    if matched:
        name_key = f'name_{language}' if f'name_{language}' in matched else 'name_en'
        crop_display_name = matched.get(name_key, matched.get('name_en', crop_name))
        return {
            'success': True,
            'crop': crop_display_name,
            'unit': matched.get('unit', 'quintal'),
            'markets': matched.get('markets', []),
            'price_trend': matched.get('trend', 'stable'),
            'advice': _get_price_advice(matched, language)
        }

    not_found_msg = {
        'hi': f'"{crop_name}" की कीमत अभी उपलब्ध नहीं है।',
        'kn': f'"{crop_name}" ಬೆಲೆ ಲಭ್ಯವಿಲ್ಲ.',
        'te': f'"{crop_name}" ధర ప్రస్తుతం అందుబాటులో లేదు.',
        'en': f'Price for "{crop_name}" is not available right now.',
        'ta': f'"{crop_name}" விலை இப்போது கிடைக்கவில்லை.'
    }
    return {'success': False, 'message': not_found_msg.get(language, not_found_msg['en'])}


def get_all_prices(language: str = 'hi') -> dict:
    """Get prices for all available commodities."""
    data = load_price_data()
    commodities = []
    name_key = f'name_{language}'

    for commodity in data.get('commodities', []):
        crop_name = commodity.get(name_key, commodity.get('name_en', ''))
        markets = commodity.get('markets', [])
        avg_price = markets[0].get('modal_price', 0) if markets else 0

        commodities.append({
            'name': crop_name,
            'price': avg_price,
            'unit': commodity.get('unit', 'quintal'),
            'trend': commodity.get('trend', 'stable'),
            'emoji': commodity.get('emoji', '🌾')
        })

    return {'success': True, 'commodities': commodities}


def _get_price_advice(commodity: dict, language: str) -> str:
    """Generate price-related advice based on market trends."""
    trend = commodity.get('trend', 'stable')
    advice_map = {
        'hi': {
            'rising': '📈 कीमतें बढ़ रही हैं। अगर स्टॉक है तो थोड़ा रुकें।',
            'falling': '📉 कीमतें गिर रही हैं। जल्दी बेचना फायदेमंद हो सकता है।',
            'stable': '📊 कीमतें स्थिर हैं।'
        },
        'kn': {
            'rising': '📈 ಬೆಲೆಗಳು ಹೆಚ್ಚುತ್ತಿವೆ. ಸ್ವಲ್ಪ ಕಾಯಿರಿ.',
            'falling': '📉 ಬೆಲೆಗಳು ಕಡಿಮೆಯಾಗುತ್ತಿವೆ. ಬೇಗ ಮಾರಾಟ ಮಾಡಿ.',
            'stable': '📊 ಬೆಲೆಗಳು ಸ್ಥಿರವಾಗಿವೆ.'
        },
        'te': {
            'rising': '📈 ధరలు పెరుగుతున్నాయి. వేచి ఉండండి.',
            'falling': '📉 ధరలు పడిపోతున్నాయి. త్వరగా విక్రయించండి.',
            'stable': '📊 ధరలు స్థిరంగా ఉన్నాయి.'
        },
        'en': {
            'rising': '📈 Prices are rising. Consider waiting if you can store.',
            'falling': '📉 Prices are falling. Consider selling sooner.',
            'stable': '📊 Prices are stable.'
        }
    }
    lang_advice = advice_map.get(language, advice_map['en'])
    return lang_advice.get(trend, lang_advice['stable'])
