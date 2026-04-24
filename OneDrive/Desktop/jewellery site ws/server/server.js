import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connection.js';
import goldPriceRoutes from './routes/goldPriceRoutes.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/uploads', express.static('uploads'));
app.use('/api/gold-price', goldPriceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
