import { userModel } from "./../models/user.model.js";

export class userManager {
	static async findUserByEmail(email) {
		return await userModel.find({
			email: email
		})
	}
}