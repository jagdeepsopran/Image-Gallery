import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './db/dbConnect.js';
// import { imageUploader } from './middleware/imageUploader.js';
import { imageUploadController } from './controllers/imageUploadController.js';
import { getImageController } from './controllers/getImageController.js';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gallery', // Folder in Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg', 'gif'],
    },
});

const upload = multer({ storage: storage });

// Middleware
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, Authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory "database" for image URLs
// let images = [];

// Route to upload an image
app.post('/upload', upload.single('image'), imageUploadController);
app.get('/getImage', getImageController);


app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.use("*", (_, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
