const mongoose = require("mongoose")
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    //child (wishlist will be small)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
)
const setImageURL = (doc) => {
  if (doc.profileImg) {
    const url = `${process.env.BASE_URL}/users/${doc.profileImg}`
    doc.profileImg = url
  }
}
userSchema.post("save", (doc) => {
  setImageURL(doc)
})
//mongoose middleware to edit image field in db and return complete url in response to frontend(it works with getone , getAll , update ,not with create
userSchema.post("init", (doc) => {
  setImageURL(doc)
})
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User
