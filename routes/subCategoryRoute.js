const express = require("express")
const {
  createSubCategory,
  getSubCategory,
  getAllSubcategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
} = require("../services/subCategoyService")
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator")
const { protect, allowedTo } = require("../services/authService")
//mergeParams allow us to pass  parameterson other routers (ex: get all subcategories of specififc category and we want this category id that we will access from ctegory router)
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(getAllSubcategory)
  .post(
    protect,
    allowedTo("admin", "manger"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    allowedTo("admin", "manger"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  )
module.exports = router
