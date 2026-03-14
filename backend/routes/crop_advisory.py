"""
KisaanMitra - Crop Advisory Routes
"""

from flask import Blueprint, request, jsonify
from services.ai_service import get_agricultural_advice

crop_bp = Blueprint('crop', __name__)


@crop_bp.route('/query', methods=['POST'])
def handle_query():
    """Main query endpoint. Receives farmer's voice-transcribed text."""
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'success': False, 'error': 'No query provided'}), 400

        query = data['query'].strip()
        language = data.get('language', 'hi')
        history = data.get('history', [])
        lat = data.get('lat', 28.6139)  # Default Delhi
        lon = data.get('lon', 77.2090)
        
        print(f"\n📥 Query: {query}")
        print(f"📥 Language: {language}")
        print(f"📥 History ({len(history)} items): {history}")
        
        if not query:
            return jsonify({'success': False, 'error': 'Empty query'}), 400

        result = get_agricultural_advice(query, language, history, lat, lon)
        return jsonify(result)

    except Exception as e:
        print(f"Query Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to process query'}), 500


@crop_bp.route('/diagnose', methods=['POST'])
def diagnose_disease():
    """Specialized disease diagnosis endpoint."""
    try:
        data = request.get_json()
        if not data or 'symptoms' not in data:
            return jsonify({'success': False, 'error': 'No symptoms provided'}), 400

        symptoms = data['symptoms']
        crop = data.get('crop', 'unknown crop')
        language = data.get('language', 'hi')

        query = f"My {crop} has: {symptoms}. What disease is this and what should I do?"
        result = get_agricultural_advice(query, language)
        return jsonify(result)

    except Exception as e:
        print(f"Diagnosis Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to diagnose'}), 500


@crop_bp.route('/status', methods=['GET'])
def get_ai_status():
    """Check which AI provider is available."""
    from config import Config
    import requests
    
    ollama_available = False
    try:
        response = requests.get(f"{Config.OLLAMA_BASE_URL}/api/tags", timeout=2)
        ollama_available = response.status_code == 200
    except:
        pass
    
    return jsonify({
        'ollama': {
            'available': ollama_available,
            'model': Config.OLLAMA_MODEL if Config.USE_OLLAMA else None,
            'url': Config.OLLAMA_BASE_URL
        },
        'gemini': {
            'available': bool(Config.GEMINI_API_KEY),
            'model': Config.GEMINI_MODEL if Config.GEMINI_API_KEY else None
        }
    })