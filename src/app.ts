import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.config';
import errorHandler from './errorHandler/errorHandler';
import authRoutes from './routes/authRoutes';


const app = express();

connectDB();

app.use(express.json());

app.use('/api/', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
