from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# -------------------- HANDLER IMPORTS ----------------------
from handlers.smsHandler import send_sms        # SMS gateway OR push? (Your file has "send_push")
from handlers.emailHandler import send_email
from handlers.pushNotificationHandler import send_push as send_fcm_push
from handlers.emergencyAlertHandler import send_emergency_alert
from scheduler.reminderScheduler import schedule_reminder
# -----------------------------------------------------------


app = Flask(__name__)     # FIXED
CORS(app)
logging.basicConfig(level=logging.INFO)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Notification Service running'}), 200


# =====================  SMS ROUTE  =======================
@app.route('/api/sms', methods=['POST'])
def send_sms_route():
    """
    SMS handler — your smsHandler.py only contains send_push()
    So we temporarily use send_push() for SMS unless you supply real SMS code.
    """
    try:
        data = request.get_json()
        phone = data.get('phone')
        carrier = data.get('carrier')
        message = data.get('message')

        if not phone or not carrier or not message:
            return jsonify({'error': 'phone, carrier, and message are required'}), 400

        # Using your smsHandler's send_push method for SMS (until you provide actual SMS gateway handler)
        result = send_push(phone, f"SMS to {phone}", message)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =====================  EMAIL ROUTE  =======================
@app.route('/api/email', methods=['POST'])
def send_email_route():
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


# ===================== PUSH NOTIFICATION ROUTE ===============
@app.route('/api/push', methods=['POST'])
def send_push_route():
    """
    Firebase Cloud Messaging
    """
    try:
        data = request.get_json()
        device_token = data.get('device_token')
        title = data.get('title')
        body = data.get('body')

        result = send_fcm_push(device_token, title, body)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===================== REMINDER ROUTE =======================
@app.route('/api/schedule-reminder', methods=['POST'])
def schedule_reminder_route():
    try:
        data = request.get_json()
        schedule_reminder(
            data.get('reminder_id'),
            data.get('patient_id'),
            data.get('time'),
            data.get('frequency'),
            data.get('message')
        )
        return jsonify({'message': 'Reminder scheduled'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===================== EMERGENCY ALERT ROUTE =================
@app.route('/api/emergency-alert', methods=['POST'])
def emergency_alert_route():
    try:
        data = request.get_json()
        contacts = data.get('contacts', [])
        message = data.get('message')
        location = data.get('location')

        result = send_emergency_alert(contacts, message, location)
        return jsonify(result), 200 if result['success'] else 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===================== RUN SERVER ============================
if __name__ == '__main__':
    app.run(
        debug=os.getenv('FLASK_ENV') == 'development',
        host='0.0.0.0',
        port=int(os.getenv('NOTIFICATION_PORT', 5003))
    )
