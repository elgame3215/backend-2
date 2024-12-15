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
		required: true,
	},
	rol: {
		type: String,
		required: true,
		default: 'user',
	},
});

export const userModel = mongoose.model('user', userSchema);
