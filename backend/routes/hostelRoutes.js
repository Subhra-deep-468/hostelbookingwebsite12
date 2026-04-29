const express = require('express');
const {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
  getOwnerHostels,
  uploadHostelPhoto,
  deleteHostelPhoto,
} = require('../controllers/hostelController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Public routes
router.get('/', getHostels);
router.get('/:id', getHostelById);

// Protected routes
router.post('/', protect, authorize('owner'), createHostel);
router.put('/:id', protect, authorize('owner'), updateHostel);
router.delete('/:id', protect, authorize('owner'), deleteHostel);
router.get('/owner/my-hostels', protect, authorize('owner'), getOwnerHostels);

// Photo routes
router.post('/:id/photos', protect, authorize('owner'), upload.single('photo'), uploadHostelPhoto);
router.delete('/:id/photos', protect, authorize('owner'), deleteHostelPhoto);

module.exports = router;
