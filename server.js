import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const PORT = process.env.PORT || 5500;
const DATABASE_URI = process.env.DATABASE_URI;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

mongoose
	.connect(DATABASE_URI)
	.then(() => {
		console.log('Server connected to DB');
		app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
	})
	.catch((error) => console.error(error));
