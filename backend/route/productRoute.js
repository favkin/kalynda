import express from 'express';
import { 
    createNewProduct,
    getHomeProducts,
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
import validateProductMedia from '../middleware/validateProductMedia.js'


// routes
router.post('/newProduct', authMiddleware, upload.array('media', 10), validateProductMedia, roleMiddileware('admin'), createNewProduct);
router.get('/homeProducts', getHomeProducts);
router.get('/allProducts', getAllProducts);
router.get('/singleProduct/:id', getSingleProductById);
router.patch('/updateSingle/:id', authMiddleware, upload.array('media', 10), validateProductMedia, updateProductById);
router.delete('/deleteSingle/:id', authMiddleware, deleteProductById);


export default router;