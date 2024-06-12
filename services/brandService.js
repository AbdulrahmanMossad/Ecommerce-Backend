const asyncHandler = require("express-async-handler")
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp")
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid")
const BrandModel = require("../models/brandModel")
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory")
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware")

exports.uploadBrandsImages = uploadSingleImage("image")
//using sharp node js library for image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  //here we make extention jpeg because we use in sharp toFormat("jpeg") (it is not optional )
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`
  //sharp takes buffer
  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`)
  // save only image name to database
  req.body.image = fileName
  next()
})
//get all Brands
// route get /api/v1/Brands
//anyone
// exports.getBrands=asyncHandler(async(req,res)=>{

//     const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
//     // .paginate(countDocuments)
//     .filter()
//     .search("brands")
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
//     // //user can put page in query url request
//     // const page = req.query.page * 1 || 1;
//     // //user can put limit in query url request
//     // const limit = req.query.limit * 1 || 5;
//     // // skip number in limits and depend on number of pages
//     // const skip = (page - 1) * limit;
//     // // const numBrands = await BrandModel.find({})
//     // // const numPages=numBrands.length/limit
//     // const brands = await BrandModel.find({}).skip(skip).limit(limit);
//     // res.status(200).json({ results: brands.length, page, data: brands })
// })
exports.getBrands = getAll(BrandModel, "brands")
//get specific Brand by id
// route get /api/v1/Brands/:id
//anyone
// exports.getBrand=asyncHandler(async(req,res,next)=>{
//     const {id}=req.params
//     const brand = await BrandModel.findById(id)
//     if(!brand){
//         // res.status(404).json({msg:`no Brand found fot this id ${id}`})
//         return next(new ApiError(`no Brand found for this id ${id}`,404))
//     }
//         res.status(200).json({data: brand })
// })
exports.getBrand = getOne(BrandModel)
// insert to database using returned promise
// route get /api/v1/Brands
//private
// exports.createBrand=(req,res)=>{
//     //return promise so we will use then  ------- slugify to replace space by -
//     BrandModel.create(req.body).then((brand)=>{
//         res.status(201).json({data:brand})
//     }).catch((err)=>{
//         res.status(400).send(err)
//     })
// }
exports.createBrand = createOne(BrandModel)
// insert to database using async-await and use express async handler for error handling
// exports.createBrand=asyncHandler(async(req,res)=>{
//     const name=req.body.name;
//     //return promise so we will use then  ------- slugify to replace space by -
//     const Brand=await BrandModel.create({name,slug:slugify(name)})
//     res.status(201).json({data:Brand})

// })

//update specific Brand by id
// route get /api/v1/Brands/:id
//private
// exports.updateBrand=asyncHandler(async(req,res,next)=>{
//     const {id}=req.params
//     const name=req.body.name;
//     // const Brand = await BrandModel.updateOne({id,name,slug:slugify(name)})

//     // new to return new Brand after update
//     const brand=await BrandModel.findOneAndUpdate({_id:id},{name:name,slug:slugify(name)},{new:true})
//     // if invalid id
//     if(!brand){
//         // res.status(404).json({msg:`no Brand found fot this id ${id}`})
//         return next(new ApiError(`no Brand found for this id ${id}`,404))
//     }
//         res.status(200).json({data: brand })

// })
exports.updateBrand = updateOne(BrandModel)
//delete specific Brand by id
// route get /api/v1/Brands/:id
//private
// exports.deleteBrand=asyncHandler(async(req,res,next)=>{
//     const {id}=req.params
//     const brand=await BrandModel.findByIdAndDelete({_id:id})
//     // if invalid id
//     if(!brand){
//         // res.status(404).json({msg:`no Brand found fot this id ${id}`})
//         return next(new ApiError(`no Brand found for this id ${id}`,404))
//     }
//         res.status(204).send()

// })
exports.deleteBrand = deleteOne(BrandModel)
