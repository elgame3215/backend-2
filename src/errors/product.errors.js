import { CustomError } from './CustomError.js';

export class ProductOutOfStockError extends CustomError {
	constructor() {
		super('Producto sin stock suficiente', 400);
	}
}

export class ProductNotFoundError extends CustomError {
	constructor(idNotFound) {
		super(`Producto no encontrado: ${idNotFound}`, 404);
	}
}

export class ProductWithNegativeValuesError extends CustomError {
	constructor() {
		super("'price' y 'stock' deben ser números no menores a 0", 400);
	}
}

export class DuplicatedProductCodeError extends CustomError {
	constructor() {
		super('Ya existe un producto con el mismo código', 400);
	}
}
