import { ProductController } from '../dao/controllers/product.controller.js';

export class ProductValidator {
	static #requiredKeys = [
		'title',
		'description',
		'code',
		'price',
		'stock',
		'category',
	];
	static validateKeys(product) {
		const keys = Object.keys(product);
		if (!this.#requiredKeys.every(requiredKey => keys.includes(requiredKey))) {
			throw new Error(this.errorMessages.missingCamp);
		}
	}

	static validateValues(product) {
		if (product.price < 0 || product.stock < 0) {
			throw new Error(this.errorMessages.negativeValues);
		}
		for (const key of this.#requiredKeys) {
			const value = product[key];
			if (new String(value).trim() == '') {
				throw new Error(this.errorMessages.emptyCamp);
			}
		}
	}

	static async validateCode(product) {
		const { code } = product;
		const response = await ProductController.getProducts(1e12);
		const { docs: products } = response;
		if (products.find(p => p.code == code)) {
			throw new Error(this.errorMessages.duplicatedCode);
		}
	}
	static errorMessages = {
		duplicatedCode: 'Código ya existente',
		emptyCamp: 'Todos los campos obligatorios deben estar completos',
		missingCamp: 'Campos faltantes',
		negativeValues: 'Precio y stock no admiten valores negativos',
	};
}
