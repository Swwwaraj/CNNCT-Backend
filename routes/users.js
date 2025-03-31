const express = require("express")
const { updateDetails, updatePassword } = require("../controllers/users")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.use(protect)

router.put("/updatedetails", updateDetails)
router.put("/updatepassword", updatePassword)

module.exports = router

