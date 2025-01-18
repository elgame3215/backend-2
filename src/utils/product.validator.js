import { ProductService } from '../db/services/product.service.js';
import { DuplicatedProductCodeError, ProductWithNegativeValuesError } from '../errors/product.errors.js';

export class ProductValidator {
	static requiredKeys = [
		'title',
		'description',
		'code',
		'price',
		'stock',
		'category',
	];

	static validateValues(product) {
		if (product.price < 0 || product.stock < 0) {
			throw new ProductWithNegativeValuesError();
		}
	}

	static async validateCode(product) {
		const { code } = product;
		const response = await ProductService.getProducts(1e12);
		const { docs: products } = response;
		if (products.find(p => p.code == code)) {
			throw new DuplicatedProductCodeError();
		}
	}
}
