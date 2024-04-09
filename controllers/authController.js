import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const DEV_MODE = (process.env.NODE_ENV = 'development');

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
			{ expiresIn: DEV_MODE ? '10s' : '15m' }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} else {
		return res.sendStatus(401);
	}
});

const handleRefresh = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decoded) => {
			if (err) return res.sendStatus(403);

			const foundUser = await User.findOne({
				username: decoded.username,
			}).exec();

			if (!foundUser) return res.sendStatus(401);

			const accessToken = jwt.sign(
				{ username: foundUser.username },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: DEV_MODE ? '1m' : '15m' }
			);

			res.json({ accessToken });
		})
	);
};

const handleLogout = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(204);

	res.clearCookie('jwt', {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
	});
	res.status(204).json({ message: 'Cookie cleared' });
};

export default {
	handleLogin,
	handleRefresh,
	handleLogout,
};
