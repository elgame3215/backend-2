import { userModel } from '../models/user.model.js';

export class UsersService {
	static async registerUser(user) {
		const newUser = await userModel.create(user);
		return newUser.toObject();
	}

	static async findUserByEmail(email) {
		return await userModel
			.findOne({
				email: email,
			})
			.lean({ virtuals: true });
	}

	static async findUserById(id) {
		return await userModel.findById(id).lean({ virtuals: true });
	}
}
