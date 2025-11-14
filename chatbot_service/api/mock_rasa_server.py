#!/usr/bin/env python3
"""
Mock Rasa Server for testing purposes
Provides a minimal Rasa-compatible API without requiring full Rasa
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
# Enable CORS for all routes - allows frontend to call this service
CORS(app, resources={r"/*": {"origins": "*"}})

# Simple NLU mock - maps keywords to intents
INTENT_PATTERNS = {
    'greet': ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    'goodbye': ['bye', 'goodbye', 'see you', 'farewell'],
    'medication_question': ['medication', 'medicine', 'drug', 'pill'],
    'symptom_inquiry': ['symptom', 'pain', 'ache', 'feel', 'hurt'],
    'mental_health': ['mental', 'stress', 'anxiety', 'depression', 'mood'],
    'emergency': ['emergency', 'urgent', 'help', 'alert', 'critical'],
}

RESPONSES = {
    'greet': 'Hello! I am HealthEcho, your virtual health assistant. How can I help you today?',
    'goodbye': 'Goodbye! Take care and remember to prioritize your health.',
    'medication_question': 'I can help you with medication information. Please tell me which medication you are asking about.',
    'symptom_inquiry': 'I understand you are experiencing some symptoms. Can you describe them in more detail?',
    'mental_health': 'I am here to support your mental health. How are you feeling?',
    'emergency': 'This sounds urgent. Please contact emergency services or go to the nearest hospital immediately.',
    'default': 'I am not sure I understand. Could you please rephrase that?'
}

def predict_intent(message):
    """Simple intent classifier"""
    message_lower = message.lower()
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if pattern in message_lower:
                return intent
    return 'default'

@app.route('/webhooks/rest/webhook', methods=['POST'])
def webhook():
    """Rasa-compatible webhook endpoint"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        sender = data.get('sender', 'default_user')
        
        if not message:
            return jsonify([{'text': 'Please provide a message'}]), 400
        
        # Predict intent
        intent = predict_intent(message)
        response_text = RESPONSES.get(intent, RESPONSES['default'])
        
        # Return Rasa-compatible format
        response = [{
            'recipient_id': sender,
            'text': response_text,
            'intent': intent,
            'timestamp': datetime.now().isoformat()
        }]
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/conversations/<sender>/tracker', methods=['GET'])
def get_tracker(sender):
    """Get conversation tracker"""
    return jsonify({
        'sender_id': sender,
        'slots': {},
        'events': [],
        'latest_input_channel': 'rest',
        'paused': False,
        'followup_action': None,
        'active_loop': None,
    }), 200

@app.route('/', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'Rasa server running (mock)'}), 200

if __name__ == '__main__':
    port = int(os.getenv('RASA_PORT', 5005))
    print(f"Mock Rasa Server starting on port {port}")
    app.run(
        debug=False,
        host='0.0.0.0',
        port=port,
        threaded=True
    )
