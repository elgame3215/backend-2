import Joi from 'joi';

export const userLoginReqSchema = Joi.object({
	email: Joi.string().email().trim().required().label('Email'),
	password: Joi.string()
		.min(8)
		.max(20)
		.alphanum()
		.trim()
		.required()
		.label('Contraseña'),
});
