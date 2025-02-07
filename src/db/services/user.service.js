import { userModel } from '../models/user.model.js';

export class UsersService {
	static async registerUser(user) {
		const newUser = await userModel.create(user);
		return newUser;
	}

	static async findUserByEmail(email) {
		return await userModel.findOne({
			email: email,
		});
	}

	static async findUserById(id) {
		return await userModel.findById(id);
	}
}
