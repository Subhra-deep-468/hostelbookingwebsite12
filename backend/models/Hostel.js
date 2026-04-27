const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide hostel name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      lowercase: true,
    },
    area: {
      type: String,
      lowercase: true,
    },
    pricePerMonth: {
      type: Number,
      required: [true, 'Please provide price'],
    },
    roomTypes: [
      {
        type: {
          type: String,
          enum: ['Single Bed', 'Double Bed', 'Triple Sharing'],
          required: true,
        },
        pricePerMonth: {
          type: Number,
          required: true,
        },
        availableRooms: {
          type: Number,
          default: 0,
        },
        totalRooms: {
          type: Number,
          default: 0,
        },
      },
    ],
    amenities: {
      type: [String],
      default: [],
      // Common amenities: WiFi, Food, AC, Parking, Laundry, Hot Water, etc.
    },
    images: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for search functionality
hostelSchema.index({ city: 1, area: 1 });
hostelSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Hostel', hostelSchema);
