import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	githubId: {
		type: String,
		unique: true
	},
	rol: {
		type: String,
		default: 'user',
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts',
		required: true,
	},
});

export const userModel = mongoose.model('users', userSchema);
