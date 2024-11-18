import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";

export class ProductValidator {
	static #requiredKeys = [
		'title',
		'description',
		'code',
		'price',
		'stock',
		'category'
	]
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
		const response = await ProductsManager.getProducts(1e12)
		const { docs: products } = response
		if (products.find(p => p.code == code)) {
			throw new Error(this.errorMessages.duplicatedCode);
		}
	}
	static errorMessages = {
		emptyCamp: "Todos los campos obligatorios deben estar completos",
		duplicatedCode: "Código ya existente",
		missingCamp: "Campos faltantes",
		negativeValues: "Precio y stock no admiten valores negativos"
	}
}