from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models.translationModels import translate_text, get_supported_languages
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

SUPPORTED_LANGS = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'pa', 'or', 'ur']

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Translation Service running'}), 200

@app.route('/api/translate', methods=['POST'])
def translate():
    """Translate medical text"""
    try:
        data = request.get_json()
        text = data.get('text')
        target_lang = data.get('target_lang', 'en')
        source_lang = data.get('source_lang', 'en')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        if target_lang not in SUPPORTED_LANGS:
            return jsonify({'error': f'Unsupported language: {target_lang}'}), 400

        translated = translate_text(text, source_lang, target_lang)

        return jsonify({
            'success': True,
            'original': text,
            'translated': translated,
            'source_lang': source_lang,
            'target_lang': target_lang
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/supported-languages', methods=['GET'])
def supported_languages():
    """Get list of supported languages"""
    languages = {
        'en': 'English',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'bn': 'Bengali',
        'pa': 'Punjabi',
        'or': 'Odia',
        'ur': 'Urdu'
    }
    return jsonify(languages), 200

@app.route('/api/batch-translate', methods=['POST'])
def batch_translate():
    """Translate multiple texts"""
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        target_lang = data.get('target_lang', 'en')

        results = []
        for text in texts:
            translated = translate_text(text, 'en', target_lang)
            results.append({
                'original': text,
                'translated': translated
            })

        return jsonify({
            'success': True,
            'count': len(results),
            'results': results
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development',
            host='0.0.0.0',
            port=int(os.getenv('TRANSLATION_PORT', 5004)))
