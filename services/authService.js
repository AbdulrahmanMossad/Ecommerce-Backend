const crypto = require("crypto")
const asyncHandler = require("express-async-handler")
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs")
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const ApiError = require("../utils/ApiError")
const sendEmail = require("../utils/sendEmail")

exports.signUp = (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password, //hashing done in userModel
  })
    .then((newUser) => {
      // res.status(201).json({ data: newUser })
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET_kEY,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
      )
      res.status(200).json({ data: newUser, token })
    })
    .catch((err) => {
      res.status(400).send(err)
    })
}

exports.login = asyncHandler(async (req, res, next) => {
  //check if user exisits (email and password are correct)
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect Email or passwords", 400))
  }
  //sign token to header
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_kEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  })
  res.status(200).json({ data: user, token })
})

//protect route authntication by jwt
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token
  if (req.headers && req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
      // console.log(token)
    }
  }
  if (!token) {
    //401 for authtication problems
    return next(new ApiError("please login first !", 401))
  }
  //verify token (no chang happening to token - checking expiration time )if token failed or expired then return global error from errorMiddleware.js
  const decoded = jwt.verify(token, process.env.JWT_SECRET_kEY)
  // console.log(decoded)
  //check if user exists (user may be deleted frm db despite token is correct)
  const user = await User.findById(decoded.userId)
  if (!user) {
    return next(
      new ApiError(
        "the user that belongs to this token is no longer exist ",
        401
      )
    )
  }
  //4- check if the user change his password after token created
  if (user.passwordChangedAt) {
    // console.log(user.passwordChangedAt, decoded.iat)
    const passwordChangedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    )
    // console.log(passwordChangedTimeStamp, decoded.iat)
    //password changed after token created (error)
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "the user that belongs to this token has changed his password",
          401
        )
      )
    }
  }
  req.user = user
  next()
})

//user permissions
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you are not allowed to access this route", 403))
    }
    next()
  })
//forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1-get user by email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ApiError(`no user with this email ${req.body.email}`, 404))
  }
  //if user exists generate 6 digits and save in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex")
  //save hashed 6 digigt to database
  user.passwordResetCode = hashedResetCode
  // console.log(resetCode)
  // console.log(hashedResetCode)
  //expairy for 10 min
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000
  user.passwordResetVerified = false
  //save to database
  await user.save()
  //3-send reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    })
  } catch (err) {
    console.log(err.message)
    user.passwordResetCode = undefined
    user.passwordResetExpires = undefined
    user.passwordResetVerified = undefined

    await user.save()
    return next(new ApiError("There is an error in sending email", 500))
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" })
})

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex")

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"))
  }

  // 2) Reset code valid
  user.passwordResetVerified = true
  await user.save()

  res.status(200).json({
    status: "Success",
  })
})

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    )
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400))
  }

  user.password = req.body.newPassword
  user.passwordResetCode = undefined
  user.passwordResetExpires = undefined
  user.passwordResetVerified = undefined

  await user.save()

  // 3) if everything is ok, generate token to prevent old token
  // const token = createToken(user._id)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_kEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  })
  res.status(200).json({ token })
})
