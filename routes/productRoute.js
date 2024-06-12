const express = require("express")
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator")
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductsImages,
  resizeImage,
} = require("../services/productService")
const { protect, allowedTo } = require("../services/authService")
const reviewRoute = require("./reviewRoute")
//use express.router instead of app
const router = express.Router()

//nested routes
router.use("/:productId/reviews", reviewRoute)
//insert into Product database
// router.post("/",createProduct)
router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manger"),
    uploadProductsImages,
    resizeImage,
    createProductValidator,
    createProduct
  )
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("admin", "manger"),
    uploadProductsImages,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct)

module.exports = router
