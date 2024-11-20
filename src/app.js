import express from 'express'
import { router as productsRouter } from "./routes/ProductsRouter.js";
import { router as cartsRouter } from "./routes/CartsRouter.js";
import { router as viewsRouter } from "./routes/viewsRouter.js"
import { engine } from "express-handlebars";
import Handlebars from "handlebars"
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

const app = express();
export const PORT = 8080;
app.use(express.json());


app.engine('handlebars', engine({
	handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
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