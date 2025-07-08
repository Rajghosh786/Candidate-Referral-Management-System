const mongoose = require("mongoose")
require("dotenv").config()

const connectingDB = mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to DB")
}).catch(err=>{
    console.log(err,"error conencting DB")
})

module.exports = connectingDB