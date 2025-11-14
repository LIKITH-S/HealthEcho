const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const recommendationController = require('../controllers/recommendationController');
const chatbotController = require('../controllers/chatbotController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbacMiddleware');
const { upload } = require('../utils/fileHandler');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { validateReportUpload, handleValidationErrors } = require('../middleware/validation');

router.use(authenticate);
router.use(authorize('view_own_profile'));
router.get('/profile', auth, patientController.getProfile);
router.put('/profile', patientAuth, patientController.updateProfile);

// Minimal Info
router.get('/me', patientAuth, patientController.getMe);
// Report routes
router.post('/reports/upload', uploadLimiter, upload.single('report'), validateReportUpload, handleValidationErrors, reportController.uploadReport);
router.get('/reports', reportController.getPatientReports);
router.get('/reports/:report_id', reportController.getReportDetails);
router.delete('/reports/:report_id', reportController.deleteReport);

// Recommendation routes
router.get('/recommendations', recommendationController.getRecommendations);
router.patch('/recommendations/:recommendation_id/complete', recommendationController.markAsCompleted);

// Chatbot routes
router.post('/chatbot/message', chatbotController.sendMessage);
router.get('/chatbot/history', chatbotController.getChatHistory);

module.exports = router;
