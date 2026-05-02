const express = require('express');
const { getHostelReviews, submitReview } = require('../controllers/reviewController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/hostel/:hostelId', optionalAuth, getHostelReviews);
router.post('/', protect, authorize('student'), submitReview);

module.exports = router;
