const mongoose = require('mongoose');
const Hostel = require('../models/Hostel');

// Create a new hostel (Owner only)
exports.createHostel = async (req, res) => {
  try {
    const { name, description, location, city, area, pricePerMonth, roomTypes, amenities, images } = req.body;

    // Validation
    if (!name || !description || !location || !city) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const hostel = await Hostel.create({
      owner: req.user.id,
      name,
      description,
      location,
      city,
      area,
      pricePerMonth,
      roomTypes,
      amenities,
      images,
    });

    res.status(201).json({
      success: true,
      hostel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all hostels with filters and search
exports.getHostels = async (req, res) => {
  try {
    const { city, area, minPrice, maxPrice, roomType, amenity, sort } = req.query;

    let filter = { isActive: true };

    if (city) {
      filter.city = city.toLowerCase();
    }

    if (area) {
      filter.area = area.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filter.$expr = {
        $or: [
          {
            $and: [
              { $gte: ['$pricePerMonth', parseInt(minPrice) || 0] },
              { $lte: ['$pricePerMonth', parseInt(maxPrice) || 999999] },
            ],
          },
          {
            $and: [
              {
                $gte: [
                  {
                    $min: {
                      $map: {
                        input: '$roomTypes',
                        as: 'room',
                        in: '$$room.pricePerMonth',
                      },
                    },
                  },
                  parseInt(minPrice) || 0,
                ],
              },
              {
                $lte: [
                  {
                    $max: {
                      $map: {
                        input: '$roomTypes',
                        as: 'room',
                        in: '$$room.pricePerMonth',
                      },
                    },
                  },
                  parseInt(maxPrice) || 999999,
                ],
              },
            ],
          },
        ],
      };
    }

    if (roomType) {
      filter['roomTypes.type'] = roomType;
    }

    if (amenity) {
      filter.amenities = { $in: [amenity] };
    }

    let query = Hostel.find(filter).populate('owner', 'name email phone');

    // Sorting
    if (sort === 'priceLow') {
      query = query.sort({ pricePerMonth: 1 });
    } else if (sort === 'priceHigh') {
      query = query.sort({ pricePerMonth: -1 });
    } else if (sort === 'rating') {
      query = query.sort({ rating: -1 });
    }

    const hostels = await query;

    res.status(200).json({
      success: true,
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single hostel
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('owner', 'name email phone');

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update hostel (Owner only)
exports.updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check if user is the owner
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this hostel' });
    }

    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete hostel (Owner only)
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check if user is the owner
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this hostel' });
    }

    await Hostel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hostel deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get hostels by owner
exports.getOwnerHostels = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const hostels = await Hostel.find({ owner: ownerId });

    res.status(200).json({
      success: true,
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload hostel photos (Owner only)
exports.uploadHostelPhoto = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check if user is the owner
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to upload photos for this hostel' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Add photo path to hostel's images array
    const photoPath = `/uploads/${req.file.filename}`;
    hostel.images.push(photoPath);
    await hostel.save();

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      image: photoPath,
      hostel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete hostel photo (Owner only)
exports.deleteHostelPhoto = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check if user is the owner
    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete photos from this hostel' });
    }

    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide image URL' });
    }

    // Remove photo from hostel's images array
    hostel.images = hostel.images.filter((img) => img !== imageUrl);
    await hostel.save();

    // Delete file from uploads folder
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../' + imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
      hostel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
