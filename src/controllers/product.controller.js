import { ProductService } from "../db/services/product.service.js";

export class ProductController {
	static async addProduct(req, res) {
		const newProduct = req.body;
		try {
			const addedProduct = await ProductService.addProduct(newProduct);
			req.io.emit('product added', addedProduct);
			return res.sendResourceCreated({ addedProduct });
		} catch (err) {
			console.error(err);
			req.io.emit('invalid product', err.message);
			res.sendServerError();
		}
	}

	static async getOneProduct(req, res) {
		const { pid } = req.params;
		try {
			const product = await ProductService.getProductById(pid);
			if (!product) {
				return res.sendProductNotFound();
			}
			res.sendSuccess(product);
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}

	static async getAllProducts(req, res) {
		const { limit, sort, query } = req.query;
		const page = req.query.page ?? 1;
		try {
			const response = await ProductService.getProducts(
				limit,
				page,
				sort,
				query
			);
			formatResponse(response, page, limit, sort, query);
			return res.sendSuccess(response);
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}

	static async deleteProduct(req, res) {
		const { pid } = req.params;
		try {
			const deletedProduct = await ProductService.deleteProductById(pid);
			if (!deletedProduct) {
				return res.sendProductNotFound();
			}
			return res.sendSuccess({ deletedProduct });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}

	static async updateProduct(req, res) {
		const { pid } = req.params;
		const modifiedValues = req.body;
		try {
			const updatedProduct = await ProductService.updateProductById(
				pid,
				modifiedValues
			);
			if (!updatedProduct) {
				return res.sendProductNotFound();
			}
			return res.sendSuccess({ updatedProduct });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}
}