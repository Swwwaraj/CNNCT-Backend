const mongoose = require("mongoose")

const TimeSlotSchema = new mongoose.Schema({
  start: {
    type: String,
    default: "",
  },
  end: {
    type: String,
    default: "",
  },
})

const DayAvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  available: {
    type: Boolean,
    default: true,
  },
  timeSlots: [TimeSlotSchema],
})

const AvailabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  weeklyHours: [DayAvailabilitySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Initialize default weekly hours when creating a new availability record
AvailabilitySchema.pre("save", function (next) {
  if (this.isNew && (!this.weeklyHours || this.weeklyHours.length === 0)) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    this.weeklyHours = days.map((day) => ({
      day,
      available: day !== "Sun" && day !== "Sat", // Weekends off by default
      timeSlots: day !== "Sun" && day !== "Sat" ? [{ start: "9:00 AM", end: "5:00 PM" }] : [],
    }))
  }

  if (this.isModified("weeklyHours")) {
    this.updatedAt = Date.now()
  }

  next()
})

module.exports = mongoose.model("Availability", AvailabilitySchema)

