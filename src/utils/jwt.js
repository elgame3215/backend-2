import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config.js';

export function setToken(req, res) {
	const payload = {
		email: req.user.email,
		rol: req.user.rol,
	};
	const token = jwt.sign(payload, SECRET, {
		expiresIn: '15m',
	});
	res.cookie('token', token, {
		httpOnly: true,
	});
}

export function verifyToken(token) {
	return jwt.verify(token, SECRET);
}
