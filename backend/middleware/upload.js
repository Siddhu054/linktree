const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    console.log("Upload destination:", uploadPath);
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log("Original filename:", file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// File filter with better error handling
const fileFilter = (req, file, cb) => {
  console.log("File mimetype:", file.mimetype);
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Create multer instance with error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("image");

// Wrapper function to handle multer errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        message: "Unknown upload error",
        error: err.message,
      });
    }
    // Everything went fine
    next();
  });
};

module.exports = uploadMiddleware;
