import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

 const connectDB = async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI);
                console.log('Database connected successfully');
        } catch (err) {
                console.error('connection Failed:', err.message);
                process.exit(1);
        }
};

export default connectDB;