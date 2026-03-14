"""
KisaanMitra - AI Service (Ollama + Gemini Fallback)
Unlimited, offline-capable AI for agricultural advice.
"""

import json
import requests
from config import Config
import google.generativeai as genai

# Configure Gemini if API key available
if Config.GEMINI_API_KEY:
    genai.configure(api_key=Config.GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel(
        model_name=Config.GEMINI_MODEL,
        system_instruction=Config.SYSTEM_PROMPT_GEMINI
    )


def get_ollama_response(query: str, language: str, history: list = None) -> dict:
    """Get response from local Ollama server with conversation history."""
    if history is None:
        history = []
    
    lang_name = Config.LANGUAGES.get(language, {}).get('name', 'Hindi')
    
    # Build conversation context from history
    context = ""
    if history:
        context = "\n\nCHAT HISTORY (Farmer's previous questions and your answers):\n"
        for msg in history[-4:]:  # Last 4 messages for context
            context += f"- {msg['role'].capitalize()}: {msg['content']}\n"
        context += "\nIMPORTANT: The farmer's current question is a FOLLOW-UP to the conversation above. Use the chat history to understand the context!\n"
    
    prompt = f"""You are an experienced Indian agricultural expert helping farmers. {context}

Current question from farmer in {lang_name}: {query}

Instructions:
1. This is a follow-up question - use the chat history above to understand context
2. If farmer asks "why" or "how" or "details", elaborate on your previous answer
3. Give specific, actionable advice
4. Respond in {lang_name} language

Respond in this JSON format:
{{"text": "your answer here", "type": "disease/weather/price/general", "steps": ["step1", "step2", "step3"]}}"""

    try:
        response = requests.post(
            f"{Config.OLLAMA_BASE_URL}/api/generate",
            json={
                "model": Config.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get('response', '').strip()
            
            # Clean response - remove emoji prefix if present
            if response_text.startswith('🌾'):
                response_text = response_text[1:].strip()
            
            # Parse JSON response
            try:
                parsed = json.loads(response_text)
                return parsed
            except json.JSONDecodeError:
                # Try to extract JSON from text
                import re
                # Find JSON object - look for { followed by key-value pairs
                json_match = re.search(r'\{[^{}]*\}', response_text, re.DOTALL)
                if json_match:
                    try:
                        parsed = json.loads(json_match.group())
                        # Verify it has the expected fields
                        if 'text' in parsed:
                            return parsed
                    except:
                        pass
                
                # Try another approach - find content after "text":"
                text_match = re.search(r'"text"\s*:\s*"([^"]+)"', response_text)
                if text_match:
                    # Try to extract all fields
                    data = {'text': text_match.group(1)}
                    
                    type_match = re.search(r'"type"\s*:\s*"([^"]+)"', response_text)
                    if type_match: data['type'] = type_match.group(1)
                    
                    crop_match = re.search(r'"crop"\s*:\s*"([^"]+)"', response_text)
                    if crop_match: data['crop'] = crop_match.group(1)
                    
                    steps_matches = re.findall(r'"steps"\s*:\s*\[([^\]]+)\]', response_text)
                    if steps_matches:
                        steps = re.findall(r'"([^"]+)"', steps_matches[0])
                        data['steps'] = steps[:3]
                    
                    emoji_match = re.search(r'"emoji"\s*:\s*"([^"]+)"', response_text)
                    if emoji_match: data['emoji'] = emoji_match.group(1)
                    
                    return data
                
                # Return as plain text if nothing works
                return {
                    'text': response_text[:300],
                    'type': 'general',
                    'crop': '',
                    'steps': ['देखभाल करें', 'सिंचाई करें', 'खाद दें'],
                    'emoji': '🌾'
                }
        return None
    except Exception as e:
        print(f"Ollama Error: {e}")
        return None


def get_gemini_response(query: str, language: str) -> dict:
    """Get response from Google Gemini API as fallback."""
    if not Config.GEMINI_API_KEY:
        return None
        
    try:
        lang_name = Config.LANGUAGES.get(language, {}).get('name', 'Hindi')
        prompt = f"""
Please respond in {lang_name} language ONLY.
A farmer is asking: "{query}"
Provide practical farming advice in JSON format:
{{"text": "...", "type": "...", "crop": "...", "steps": ["...", "..."], "emoji": "..."}}
"""
        
        response = gemini_model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Parse JSON
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        try:
            result = json.loads(response_text)
            return result
        except json.JSONDecodeError:
            return {
                'text': response_text,
                'type': 'general',
                'crop': '',
                'severity': 'low',
                'steps': [],
                'emoji': '🌾'
            }
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None


def get_agricultural_advice(query: str, language: str = 'hi', history: list = None, lat: float = 28.6139, lon: float = 77.2090) -> dict:
    """
    Get agricultural advice using Ollama (primary) or Gemini (fallback).
    Priority: Ollama > Gemini > Offline Fallback
    Supports conversation history and location for weather queries.
    """
    if history is None:
        history = []
    
    # For languages that llama3.2 struggles with, use English
    if language not in ['hi', 'en']:
        language = 'en'
    
    # Check query type
    query_lower = query.lower()
    
    # Weather keywords
    weather_keywords = ['weather', 'मौसम', 'बारिश', 'temperature', 'तापमान', 'गर्मी', 'ठंड', 'forecast']
    # Planting keywords - be more specific to avoid false triggers
    planting_keywords = ['when to plant', 'when to sow', 'best time to plant', 'best time to sow', 
                        'रोपने का समय', 'बुवाई का समय', 'कब लगाए', 'कब बोए']
    
    is_weather_query = any(kw.lower() in query_lower for kw in weather_keywords) or any(kw in query for kw in weather_keywords)
    has_planting = any(kw.lower() in query_lower for kw in planting_keywords) or any(kw in query for kw in planting_keywords)
    
    # DISEASE/SYMPTOM queries should ALWAYS go to AI - before weather check!
    # Query contains symptoms like yellow leaves, spots, pests, etc.
    disease_keywords = ['yellow', 'yellowing', 'leaves', 'pale', 'spots', 'disease', 'pest', 'insect', 
                       'पील', 'पत्ता', 'कीड़ा', 'रोग', 'बीमारी', 'सूख', 'मर', 'diseased', 'sick', 'turning',
                       'पीले हो', 'पीलापन', 'कीट', 'problem', 'issue', 'help', 'treatment', 'cure']
    is_disease_query = any(kw in query_lower for kw in disease_keywords) or any(kw in query for kw in disease_keywords)
    
    # If it's a disease/symptom query, skip weather and go directly to AI
    if is_disease_query:
        print(f"🔍 Detected disease/symptom query - going to AI")
    
    # For weather OR planting queries, get weather data + planting advice
    # BUT skip if it's a disease/symptom query - those go to AI!
    if (is_weather_query or has_planting) and not is_disease_query:
        from services.weather_service import get_weather_for_ai, get_planting_advice, get_weather
        
        weather_text = get_weather_for_ai(lat, lon, language)
        
        if weather_text:
            # Check if they also asked about planting a crop
            final_text = weather_text
            
            if has_planting:
                # Try to find which crop they want to plant
                crops = ['tomato', 'onion', 'potato', 'wheat', 'rice', 'cotton', 'soybean', 'maize',
                        'टमाटर', 'प्याज', 'आलू', 'गेहूँ', 'धान', 'कपास']
                found_crop = None
                for crop in crops:
                    if crop in query_lower or crop in query:
                        found_crop = crop
                        break
                
                if found_crop:
                    # Get weather data for planting advice
                    weather_data = get_weather(lat, lon, language)
                    planting_advice = get_planting_advice(found_crop, weather_data, language)
                    if planting_advice:
                        final_text = weather_text + "\n\n" + planting_advice
            
            return {
                'success': True,
                'data': {
                    'text': final_text,
                    'type': 'weather',
                    'crop': '',
                    'steps': ['मौसम देखकर काम करें', 'सही समय का इंतजार करें', 'मौसम अनुकूल होने पर काम शुरू करें'] if language == 'hi' else ['Check weather before work', 'Wait for right time', 'Start when conditions are favorable'],
                    'emoji': '🌦️'
                },
                'language': language,
                'provider': 'weather_service'
            }
    
    # Check if this is a price-related query
    price_keywords = ['price', 'rate', 'cost', 'भाव', 'कीमत', 'दाम', 'मूल्य']
    crop_keywords = ['tomato', 'onion', 'potato', 'wheat', 'rice', 'cotton', 'soybean', 'maize', 
                   'टमाटर', 'प्याज', 'आलू', 'गेहूँ', 'धान', 'कपास', 'सोयाबीन', 'मक्का']
    
    # Check for keywords - expanded for Hindi
    query_lower = query.lower()
    price_keywords = ['price', 'rate', 'cost', 'भाव', 'कीमत', 'दाम', 'मूल्य']
    crop_keywords = ['tomato', 'onion', 'potato', 'wheat', 'rice', 'cotton', 'soybean', 'maize',
                   'टमाटर', 'प्याज', 'आलू', 'गेहूँ', 'धान', 'कपास', 'सोयाबीन', 'मक्का',
                   'tomato', 'onion', 'potato', 'aloo', 'pyaj', 'pyaaz']
    
    is_price_query = any(kw.lower() in query_lower for kw in price_keywords) or any(kw in query for kw in price_keywords)
    has_crop = any(kw.lower() in query_lower for kw in crop_keywords) or any(kw in query for kw in crop_keywords)
    
    # Only treat as price query if they explicitly ask about price
    # NOT just because they mention a crop
    # Removed: incorrectly forcing price for any crop mention
    
    # Get detailed price info for price queries
    if is_price_query and has_crop:
        from services.price_service import format_price_for_ai, get_detailed_price
        crop_name = query
        # Try to find which crop they're asking about
        crops = ['tomato', 'onion', 'potato', 'wheat', 'rice', 'cotton', 'soybean', 'maize']
        found_crop = None
        for crop in crops:
            if crop in query.lower():
                found_crop = crop
                break
        
        if found_crop:
            price_text = format_price_for_ai(found_crop, language)
            if price_text:
                return {
                    'success': True,
                    'data': {
                        'text': price_text,
                        'type': 'price',
                        'crop': found_crop,
                        'steps': ['जांचें अपनी स्थानीय मंडी', 'सही समय पर बेचें', 'MSP जानें'] if language == 'hi' else ['Check local mandi', 'Sell at right time', 'Know MSP'],
                        'emoji': '💰'
                    },
                    'language': language,
                    'provider': 'price_service'
                }
    
    # Try with specified language (or fallback to English)
    if Config.USE_OLLAMA:
        result = get_ollama_response(query, language, history)
        if result:
            return {
                'success': True,
                'data': ensure_fields(result),
                'language': language,  # Return original requested language
                'provider': 'ollama'
            }
    
    # Fallback to Gemini if available
    if Config.USE_GEMINI_FALLBACK and Config.GEMINI_API_KEY:
        result = get_gemini_response(query, language)
        if result:
            return {
                'success': True,
                'data': ensure_fields(result),
                'language': language,
                'provider': 'gemini'
            }
    
    # Ultimate fallback - return offline message
    return {
        'success': False,
        'data': get_offline_fallback(language),
        'language': language,
        'provider': 'offline'
    }


def ensure_fields(data: dict) -> dict:
    """Ensure all required fields exist in the response."""
    text = data.get('text', '')
    # Clean up text - remove newlines and extra spaces
    text = ' '.join(text.split())[:500]
    
    steps = data.get('steps', [])
    
    # Clean steps - ensure exactly 3 simple items
    if isinstance(steps, list):
        cleaned_steps = []
        for s in steps:
            if s:
                # Clean each step - remove newlines, extra spaces
                step = ' '.join(str(s).split())
                # Keep only first 50 chars per step
                if len(step) > 50:
                    step = step[:50]
                if len(step) > 3:
                    cleaned_steps.append(step)
        # Ensure exactly 3 steps
        while len(cleaned_steps) < 3:
            cleaned_steps.append('देखभाल करें' if data.get('language') == 'hi' else 'Take care')
        steps = cleaned_steps[:3]
    else:
        steps = ['देखभाल करें', 'सिंचाई करें', 'खाद दें'] if data.get('language') == 'hi' else ['Take care', 'Irrigate', 'Fertilize']
    
    return {
        'text': text,
        'type': data.get('type', 'general'),
        'crop': data.get('crop', ''),
        'severity': data.get('severity', 'low'),
        'steps': steps,
        'emoji': data.get('emoji', '🌾')
    }


def _is_garbled(text: str) -> bool:
    """Check if text appears garbled or nonsensical."""
    if not text:
        return True
    # Check for unusual character ratios
    # Count readable Indic characters vs garbled
    import re
    # Check for broken/mixed scripts
    if re.search(r'[\u0900-\u0fff].*[\u1700-\u1fff]', text):  # Mixed scripts
        return True
    # Check for very short responses with unusual chars
    if len(text) < 40 and re.search(r'[\u0b80-\u0bff]', text):
        return True
    return False


def get_offline_fallback(language: str) -> dict:
    """Return offline fallback messages with static agricultural info."""
    fallbacks = {
        'hi': {
            'text': 'इंटरनेट नहीं है। आप मंडी भाव और फसल कैलेंडर ऑफलाइन देख सकते हैं।',
            'type': 'offline',
            'crop': '',
            'severity': 'low',
            'steps': ['मंडी भाव देखें', 'फसल कैलेंडर देखें', 'ऑफलाइन मदद लें'],
            'emoji': '📡'
        },
        'kn': {
            'text': 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲ. ಮಂಡಿ ಬೆಲೆ ಮತ್ತು ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ನೋಡಿ.',
            'type': 'offline',
            'crop': '',
            'severity': 'low',
            'steps': ['ಮಂಡಿ ಬೆಲೆ ನೋಡಿ', 'ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್ ನೋಡಿ', 'ಆಫ್‌ಲೈನ್ ಸಹಾಯ ಪಡೆಯಿರಿ'],
            'emoji': '📡'
        },
        'te': {
            'text': 'ఇంటర్నెట్ లేదు. మార్కెట్ ధరలు మరియు పంట日历 నిల్వ ఉంది.',
            'type': 'offline',
            'crop': '',
            'severity': 'low',
            'steps': ['మార్కెట్ ధరలు చూడు', 'పంట calendar చూడు', 'ఆఫ్‌లైన్ సహాయం తీసుకు'],
            'emoji': '📡'
        },
        'ta': {
            'text': 'இணையம் இல்லை. சந்தை விலை மற்றும் பயிர் ந takvim ஆஃப்லைன் கிடைக்கும்.',
            'type': 'offline',
            'crop': '',
            'severity': 'low',
            'steps': ['சந்தை விளைக்கு பார்க்க', 'பயிர் calendar பார்க்க', 'ஆஃப்லைன் உதவி பெற'],
            'emoji': '📡'
        },
        'en': {
            'text': 'No internet. You can view market prices and crop calendar offline.',
            'type': 'offline',
            'crop': '',
            'severity': 'low',
            'steps': ['View Market Prices', 'View Crop Calendar', 'Get Offline Help'],
            'emoji': '📡'
        }
    }
    return fallbacks.get(language, fallbacks['en'])