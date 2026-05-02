const mongoose = require('mongoose');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const { hostelIsPubliclyVisible, canViewUnpublishedHostel } = require('../utils/hostelVisibility');

async function recalcHostelRating(hostelId) {
  const oid = new mongoose.Types.ObjectId(hostelId);
  const agg = await Review.aggregate([
    { $match: { hostel: oid } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, n: { $sum: 1 } } },
  ]);
  const avg = agg[0] ? Math.round(agg[0].avgRating * 10) / 10 : 0;
  const n = agg[0]?.n ?? 0;
  await Hostel.findByIdAndUpdate(hostelId, { rating: avg, reviews: n });
}

// GET /api/reviews/hostel/:hostelId (optional auth for canRate / myReview)
exports.getHostelReviews = async (req, res) => {
  try {
    const { hostelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, message: 'Invalid hostel id' });
    }

    const hostel = await Hostel.findById(hostelId).select('_id approvalStatus owner');
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    if (!hostelIsPubliclyVisible(hostel) && !canViewUnpublishedHostel(hostel, req.user)) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const reviews = await Review.find({ hostel: hostelId })
      .populate('student', 'name')
      .sort({ updatedAt: -1 })
      .lean();

    const payload = {
      success: true,
      reviews: reviews.map((doc) => ({
        id: doc._id,
        rating: doc.rating,
        comment: doc.comment,
        studentName: doc.student?.name || 'Student',
        updatedAt: doc.updatedAt,
      })),
      canRate: false,
      myReview: null,
    };

    if (req.user && req.user.role === 'student') {
      const [myRev, canRate] = await Promise.all([
        Review.findOne({ hostel: hostelId, student: req.user.id }).lean(),
        Booking.exists({ student: req.user.id, hostel: hostelId, status: 'approved' }),
      ]);
      payload.myReview = myRev
        ? { id: myRev._id, rating: myRev.rating, comment: myRev.comment }
        : null;
      payload.canRate = !!canRate;
    }

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reviews — student only; requires approved booking for this hostel
exports.submitReview = async (req, res) => {
  try {
    const { hostelId, rating, comment } = req.body;

    if (!hostelId) {
      return res.status(400).json({ success: false, message: 'Please provide hostel id' });
    }

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, message: 'Invalid hostel id' });
    }

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a whole number from 1 to 5' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const hasApprovedBooking = await Booking.exists({
      student: req.user.id,
      hostel: hostelId,
      status: 'approved',
    });

    if (!hasApprovedBooking) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate hostels where you have an approved booking',
      });
    }

    const trimmedComment = comment != null && String(comment).trim() ? String(comment).trim().slice(0, 500) : '';

    const review = await Review.findOneAndUpdate(
      { student: req.user.id, hostel: hostelId },
      { $set: { rating: r, comment: trimmedComment } },
      { new: true, upsert: true, runValidators: true }
    );

    await recalcHostelRating(hostelId);

    res.status(201).json({
      success: true,
      message: 'Thank you for your rating',
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
