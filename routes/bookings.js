const express = require("express")
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookings")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.use(protect)

router.route("/").get(getBookings).post(createBooking)

router.route("/:id").get(getBooking).delete(deleteBooking)

router.put("/:id/status", updateBookingStatus)

module.exports = router

