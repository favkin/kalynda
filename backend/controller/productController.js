import mongoose from 'mongoose';
import Product from '../model/product.js';

// To create New Product
export const createNewProduct = async (req, res) => {
    try {
        const { name, description, stock } = req.body;
        const price = Number(req.body.price);

        if (!name || req.body.price === undefined || !description  ||stock === undefined || !req.file ) {
            return res.status(400).json({ message: 'All fields are required!'})
        };

        if (Number.isNaN(price)) {
            return res.status(400).json({ success: false, message: 'Price must be Number'})
        };
        if(price < 0) {
            return res.status(400).json({ message: 'Price cannot be negative'})
        };

        const stockNumber = Number(stock);

        if(Number.isNaN(stockNumber)) {
            return res.status(400).json({ message: 'Stock must be a number'})
        };
        if(stockNumber < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative'})
        };
        


        const newProduct = await Product.create({
            name,
            price,
            description,
            stock: stockNumber,
            media: [{
                url: req.file.path,
                publicId: req.file.filename
            }]
        });

        res.status(201).json({
            success: true,
            message: 'Product created Successfully',
            newProduct
        });

    } catch(error) {        
        return res.status(500).json({ message: error.message})
    };
    
};

// To get all Products
export const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find();
        return res.status(201).json(products)
    } catch(error) {    
        return res.status(500).json({ success: false,  message: error.message })
    };
}

// To get single Product
export const getSingleProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product){
            return res.status(404).json({ message: 'Product not found'})
        };

        return res.status(201).json(product);
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message})
    };
}

// To update product
export const updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(201).json(product);
    } catch(error) {
        return res.status(500).json({ message: error.message })
    };
}

// To delete product
export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id'
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if(!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not Found'});
        }

        return res.status(200).json({ 
            success: true,
            message: 'Product deleted Successfully'})

    } catch(error) {
        return res.status(500).json({ message: error.message})
    }
}