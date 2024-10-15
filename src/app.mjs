import { ProductManager } from "./managers/Product-Manager.mjs";
import express from 'express'
import { router as productsRouter } from "./api/products/ProductsRouter.mjs";
// import { router as cartsRouter } from "./api/carts/CartsRouter";

const app = express();
const PORT = 8080;
ProductManager.setPath('./src/products.json')

app.use(express.json());

app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})