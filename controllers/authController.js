import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const handleLogin = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.sendStatus(400);
	}

	const foundUser = await User.findOne({ username }).exec();
	if (!foundUser) {
		return res.sendStatus(401);
	}

	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		const accessToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1m' }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		foundUser.refreshToken = refreshToken;
		await foundUser.save();

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} else {
		return res.sendStatus(401);
	}
});

export default {
	handleLogin,
};
