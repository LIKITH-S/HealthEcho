from apscheduler.schedulers.background import BackgroundScheduler
from handlers.smsHandler import send_sms
from handlers.pushNotificationHandler import send_push
import logging

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()
scheduler.start()

scheduled_reminders = {}

def schedule_reminder(reminder_id, patient_id, time, frequency, message):
    """Schedule medication reminder"""
    try:
        job = scheduler.add_job(
            send_reminder,
            'cron',
            args=[reminder_id, patient_id, message],
            hour=int(time.split(':')[0]),
            minute=int(time.split(':')[1]),
            id=reminder_id
        )

        scheduled_reminders[reminder_id] = job
        logger.info(f"Reminder {reminder_id} scheduled")

        return {'success': True}

    except Exception as e:
        logger.error(f"Scheduling failed: {str(e)}")
        return {'success': False, 'error': str(e)}

def send_reminder(reminder_id, patient_id, message):
    """Send scheduled reminder"""
    try:
        logger.info(f"Sending reminder {reminder_id}")
        # Send via SMS or push - integrate with backend API to get contact info
        
    except Exception as e:
        logger.error(f"Reminder send failed: {str(e)}")