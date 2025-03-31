const express = require("express")
const { getAvailability, updateAvailability } = require("../controllers/availability")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.use(protect)

router.route("/").get(getAvailability).put(updateAvailability)

module.exports = router

