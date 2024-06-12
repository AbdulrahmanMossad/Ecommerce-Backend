const mongoose = require("mongoose")
//create schema (data analysis work)
const schema1 = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    // A and B => shoping.com/a-and-b (replace distance by -)
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
) // for (CreateAt and UpdatedAt)

const setImageURL = (doc) => {
  if (doc.image) {
    const url = `${process.env.BASE_URL}/brands/${doc.image}`
    doc.image = url
  }
}
schema1.post("save", (doc) => {
  setImageURL(doc)
})
//mongoose middleware to edit image field in db and return complete url in response to frontend(it works with getone , getAll , update ,not with create
schema1.post("init", (doc) => {
  setImageURL(doc)
})
//create model

const BrandModel = mongoose.model("Brand", schema1)

module.exports = BrandModel
