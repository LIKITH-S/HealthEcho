import firebase_admin
from firebase_admin import credentials, messaging
import os
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase
try:
    key_path = os.getenv('FIREBASE_KEY_PATH')

    if key_path and os.path.exists(key_path):
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized successfully")
    else:
        logger.warning("Firebase key path not set or file missing")

except Exception as e:
    logger.warning(f"Firebase initialization failed: {str(e)}")


def send_sms(device_token, title, body):
    """Send push notification via Firebase Cloud Messaging (FCM)."""
    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=device_token
        )

        response = messaging.send(message)
        logger.info(f"Push notification sent → Token: {device_token}")

        return {
            'success': True,
            'message_id': response
        }

    except Exception as e:
        logger.error(f"Push failed → {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }
