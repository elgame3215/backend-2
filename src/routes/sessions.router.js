import { Router } from "express";
import { UserController } from "../dao/controllers/user.controller";
import { validateEmail } from "../middleware/user.validate";

export const router = Router();

router.post('register', validateEmail , async (req, res) => {
	const {name, surname, email, password} = req.body;
	const newUser = await UserController.registerUser();
});

router.post('login', async (req, res) => {

});

router.post('logout', async (req, res) => {
	
});