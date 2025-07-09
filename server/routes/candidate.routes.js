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

const candidatePostMiddleware = (req,res,next) =>{
    const token = req.headers.authorization?.split(" ")[1];
    const { name, email, phone, jobTitle } = req.body;
    if (!name || !email || !phone || !jobTitle || !token) {
        return res.status(400).json({ msg: "Missing required fields or token" });
    }
    req.token = token;
    next()
}

candidateRouter.post("",candidatePostMiddleware,async (req,res)=>{
    const token = req.token;
    const {name,email,phone,jobTitle,resume} = req.body
    console.log(resume)
    try {
        var decoded = jwt.verify(token, JWT_TOKEN);
        if(!decoded.userID){
            return res.status(401).json({ msg: "Invalid token. Please login again." });
        }
        const candidate = await candidateModel.create({ name, email, phone, jobTitle, resumeURL:resume, referredBy: decoded.userID }); 
        return res.status(201).json({ msg: "Candidate referred successfully", candidate });
    } catch (error) {
        return res.status(401).json({ msg: "Token verification failed", error: error.message });
    }
})

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

candidateRouter.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    const originalName = req.file.originalname.replace(/\.[^/.]+$/, ""); // remove extension if any
    const uniqueName = `${originalName}-${Date.now()}.pdf`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes',
          public_id: uniqueName, 
          format: 'pdf',
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
});

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

candidateRouter.get("", verifyToken, async (req, res) => {
  try {
    const data = await candidateModel.find();
    res.status(200).json({ msg: "Candidate list fetched successfully", data });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch candidates", error: error.message });
  }
});

candidateRouter.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { status } = req.body;
    console.log(candidateId,status)
    const updatedCandidate = await candidateModel.findByIdAndUpdate(candidateId,{ status },{ new: true });

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ msg: 'Status updated successfully', data: updatedCandidate });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = candidateRouter