const mongoose = require("mongoose")

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //" x" or "x " --->  "x" clear distnce befor and after
      unique: [true, "subCategory must be unique"],
      minlength: [3, "Too short subCategory name"],
      maxlength: [32, "Too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    //forigen key
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to category"],
    },
  },
  { timestamps: true }
)

const subCategoryModel = mongoose.model("subCategory", subCategorySchema)

module.exports = subCategoryModel
