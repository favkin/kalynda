import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import cors from 'cors';



// All routes
import connectDB from './utils/db.js'
import adminRoute from './route/adminRoute.js';
import productRoute from './route/productRoute.js';


const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// Health check
app.get("/", (req, res) => {
    res.send("Kalynda API is running 🚀");
});

// Use Routes
app.use('/api/admin', adminRoute);
app.use('/api/product', productRoute);


const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
    console.log(`App Running on port ${PORT}`);
});

