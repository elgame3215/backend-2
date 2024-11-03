import express from 'express'
import { ProductsManager } from "./managers/Product-Manager.js";
import { CartsManager } from "./managers/Carts-Manager.js";
import { router as productsRouter } from "./routes/ProductsRouter.js";
import { router as cartsRouter } from "./routes/CartsRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js"
import { engine } from "express-handlebars";
import { Server } from 'socket.io';

const app = express();
export const PORT = 8080;
ProductsManager.setPath('./src/productos.json')
CartsManager.setPath('./src/carrito.json');
app.use(express.json());


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')

const server = app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})

export const io = new Server(server);
app.use(express.static('./src/public'))
app.use(
	'/api/products',
	(req, res, next) => {
		req.io = io
		next()
	},
	productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', viewsRouter)

io.on('connection', socket => {
	console.log('usuario conetado', socket.id);
	socket.on('new product', async product => {
		const operation = await ProductsManager.addProduct(product);
		if (!operation.succeed) {
			socket.emit('invalid product', operation.detail)
			return
		}
		io.emit('product added', product)
	})
	socket.on('deleteProduct', code => {
		console.log('producto eliminado', code);
		ProductsManager.deleteProductByCode(code)
	})
})