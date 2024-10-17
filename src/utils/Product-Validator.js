export class ProductValidator {
	static #requiredKeys = [
		'title',
		'description',
		'code',
		'price',
		'status',
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
		for (const key in product) {
			const value = product[key];
			if (new String(value) == '' && this.#requiredKeys.includes(key)) {
				throw new Error(this.errorMessages.emptyCamp);
			}
		}
	}

	static validateCode(product, products) {
		const { code } = product;
		if (products.some(p => p.code == code)) {
			throw new Error(this.errorMessages.duplicatedCode);
		};
	}
	static errorMessages = {
		emptyCamp: "Todos los campos obligatorios deben estar completos",
		duplicatedCode: "Código ya existente",
		missingCamp: "Campos faltantes"
	}
}