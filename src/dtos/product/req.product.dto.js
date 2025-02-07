import Joi from 'joi';

export const productReqSchema = Joi.object({
	title: Joi.string().trim().required().label('Título'),
	description: Joi.string().trim().required().label('Descripción'),
	code: Joi.string().trim().alphanum().required().label('Código'),
	price: Joi.number().min(0).required().label('Precio'),
	stock: Joi.number().min(0).required().label('Stock'),
	category: Joi.string().trim().required().label('Categoría'),
});
