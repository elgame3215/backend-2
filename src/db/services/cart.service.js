import { cartModel } from '../models/cart.model.js';
import mongoose from 'mongoose';

export class CartsService {
	static async addCart() {
		const products = { products: [] };
		const addedCart = await cartModel.create(products);
		return addedCart;
	}

	static async getCartById(cid) {
		const cart = await cartModel.findById(cid);
		return cart;
	}

	static async addProductToCart(pid, cid) {
		const cart = await cartModel.findById(cid);
		const addedProduct = cart.products.find(p => p.product._id == pid);
		if (addedProduct) {
			addedProduct.quantity++;
		} else {
			cart.products.push({ product: pid, quantity: 1 });
		}
		const updatedCart = await cartModel.findByIdAndUpdate(cid, cart, {
			new: true,
		});
		return updatedCart;
	}

	static async deleteProductFromCart(pid, cid) {
		const updatedCart = await cartModel.findByIdAndUpdate(
			cid,
			{
				$pull: { products: { product: pid } },
			},
			{
				new: true,
			}
		);
		return updatedCart;
	}

	static async updateCartProducts(cid, productList) {
		const updatedCart = await cartModel.findByIdAndUpdate(
			cid,
			{ products: productList },
			{ new: true }
		);
		return updatedCart;
	}

	static async updateProductQuantity(cid, pid, quantity) {
		const objPid = new mongoose.Types.ObjectId(pid);
		const updatedProduct = await cartModel.findByIdAndUpdate(
			cid,
			{ 'products.$[product].quantity': quantity },
			{
				arrayFilters: [{ 'product.product': objPid }],
				new: true,
			}
		);
		return updatedProduct;
	}

	static async clearCart(cid) {
		const updatedCart = await cartModel.findByIdAndUpdate(
			cid,
			{
				products: [],
			},
			{
				new: true,
			}
		);
		return updatedCart;
	}
}
