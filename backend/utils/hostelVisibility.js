/** Hostels are listed/bookable by students only when approved. Legacy docs without the field stay visible. */
function hostelIsPubliclyVisible(hostel) {
  if (!hostel) return false;
  const s = hostel.approvalStatus;
  return s === 'approved' || s == null || s === undefined;
}

function canViewUnpublishedHostel(hostel, user) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const ownerId = hostel.owner?._id != null ? String(hostel.owner._id) : String(hostel.owner);
  return user.role === 'owner' && ownerId === String(user.id);
}

module.exports = { hostelIsPubliclyVisible, canViewUnpublishedHostel };
