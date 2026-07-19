import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: [0, 'Price cannot be nagative'] },
    description: { type: String, required: true, maxLength: [500, 'Character must not exceed 500 words'] },
    media: [{ url: String, publicId: String, type: { type: String, enum: ['image', 'video']}}],
    stock: { type: Number},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin'}
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;