const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../utils/fileHandler');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.post('/upload', uploadLimiter, upload.single('report'), reportController.uploadReport);
router.get('/', reportController.getPatientReports);
router.get('/:report_id', reportController.getReportDetails);
router.delete('/:report_id', reportController.deleteReport);

module.exports = router;
