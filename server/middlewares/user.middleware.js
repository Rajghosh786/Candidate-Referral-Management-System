const express = require("express")
const userModel = require("../models/user.model")
const userRouter = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const candidateModel = require("../models/candidate.model");
const JWT_TOKEN = process.env.JWT_TOKEN


const loginMiddleware = (req,res,next) =>{
    const {email,password} = req.body
        if(!email || !password){
        return res.status(400).json({msg:"missing fields"})
        }
    next()
}


const registerMiddleware = (req,res,next) =>{
    const {firstName,lastName,email,phone,password} = req.body
    if(!firstName || !lastName || !email || !phone || !password){
        return res.status(400).json({msg:"missing fields"})
    }
    next()
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token", error: err.message });
  }
};

module.exports = {loginMiddleware,registerMiddleware,verifyToken}