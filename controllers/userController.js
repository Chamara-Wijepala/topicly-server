import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

const createUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.sendStatus(400);
	}

	const duplicate = await User.find({ username });
	if (duplicate[0]) {
		return res.sendStatus(409);
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({ username, password: hashedPassword });

		return res.sendStatus(201);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default {
	createUser,
};
