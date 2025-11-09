from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from models.entity_extractor import extract_entities
from preprocessing.text_cleaner import clean_text
from utils.config import logger

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'NLP Service running'}), 200

@app.route('/api/extract', methods=['POST'])
def extract_medical_entities():
    """Extract medical entities from text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        report_id = data.get('report_id')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Clean text
        cleaned_text = clean_text(text)

        # Extract entities
        extraction_result = extract_entities(cleaned_text, report_id)

        logger.info(f"Extraction completed for report {report_id}")

        return jsonify({
            'success': True,
            'report_id': report_id,
            'extracted_data': extraction_result
        }), 200

    except Exception as e:
        logger.error(f"Extraction failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/extract-batch', methods=['POST'])
def extract_batch():
    """Extract from multiple reports"""
    try:
        data = request.get_json()
        reports = data.get('reports', [])

        results = []
        for report in reports:
            text = report.get('text', '')
            report_id = report.get('report_id')
            
            if text:
                cleaned_text = clean_text(text)
                extraction = extract_entities(cleaned_text, report_id)
                results.append({
                    'report_id': report_id,
                    'data': extraction
                })

        return jsonify({
            'success': True,
            'total': len(results),
            'results': results
        }), 200

    except Exception as e:
        logger.error(f"Batch extraction failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/status/<report_id>', methods=['GET'])
def get_status(report_id):
    """Get extraction status"""
    return jsonify({'status': 'completed', 'report_id': report_id}), 200

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development', 
            host='0.0.0.0', 
            port=int(os.getenv('NLP_PORT', 5001)))
