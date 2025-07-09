const express = require("express")
const cors = require('cors')
require("dotenv").config()
const app = express()
app.use(cors())
app.use(express.json())
const connectingDB = require("./config/db")
const userRouter = require("./routes/user.routes")
const candidateRouter = require("./routes/candidate.routes")

app.use("/user",userRouter)
app.use("/candidate",candidateRouter)

app.use("",(req,res)=>{
    return res.status(404).json({msg:"no route found"})
})

connectingDB.then(()=>{
    const PORT = process.env.PORT || 8080
    app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`)
    })
}).catch(err=>{
    console.log(err)
})
