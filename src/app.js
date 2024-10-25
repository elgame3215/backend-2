import express from 'express'
import { ProductsManager } from "./managers/Product-Manager.js";
import { CartsManager } from "./managers/Carts-Manager.js";
import { router as productsRouter } from "./routes/ProductsRouter.js";
import { router as cartsRouter } from "./routes/CartsRouter.js";
import { engine } from "express-handlebars";

const app = express();
const PORT = 8080;
ProductsManager.setPath('./src/productos.json')
CartsManager.setPath('./src/carrito.json');
app.use(express.json());


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')

app.use(express.static('./src/public'))
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})