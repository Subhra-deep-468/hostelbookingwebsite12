const express = require('express');
const { applyForOwnerVerification, verifyOwner, getOwnerStatus } = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply for owner verification
router.post('/apply', protect, authorize('owner'), applyForOwnerVerification);

// Get owner verification status
router.get('/status', protect, getOwnerStatus);

// Verify owner (Admin - can be called directly for demo)
router.put('/verify/:userId', verifyOwner);

module.exports = router;
