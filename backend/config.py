"""
KisaanMitra - Configuration Module
Loads environment variables and defines app-wide settings.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration."""

    # API Keys
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    WEATHER_API_KEY = os.getenv('WEATHER_API_KEY', '')

    # Flask Settings
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5001

    # CORS Settings
    CORS_ORIGINS = ['*']

    # Gemini Settings
    GEMINI_MODEL = 'gemini-2.5-flash'

    # Supported Languages
    LANGUAGES = {
        'hi': {
            'name': 'Hindi',
            'native_name': 'हिंदी',
            'code': 'hi-IN',
            'greeting': 'नमस्ते! मैं किसानमित्र हूँ। आपकी क्या मदद कर सकता हूँ?'
        },
        'kn': {
            'name': 'Kannada',
            'native_name': 'ಕನ್ನಡ',
            'code': 'kn-IN',
            'greeting': 'ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್\u200cಮಿತ್ರ. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
        },
        'en': {
            'name': 'English',
            'native_name': 'English',
            'code': 'en-IN',
            'greeting': 'Hello! I am KisaanMitra. How can I help you today?'
        },
        'ta': {
            'name': 'Tamil',
            'native_name': 'தமிழ்',
            'code': 'ta-IN',
            'greeting': 'வணக்கம்! நான் கிசான்மித்ரா. நான் எப்படி உதவ முடியும்?'
        },
        'te': {
            'name': 'Telugu',
            'native_name': 'తెలుగు',
            'code': 'te-IN',
            'greeting': 'నమస్కారం! నేను కిసాన్‌మిత్ర. మీకు ఎలా సహాయపడగలను?'
        }
    }

    # Agricultural context for Gemini prompts
    SYSTEM_PROMPT = """You are KisaanMitra (Farmer's Friend), an AI agricultural advisor 
    designed to help Indian farmers. You must:
    
    1. Respond ONLY about agriculture, farming, crops, weather, and related topics
    2. Give practical, actionable advice that a small farmer can implement
    3. Use simple language that a person with basic education can understand
    4. Always respond in the SAME LANGUAGE the farmer asked in
    5. If the farmer describes crop symptoms, provide:
       - Likely diagnosis (disease/pest/deficiency)
       - Immediate treatment steps
       - Prevention measures for future
       - Whether they need to consult a local agricultural officer
    6. If asked about market prices, provide context about price trends
    7. If asked about weather, relate it to farming activities
    8. Keep responses concise (under 200 words)
    9. Never recommend specific branded chemicals - use generic names
    10. Be empathetic and encouraging - farming is hard work
    
    IMPORTANT: Format your response as JSON with these fields:
    {
        "text": "Your main response text",
        "type": "disease|price|weather|crop_planning|general",
        "crop": "crop name if applicable",
        "severity": "low|medium|high if disease",
        "steps": ["step 1", "step 2", "step 3"],
        "emoji": "relevant emoji for the topic"
    }
    """
