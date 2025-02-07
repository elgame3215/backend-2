import mongoose from 'mongoose';

const userRegisterReqSchema = new mongoose.Schema({
	first_name: {
		 
		type: String,
		required: true,
	},
	last_name: {
		 
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true, // [age] no puede ser requerido porque Github no proporciona la edad de sus usuarios, y solucionarlo por mi cuenta me costaría años de vida.
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String, // [password] no puede ser requerido porque Github no proporciona la contraseña de sus usuarios
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

export const userModel = mongoose.model('users', userRegisterReqSchema);
