const express = require('express');
const router = express.Router();
const drugInteractionController = require('../controllers/drugInteractionController');
const { authenticate } = require('../middleware/auth');
const { validateDrugCheck, handleValidationErrors } = require('../middleware/validation');

router.use(authenticate);

router.post('/check', validateDrugCheck, handleValidationErrors, drugInteractionController.checkInteractions);
router.get('/history', drugInteractionController.getCheckHistory);

module.exports = router;
