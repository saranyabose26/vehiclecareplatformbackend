import express from "express";
import path from "path";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
