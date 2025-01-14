import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	first_name: {			// eslint-disable-line camelcase
		type: String,
		required: true,
	},
	last_name: {			// eslint-disable-line camelcase
		type: String,
		required: true,
	},
	age: {
		type: Number,
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
		unique: true,
		sparse: true,
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
