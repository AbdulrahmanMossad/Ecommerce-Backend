// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs")
const slugify = require("slugify")

const { check, body } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const User = require("../../models/userModel")

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
]

//check name that is sent in body and handle error fro schema
exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),

  check("email")
    .notEmpty()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        //check if email already exists when sign up
        if (user) {
          return Promise.reject(new Error("Please enter a valid email address"))
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Please enter a valid password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        return Promise.reject(new Error("Passwords do not match"))
      }
      return true
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid EG or SA phone number"),
  check("profileImg").optional(),
  check("role").optional(),

  validatorMiddleware,
]
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        //check if email already exists when sign up
        if (user) {
          return Promise.reject(new Error("Please enter a valid email address"))
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid EG or SA phone number"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
]

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id)
      if (!user) {
        throw new Error("There is no user for this id")
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      )
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password")
      }
      // 2- compare old password with new password(they should e different)
      const isnewPassword = await bcrypt.compare(val, user.password)
      if (isnewPassword) {
        throw new Error("please type a new password")
      }
      // 3- Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect")
      }
      return true
    }),
  validatorMiddleware,
]

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  validatorMiddleware,
]
exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"))
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
]
