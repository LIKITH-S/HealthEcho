const express = require('express');
const router = express.Router();
const mentalHealthController = require('../controllers/mentalHealthController');
const { authenticate } = require('../middleware/auth');
const { validateMentalHealthAssessment, handleValidationErrors } = require('../middleware/validation');

router.use(authenticate);

router.post('/assess', validateMentalHealthAssessment, handleValidationErrors, mentalHealthController.createAssessment);
router.get('/assessments', mentalHealthController.getAssessments);
router.get('/assessments/:assessment_id', mentalHealthController.getAssessmentDetails);
router.post('/support', mentalHealthController.getSupportResources);

module.exports = router;
