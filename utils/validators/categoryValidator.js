const slugify = require("slugify")
const { check, body } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
]

//check name that is sent in body and handle error fro schema
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),
  validatorMiddleware,
]
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val)
    return true
  }),
  validatorMiddleware,
]

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleware,
]
