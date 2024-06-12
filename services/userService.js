const asyncHandler = require("express-async-handler")
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp")
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken")
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid")
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory")

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware")
const ApiError = require("../utils/ApiError")

exports.uploadUserImages = uploadSingleImage("profileImg")
//using sharp node js library for image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  //here we make extention jpeg because we use in sharp toFormat("jpeg") (it is not optional )
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`
  // image is optional
  if (req.file) {
    //sharp takes buffer
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`)
    // save only image name to database
    req.body.profileImg = fileName
  }

  next()
})

exports.getUsers = getAll(User, "users")
//get specific user by id
exports.getUser = getOne(User)
// insert to database using returned promise
// route get /api/v1/users
//private
exports.createUser = createOne(User)

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  )

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404))
  }
  res.status(200).json({ data: document })
})
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(), //to know if we update password after token created
    },
    {
      new: true,
    }
  )

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404))
  }
  res.status(200).json({ data: document })
})

//delete specific category by id
exports.deleteUser = deleteOne(User)

exports.geLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id
  next()
})

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  //sign token to header
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_kEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  })

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});