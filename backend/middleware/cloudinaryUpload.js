import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../utils/cloudinary.js';
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'],
        resource_type: 'auto'
    }

});

const upload = multer ({
    storage
});

export default upload;  