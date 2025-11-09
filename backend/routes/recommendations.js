const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(authenticate);

router.get('/', recommendationController.getRecommendations);
router.post('/', authorize('create_recommendations'), recommendationController.createRecommendation);
router.patch('/:recommendation_id/complete', recommendationController.markAsCompleted);

module.exports = router;
