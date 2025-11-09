from twilio.rest import Client
import os
import logging

logger = logging.getLogger(__name__)

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE = os.getenv('TWILIO_PHONE')

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms(phone_number, message):
    """Send SMS using Twilio"""
    try:
        sms = client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=phone_number
        )
        
        logger.info(f"SMS sent to {phone_number}")
        return {
            'success': True,
            'message_id': sms.sid
        }

    except Exception as e:
        logger.error(f"SMS failed: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }
