const express = require("express")

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator")
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserImages,
  resizeImage,
  geLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService")
const { protect, allowedTo } = require("../services/authService")
//use express.router instead of app
const router = express.Router()

//user routes
router.get("/getMe", protect, geLoggedUserData, getUser)
router.put("/changeMyPassword", protect, updateLoggedUserPassword)
router.put(
  "/updateMe",
  protect,
  updateLoggedUserValidator,
  updateLoggedUserData
)
router.delete("/deleteMe", protect, deleteLoggedUserData)

//admin routes
router.put(
  "/changePassword/:id",
  protect,
  allowedTo("admin", "manger"),
  changeUserPasswordValidator,
  changeUserPassword
)
//insert into Brand database
// router.post("/",createBrand)
router
  .route("/")
  .get(protect, allowedTo("admin", "manger"), getUsers)
  .post(
    protect,
    allowedTo("admin", "manger"),
    uploadUserImages,
    (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      next()
    },
    resizeImage,
    createUserValidator,
    createUser
  )

router
  .route("/:id")
  .get(protect, allowedTo("admin", "manger"), getUserValidator, getUser)
  .put(
    protect,
    allowedTo("admin", "manger"),
    uploadUserImages,
    (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      next()
    },
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser)

module.exports = router
