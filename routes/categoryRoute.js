const express = require("express")
const subCategoryRoute = require("./subCategoryRoute")
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator")
const { protect, allowedTo } = require("../services/authService")
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoriesImages,
  resizeImage,
} = require("../services/categoryService")
//use express.router instead of app
const router = express.Router()

//nested routes
router.use("/:categoryId/subcategories", subCategoryRoute)
//insert into category database
// router.post("/",createCategory)
router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("admin", "manger"),
    uploadCategoriesImages,
    (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      next()
    },
    resizeImage,
    createCategoryValidator,
    createCategory
  ) //uploadProductImages middleware to add  categories images to  uploads/categories
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoriesImages,
    (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      next()
    },
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory)

module.exports = router
