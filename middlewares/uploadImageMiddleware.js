// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer")

const ApiError = require("../utils/ApiError")

exports.uploadSingleImage = (fileName) => {
  // using memoryStorage
  const multerStorage = multer.memoryStorage()
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      // if not image return error with status 400 (bad request)
      cb(new ApiError("input not image", 400), false)
    }
  }
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
  // uploads single image for category after configuration like add image extention and file to upload and add file property to request
  return upload.single(fileName)
}
exports.uploadMixOfImages = (arrayOfFields) => {
  const multerStorage = multer.memoryStorage()
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      // if not image return error with status 400 (bad request)
      cb(new ApiError("input not image", 400), false)
    }
  }
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
  return upload.fields(arrayOfFields)
}
