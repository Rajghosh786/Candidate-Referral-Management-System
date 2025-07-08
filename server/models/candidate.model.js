const mongoose = require("mongoose")

const candidateSchema = new mongoose.Schema({
    referredBy: {type: mongoose.Schema.Types.ObjectId,ref: "User"},
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    jobTitle: {type: String,required:true},
    resumeURL:{type: String},
    status:{type: String,enum:["pending","reviewed","hired"],default:"pending"}
})

const candidateModel = mongoose.model("Candidate",candidateSchema)

module.exports = candidateModel