import { CustomError } from './CustomError.js';

export class ProductOutOfStockError extends CustomError {
	constructor(idOutOfStock) {
		const ids = Array.isArray(idOutOfStock)
			? idOutOfStock.join(', ')
			: idOutOfStock;
		super(`Producto/s sin stock suficiente: ${ids}`, 400);
	}
}

export class ProductNotFoundError extends CustomError {
	constructor(idNotFound) {
		super(`Producto no encontrado: ${idNotFound}`, 404);
	}
}

export class DuplicatedProductCodeError extends CustomError {
	constructor() {
		super('Ya existe un producto con el mismo código', 400);
	}
}
