const express = require("express")

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator")
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandsImages,
  resizeImage,
} = require("../services/brandService")
const { protect, allowedTo } = require("../services/authService")
//use express.router instead of app
const router = express.Router()

//insert into Brand database
// router.post("/",createBrand)
router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("admin", "manger"),
    uploadBrandsImages,
    (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      next()
    },
    resizeImage,
    createBrandValidator,
    createBrand
  )
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo("admin", "manger"),
    uploadBrandsImages,
    (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      next()
    },
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand)

module.exports = router
