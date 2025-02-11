import { CONFIG } from '../../config/config.js';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { POLICIES } from '../../constants/enums/policies.js';
import { model, Schema } from 'mongoose';

const userSchema = new Schema(
	{
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
			default: CONFIG.AGE_REQUIRED, // [age] no puede ser requerido porque Github no proporciona la edad de sus usuarios
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
		role: {
			type: String,
			default: POLICIES.USER,
		},
		cart: {
			type: Schema.Types.ObjectId,
			ref: 'carts',
			required: function () {
				return this.role == POLICIES.USER;
			},
		},
	},
	{
		id: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.plugin(mongooseLeanVirtuals);

export const userModel = model('users', userSchema);
