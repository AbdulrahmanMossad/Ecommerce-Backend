const ApiError = require("../utils/ApiError")

const sendErrForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack, //to know where error happened
  })
const sendErrForProducton = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401)

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401)
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"
  if (process.env.NODE_ENV === "development") {
    sendErrForDev(err, res)
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature()
    if (err.name === "TokenExpiredError") err = handleJwtExpired()
    sendErrForProducton(err, res)
  }
}

module.exports = globalError
