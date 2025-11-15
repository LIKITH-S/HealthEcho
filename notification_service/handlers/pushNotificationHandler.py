import firebase_admin
from firebase_admin import credentials, messaging
import os
import logging

logger = logging.getLogger(__name__)

try:
    cred = credentials.Certificate(os.getenv('FIREBASE_KEY_PATH'))
    firebase_admin.initialize_app(cred)
except:
    logger.warning("Firebase not configured")

def send_push(device_token, title, body):
    """Send push notification via Firebase"""
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=device_token
        )

        response = messaging.send(message)
        logger.info(f"Push sent to {device_token}")
        return {'success': True, 'message_id': response}

    except Exception as e:
        logger.error(f"Push failed: {str(e)}")
        return {'success': False, 'error': str(e)}