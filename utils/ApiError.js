// this class is responsible about errors that i can predict (opertional errors)

class ApiError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
        this.status=`${statusCode}.`.startsWith(4)?"fail":"error"
        this.isOpertional=true
    }
}
module.exports=ApiError