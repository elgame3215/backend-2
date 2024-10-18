import express from 'express'
import { ProductsManager } from "./managers/Product-Manager.js";
import { CartsManager } from "./managers/Carts-Manager.js";
import { router as productsRouter } from "./api/products/ProductsRouter.js";
import { router as cartsRouter } from "./api/carts/CartsRouter.js";

const app = express();
const PORT = 8080;
ProductsManager.setPath('./src/productos.json')
CartsManager.setPath('./src/carrito.json');
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})