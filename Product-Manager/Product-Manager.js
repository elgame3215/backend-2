class ProductManager {
	static #nextId = 0;
	#products = [];
	getProducts() {
		console.log(this.#products);
	};

	addProduct(product) {
		// Valido que el producto contenga los campos requeridos
		for (const key in product) {
			const value = product[key];
			if (!value) {
				console.error('Todos los campos deben estar completos');
				return
			}
		}
		// Valido que el codigo sea único en la instancia
		const { code } = product;
		if (this.#products.some(p => p.code == code)) {
			console.error('Código ya existente');
			return
		};

		// El producto es válido, le asigno un ID y lo registro
		const id = ProductManager.#nextId++;
		product.id = id;
		this.#products.push(product);
		console.error('Producto agregado');
	};

	getProductById(id) {
		const product = this.#products.find(p => p.id == id);
		if (!product) {
			console.error('Producto no encontrado');
			return
		}
		console.error(product)
	}
}

const pm = new ProductManager()

pm.getProducts() // []

pm.addProduct(
	{
		title: "producto prueba",
		description:"Este es un producto prueba",
		price:200,
		thumbnail:"Sin imagen",
		code:"abc123",
		stock:25
	}
) // Producto agregado

pm.getProducts() // muestra el producto agregado

pm.addProduct(
	{
		title: "producto prueba",
		description:"Este es un producto prueba",
		price:200,
		thumbnail:"Sin imagen",
		code:"abc123",
		stock:25
	}
) // error: campos repetidos

pm.getProductById(0) // muestra el producto agregado