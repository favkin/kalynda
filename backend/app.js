import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from '../backend/utils/db.js'
import cors from 'cors';

// All routes
import adminRoute from '../backend/route/adminRoute.js';
import productRoute from '../backend/route/productRoute.js';



const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Use Routes
app.use('/api/admin', adminRoute);
app.use('/api/product', productRoute);


const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
    console.log(`App Running on port ${PORT}`);
});

