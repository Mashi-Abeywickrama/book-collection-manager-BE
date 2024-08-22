import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
