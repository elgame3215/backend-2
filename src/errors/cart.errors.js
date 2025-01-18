import { CustomError } from './CustomError.js';

export class CartNotFoundError extends CustomError {
	constructor () {
		super('Carrito no encontrado', 404);
	}
}

export class InvalidQuantityError extends CustomError {
	constructor () {
		super('Cantidad inválida', 400);
	}
}

export class ProductNotInCartError extends CustomError {
	constructor () {
		super('El carrito no tiene unidades del producto', 400);
	}
}