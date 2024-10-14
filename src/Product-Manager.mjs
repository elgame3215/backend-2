import fs from "node:fs";

export class ProductManager {
	constructor(path) {
		this.path = path
		fs.writeFileSync(this.path, '[]')
	}
	static #nextId = 0;
	async getProducts() {
		const productsJSON = await fs.promises.readFile(this.path);
		const products = JSON.parse(productsJSON);
		return products
	};

	async addProduct(product) {
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
		const productsJSON = await fs.promises.readFile(this.path)
		const products = JSON.parse(productsJSON);
		if (products.some(p => p.code == code)) {
			console.error('Código ya existente');
			return
		};

		// El producto es válido, le asigno un ID y lo registro
		const id = ProductManager.#nextId++;
		product.id = id;
		products.push(product)
		await fs.promises.writeFile(this.path, JSON.stringify(products))
		return 'Producto agregado'
	};

	async getProductById(id) {
		const productsJSON = await fs.promises.readFile(this.path);
		const products = JSON.parse(productsJSON);
		const product = products.find(p => p.id == id);
		if (!product) {
			console.error('Producto no encontrado');
			return
		}
		return product
	}
}

const pm = new ProductManager('./products.json')


pm.getProducts() // []

pm.addProduct(
	{
		title: "producto prueba",
		description: "Este es un producto prueba",
		price: 200,
		thumbnail: "Sin imagen",
		code: "abc123",
		stock: 25
	}
) // Producto agregado

pm.getProducts() // muestra el producto agregado

pm.addProduct(
	{
		title: "producto prueba",
		description: "Este es un producto prueba",
		price: 200,
		thumbnail: "Sin imagen",
		code: "abc123",
		stock: 25
	}
) // error: campos repetidos

pm.getProductById(0) // muestra el producto agregado