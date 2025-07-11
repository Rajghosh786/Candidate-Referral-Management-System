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
userRouter.post("/login",loginMiddleware,async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({msg:"no user found"})
        }
        let result = await bcrypt.compare(password, user.password);
        if(!result){
            return res.status(401).json({msg:"wrong password"})
        }
        var token = jwt.sign({ userID: user._id,role:user.role,name:user.firstName }, JWT_TOKEN,{ expiresIn: '1h' });
        return res.status(200).json({ msg: "Login successful",token,firstName:user.firstName,lastName:user.lastName,email:user.email,phone:user.phone});
    } catch (error) {
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
})

const registerMiddleware = (req,res,next) =>{
    const {firstName,lastName,email,phone,password} = req.body
    if(!firstName || !lastName || !email || !phone || !password){
        return res.status(400).json({msg:"missing fields"})
    }
    next()
}
userRouter.post("/register",registerMiddleware,async(req,res)=>{
    const {firstName,lastName,email,phone,password} = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await userModel.create({firstName,lastName,email,phone,password:hashedPassword})
        return res.status(201).json({msg:"user created successfully"})     
    } catch (error) {
        if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

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

userRouter.get("/all-referral", verifyToken, async (req, res) => {
  const { userID } = req.user;
  try {
    const candidates = await candidateModel.find({ referredBy: userID });

    const totalReferred = candidates.length;

    let pending = 0;
    let reviewed = 0;
    let hired = 0;

    candidates.forEach((candidate) => {
      const status = candidate.status || "pending";
      if (status === "pending") pending++;
      else if (status === "reviewed") reviewed++;
      else if (status === "hired") hired++;
    });

    res.status(200).json({
      totalReferred,
      pending,
      reviewed,
      hired,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error.message);
    res.status(500).json({ error: "Failed to fetch referral data" });
  }
});


module.exports = userRouter