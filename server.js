const path = require("path")
//conect config.env///////////////////
const dotenv = require("dotenv")
// morgan for logging (information about request )-- it is working in middlware
const morgan = require("morgan")
const express = require("express")
// eslint-disable-next-line import/no-extraneous-dependencies
const cors=require("cors")
// eslint-disable-next-line import/no-extraneous-dependencies
const compression=require("compression")
const ApiError = require("./utils/ApiError")
const globalError = require("./middlewares/errorMiddleware")

dotenv.config({ path: "config.env" })
const categoryRoute = require("./routes/categoryRoute")
const subCategoryRoute = require("./routes/subCategoryRoute")
const brandRoute = require("./routes/brandRoute")
const productRoute = require("./routes/productRoute")
const userRoute = require("./routes/userRoute")
const authRoute = require("./routes/authRoute")
const dbConnection = require("./config/database")
const reviewRoute = require("./routes/reviewRoute")
const wishlistRoute = require("./routes/wishlistRoute")
const addressRoute = require("./routes/addressRoute")
const couponRoute = require("./routes/couponRoute")
const cartRoute = require("./routes/cartRoute")
const orderRoute = require("./routes/orderRoute")
const { webhookCheckout } = require("./services/orderService")
// connect to database
dbConnection()
//express app
const app = express()
//enable other domains to access my app
app.use(cors())
app.options("*",cors())
app.use(compression())
app.post("/webhook-checkout",
  express.raw({type:"application/json"}),
  webhookCheckout
)
// apply middleware
app.use(express.json())
//image stored in database like this(category-c3d7fe47-4b70-4077-8b2e-5ca7e9800fae-1717382645148.jpeg) after serving image we can use this url to show in browser (http://localhost:8000/categories/category-c3d7fe47-4b70-4077-8b2e-5ca7e9800fae-1717382645148.jpeg)
app.use(express.static(path.join(__dirname, "uploads")))
//using morgan for logging information
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
  console.log(`Mode: ${process.env.NODE_ENV}`)
}

// mount routes
app.use("/api/v1/categories", categoryRoute)
app.use("/api/v1/subcategories", subCategoryRoute)
app.use("/api/v1/brands", brandRoute)
app.use("/api/v1/products", productRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/reviews", reviewRoute)
app.use("/api/v1/wishlist", wishlistRoute)
app.use("/api/v1/addresses", addressRoute)
app.use("/api/v1/coupons", couponRoute)
app.use("/api/v1/cart", cartRoute)
app.use("/api/v1/orders", orderRoute)
//if user write route that is not exist
app.all("*", (req, res, next) => {
  // const err=new Error(`can't find this route ${req.originalUrl}`)
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400)) //take me to next middleware (error handleing) and pass this to err
})
//put after routes handle errors
//global error handling for express errors
app.use(globalError)
///////////////////////////////////////////
const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`running from ${PORT}`)
})

//handling errors  outside express (like :promisses catch )
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection errors : ${err.name} | ${err.message}`)
  //close database server first then exit
  server.close(() => {
    console.error("shuting down ...")
    process.exit(1)
  })
})
