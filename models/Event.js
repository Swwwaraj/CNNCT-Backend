const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, "Please add an event topic"],
    trim: true,
    maxlength: [100, "Topic cannot be more than 100 characters"],
  },
  password: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    required: [true, "Please add a date"],
  },
  startTime: {
    type: String,
    required: [true, "Please add a start time"],
  },
  endTime: {
    type: String,
    required: [true, "Please add an end time"],
  },
  timeFormat: {
    type: String,
    enum: ["AM", "PM"],
    required: [true, "Please specify time format"],
  },
  timezone: {
    type: String,
    default: "(UTC +5:00 Delhi)",
  },
  duration: {
    type: String,
    default: "1 hour",
  },
  backgroundColor: {
    type: String,
    default: "#0066ff",
  },
  link: {
    type: String,
    default: "",
  },
  emails: {
    type: String,
    default: "",
  },
  meetingType: {
    type: String,
    enum: ["google_meet", "zoom", "teams", "in_person"],
    default: "google_meet",
  },
  active: {
    type: Boolean,
    default: true,
  },
  conflict: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create index for faster queries
EventSchema.index({ user: 1, date: 1 })

// Check for event time conflicts
EventSchema.statics.checkConflict = async function (userId, date, startTime, endTime, timeFormat, eventId = null) {
  const query = {
    user: userId,
    date: date,
    active: true,
  }

  // Exclude current event when updating
  if (eventId) {
    query._id = { $ne: eventId }
  }

  const events = await this.find(query)

  // Convert times to 24-hour format for comparison
  const convertTo24Hour = (time, format) => {
    let [hours, minutes] = time.split(":")
    hours = Number.parseInt(hours)

    if (format === "PM" && hours < 12) {
      hours += 12
    } else if (format === "AM" && hours === 12) {
      hours = 0
    }

    return hours * 60 + Number.parseInt(minutes || 0)
  }

  const newStartMinutes = convertTo24Hour(startTime, timeFormat)
  const newEndMinutes = convertTo24Hour(endTime, timeFormat)

  for (const event of events) {
    const existingStartMinutes = convertTo24Hour(event.startTime, event.timeFormat)
    const existingEndMinutes = convertTo24Hour(event.endTime, event.timeFormat)

    // Check for overlap
    if (
      (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
      (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
      (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
    ) {
      return true // Conflict exists
    }
  }

  return false // No conflict
}

module.exports = mongoose.model("Event", EventSchema)

