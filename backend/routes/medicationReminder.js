const express = require('express');
const router = express.Router();
const medicationReminderController = require('../controllers/medicationReminderController');
const { authenticate } = require('../middleware/auth');
const { validateMedicationReminder, handleValidationErrors } = require('../middleware/validation');

router.use(authenticate);

router.post('/', validateMedicationReminder, handleValidationErrors, medicationReminderController.createReminder);
router.get('/', medicationReminderController.getReminders);
router.put('/:reminder_id', medicationReminderController.updateReminder);
router.delete('/:reminder_id', medicationReminderController.deleteReminder);

module.exports = router;
