const express = require('express');
const {
  getStudentBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Student routes (booking is created after advance payment — see POST /api/payments/booking-order)
router.get('/student/my-bookings', protect, authorize('student'), getStudentBookings);
router.delete('/:id', protect, authorize('student'), cancelBooking);

// Owner routes
router.get('/owner/requests', protect, authorize('owner'), getOwnerBookings);
router.put('/:id', protect, authorize('owner'), updateBookingStatus);

module.exports = router;
