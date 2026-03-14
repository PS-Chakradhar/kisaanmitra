"""
KisaanMitra - Enhanced Price Service
Provides detailed market (mandi) price data with regional context.
"""

import json
import os
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

# Cache for API responses
price_cache = {
    'data': None,
    'timestamp': None,
    'cache_duration': 30 * 60
}


def load_price_data():
    """Load market price data from JSON file."""
    try:
        with open(os.path.join(DATA_DIR, 'market_prices.json'), 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {'commodities': []}


def get_detailed_price(crop_name: str, language: str = 'hi') -> dict:
    """Get detailed market price with regional information."""
    data = load_price_data()
    crop_lower = crop_name.lower().strip()

    matched = None
    for commodity in data.get('commodities', []):
        names = [
            commodity.get('name_en', '').lower(),
            commodity.get('name_hi', '').lower()
        ]
        if crop_lower in names or any(crop_lower in name for name in names):
            matched = commodity
            break

    if not matched:
        for commodity in data.get('commodities', []):
            all_names = ' '.join([
                commodity.get('name_en', ''),
                commodity.get('name_hi', '')
            ]).lower()
            if crop_lower in all_names:
                matched = commodity
                break

    if matched:
        name_key = f'name_{language}' if f'name_{language}' in matched else 'name_en'
        crop_display_name = matched.get(name_key, matched.get('name_en', crop_name))
        
        # Get markets with price range
        markets = matched.get('markets', [])
        if markets:
            prices = [m.get('modal_price', 0) for m in markets if m.get('modal_price')]
            min_price = min(prices) if prices else 0
            max_price = max(prices) if prices else 0
            avg_price = sum(prices) // len(prices) if prices else 0
        else:
            min_price = max_price = avg_price = 0

        return {
            'success': True,
            'crop': crop_display_name,
            'unit': matched.get('unit', 'quintal'),
            'min_price': min_price,
            'max_price': max_price,
            'avg_price': avg_price,
            'markets': markets,
            'trend': matched.get('trend', 'stable'),
            'season': matched.get('season', ''),
            'tips': matched.get('tips', {}).get(language, matched.get('tips', {}).get('en', '')),
            'investment': matched.get('investment', {}).get(language, ''),
            'returns': matched.get('returns', {}).get(language, ''),
            'advice': _get_price_advice(matched, language)
        }

    return {'success': False}


def get_price(crop_name: str, language: str = 'hi') -> dict:
    """Get market price for a specific crop."""
    result = get_detailed_price(crop_name, language)
    
    if result.get('success'):
        return {
            'success': True,
            'crop': result.get('crop'),
            'unit': result.get('unit', 'quintal'),
            'markets': result.get('markets', []),
            'price_trend': result.get('trend', 'stable'),
            'advice': result.get('advice', '')
        }
    
    not_found_msg = {
        'hi': f'"{crop_name}" की कीमत अभी उपलब्ध नहीं है।',
        'en': f'Price for "{crop_name}" is not available right now.'
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
        
        if markets:
            prices = [m.get('modal_price', 0) for m in markets if m.get('modal_price')]
            avg_price = sum(prices) // len(prices) if prices else 0
        else:
            avg_price = 0

        commodities.append({
            'name': crop_name,
            'price': avg_price,
            'unit': commodity.get('unit', 'quintal'),
            'trend': commodity.get('trend', 'stable'),
            'emoji': commodity.get('emoji', '🌾')
        })

    return {'success': True, 'commodities': commodities}


def format_price_for_ai(crop_name: str, language: str = 'hi') -> str:
    """Format price data - VERY CLEAR about quintal vs kg."""
    
    result = get_detailed_price(crop_name, language)
    
    if not result.get('success'):
        return None
    
    # IMPORTANT: Always say "per 100 kg" or "per quintal" to avoid confusion
    price_unit_hi = "प्रति 100 किलो (एक क्विंटल)"
    price_unit_en = "per 100 kg (one quintal)"
    
    if language == 'hi':
        # Build market info - VERY CLEAR
        market_list = []
        for m in result.get('markets', [])[:5]:
            market = m.get('market', 'Unknown')
            price = m.get('modal_price', 0)
            market_list.append(f"{market}: ₹{price} प्रति 100 किलो")
        
        markets_info = "। ".join(market_list)
        
        return f"""आज का {result.get('crop', crop_name)} का भाव:

नोट: सभी भाव प्रति 100 किलो (एक क्विंटल) हैं, प्रति किलो नहीं!

सबसे कम: ₹{result.get('min_price', 'NA')} प्रति 100 किलो
सबसे ज्यादा: ₹{result.get('max_price', 'NA')} प्रति 100 किलो
औसत: ₹{result.get('avg_price', 'NA')} प्रति 100 किलो

प्रमुख मंडी भाव (प्रति 100 किलो):
{markets_info}

बाजार ट्रेंड: {result.get('trend', 'NA')}
सीजन: {result.get('season', 'NA')}

किसान सलाह: {result.get('tips', '')}

निवेश: {result.get('investment', '')}
अपेक्षित मुनाफा: {result.get('returns', '')}"""
    
    else:  # English
        market_list = []
        for m in result.get('markets', [])[:5]:
            market = m.get('market', 'Unknown')
            price = m.get('modal_price', 0)
            market_list.append(f"{market}: Rs {price} per 100 kg")
        
        markets_info = ". ".join(market_list)
        
        return f"""Today's {result.get('crop', crop_name)} price:

NOTE: All prices are per 100 kg (one quintal), NOT per kg!

Minimum: Rs {result.get('min_price', 'NA')} per 100 kg
Maximum: Rs {result.get('max_price', 'NA')} per 100 kg  
Average: Rs {result.get('avg_price', 'NA')} per 100 kg

Major Market Prices (per 100 kg):
{markets_info}

Market Trend: {result.get('trend', 'NA')}
Season: {result.get('season', 'NA')}

Farmer's Tip: {result.get('tips', '')}

Investment: {result.get('investment', '')}
Expected Returns: {result.get('returns', '')}"""


def _get_price_advice(commodity: dict, language: str) -> str:
    """Generate price-related advice based on market trends."""
    trend = commodity.get('trend', 'stable')
    advice_map = {
        'hi': {
            'rising': 'कीमतें बढ़ रही हैं। अगर स्टॉक है तो थोड़ा रुकें।',
            'falling': 'कीमतें गिर रही हैं। जल्दी बेचना फायदेमंद हो सकता है।',
            'stable': 'कीमतें स्थिर हैं।'
        },
        'en': {
            'rising': 'Prices are rising. Consider waiting if you can store.',
            'falling': 'Prices are falling. Consider selling sooner.',
            'stable': 'Prices are stable.'
        }
    }
    lang_advice = advice_map.get(language, advice_map['en'])
    return lang_advice.get(trend, lang_advice['stable'])
