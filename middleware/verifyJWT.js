import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
	// authorization: Bearer <token>
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				return res.sendStatus(401);
			}

			return res.sendStatus(403);
		}

		req.user = decoded.username;

		next();
	});
};

export default verifyJWT;
