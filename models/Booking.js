const mongoose = require("mongoose")

const ParticipantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
    default: "/images/avatar.png",
  },
})

const BookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a booking title"],
    trim: true,
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
  participants: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  attendees: {
    type: Number,
    default: 0,
  },
  tab: {
    type: String,
    enum: ["upcoming", "pending", "canceled", "past"],
    default: "pending",
  },
  participantsList: [ParticipantSchema],
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
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

module.exports = mongoose.model("Booking", BookingSchema)

