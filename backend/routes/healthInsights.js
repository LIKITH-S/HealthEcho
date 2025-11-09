const express = require('express');
const router = express.Router();
const healthInsightsController = require('../controllers/healthInsightsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/metrics', healthInsightsController.addMetric);
router.get('/metrics', healthInsightsController.getMetrics);
router.get('/insights', healthInsightsController.getInsights);
router.get('/trends', healthInsightsController.getTrends);

module.exports = router;
