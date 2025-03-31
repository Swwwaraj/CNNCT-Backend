const Booking = require("../models/Booking")
const Event = require("../models/Event")

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      })
    }

    // Make sure user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this booking",
      })
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Check if event exists
    const event = await Event.findById(req.body.event)

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    // Add user to req.body
    req.body.user = req.user.id

    // Set attendees count based on participantsList
    if (req.body.participantsList) {
      req.body.attendees = req.body.participantsList.length
    }

    const booking = await Booking.create(req.body)

    res.status(201).json({
      success: true,
      data: booking,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      })
    }

    // Make sure user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this booking",
      })
    }

    // Update status and tab based on the new status
    booking.status = req.body.status

    if (req.body.status === "Accepted") {
      booking.tab = "upcoming"
    } else if (req.body.status === "Rejected") {
      booking.tab = "canceled"
    }

    // Update selected participants if provided
    if (req.body.participantsList) {
      booking.participantsList = req.body.participantsList
      booking.attendees = req.body.participantsList.filter((p) => p.selected).length
    }

    await booking.save()

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      })
    }

    // Make sure user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this booking",
      })
    }

    await booking.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

