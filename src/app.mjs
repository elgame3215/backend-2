import express from 'express'
import { ProductsManager } from "./managers/Product-Manager.mjs";
import { CartsManager } from "./managers/Carts-Manager.mjs";
import { router as productsRouter } from "./api/products/ProductsRouter.mjs";
import { router as cartsRouter } from "./api/carts/CartsRouter.mjs";

const app = express();
const PORT = 8080;
ProductsManager.setPath('./src/productos.json')
CartsManager.setPath('./src/carritos.json');
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})