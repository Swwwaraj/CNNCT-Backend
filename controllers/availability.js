const Availability = require("../models/Availability")

// @desc    Get user availability
// @route   GET /api/availability
// @access  Private
exports.getAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({ user: req.user.id })

    if (!availability) {
      // Create default availability if not exists
      availability = await Availability.create({
        user: req.user.id,
      })
    }

    res.status(200).json({
      success: true,
      data: availability,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update user availability
// @route   PUT /api/availability
// @access  Private
exports.updateAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({ user: req.user.id })

    if (!availability) {
      // Create availability if not exists
      availability = await Availability.create({
        user: req.user.id,
        weeklyHours: req.body.weeklyHours,
      })
    } else {
      // Update existing availability
      availability = await Availability.findOneAndUpdate(
        { user: req.user.id },
        { weeklyHours: req.body.weeklyHours },
        { new: true, runValidators: true },
      )
    }

    res.status(200).json({
      success: true,
      data: availability,
    })
  } catch (err) {
    next(err)
  }
}

