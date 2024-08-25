import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.config';
import errorHandler from './errorHandler/errorHandler';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import genreRoutes from './routes/genreRoutes';

const cors = require('cors')

const app = express();
app.use(cors())

connectDB();

app.use(express.json());

app.use('/api/', authRoutes);
app.use('/api/book/', bookRoutes);
app.use('/api/genre/', genreRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
