import { ProductManager } from "./Product-Manager.mjs";
import express from 'express'

const app = express();
const PORT = 8080;
const pm = new ProductManager('./products.json');

app.get('/products', async (req, res) => {
	const products = await pm.getProducts();
	res.send(products);
})

app.get('/products/:pid', async (req, res) => {
	const { pid } = req.params;
	if (isNaN(pid)) {
		res.send('El ID debe ser numérico');
	}
	const product = await pm.getProductById(pid);
	res.send(product)
})

app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})