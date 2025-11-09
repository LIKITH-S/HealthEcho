from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from handlers.smsHandler import send_sms
from handlers.emailHandler import send_email
from handlers.pushNotificationHandler import send_push
from handlers.emergencyAlertHandler import send_emergency_alert
from scheduler.reminderScheduler import schedule_reminder
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Notification Service running'}), 200

@app.route('/api/sms', methods=['POST'])
def send_sms_route():
    """Send SMS notification"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        message = data.get('message')

        if not phone or not message:
            return jsonify({'error': 'Phone and message required'}), 400

        result = send_sms(phone, message)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/email', methods=['POST'])
def send_email_route():
    """Send email notification"""
    try:
        data = request.get_json()
        email = data.get('email')
        subject = data.get('subject')
        body = data.get('body')

        if not email or not subject:
            return jsonify({'error': 'Email and subject required'}), 400

        result = send_email(email, subject, body)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/push', methods=['POST'])
def send_push_route():
    """Send push notification"""
    try:
        data = request.get_json()
        device_token = data.get('device_token')
        title = data.get('title')
        body = data.get('body')

        result = send_push(device_token, title, body)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/schedule-reminder', methods=['POST'])
def schedule_reminder_route():
    """Schedule medication reminder"""
    try:
        data = request.get_json()
        reminder_id = data.get('reminder_id')
        patient_id = data.get('patient_id')
        time = data.get('time')
        frequency = data.get('frequency')
        message = data.get('message')

        schedule_reminder(reminder_id, patient_id, time, frequency, message)
        return jsonify({'message': 'Reminder scheduled'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emergency-alert', methods=['POST'])
def emergency_alert_route():
    """Send emergency alert"""
    try:
        data = request.get_json()
        contacts = data.get('contacts', [])
        message = data.get('message')
        location = data.get('location')

        result = send_emergency_alert(contacts, message, location)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development',
            host='0.0.0.0',
            port=int(os.getenv('NOTIFICATION_PORT', 5003)))
