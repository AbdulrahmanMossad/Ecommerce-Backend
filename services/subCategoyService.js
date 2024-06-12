const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const subCategoryModel = require("../models/subCategoryModel")
const ApiError = require("../utils/ApiError")
const ApiFeatures = require("../utils/apiFeatures")
const { deleteOne, updateOne, createOne ,getOne,getAll} = require("./handlersFactory")
// insert to database using returned promise
// route get /api/v1/subCategories
//private
// exports.createSubCategory = asyncHandler(async (req, res) => {
//   const { name, category } = req.body
//   const subCategory = await subCategoryModel.create({
//     name,
//     slug: slugify(name),
//     category: category,
//   })
// res.status(201).json({ data: subCategory });
// })
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId
  }
  next()
}

// exports.createSubCategory = (req, res) => {
//   // if category id comes from url not body (/:categoryId/subcategories in this state)
//   subCategoryModel
//     .create(req.body)
//     .then((subcategory) => {
//       res.status(201).json({ data: subcategory })
//     })
//     .catch((err) => {
//       res.status(400).send(err)
//     })
// }
exports.createSubCategory = createOne(subCategoryModel)

// exports.getSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const subcategory = await subCategoryModel.findById(id)
//   // .populate({ path: "category", select: "name -_id" }) // to expand category but we select only name from category model and remove id from output
//   if (!subcategory) {
//     return next(new ApiError(`no subcategory found for this id ${id}`, 404))
//   }
//   res.status(200).json({ data: subcategory })
// })
exports.getSubCategory = getOne(subCategoryModel)

// exports.getAllSubcategory = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params
//   let filterObj = {}
//   if (categoryId) {
//     filterObj = { category: categoryId }
//   }
//   const apiFeatures = new ApiFeatures(
//     subCategoryModel.find(filterObj),
//     req.query
//   )
//     // .paginate(countDocuments)
//     .filter()
//     .search("subCategories")
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
//   //user can put page in query url request
//   // const page = req.query.page * 1 || 1
//   // //user can put limit in query url request
//   // const limit = req.query.limit * 1 || 5
//   // // skip number in limits and depend on number of pages
//   // const skip = (page - 1) * limit
//   // // const numCategories = await CategoryModel.find({})
//   // // const numPages=numCategories.length/limit
//   // const subCategories = await subCategoryModel
//   //   .find(filterObj)
//   //   .skip(skip)
//   //   .limit(limit)
//   // // .populate({ path: "category", select: "name -_id" })
//   // res
//   //   .status(200)
//   //   .json({ results: subCategories.length, page, data: subCategories })
// })
exports.getAllSubcategory = getAll(subCategoryModel,"subCategories")
// exports.updateSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const { name, category } = req.body
//   const slug = slugify(name)
//   const subcategory = await subCategoryModel.findByIdAndUpdate(
//     { _id: id },
//     { name, slug, category },
//     { new: true }
//   )
//   if (!subcategory) {
//     return next(new ApiError(`no subcategory found for this id ${id}`, 404))
//   }
//   res.status(200).json({ data: subcategory })
// })
exports.updateSubCategory = updateOne(subCategoryModel)
// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params
//   const subcategory = await subCategoryModel.findByIdAndDelete(id)
//   if (!subcategory) {
//     return next(new ApiError(`no subcategory found for this id ${id}`, 404))
//   }
//   //If you want to ensure that the client knows the operation was successful without sending any content, you can use a 204 status code without a message
//   res.status(204).send()
//   //   res.status(200).json({ message: "deleted successfully" })
// })
exports.deleteSubCategory = deleteOne(subCategoryModel)
