"""
KisaanMitra - Gemini AI Service
Handles all interactions with Google Gemini API for agricultural advice.
"""

import json
import google.generativeai as genai
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

model = genai.GenerativeModel(
    model_name=Config.GEMINI_MODEL,
    system_instruction=Config.SYSTEM_PROMPT
)


def get_agricultural_advice(query: str, language: str = 'hi') -> dict:
    """Send a farmer's query to Gemini and get structured agricultural advice."""
    try:
        lang_name = Config.LANGUAGES.get(language, {}).get('name', 'Hindi')
        prompt = f"""
	Please respond in {lang_name} language ONLY.
	A farmer is asking the following question in {lang_name}:
	"{query}"

	Please respond in {lang_name} language only.
	Provide practical farming advice.
	Remember to format your response as the JSON structure specified.
	"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Parse JSON from Gemini response (may be wrapped in markdown)
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0].strip()

        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            result = {
                'text': response.text.strip(),
                'type': 'general',
                'crop': '',
                'severity': 'low',
                'steps': [],
                'emoji': '🌾'
            }

        # Ensure all required fields exist
        result.setdefault('text', '')
        result.setdefault('type', 'general')
        result.setdefault('crop', '')
        result.setdefault('severity', 'low')
        result.setdefault('steps', [])
        result.setdefault('emoji', '🌾')

        return {'success': True, 'data': result, 'language': language}

    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        fallback_messages = {
            'hi': 'माफ़ कीजिए, अभी जवाब देने में दिक्कत हो रही है। कृपया दोबारा कोशिश करें।',
            'kn': 'ಕ್ಷಮಿಸಿ, ಈಗ ಉತ್ತರಿಸಲು ಸಮಸ್ಯೆ ಆಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
            'te': 'క్షమించండి, ఇప్పుడు సమాధానం ఇవ్వడంలో సమస్య ఉంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
            'en': 'Sorry, having trouble responding right now. Please try again.',
            'ta': 'மன்னிக்கவும், இப்போது பதிலளிக்க சிக்கல் உள்ளது. மீண்டும் முயற்சிக்கவும்.'
        }
        return {
            'success': False,
            'data': {
                'text': fallback_messages.get(language, fallback_messages['en']),
                'type': 'error', 'crop': '', 'severity': 'low', 'steps': [], 'emoji': '⚠️'
            },
            'language': language
        }


def get_crop_disease_info(symptoms: str, crop: str, language: str = 'hi') -> dict:
    """Specialized function for crop disease diagnosis."""
    query = f"My {crop} has these symptoms: {symptoms}" if language == 'en' else symptoms
    return get_agricultural_advice(query, language)
