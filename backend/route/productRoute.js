import express from 'express';
import { 
    createNewProduct,
    getAllProducts,
    getSingleProductById,
    updateProductById,
    deleteProductById
 } from "../controller/productController.js";


const router = express.Router();

// middlewares
import { roleMiddileware } from '../middleware/role.js';
import { authMiddleware } from '../middleware/auth.js';
import  upload  from '../middleware/cloudinaryUpload.js';
// import upload from '../middleware/multer.js';


// routes
router.post('/newProduct', upload.single('auto'), authMiddleware, roleMiddileware('admin'), createNewProduct);
router.get('/allProducts', getAllProducts);
router.get('/singleProduct/:id', getSingleProductById);
router.patch('/updateSingle/:id', authMiddleware, upload.single('auto'), updateProductById);
router.delete('/deleteSingle/:id', authMiddleware, deleteProductById);


export default router;