const express = require("express")
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator")

const {
  signUp,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService")

const router = express.Router()

router.post("/signup", signupValidator, signUp)
router.post("/login", loginValidator, login)
router.post("/forgotPassword", forgotPassword)
router.post("/verifyResetCode", verifyPassResetCode)
router.put("/resetPassword", resetPassword)

module.exports = router
