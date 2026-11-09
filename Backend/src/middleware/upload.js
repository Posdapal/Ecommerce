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

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// go up TWO levels from src/middleware to reach the project root, then into uploads
const uploadDir = path.join(__dirname, "../../uploads");

// create the folder if it doesn't exist yet
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PNG JPG JPEG allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;