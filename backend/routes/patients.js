const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientController');
const reportController = require('../controllers/reportController');
const recommendationController = require('../controllers/recommendationController');
const chatbotController = require('../controllers/chatbotController');

const { authenticate } = require('../middleware/auth');
const patientAuthMiddleware = require('../middleware/patientAuthMiddleware');

const { upload } = require('../utils/fileHandler');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { validateReportUpload, handleValidationErrors } = require('../middleware/validation');

// ------------- AUTH ENFORCEMENT -------------
router.use(authenticate);           // Verify token
router.use(patientAuthMiddleware);  // Check patient role

// ------------- Patient Profile -------------
router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);
router.get('/me', patientController.getMe);

// ------------- Reports -------------
router.post(
    '/reports/upload',
    uploadLimiter,
    upload.single('report'),
    validateReportUpload,
    handleValidationErrors,
    reportController.uploadReport
);

router.get('/reports', reportController.getPatientReports);
router.get('/reports/:report_id', reportController.getReportDetails);
router.delete('/reports/:report_id', reportController.deleteReport);

// ------------- Recommendations -------------
router.get('/recommendations', recommendationController.getRecommendations);
router.patch(
    '/recommendations/:recommendation_id/complete',
    recommendationController.markAsCompleted
);

// ------------- Chatbot -------------
router.post('/chatbot/message', chatbotController.sendMessage);
router.get('/chatbot/history', chatbotController.getChatHistory);

module.exports = router;
