import logging
from handlers.emailHandler import send_email

logger = logging.getLogger(__name__)


def send_sms(phone_number, carrier_gateway, message):
    """
    Send SMS using Email-to-SMS Gateway.
    
    Args:
        phone_number (str): Recipient mobile number (e.g., '918150657720')
        carrier_gateway (str): Carrier's SMS gateway domain (e.g., 'txt.att.net')
        message (str): SMS message content (plain text)
    
    Returns:
        dict: {'success': True/False, 'response': response_data or 'error': error_message}
    """
    try:
        # Construct SMS gateway email address
        recipient_email = f"{phone_number}@{carrier_gateway}"
        
        # Subject is typically ignored by SMS gateways
        subject = ""
        body = message
        
        # Use existing email handler to send SMS
        result = send_email(recipient=recipient_email, subject=subject, body=body)
        
        logger.info(f"SMS sent via email gateway to {phone_number} on {carrier_gateway}")
        return result
        
    except Exception as e:
        logger.error(f"SMS send failed: {str(e)}")
        return {"success": False, "error": str(e)}
