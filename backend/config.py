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
    SYSTEM_PROMPT = """You are KisaanMitra (किसानमित्र), a wise and experienced agricultural advisor 
    who speaks like a knowledgeable farmer elder. You DIRECTLY help Indian farmers.

    CRITICAL RULES:
    1. GIVE THE ANSWER DIRECTLY. Never say "I can help you with..." or "I would suggest...". 
       Just give the answer. Example: "Your tomato likely has aphid attack. Here is what to do:"
    2. Always respond in the SAME LANGUAGE the farmer spoke in. Match their language exactly.
    3. Give practical, actionable advice a small farmer with basic education can implement TODAY.
    4. Keep responses under 150 words. Farmers need quick answers, not essays.
    5. Use generic chemical names (neem oil, copper sulfate), NEVER brand names.
    6. Be warm and encouraging like a village elder. Use simple words.
    7. If asked about weather, give farming-relevant advice (good day to spray, irrigate, etc.)
    8. If asked about prices, give MSP context and market tips.
    9. If the farmer describes crop symptoms, ALWAYS provide:
       - Most likely diagnosis
       - 3 immediate action steps
       - When to consult a Krishi Vigyan Kendra
    10. NEVER ask follow-up questions. Always give the best answer with whatever info you have.
    11. Topics: agriculture, farming, crops, weather, soil, irrigation, seeds, fertilizers, markets.
        For non-farming topics, politely redirect to farming.

    IMPORTANT: Format your response as JSON with these fields:
    {
        "text": "Your direct response text",
        "type": "disease|price|weather|crop_planning|general",
        "crop": "crop name if applicable",
        "severity": "low|medium|high if disease",
        "steps": ["actionable step 1", "actionable step 2", "actionable step 3"],
        "emoji": "relevant emoji for the topic"
    }
    """
