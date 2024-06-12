const { validationResult } = require('express-validator');
const ApiError = require("../utils/ApiError");

const validatorMiddleware=(req,res,next)=>{
    // console.log(param)
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
            // res.status(404).json({msg:`Invalid categorry id format `})    
            // return next(new ApiError("InValid id ",400))
        }
        next()
    }
    
module.exports=validatorMiddleware