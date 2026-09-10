import mongoose from 'mongoose';
import Product from '../model/product.js';
import { 
    getProducts,
    getRandomProducts
} from '../service/productPaginatonService.js';
import { deleteCloudinaryMedia } from '../utils/deleteCloudinaryMedia.js'

// To create New Product
export const createNewProduct = async (req, res) => {
    try {
        const { name, description, stock } = req.body;
        const price = Number(req.body.price);

        if (
            !name ||
            req.body.price === undefined ||
            !description ||
            stock === undefined ||
            !req.files ||
            req.files.length === 0
        ) {
            return res.status(400).json({
                message: 'All fields are required!'
            });
        }

        if (Number.isNaN(price)) {
            return res.status(400).json({
                success: false,
                message: 'Price must be Number'
            });
        }

        if (price < 0) {
            return res.status(400).json({
                message: 'Price cannot be negative'
            });
        }

        const stockNumber = Number(stock);

        if (Number.isNaN(stockNumber)) {
            return res.status(400).json({
                message: 'Stock must be a number'
            });
        }

        if (stockNumber < 0) {
            return res.status(400).json({
                message: 'Stock cannot be negative'
            });
        }

        const media = req.files.map((file) => ({
            url: file.path,
            publicId: file.filename,
            type: file.mimetype.startsWith('image/')
                ? 'image'
                : 'video'
        }));

        const newProduct = await Product.create({
            name,
            price,
            description,
            stock: stockNumber,
            media
        });

        return res.status(201).json({
            success: true,
            message: 'Product created Successfully',
            newProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// To get Home Products
export const getHomeProducts = async(req, res) => {
    try {
        const products = await getRandomProducts();
        return res.status(200).json({
            success: true,
            products
        });
    } catch(error) {    
        return res.status(500).json({ success: false,  message: 'Failed to load home products' })
    };
}

// To get all Products
export const getAllProducts = async(req, res) => {
    try {
        const products = await getProducts(req.query);
        return res.status(200).json(products)
    } catch(error) {    
        return res.status(500).json({ success: false,  message: error.message })
    };
}

// To get single Product
export const getSingleProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            });
        };

        const product = await Product.findById(req.params.id);

        if (!product){
            return res.status(404).json({ message: 'Product not found'})
        };

        return res.status(200).json(product);
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message})
    };
}

// To update product
export const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, stock } = req.body;
        const price = Number(req.body.price);

        // Check product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            });
        }

        // Find existing product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Convert keepMediaIds into an array
        let keepMediaIds;

        if (req.body.keepMediaIds !== undefined) {
            try {
                keepMediaIds = JSON.parse(req.body.keepMediaIds);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid keepMediaIds format'
                });
            }

            if (!Array.isArray(keepMediaIds)) {
                return res.status(400).json({
                    success: false,
                    message: 'keepMediaIds must be an array'
                });
            }
        } else {
            keepMediaIds = product.media.map(
                (item) => item.publicId
            );
        }


        // Find media that should be deleted
        const mediaToDelete = product.media.filter(
            (item) => !keepMediaIds.includes(item.publicId)
        );

        // New files uploaded through Cloudinary
        const newMedia = (req.files || []).map((file) => ({
            url: file.path,
            publicId: file.filename,
            type: file.mimetype.startsWith('image/')
                ? 'image'
                : 'video'
        }));

        // Media that should remain
        const keptMedia = product.media.filter(
            (item) => keepMediaIds.includes(item.publicId)
        );

        // Final media after editing
        const finalMedia = [
            ...keptMedia,
            ...newMedia
        ];

        // Validate image limit
        const imageCount = finalMedia.filter(
            (item) => item.type === 'image'
        ).length;

        // Validate video limit
        const videoCount = finalMedia.filter(
            (item) => item.type === 'video'
        ).length;

        if (imageCount > 8) {
            await deleteCloudinaryMedia(newMedia);

            return res.status(400).json({
                success: false,
                message: 'A product can have a maximum of 8 images'
            });
        }

        if (videoCount > 2) {
            await deleteCloudinaryMedia(newMedia);

            return res.status(400).json({
                success: false,
                message: 'A product can have a maximum of 2 videos'
            });
        }

        // Validate price
        if (req.body.price !== undefined) {
            if (Number.isNaN(price)) {
                await deleteCloudinaryMedia(newMedia);

                return res.status(400).json({
                    success: false,
                    message: 'Price must be a number'
                });
            }

            if (price < 0) {
                await deleteCloudinaryMedia(newMedia);

                return res.status(400).json({
                    success: false,
                    message: 'Price cannot be negative'
                });
            }
        }

        // Validate stock
        let stockNumber;

        if (stock !== undefined) {
            stockNumber = Number(stock);

            if (Number.isNaN(stockNumber)) {
                await deleteCloudinaryMedia(newMedia);

                return res.status(400).json({
                    success: false,
                    message: 'Stock must be a number'
                });
            }

            if (stockNumber < 0) {
                await deleteCloudinaryMedia(newMedia);

                return res.status(400).json({
                    success: false,
                    message: 'Stock cannot be negative'
                });
            }
        }

        await deleteCloudinaryMedia(mediaToDelete);

        // Update product
        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = req.body.price !== undefined
            ? price
            : product.price;
        product.stock = stockNumber !== undefined
            ? stockNumber
            : product.stock;

        product.media = finalMedia;

        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// To delete product
export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id'
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not Found'
            });
        }

        await deleteCloudinaryMedia(product.media);

        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Product deleted Successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};