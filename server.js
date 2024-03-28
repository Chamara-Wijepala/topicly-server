import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const PORT = process.env.PORT || 5500;
const DATABASE_URI = process.env.DATABASE_URI;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

mongoose
	.connect(DATABASE_URI)
	.then(() => {
		console.log('Server connected to DB');
		app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
	})
	.catch((error) => console.error(error));
