const mongoose=require("mongoose")
const dbConnection=()=>{
//connect to database
mongoose.connect(process.env.DB_URI).then((conn)=>{
    console.log(`Database connected :${conn.connection.host}`)
  }) 
  //we will use nodejs evenet unhandledRejection for automatic error handling
  // .catch((err)=>{
  // console.log(`Error : ${err}`)
  // process.exit(1)
  // })
}
module.exports =dbConnection