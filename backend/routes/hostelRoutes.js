const express = require('express');
const {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
  getOwnerHostels,
} = require('../controllers/hostelController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getHostels);
router.get('/:id', getHostelById);

// Protected routes
router.post('/', protect, authorize('owner'), createHostel);
router.put('/:id', protect, authorize('owner'), updateHostel);
router.delete('/:id', protect, authorize('owner'), deleteHostel);
router.get('/owner/my-hostels', protect, authorize('owner'), getOwnerHostels);

module.exports = router;
