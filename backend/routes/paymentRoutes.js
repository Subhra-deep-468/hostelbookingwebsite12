const express = require('express');
const {
  createBookingOrder,
  verifyBookingPayment,
  createQuickPayOrder,
  verifyQuickPayPayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/booking-order', protect, authorize('student'), createBookingOrder);
router.post('/booking-verify', protect, authorize('student'), verifyBookingPayment);

router.post('/quick-order', protect, createQuickPayOrder);
router.post('/quick-verify', protect, verifyQuickPayPayment);

module.exports = router;
