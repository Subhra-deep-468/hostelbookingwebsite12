const express = require('express');
const { applyForOwnerVerification, verifyOwner, getOwnerStatus } = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply for owner verification
router.post('/apply', protect, authorize('owner'), applyForOwnerVerification);

// Get owner verification status
router.get('/status', protect, getOwnerStatus);

// Verify owner (admin only)
router.put('/verify/:userId', protect, authorize('admin'), verifyOwner);

module.exports = router;
