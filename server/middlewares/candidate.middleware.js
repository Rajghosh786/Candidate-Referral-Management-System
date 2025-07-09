const express = require("express")
const candidateModel = require("../models/candidate.model")
const candidateRouter = express.Router()
var jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  },
});

const candidatePostMiddleware = (req,res,next) =>{
    const token = req.headers.authorization?.split(" ")[1];
    const { name, email, phone, jobTitle } = req.body;
    if (!name || !email || !phone || !jobTitle || !token) {
        return res.status(400).json({ msg: "Missing required fields or token" });
    }
    req.token = token;
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

module.exports = {candidatePostMiddleware,verifyToken}