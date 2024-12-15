import { Router } from "express";
import { UserController } from "../dao/controllers/user.controller.js";
import { validateEmail, validatePassword } from "./../middleware/user.validate.js";
export const router = Router();

router.post('/register', validateEmail, validatePassword, async (req, res) => {
	const { name, email, password, rol } = req.body;
	if (!name.trim() || !password.trim()) {
		return res.status(401).json({ status: "error", detail: "missing camps" });
	}
	try {
		const newUser = await UserController.registerUser({ name, email, password, rol });
		return res.status(201).json({status: "success", newUser});
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "error", error: UserController.errorMessages.serverError });
	}
});

router.post('/login', async (req, res) => {

});

router.post('/logout', async (req, res) => {

});