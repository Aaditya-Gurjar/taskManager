const express = require("express")
const { signupUser, loginUser, logoutUser } = require("../contollers/user.controller");
const { protect } = require("../middlwares/authMiddleware");
const router = express.Router()

router.post('/signup', signupUser);
router.post('/login', loginUser)
router.get('/logout', logoutUser)

module.exports = router;
