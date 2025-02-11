export function hasProduct(cart, pid) {
	return cart.products.find(p => p.product._id == pid);
}
