const mongoose = require('mongoose');

/** Standalone ₹1000 test / dummy checkout — does not create a booking. */
const quickPayOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amountRupees: { type: Number, required: true },
    amountPaise: { type: Number, required: true },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    isMockOrder: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['created', 'paid', 'expired', 'failed'],
      default: 'created',
    },
    expiresAt: { type: Date, required: true },
    razorpayPaymentId: { type: String, default: '' },
  },
  { timestamps: true }
);

quickPayOrderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('QuickPayOrder', quickPayOrderSchema);
