// const multer = require("multer");
// const path = require("path");

// // image storage
// const storage = multer.diskStorage({

//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, "../uploads"));
//     },

//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + "-" + file.originalname;
//         cb(null, uniqueName);
//     }
// });

// // file filter
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PNG JPG JPEG allowed"), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
// });

// module.exports = upload;

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // go up TWO levels from src/middleware to reach the project root, then into uploads
// const uploadDir = path.join(__dirname, "../../uploads");

// // create the folder if it doesn't exist yet
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + "-" + file.originalname;
//         cb(null, uniqueName);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PNG JPG JPEG allowed"), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
// });

// module.exports = upload;


// middleware/upload.js  -- replaces your old multer file
// Images are NOT saved on the server disk anymore (Render erases the disk on every restart/deploy).
// They are sent to Cloudinary (free), and the database saves the full image URL.

// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;

// // ---------- Cloudinary login (values come from the Render Environment tab) ----------
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ---------- step 1: multer keeps the file in memory (RAM), not on disk ----------
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PNG JPG JPEG allowed"), false);
//     }
// };

// const multerUpload = multer({
//     storage: multer.memoryStorage(),
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 },   // max 5 MB
// });

// // ---------- step 2: send the file to Cloudinary ----------
// const uploadToCloudinary = (req, res, next) => {
//     // no image chosen (for example: update without a new image) -> just continue
//     if (!req.file) return next();

//     const stream = cloudinary.uploader.upload_stream(
//         { folder: "ecommerce" },
//         (error, result) => {
//             if (error) {
//                 console.log("Cloudinary error:", error);
//                 return res.status(500).json({ error: true, message: "Image upload failed" });
//             }
//             // Your controllers already save "req.file.filename" in the database.
//             // We put the full Cloudinary URL there, so the controllers do NOT need to change.
//             req.file.filename = result.secure_url;
//             next();
//         }
//     );

//     stream.end(req.file.buffer);
// };

// // ---------- your routes keep working: upload.single("image") ----------
// // (Express runs both steps one after the other)
// module.exports = {
//     single: (fieldName) => [multerUpload.single(fieldName), uploadToCloudinary],
// };



// middleware/upload.js  -- replaces your old multer file
// Images are NOT saved on the server disk (Render erases the disk on every restart/deploy).
// They are sent to Cloudinary (free), and the database saves the full image URL.

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// ---------- Cloudinary login (values come from .env locally, or Render > Environment) ----------
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const cloudinaryReady = !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

if (!cloudinaryReady) {
    console.error("!!! Cloudinary is NOT configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

// ---------- step 1: multer keeps the file in memory (RAM), not on disk ----------
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PNG, JPG, JPEG or WEBP images are allowed"), false);
    }
};

const multerUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },   // max 5 MB
});

// run multer, and turn its errors into a clear JSON message (instead of a blank 500)
const readFile = (fieldName) => (req, res, next) => {
    multerUpload.single(fieldName)(req, res, (error) => {
        if (error) {
            const message = error.code === "LIMIT_FILE_SIZE"
                ? "The image is too large (max 5 MB)"
                : error.message;
            return res.status(400).json({ error: true, message });
        }
        next();
    });
};

// ---------- step 2: send the file to Cloudinary ----------
const uploadToCloudinary = (req, res, next) => {
    // no image chosen (for example: update without a new image) -> just continue
    if (!req.file) return next();

    if (!cloudinaryReady) {
        return res.status(500).json({
            error: true,
            message: "Server problem: the CLOUDINARY_* variables are missing on the server",
        });
    }

    const stream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce" },
        (error, result) => {
            if (error) {
                console.log("Cloudinary error:", error);   // <- look for this line in the Render Logs
                return res.status(500).json({
                    error: true,
                    message: "Image upload failed: " + (error.message || "unknown error"),
                });
            }
            // Your controllers already save "req.file.filename" in the database.
            // We put the full Cloudinary URL there, so the controllers do NOT need to change.
            req.file.filename = result.secure_url;
            next();
        }
    );

    stream.end(req.file.buffer);
};

// ---------- your routes keep working: upload.single("image") ----------
module.exports = {
    single: (fieldName) => [readFile(fieldName), uploadToCloudinary],
};