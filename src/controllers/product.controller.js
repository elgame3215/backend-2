import { InternalServerError } from '../errors/generic.errors.js';
import { ProductNotFoundError } from '../errors/product.errors.js';
import { productResSchema } from '../dtos/product/res.product.dto.js';
import { ProductService } from '../db/services/product.service.js';
import { sendSuccess } from '../utils/customResponses.js';

export class ProductController {
	static async addProduct(req, res, next) {
		const newProduct = req.body;
		try {
			const addedProduct = await ProductService.addProduct(newProduct);
			req.io.emit('product added', addedProduct);
			return sendSuccess({
				res,
				next,
				code: 201,
				detail: 'Producto añadido',
				payload: addedProduct,
				dtoSchema: productResSchema,
			});
		} catch (err) {
			req.io.emit('invalid product', err.message);
			next(new InternalServerError());
		}
	}

	static async getOneProduct(req, res, next) {
		const { pid } = req.params;
		try {
			const product = await ProductService.getProductById(pid);
			if (!product) {
				return next(new ProductNotFoundError());
			}
			sendSuccess({
				res,
				next,
				code: 200,
				payload: product,
				dtoSchema: productResSchema,
			});
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}

	static async getAllProducts(req, res, next) {
		const { limit, sort, query } = req.query;
		const page = req.query.page ?? 1;
		try {
			const response = await ProductService.getProducts(
				limit,
				page,
				sort,
				query
			);
			return sendSuccess({
				res,
				next,
				code: 200,
				payload: response,
				dtoSchema: productResSchema,
			});
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}

	static async deleteProduct(req, res, next) {
		const { pid } = req.params;
		try {
			const deletedProduct = await ProductService.deleteProductById(pid);
			if (!deletedProduct) {
				return next(new ProductNotFoundError());
			}
			return sendSuccess({
				res,
				next,
				code: 200,
				detail: 'Producto eliminado',
				payload: deletedProduct,
			});
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}

	static async updateProduct(req, res, next) {
		const { pid } = req.params;
		const modifiedValues = req.body;
		try {
			const updatedProduct = await ProductService.updateProductById(
				pid,
				modifiedValues
			);
			if (!updatedProduct) {
				return next(new ProductNotFoundError());
			}
			return sendSuccess({
				res,
				next,
				code: 200,
				detail: 'Producto actualizado',
				payload: updatedProduct,
			});
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}
}
