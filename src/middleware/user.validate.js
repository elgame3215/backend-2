import { UserController } from "../dao/controllers/user.controller";

export function validateEmail(req, res, next) {
	const { email } = req.body;
	const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regEx.test(email)) {
		return res.status(401).json({ status: "error", detail: "invalid email" });
	}
	const userExists = UserController.findUserByEmail(email);
	if (!userExists) {
		return res.status(401).json({ status: "error", detail: "user not found" })
	}
	return next();
}