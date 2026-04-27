const User = require('../models/User');

// Apply for owner verification
exports.applyForOwnerVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'owner') {
      return res.status(400).json({ success: false, message: 'Only owners can apply for verification' });
    }

    if (user.ownerAppliedAt) {
      return res.status(400).json({ success: false, message: 'You have already applied for verification' });
    }

    user.ownerAppliedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'You have applied for owner verification. Please wait for admin approval.',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify owner (Admin function - simplified, no admin panel)
exports.verifyOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isOwnerVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Owner verified successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get owner application status
exports.getOwnerStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      isOwnerVerified: user.isOwnerVerified,
      ownerAppliedAt: user.ownerAppliedAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
