const asyncHandler = require("express-async-handler")
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp")
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid")
// eslint-disable-next-line import/no-extraneous-dependencies

const CategoryModel = require("../models/categoryModel")
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory")

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware")
//using diskstorage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // if sucess null errors and save image to uploads/categories
//     cb(null, "uploads/categories")
//   },
//   filename: (req, file, cb) => {
//     //extract extention from mimetype (ex : image/jpeg )
//     const ext = file.mimetype.split("/")[1]
//     //image that saved in uploads/categories in this format (category-uuid-date.now().extention)
//     cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`)
//   },
// })
//using memoryStorage
// const multerStorage = multer.memoryStorage()
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true)
//   } else {
//     // if not image return error with status 400 (bad request)
//     cb(new ApiError("input not image", 400), false)
//   }
// }
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
// // uploads single image for category after configuration like add image extention and file to upload and add file property to request
// exports.uploadCategoriesImages = upload.single("image")
exports.uploadCategoriesImages = uploadSingleImage("image")
//using sharp node js library for image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  //here we make extention jpeg because we use in sharp toFormat("jpeg") (it is not optional )
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`
  //sharp takes buffer
  if (req.file) {
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`)
    // save only image name to database
    req.body.image = fileName
  }

  next()
})

//get all categories
// route get /api/v1/categories
//anyone
// exports.getCategories = asyncHandler(async (req, res) => {
//   const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
//     // .paginate(countDocuments)
//     .filter()
//     .search("categories")
//     .limitFields()
//     .sort()
//   const countDocuments2 = await apiFeatures.mongooseQuery
//     .clone()
//     .countDocuments()
//   const apiFeatures2 = await apiFeatures.paginate(countDocuments2)
//   //excute query
//   const { mongooseQuery, paginationResult } = apiFeatures2
//   const products = await mongooseQuery
//   res.status(200).json({
//     results: products.length,
//     paginationResult,
//     data: products,
//   })

// //user can put page in query url request
// const page = req.query.page * 1 || 1;
// //user can put limit in query url request
// const limit = req.query.limit * 1 || 5;
// // skip number in limits and depend on number of pages
// const skip = (page - 1) * limit;
// // const numCategories = await CategoryModel.find({})
// // const numPages=numCategories.length/limit
// const categories = await CategoryModel.find({}).skip(skip).limit(limit);
// res.status(200).json({ results: categories.length, page, data: categories })
// })
exports.getCategories = getAll(CategoryModel, "categories")
//get specific category by id
// route get /api/v1/categories/:id
//anyone
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const category = await CategoryModel.findById(id)
//   if (!category) {
//     // res.status(404).json({msg:`no category found fot this id ${id}`})
//     return next(new ApiError(`no category found for this id ${id}`, 404))
//   }
//   res.status(200).json({ data: category })
// })
exports.getCategory = getOne(CategoryModel)
// insert to database using returned promise
// route get /api/v1/categories
//private
// exports.createCategory = (req, res) => {
//   //return promise so we will use then  ------- slugify to replace space by -
//   CategoryModel.create(req.body)
//     .then((category) => {
//       res.status(201).json({ data: category })
//     })
//     .catch((err) => {
//       res.status(400).send(err)
//     })
// }
exports.createCategory = createOne(CategoryModel)
// insert to database using async-await and use express async handler for error handling
// exports.createCategory=asyncHandler(async(req,res)=>{
//     const name=req.body.name;
//     //return promise so we will use then  ------- slugify to replace space by -
//     const category=await CategoryModel.create({name,slug:slugify(name)})
//     res.status(201).json({data:category})

// })

//update specific category by id
// route get /api/v1/categories/:id
//private
// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const name = req.body.name
//   // const category = await CategoryModel.updateOne({id,name,slug:slugify(name)})

//   // new to return new category after update
//   const category = await CategoryModel.findOneAndUpdate(
//     { _id: id },
//     { name: name, slug: slugify(name) },
//     { new: true }
//   )
//   // if invalid id
//   if (!category) {
//     // res.status(404).json({msg:`no category found fot this id ${id}`})
//     return next(new ApiError(`no category found for this id ${id}`, 404))
//   }
//   res.status(200).json({ data: category })
// })
exports.updateCategory = updateOne(CategoryModel)
//delete specific category by id
// route get /api/v1/categories/:id
//private
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const category = await CategoryModel.findByIdAndDelete({ _id: id })
//   // if invalid id
//   if (!category) {
//     // res.status(404).json({msg:`no category found fot this id ${id}`})
//     return next(new ApiError(`no category found for this id ${id}`, 404))
//   }
//   res.status(204).send()
// })
exports.deleteCategory = deleteOne(CategoryModel)
