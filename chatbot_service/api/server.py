from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

RASA_SERVER_URL = os.getenv('RASA_URL', 'http://localhost:5005')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Chatbot Service running'}), 200

@app.route('/webhooks/rest/webhook', methods=['POST'])
def handle_message():
    """Handle incoming messages and forward to Rasa"""
    try:
        data = request.get_json()
        sender = data.get('sender')
        message = data.get('message')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Forward to Rasa
        rasa_response = requests.post(
            f"{RASA_SERVER_URL}/webhooks/rest/webhook",
            json={'sender': sender, 'message': message}
        )

        bot_messages = rasa_response.json()

        return jsonify(bot_messages), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations/<sender>', methods=['GET'])
def get_conversation(sender):
    """Get conversation history"""
    try:
        # Query Rasa tracker
        response = requests.get(
            f"{RASA_SERVER_URL}/conversations/{sender}/tracker"
        )
        
        return jsonify(response.json()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development',
            host='0.0.0.0',
            port=int(os.getenv('CHATBOT_PORT', 5002)))
