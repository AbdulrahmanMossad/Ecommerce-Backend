const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/ApiError")
const ApiFeatures = require("../utils/apiFeatures")

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const document = await Model.findByIdAndDelete(id)
    if (!document) {
      return next(new ApiError(`no Document found for this id ${id}`, 404))
    }
    // // Trigger "remove" event when update document
    // document.remove()
    //If you want to ensure that the client knows the operation was successful without sending any content, you can use a 204 status code without a message
    res.status(200).send()
    //   res.status(200).json({ message: "deleted successfully" })
  })

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    //trigger "save" event when update document(ex: page 42 with update review (ratingAverage and quantity))
    document.save()
    res.status(200).json({ data: document })
  })

exports.createOne = (Model) => (req, res) => {
  Model.create(req.body)
    .then((document) => {
      res.status(201).json({ data: document })
    })
    .catch((err) => {
      res.status(400).send(err)
    })
}

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const ordersForSpecificUser = req.filterObj
    //only logged user can access his orders
    let query
    if (ordersForSpecificUser) {
      // Use findOne with a combined filter object
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const filterObj = { _id: id, ...ordersForSpecificUser }
      query = Model.findOne(filterObj)
    } else {
      query = Model.findById(id)
    }

    if (populateOpt) {
      query = query.populate(populateOpt)
      // console.log(query)
    }
    const document = await query
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404))
    }
    res.status(200).json({ data: document })
  })

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    //filterObj for get  ll subcategories for specific category
    const { categoryId } = req.params
    const ordersForSpecificUser = req.filterObj
    let filterObj = {}
    if (categoryId) {
      filterObj = { category: categoryId }
    }
    //only logged user can access his orders
    if (ordersForSpecificUser) {
      filterObj = ordersForSpecificUser
    }
    // Build query
    // const documentsCounts = await Model.countDocuments()
    const apiFeatures = new ApiFeatures(Model.find(filterObj), req.query)
      // .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort()
    const countDocuments2 = await apiFeatures.mongooseQuery
      .clone()
      .countDocuments()
    const apiFeatures2 = await apiFeatures.paginate(countDocuments2)

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures2
    const documents = await mongooseQuery

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents })
  })
