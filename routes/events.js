const express = require("express")
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  checkConflict,
} = require("../controllers/events")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.use(protect)

router.route("/").get(getEvents).post(createEvent)

router.route("/:id").get(getEvent).put(updateEvent).delete(deleteEvent)

router.put("/:id/toggle", toggleEventStatus)
router.post("/check-conflict", checkConflict)

module.exports = router

