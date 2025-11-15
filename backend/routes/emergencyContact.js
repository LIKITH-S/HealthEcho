const express = require('express');
const router = express.Router();
const emergencyContactController = require('../controllers/emergencyContactController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', emergencyContactController.addContact);
router.get('/', emergencyContactController.getContacts);
router.put('/:contact_id', emergencyContactController.updateContact);
router.delete('/:contact_id', emergencyContactController.deleteContact);

module.exports = router;
