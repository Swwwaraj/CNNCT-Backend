const Event = require("../models/Event")

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ user: req.user.id })

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this event",
      })
    }

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id

    // Check for conflict
    const hasConflict = await Event.checkConflict(
      req.user.id,
      req.body.date,
      req.body.startTime,
      req.body.endTime,
      req.body.timeFormat,
    )

    if (hasConflict) {
      req.body.conflict = true
    }

    const event = await Event.create(req.body)

    res.status(201).json({
      success: true,
      data: event,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this event",
      })
    }

    // Check for conflict if date or time is being updated
    if (req.body.date || req.body.startTime || req.body.endTime || req.body.timeFormat) {
      const hasConflict = await Event.checkConflict(
        req.user.id,
        req.body.date || event.date,
        req.body.startTime || event.startTime,
        req.body.endTime || event.endTime,
        req.body.timeFormat || event.timeFormat,
        event._id,
      )

      if (hasConflict) {
        req.body.conflict = true
      } else {
        req.body.conflict = false
      }
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this event",
      })
    }

    await event.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Toggle event status (active/inactive)
// @route   PUT /api/events/:id/toggle
// @access  Private
exports.toggleEventStatus = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      })
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this event",
      })
    }

    // Toggle the active status
    event.active = !event.active
    await event.save()

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Check for event time conflicts
// @route   POST /api/events/check-conflict
// @access  Private
exports.checkConflict = async (req, res, next) => {
  try {
    const { date, startTime, endTime, timeFormat, eventId } = req.body

    const hasConflict = await Event.checkConflict(req.user.id, date, startTime, endTime, timeFormat, eventId)

    res.status(200).json({
      success: true,
      hasConflict,
    })
  } catch (err) {
    next(err)
  }
}

