class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery
    this.queryString = queryString
  }

  filter() {
    let queryStringObj = {}
    if (this.queryString) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      queryStringObj = { ...this.queryString }
    }
    const excludedFields = [
      "page",
      "limit",
      "skip",
      "fields",
      "sort",
      "keyword",
    ]
    excludedFields.map((field) => delete queryStringObj[field])
    // add $ befor gt-gte-lt-lte for filteration
    let queryStr = JSON.stringify(queryStringObj)
    // eslint-disable-next-line no-unused-vars
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))
    return this
  }

  paginate(countDocuments) {
    //user can put page in query url request
    const page = this.queryString.page * 1 || 1
    //user can put limit in query url request
    const limit = this.queryString.limit * 1 || 5
    // skip number in limits and depend on number of pages
    const skip = (page - 1) * limit
    // const numProducts = await ProductModel.find({})
    // const numPages=numProducts.length/limit
    const endIndex = page * limit

    // Pagination result
    const pagination = {}
    pagination.currentPage = page
    pagination.limit = limit
    pagination.numberOfPages = Math.ceil(countDocuments / limit)

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1
    }
    if (skip > 0) {
      pagination.prev = page - 1
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
    this.paginationResult = pagination
    return this
  }

  sort() {
    //   sorting
    if (this.queryString.sort) {
      // if we want to sort with 2 parameters at same time sort=price,sold
      const sortBy = this.queryString.sort.split(",").join(" ")
      // console.log(sortBy)
      this.mongooseQuery = this.mongooseQuery.sort(sortBy)
    } else {
      // default  sort by newest to oldest
      this.mongooseQuery = this.mongooseQuery.sort("-creatAt")
    }
    return this
  }

  limitFields() {
    // if front end want specific fields(fields limiting)
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.mongooseQuery = this.mongooseQuery.select(fields)
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v")
    }
    return this
  }

  search(modelName) {
    // searching word
    if (this.queryString.keyword) {
      let query = {}
      if (modelName === "products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ]
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } }
      }
      this.mongooseQuery = this.mongooseQuery.find(query)
    }
    return this
  }
}
module.exports = ApiFeatures
