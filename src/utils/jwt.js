import { CONFIG } from '../config/config.js';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = CONFIG;

export function setToken(req, res) {
	const payload = {
		email: req.user.email,
		rol: req.user.rol,
	};
	const token = jwt.sign(payload, JWT_SECRET, {
		expiresIn: '15m',
	});
	res.cookie('token', token, {
		httpOnly: true,
	});
}

export function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}
