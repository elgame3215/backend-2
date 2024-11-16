import express from 'express'
import { ProductsManager } from "./dao/Mongo/Product-Manager-Mongo.js";
import { router as productsRouter } from "./routes/ProductsRouter.js";
import { router as cartsRouter } from "./routes/CartsRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js"
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express();
export const PORT = 8080;
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
	socket.on('new product', async product => {
		const operation = await ProductsManager.addProduct(product);
		if (!operation.succeed) {
			socket.emit('invalid product', operation.detail)
			return
		}
		io.emit('product added', product)
	})
	socket.on('deleteProduct', code => {
		ProductsManager.deleteProductByCode(code)
	})
})

const connectDB = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://backend70335:CoderCoder@cluster0.zwnp1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
			{
				dbName: "ecommerce"
			}
		)
		console.log(`DB connected`)
	} catch (error) {
		console.log(`Error connecting to DB: ${error.message}`)
	}
}
connectDB()