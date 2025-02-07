import Joi from 'joi';
import { Temporal } from 'temporal-polyfill';
import { userLoginReqSchema } from './req.user.login.dto.js';

const instant = Temporal.Now.instant()
	.subtract({ hours: 24 * 365 * 18 }) // 18 años
	.toLocaleString();

export const userRegisterReqSchema = Joi.object({
	firstName: Joi.string().trim().min(1).label('Nombre'),
	lastName: Joi.string().trim().min(1).label('Apellido'),
	dateBirth: Joi.date()
		.min('01-01-1900')
		.max(instant)
		.prefs({
			messages: {
				'date.min': 'Invalid age',
				'date.max': 'Age of majority required',
			},
		})
		.label('Fecha de nacimiento'),
	rol: Joi.string().forbidden().default('user'),
}).keys(userLoginReqSchema.describe());
