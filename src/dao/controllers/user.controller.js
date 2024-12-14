import { userModel } from "../models/user.model.js";

export class UserController {
	static async registerUser(user) {
		const newUser = await userModel.create(user);
		return newUser;
	}

	static async findUserByEmail(email) {
		return await userModel.find({
			email: email
		});
	}
}