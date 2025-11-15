from .smsHandler import send_sms
from .emailHandler import send_email
import logging

logger = logging.getLogger(__name__)

def send_emergency_alert(contacts, message, location):
    """Send emergency alerts to multiple contacts"""
    try:
        results = []
        
        for contact in contacts:
            contact_type = contact.get('type')  # 'sms' or 'email'
            contact_info = contact.get('contact_info')
            
            if contact_type == 'sms':
                alert_msg = f"EMERGENCY ALERT: {message}. Location: {location}"
                result = send_sms(contact_info, alert_msg)
            elif contact_type == 'email':
                result = send_email(
                    contact_info,
                    'EMERGENCY ALERT',
                    f"<p><strong>Emergency Alert</strong></p><p>{message}</p><p>Location: {location}</p>"
                )
            
            results.append(result)

        success_count = sum(1 for r in results if r['success'])
        logger.info(f"Emergency alerts sent: {success_count}/{len(contacts)}")

        return {
            'success': True,
            'alerts_sent': success_count,
            'total_contacts': len(contacts)
        }

    except Exception as e:
        logger.error(f"Emergency alert failed: {str(e)}")
        return {'success': False, 'error': str(e)}