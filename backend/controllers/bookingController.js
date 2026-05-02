const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const User = require('../models/User');

// Create booking (Student only)
exports.createBooking = async (req, res) => {
  try {
    const { hostelId, roomType, checkInDate, checkOutDate, message } = req.body;

    // Validation
    if (!hostelId || !roomType) {
      return res.status(400).json({ success: false, message: 'Please provide hostel and room type' });
    }

    // Get hostel
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Find room type price
    const room = hostel.roomTypes.find((r) => r.type === roomType);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room type not found' });
    }

    // Create booking
    const booking = await Booking.create({
      student: req.user.id,
      hostel: hostelId,
      roomType,
      price: room.pricePerMonth,
      checkInDate,
      checkOutDate,
      message,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student bookings
exports.getStudentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user.id })
      .populate('hostel')
      .populate('student', 'name email phone');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get owner booking requests (join via hostel.owner so it matches JWT user id reliably)
exports.getOwnerBookings = async (req, res) => {
  try {
    let ownerId;
    try {
      ownerId = new mongoose.Types.ObjectId(req.user.id);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: Hostel.collection.name,
          localField: 'hostel',
          foreignField: '_id',
          as: 'hostelDocs',
        },
      },
      { $unwind: '$hostelDocs' },
      { $match: { 'hostelDocs.owner': ownerId } },
      {
        $lookup: {
          from: User.collection.name,
          localField: 'student',
          foreignField: '_id',
          as: 'studentDocs',
        },
      },
      { $unwind: '$studentDocs' },
      {
        $addFields: {
          hostel: '$hostelDocs',
          student: {
            _id: '$studentDocs._id',
            name: '$studentDocs.name',
            email: '$studentDocs.email',
            phone: '$studentDocs.phone',
          },
        },
      },
      {
        $project: {
          hostelDocs: 0,
          studentDocs: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve or reject booking (Owner only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('hostel');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user is the hostel owner
    const hostel = await Hostel.findById(booking.hostel._id);
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    if (status === 'rejected') {
      booking.rejectionReason = rejectionReason;
    }
    booking.updatedAt = Date.now();

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking (Student only)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user is the student who made the booking
    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    // Only pending bookings can be cancelled
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
