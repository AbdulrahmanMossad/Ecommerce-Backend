// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp")
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid")
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer")
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/ApiError")

const ProductModel = require("../models/productModel")
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware")

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory")

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
// exports.uploadProductsImages = upload.fields([
//   {
//     name: "imageCover",
//     maxCount: 1,
//   },
//   {
//     name: "images",
//     maxCount: 5,
//   },
// ])
exports.uploadProductsImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
])
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    //here we make extention jpeg because we use in sharp toFormat("jpeg") (it is not optional )
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
    //sharp takes buffer
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`)
    // save only image name to database
    req.body.imageCover = imageCoverFileName
    // next()
    //image processing for images
    if (req.files.images) {
      req.body.images = []
      req.files.images.forEach((image, index) => {
        const imageFileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
        sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageFileName}`)
        req.body.images.push(imageFileName)
      })
    }
    next()
  }
})
//get all Products
// route get /api/v1/Products
//anyone
// exports.getProducts = asyncHandler(async (req, res) => {
//   //http://localhost:8000/api/v1/products?keyword=mens&sold[gte]=15&sort=sold&fields=title,slug&page=1 (example)
//   // console.log(countDocuments)
//   const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
//     // .paginate(countDocuments)
//     .filter()
//     .search("products")
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
//   //filtering
//   // let queryStringObj = {}
//   // if (req.query) {
//   //   // eslint-disable-next-line node/no-unsupported-features/es-syntax
//   //   queryStringObj = { ...req.query }
//   // }
//   // const excludedFields = ["page", "limit", "skip", "fields", "sort", "keyword"]
//   // excludedFields.map((field) => delete queryStringObj[field])
//   // // add $ befor gt-gte-lt-lte for filteration
//   // let queryString = JSON.stringify(queryStringObj)
//   // queryString = queryString.replace(
//   //   /\b(gt|gte|lt|lte)\b/g,
//   //   (match) => `$${match}`
//   // )

//   // //pagination
//   // //user can put page in query url request
//   // const page = req.query.page * 1 || 1
//   // //user can put limit in query url request
//   // const limit = req.query.limit * 1 || 5
//   // // skip number in limits and depend on number of pages
//   // const skip = (page - 1) * limit
//   // // const numProducts = await ProductModel.find({})
//   // // const numPages=numProducts.length/limit
//   // let mongooseQuery = productModel.find(JSON.parse(queryStr)).skip(skip).limit(limit)

//   // //   sorting
//   // if (req.query.sort) {
//   //   // if we want to sort with 2 parameters at same time sort=price,sold
//   //   const sortBy = req.query.sort.split(",").join(" ")
//   //   // console.log(sortBy)
//   //   mongooseQuery = mongooseQuery.sort(sortBy)
//   // } else {
//   //   // default  sort by newest to oldest
//   //   mongooseQuery = mongooseQuery.sort("-creatAt")
//   // }
//   // // if front end want specific fields(fields limiting)
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(",").join(" ")
//   //   mongooseQuery = mongooseQuery.select(fields)
//   // } else {
//   //   mongooseQuery = mongooseQuery.select("-__v")
//   // }
//   // // searching word
//   // if (req.query.keyword) {
//   //   const query = {}
//   //   query.$or = [
//   //     { title: { $regex: req.query.keyword, $options: "i" } },
//   //     { description: { $regex: req.query.keyword, $options: "i" } },
//   //   ]

//   //   mongooseQuery = mongooseQuery.find(query)
//   // }
//   //excute query
//   // const products = await mongooseQuery
//   //   console.log(products)
//   // res.status(200).json({ results: products.length, data: products })
// })
exports.getProducts = getAll(ProductModel, "products")
//get specific Product by id
// route get /api/v1/Products/:id
//anyone
// exports.getProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const product = await ProductModel.findById(id)
//   if (!product) {
//     // res.status(404).json({msg:`no Product found fot this id ${id}`})
//     return next(new ApiError(`no Product found for this id ${id}`, 404))
//   }
//   res.status(200).json({ data: product })
// })
exports.getProduct = getOne(ProductModel, "reviews")
// insert to database using returned promise
// route get /api/v1/Products
//private
// exports.createProduct = (req, res) => {
//   //return promise so we will use then  ------- slugify to replace space by -
//   ProductModel.create(req.body)
//     .then((product) => {
//       res.status(201).json({ data: product })
//     })
//     .catch((err) => {
//       res.status(400).send(err)
//     })
// }
exports.createProduct = createOne(ProductModel)
//update specific Product by id
// route get /api/v1/Products/:id
//private
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   if (req.body.title) req.body.slug = slugify(req.body.title)
//   // const Product = await ProductModel.updateOne({id,name,slug:slugify(name)})

//   // new to return new Product after update
//   const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
//     new: true,
//   })
//   // if invalid id
//   if (!product) {
//     // res.status(404).json({msg:`no Product found fot this id ${id}`})
//     return next(new ApiError(`no Product found for this id ${id}`, 404))
//   }
//   res.status(200).json({ data: product })
// })
exports.updateProduct = updateOne(ProductModel)
//delete specific Product by id
// route get /api/v1/Products/:id
//private
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const product = await ProductModel.findByIdAndDelete({ _id: id })
//   // if invalid id
//   if (!product) {
//     // res.status(404).json({msg:`no Product found fot this id ${id}`})
//     return next(new ApiError(`no Product found for this id ${id}`, 404))
//   }
//   res.status(204).send()
// })
exports.deleteProduct = deleteOne(ProductModel)
